import psycopg2

conn = psycopg2.connect(
    database = "acadnet",
    user = "anishkn",
    host = "localhost",
    password = "anishkn@@0",
    port = 5432
)

cur = conn.cursor()

cur.execute("""
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    profile_info JSONB, -- includes name, academic details, profile picture
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    role VARCHAR(20) DEFAULT 'student' -- possible values: student, admin
);

CREATE TABLE study_groups (
    group_id SERIAL PRIMARY KEY,
    group_name VARCHAR(150) NOT NULL,
    description TEXT,
    creator_user_id INT REFERENCES users(user_id) ON DELETE SET NULL,
    is_private BOOLEAN DEFAULT FALSE,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE group_members (
    group_member_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    group_id INT REFERENCES study_groups(group_id) ON DELETE CASCADE,
    join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    member_role VARCHAR(20) DEFAULT 'member', -- values: member, moderator, creator
    UNIQUE(user_id, group_id)
);

CREATE TABLE materials (
    material_id SERIAL PRIMARY KEY,
    group_id INT REFERENCES study_groups(group_id) ON DELETE CASCADE,
    uploader_user_id INT REFERENCES users(user_id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50), -- e.g. 'PDF', 'YouTube Video', 'Link'
    file_path TEXT,
    external_url TEXT,
    subtopic VARCHAR(150),
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    average_rating DECIMAL(2,1) DEFAULT 0.0,
    tags TEXT[] -- array of tags for search
);

CREATE TABLE posts (
    post_id SERIAL PRIMARY KEY,
    group_id INT REFERENCES study_groups(group_id) ON DELETE CASCADE,
    author_user_id INT REFERENCES users(user_id),
    content TEXT NOT NULL,
    post_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    parent_post_id INT REFERENCES posts(post_id) ON DELETE CASCADE, -- nullable for root posts
    likes_count INT DEFAULT 0,
    dislikes_count INT DEFAULT 0
);

CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    post_id INT REFERENCES posts(post_id) ON DELETE CASCADE,
    parent_comment_id INT REFERENCES comments(comment_id) ON DELETE CASCADE, -- optional for nested replies
    author_user_id INT REFERENCES users(user_id),
    content TEXT NOT NULL,
    comment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ratings (
    rating_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    material_id INT REFERENCES materials(material_id) ON DELETE CASCADE,
    rating_value INT CHECK (rating_value >= 1 AND rating_value <= 5),
    rating_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, material_id)
);

CREATE TABLE reports (
    report_id SERIAL PRIMARY KEY,
    reporter_user_id INT REFERENCES users(user_id),
    reported_item_type VARCHAR(20) NOT NULL CHECK (reported_item_type IN ('user', 'material', 'post', 'comment')),
    reported_item_id INT NOT NULL,
    reason TEXT,
    report_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending' -- values: pending, reviewed, action taken
);

""")

conn.commit()
cur.close()
conn.close()