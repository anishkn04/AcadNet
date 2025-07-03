--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-07-03 10:54:17

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE acadnet;
--
-- TOC entry 5098 (class 1262 OID 71712)
-- Name: acadnet; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE acadnet WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';


ALTER DATABASE acadnet OWNER TO postgres;

\connect acadnet

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 897 (class 1247 OID 80850)
-- Name: enum_users_auth_provider; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_users_auth_provider AS ENUM (
    'local',
    'google',
    'github'
);


ALTER TYPE public.enum_users_auth_provider OWNER TO postgres;

--
-- TOC entry 903 (class 1247 OID 80866)
-- Name: enum_users_nationality; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_users_nationality AS ENUM (
    'Afghanistan',
    'Albania',
    'Algeria',
    'American Samoa',
    'Andorra',
    'Angola',
    'Anguilla',
    'Antarctica',
    'Antigua and Barbuda',
    'Argentina',
    'Armenia',
    'Aruba',
    'Australia',
    'Austria',
    'Azerbaijan',
    'Bahamas',
    'Bahrain',
    'Bangladesh',
    'Barbados',
    'Belarus',
    'Belgium',
    'Belize',
    'Benin',
    'Bermuda',
    'Bhutan',
    'Bolivia',
    'Bosnia and Herzegovina',
    'Botswana',
    'Bouvet Island',
    'Brazil',
    'British Indian Ocean Territory',
    'Brunei Darussalam',
    'Bulgaria',
    'Burkina Faso',
    'Burundi',
    'Cambodia',
    'Cameroon',
    'Canada',
    'Cape Verde',
    'Cayman Islands',
    'Central African Republic',
    'Chad',
    'Chile',
    'People''s Republic of China',
    'Christmas Island',
    'Cocos (Keeling) Islands',
    'Colombia',
    'Comoros',
    'Republic of the Congo',
    'Democratic Republic of the Congo',
    'Cook Islands',
    'Costa Rica',
    'Cote d''Ivoire',
    'Croatia',
    'Cuba',
    'Cyprus',
    'Czech Republic',
    'Denmark',
    'Djibouti',
    'Dominica',
    'Dominican Republic',
    'Ecuador',
    'Egypt',
    'El Salvador',
    'Equatorial Guinea',
    'Eritrea',
    'Estonia',
    'Ethiopia',
    'Falkland Islands (Malvinas)',
    'Faroe Islands',
    'Fiji',
    'Finland',
    'France',
    'French Guiana',
    'French Polynesia',
    'French Southern Territories',
    'Gabon',
    'Republic of The Gambia',
    'Georgia',
    'Germany',
    'Ghana',
    'Gibraltar',
    'Greece',
    'Greenland',
    'Grenada',
    'Guadeloupe',
    'Guam',
    'Guatemala',
    'Guinea',
    'Guinea-Bissau',
    'Guyana',
    'Haiti',
    'Heard Island and McDonald Islands',
    'Holy See (Vatican City State)',
    'Honduras',
    'Hong Kong',
    'Hungary',
    'Iceland',
    'India',
    'Indonesia',
    'Islamic Republic of Iran',
    'Iraq',
    'Ireland',
    'Israel',
    'Italy',
    'Jamaica',
    'Japan',
    'Jordan',
    'Kazakhstan',
    'Kenya',
    'Kiribati',
    'North Korea',
    'South Korea',
    'Kuwait',
    'Kyrgyzstan',
    'Lao People''s Democratic Republic',
    'Latvia',
    'Lebanon',
    'Lesotho',
    'Liberia',
    'Libya',
    'Liechtenstein',
    'Lithuania',
    'Luxembourg',
    'Macao',
    'Madagascar',
    'Malawi',
    'Malaysia',
    'Maldives',
    'Mali',
    'Malta',
    'Marshall Islands',
    'Martinique',
    'Mauritania',
    'Mauritius',
    'Mayotte',
    'Mexico',
    'Micronesia, Federated States of',
    'Moldova, Republic of',
    'Monaco',
    'Mongolia',
    'Montserrat',
    'Morocco',
    'Mozambique',
    'Myanmar',
    'Namibia',
    'Nauru',
    'Nepal',
    'Netherlands',
    'New Caledonia',
    'New Zealand',
    'Nicaragua',
    'Niger',
    'Nigeria',
    'Niue',
    'Norfolk Island',
    'The Republic of North Macedonia',
    'Northern Mariana Islands',
    'Norway',
    'Oman',
    'Pakistan',
    'Palau',
    'State of Palestine',
    'Panama',
    'Papua New Guinea',
    'Paraguay',
    'Peru',
    'Philippines',
    'Pitcairn',
    'Poland',
    'Portugal',
    'Puerto Rico',
    'Qatar',
    'Reunion',
    'Romania',
    'Russian Federation',
    'Rwanda',
    'Saint Helena',
    'Saint Kitts and Nevis',
    'Saint Lucia',
    'Saint Pierre and Miquelon',
    'Saint Vincent and the Grenadines',
    'Samoa',
    'San Marino',
    'Sao Tome and Principe',
    'Saudi Arabia',
    'Senegal',
    'Seychelles',
    'Sierra Leone',
    'Singapore',
    'Slovakia',
    'Slovenia',
    'Solomon Islands',
    'Somalia',
    'South Africa',
    'South Georgia and the South Sandwich Islands',
    'Spain',
    'Sri Lanka',
    'Sudan',
    'Suriname',
    'Svalbard and Jan Mayen',
    'Eswatini',
    'Sweden',
    'Switzerland',
    'Syrian Arab Republic',
    'Taiwan, Province of China',
    'Tajikistan',
    'United Republic of Tanzania',
    'Thailand',
    'Timor-Leste',
    'Togo',
    'Tokelau',
    'Tonga',
    'Trinidad and Tobago',
    'Tunisia',
    'Türkiye',
    'Turkmenistan',
    'Turks and Caicos Islands',
    'Tuvalu',
    'Uganda',
    'Ukraine',
    'United Arab Emirates',
    'United Kingdom',
    'United States of America',
    'United States Minor Outlying Islands',
    'Uruguay',
    'Uzbekistan',
    'Vanuatu',
    'Venezuela',
    'Vietnam',
    'Virgin Islands, British',
    'Virgin Islands, U.S.',
    'Wallis and Futuna',
    'Western Sahara',
    'Yemen',
    'Zambia',
    'Zimbabwe',
    'Åland Islands',
    'Bonaire, Sint Eustatius and Saba',
    'Curaçao',
    'Guernsey',
    'Isle of Man',
    'Jersey',
    'Montenegro',
    'Saint Barthélemy',
    'Saint Martin (French part)',
    'Serbia',
    'Sint Maarten (Dutch part)',
    'South Sudan',
    'Kosovo'
);


ALTER TYPE public.enum_users_nationality OWNER TO postgres;

--
-- TOC entry 900 (class 1247 OID 80858)
-- Name: enum_users_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_users_role AS ENUM (
    'user',
    'groupadmin',
    'admin'
);


ALTER TYPE public.enum_users_role OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 230 (class 1259 OID 80813)
-- Name: academics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.academics (
    academic_id integer NOT NULL,
    level_id integer NOT NULL,
    field_of_study_id integer NOT NULL,
    university_id integer NOT NULL,
    college_id integer NOT NULL,
    user_id integer
);


ALTER TABLE public.academics OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 80812)
-- Name: academics_academic_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.academics_academic_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.academics_academic_id_seq OWNER TO postgres;

--
-- TOC entry 5099 (class 0 OID 0)
-- Dependencies: 229
-- Name: academics_academic_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.academics_academic_id_seq OWNED BY public.academics.academic_id;


--
-- TOC entry 247 (class 1259 OID 81489)
-- Name: additional_resources; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.additional_resources (
    id integer NOT NULL,
    "studyGroupId" uuid NOT NULL,
    "filePath" character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.additional_resources OWNER TO postgres;

--
-- TOC entry 246 (class 1259 OID 81488)
-- Name: additional_resources_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.additional_resources_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.additional_resources_id_seq OWNER TO postgres;

--
-- TOC entry 5100 (class 0 OID 0)
-- Dependencies: 246
-- Name: additional_resources_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.additional_resources_id_seq OWNED BY public.additional_resources.id;


--
-- TOC entry 228 (class 1259 OID 80794)
-- Name: addresses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.addresses (
    address_id integer NOT NULL,
    province character varying(255) NOT NULL,
    district character varying(255) NOT NULL,
    municipality character varying(255) NOT NULL,
    postal_code character varying(255),
    user_id integer
);


ALTER TABLE public.addresses OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 80793)
-- Name: addresses_address_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.addresses_address_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.addresses_address_id_seq OWNER TO postgres;

--
-- TOC entry 5101 (class 0 OID 0)
-- Dependencies: 227
-- Name: addresses_address_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.addresses_address_id_seq OWNED BY public.addresses.address_id;


--
-- TOC entry 226 (class 1259 OID 80775)
-- Name: colleges; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.colleges (
    college_id integer NOT NULL,
    college_name character varying(255) NOT NULL,
    university_id integer NOT NULL,
    country_id integer NOT NULL
);


ALTER TABLE public.colleges OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 80774)
-- Name: colleges_college_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.colleges_college_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.colleges_college_id_seq OWNER TO postgres;

--
-- TOC entry 5102 (class 0 OID 0)
-- Dependencies: 225
-- Name: colleges_college_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.colleges_college_id_seq OWNED BY public.colleges.college_id;


--
-- TOC entry 218 (class 1259 OID 80734)
-- Name: countries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.countries (
    country_id integer NOT NULL,
    country_name character varying(255) NOT NULL
);


ALTER TABLE public.countries OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 80733)
-- Name: countries_country_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.countries_country_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.countries_country_id_seq OWNER TO postgres;

--
-- TOC entry 5103 (class 0 OID 0)
-- Dependencies: 217
-- Name: countries_country_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.countries_country_id_seq OWNED BY public.countries.country_id;


--
-- TOC entry 222 (class 1259 OID 80752)
-- Name: fields_of_study; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fields_of_study (
    field_of_study_id integer NOT NULL,
    field_of_study_name character varying(255) NOT NULL
);


ALTER TABLE public.fields_of_study OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 80751)
-- Name: fields_of_study_field_of_study_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.fields_of_study_field_of_study_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.fields_of_study_field_of_study_id_seq OWNER TO postgres;

--
-- TOC entry 5104 (class 0 OID 0)
-- Dependencies: 221
-- Name: fields_of_study_field_of_study_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.fields_of_study_field_of_study_id_seq OWNED BY public.fields_of_study.field_of_study_id;


--
-- TOC entry 220 (class 1259 OID 80743)
-- Name: levels; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.levels (
    level_id integer NOT NULL,
    level_name character varying(255) NOT NULL
);


ALTER TABLE public.levels OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 80742)
-- Name: levels_level_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.levels_level_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.levels_level_id_seq OWNER TO postgres;

--
-- TOC entry 5105 (class 0 OID 0)
-- Dependencies: 219
-- Name: levels_level_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.levels_level_id_seq OWNED BY public.levels.level_id;


--
-- TOC entry 239 (class 1259 OID 81429)
-- Name: memberships; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.memberships (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "studyGroupId" uuid NOT NULL,
    "isAnonymous" boolean DEFAULT false,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.memberships OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 81428)
-- Name: memberships_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.memberships_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.memberships_id_seq OWNER TO postgres;

--
-- TOC entry 5106 (class 0 OID 0)
-- Dependencies: 238
-- Name: memberships_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.memberships_id_seq OWNED BY public.memberships.id;


--
-- TOC entry 234 (class 1259 OID 81387)
-- Name: otps; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.otps (
    otp_id integer NOT NULL,
    user_id integer NOT NULL,
    otp_code character varying(6) NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    is_used boolean DEFAULT false,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.otps OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 81386)
-- Name: otps_otp_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.otps_otp_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.otps_otp_id_seq OWNER TO postgres;

--
-- TOC entry 5107 (class 0 OID 0)
-- Dependencies: 233
-- Name: otps_otp_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.otps_otp_id_seq OWNED BY public.otps.otp_id;


--
-- TOC entry 236 (class 1259 OID 81400)
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.refresh_tokens (
    token_id integer NOT NULL,
    user_id integer NOT NULL,
    token character varying(255) NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.refresh_tokens OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 81399)
-- Name: refresh_tokens_token_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.refresh_tokens_token_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.refresh_tokens_token_id_seq OWNER TO postgres;

--
-- TOC entry 5108 (class 0 OID 0)
-- Dependencies: 235
-- Name: refresh_tokens_token_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.refresh_tokens_token_id_seq OWNED BY public.refresh_tokens.token_id;


--
-- TOC entry 237 (class 1259 OID 81413)
-- Name: study_groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.study_groups (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    "creatorId" integer NOT NULL,
    "groupCode" character varying(6) NOT NULL,
    "isPrivate" boolean DEFAULT false,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.study_groups OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 81475)
-- Name: sub_topics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sub_topics (
    id integer NOT NULL,
    "topicId" integer NOT NULL,
    title character varying(255) NOT NULL,
    content text,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.sub_topics OWNER TO postgres;

--
-- TOC entry 244 (class 1259 OID 81474)
-- Name: sub_topics_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sub_topics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sub_topics_id_seq OWNER TO postgres;

--
-- TOC entry 5109 (class 0 OID 0)
-- Dependencies: 244
-- Name: sub_topics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sub_topics_id_seq OWNED BY public.sub_topics.id;


--
-- TOC entry 241 (class 1259 OID 81449)
-- Name: syllabi; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.syllabi (
    id integer NOT NULL,
    "studyGroupId" uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.syllabi OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 81448)
-- Name: syllabi_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.syllabi_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.syllabi_id_seq OWNER TO postgres;

--
-- TOC entry 5110 (class 0 OID 0)
-- Dependencies: 240
-- Name: syllabi_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.syllabi_id_seq OWNED BY public.syllabi.id;


--
-- TOC entry 243 (class 1259 OID 81461)
-- Name: topics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.topics (
    id integer NOT NULL,
    "syllabusId" integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.topics OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 81460)
-- Name: topics_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.topics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.topics_id_seq OWNER TO postgres;

--
-- TOC entry 5111 (class 0 OID 0)
-- Dependencies: 242
-- Name: topics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.topics_id_seq OWNED BY public.topics.id;


--
-- TOC entry 224 (class 1259 OID 80761)
-- Name: universities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.universities (
    university_id integer NOT NULL,
    university_name character varying(255) NOT NULL,
    country_id integer NOT NULL
);


ALTER TABLE public.universities OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 80760)
-- Name: universities_university_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.universities_university_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.universities_university_id_seq OWNER TO postgres;

--
-- TOC entry 5112 (class 0 OID 0)
-- Dependencies: 223
-- Name: universities_university_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.universities_university_id_seq OWNED BY public.universities.university_id;


--
-- TOC entry 232 (class 1259 OID 81368)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    username character varying(255),
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    auth_provider public.enum_users_auth_provider DEFAULT 'local'::public.enum_users_auth_provider NOT NULL,
    "fullName" character varying(255),
    role public.enum_users_role DEFAULT 'user'::public.enum_users_role NOT NULL,
    is_banned boolean DEFAULT false,
    is_verified boolean DEFAULT false,
    last_otp timestamp with time zone,
    age integer,
    phone character varying(255),
    nationality public.enum_users_nationality,
    address jsonb DEFAULT '{}'::jsonb,
    education jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 81367)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO postgres;

--
-- TOC entry 5113 (class 0 OID 0)
-- Dependencies: 231
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- TOC entry 4831 (class 2604 OID 80816)
-- Name: academics academic_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.academics ALTER COLUMN academic_id SET DEFAULT nextval('public.academics_academic_id_seq'::regclass);


--
-- TOC entry 4848 (class 2604 OID 81492)
-- Name: additional_resources id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.additional_resources ALTER COLUMN id SET DEFAULT nextval('public.additional_resources_id_seq'::regclass);


--
-- TOC entry 4830 (class 2604 OID 80797)
-- Name: addresses address_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.addresses ALTER COLUMN address_id SET DEFAULT nextval('public.addresses_address_id_seq'::regclass);


--
-- TOC entry 4829 (class 2604 OID 80778)
-- Name: colleges college_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.colleges ALTER COLUMN college_id SET DEFAULT nextval('public.colleges_college_id_seq'::regclass);


--
-- TOC entry 4825 (class 2604 OID 80737)
-- Name: countries country_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.countries ALTER COLUMN country_id SET DEFAULT nextval('public.countries_country_id_seq'::regclass);


--
-- TOC entry 4827 (class 2604 OID 80755)
-- Name: fields_of_study field_of_study_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fields_of_study ALTER COLUMN field_of_study_id SET DEFAULT nextval('public.fields_of_study_field_of_study_id_seq'::regclass);


--
-- TOC entry 4826 (class 2604 OID 80746)
-- Name: levels level_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.levels ALTER COLUMN level_id SET DEFAULT nextval('public.levels_level_id_seq'::regclass);


--
-- TOC entry 4843 (class 2604 OID 81432)
-- Name: memberships id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.memberships ALTER COLUMN id SET DEFAULT nextval('public.memberships_id_seq'::regclass);


--
-- TOC entry 4839 (class 2604 OID 81390)
-- Name: otps otp_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.otps ALTER COLUMN otp_id SET DEFAULT nextval('public.otps_otp_id_seq'::regclass);


--
-- TOC entry 4841 (class 2604 OID 81403)
-- Name: refresh_tokens token_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens ALTER COLUMN token_id SET DEFAULT nextval('public.refresh_tokens_token_id_seq'::regclass);


--
-- TOC entry 4847 (class 2604 OID 81478)
-- Name: sub_topics id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sub_topics ALTER COLUMN id SET DEFAULT nextval('public.sub_topics_id_seq'::regclass);


--
-- TOC entry 4845 (class 2604 OID 81452)
-- Name: syllabi id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.syllabi ALTER COLUMN id SET DEFAULT nextval('public.syllabi_id_seq'::regclass);


--
-- TOC entry 4846 (class 2604 OID 81464)
-- Name: topics id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.topics ALTER COLUMN id SET DEFAULT nextval('public.topics_id_seq'::regclass);


--
-- TOC entry 4828 (class 2604 OID 80764)
-- Name: universities university_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities ALTER COLUMN university_id SET DEFAULT nextval('public.universities_university_id_seq'::regclass);


--
-- TOC entry 4832 (class 2604 OID 81371)
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- TOC entry 5075 (class 0 OID 80813)
-- Dependencies: 230
-- Data for Name: academics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.academics (academic_id, level_id, field_of_study_id, university_id, college_id, user_id) FROM stdin;
\.


--
-- TOC entry 5092 (class 0 OID 81489)
-- Dependencies: 247
-- Data for Name: additional_resources; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.additional_resources (id, "studyGroupId", "filePath", created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5073 (class 0 OID 80794)
-- Dependencies: 228
-- Data for Name: addresses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.addresses (address_id, province, district, municipality, postal_code, user_id) FROM stdin;
\.


--
-- TOC entry 5071 (class 0 OID 80775)
-- Dependencies: 226
-- Data for Name: colleges; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.colleges (college_id, college_name, university_id, country_id) FROM stdin;
\.


--
-- TOC entry 5063 (class 0 OID 80734)
-- Dependencies: 218
-- Data for Name: countries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.countries (country_id, country_name) FROM stdin;
\.


--
-- TOC entry 5067 (class 0 OID 80752)
-- Dependencies: 222
-- Data for Name: fields_of_study; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fields_of_study (field_of_study_id, field_of_study_name) FROM stdin;
\.


--
-- TOC entry 5065 (class 0 OID 80743)
-- Dependencies: 220
-- Data for Name: levels; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.levels (level_id, level_name) FROM stdin;
\.


--
-- TOC entry 5084 (class 0 OID 81429)
-- Dependencies: 239
-- Data for Name: memberships; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.memberships (id, "userId", "studyGroupId", "isAnonymous", created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5079 (class 0 OID 81387)
-- Dependencies: 234
-- Data for Name: otps; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.otps (otp_id, user_id, otp_code, expires_at, is_used, created_at, updated_at) FROM stdin;
1	1	563343	2025-07-03 10:54:42.358+05:45	f	2025-07-03 10:47:42.366+05:45	2025-07-03 10:47:42.366+05:45
\.


--
-- TOC entry 5081 (class 0 OID 81400)
-- Dependencies: 236
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.refresh_tokens (token_id, user_id, token, expires_at, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5082 (class 0 OID 81413)
-- Dependencies: 237
-- Data for Name: study_groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.study_groups (id, name, description, "creatorId", "groupCode", "isPrivate", created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5090 (class 0 OID 81475)
-- Dependencies: 245
-- Data for Name: sub_topics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sub_topics (id, "topicId", title, content, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5086 (class 0 OID 81449)
-- Dependencies: 241
-- Data for Name: syllabi; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.syllabi (id, "studyGroupId", created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5088 (class 0 OID 81461)
-- Dependencies: 243
-- Data for Name: topics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.topics (id, "syllabusId", title, description, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5069 (class 0 OID 80761)
-- Dependencies: 224
-- Data for Name: universities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.universities (university_id, university_name, country_id) FROM stdin;
\.


--
-- TOC entry 5077 (class 0 OID 81368)
-- Dependencies: 232
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, username, email, password_hash, auth_provider, "fullName", role, is_banned, is_verified, last_otp, age, phone, nationality, address, education, created_at, updated_at) FROM stdin;
1	rishav	gainrishavchap@gmail.com	$2b$10$E60OYH/JXXcOWwpkhbQQLOLrZFVAi5pEUgUuTsud7kom.FG.Ig2n.	local	\N	user	f	t	2025-07-03 10:47:42.358+05:45	\N	\N	\N	{}	{}	2025-07-03 10:47:42.255+05:45	2025-07-03 10:48:12.188+05:45
\.


--
-- TOC entry 5114 (class 0 OID 0)
-- Dependencies: 229
-- Name: academics_academic_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.academics_academic_id_seq', 1, false);


--
-- TOC entry 5115 (class 0 OID 0)
-- Dependencies: 246
-- Name: additional_resources_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.additional_resources_id_seq', 1, false);


--
-- TOC entry 5116 (class 0 OID 0)
-- Dependencies: 227
-- Name: addresses_address_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.addresses_address_id_seq', 1, false);


--
-- TOC entry 5117 (class 0 OID 0)
-- Dependencies: 225
-- Name: colleges_college_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.colleges_college_id_seq', 1, false);


--
-- TOC entry 5118 (class 0 OID 0)
-- Dependencies: 217
-- Name: countries_country_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.countries_country_id_seq', 1, false);


--
-- TOC entry 5119 (class 0 OID 0)
-- Dependencies: 221
-- Name: fields_of_study_field_of_study_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.fields_of_study_field_of_study_id_seq', 1, false);


--
-- TOC entry 5120 (class 0 OID 0)
-- Dependencies: 219
-- Name: levels_level_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.levels_level_id_seq', 1, false);


--
-- TOC entry 5121 (class 0 OID 0)
-- Dependencies: 238
-- Name: memberships_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.memberships_id_seq', 1, false);


--
-- TOC entry 5122 (class 0 OID 0)
-- Dependencies: 233
-- Name: otps_otp_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.otps_otp_id_seq', 1, true);


--
-- TOC entry 5123 (class 0 OID 0)
-- Dependencies: 235
-- Name: refresh_tokens_token_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.refresh_tokens_token_id_seq', 1, false);


--
-- TOC entry 5124 (class 0 OID 0)
-- Dependencies: 244
-- Name: sub_topics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sub_topics_id_seq', 1, false);


--
-- TOC entry 5125 (class 0 OID 0)
-- Dependencies: 240
-- Name: syllabi_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.syllabi_id_seq', 1, false);


--
-- TOC entry 5126 (class 0 OID 0)
-- Dependencies: 242
-- Name: topics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.topics_id_seq', 1, false);


--
-- TOC entry 5127 (class 0 OID 0)
-- Dependencies: 223
-- Name: universities_university_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.universities_university_id_seq', 1, false);


--
-- TOC entry 5128 (class 0 OID 0)
-- Dependencies: 231
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 1, true);


--
-- TOC entry 4872 (class 2606 OID 80818)
-- Name: academics academics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.academics
    ADD CONSTRAINT academics_pkey PRIMARY KEY (academic_id);


--
-- TOC entry 4900 (class 2606 OID 81494)
-- Name: additional_resources additional_resources_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.additional_resources
    ADD CONSTRAINT additional_resources_pkey PRIMARY KEY (id);


--
-- TOC entry 4870 (class 2606 OID 80801)
-- Name: addresses addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_pkey PRIMARY KEY (address_id);


--
-- TOC entry 4866 (class 2606 OID 80782)
-- Name: colleges colleges_college_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.colleges
    ADD CONSTRAINT colleges_college_name_key UNIQUE (college_name);


--
-- TOC entry 4868 (class 2606 OID 80780)
-- Name: colleges colleges_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.colleges
    ADD CONSTRAINT colleges_pkey PRIMARY KEY (college_id);


--
-- TOC entry 4850 (class 2606 OID 80741)
-- Name: countries countries_country_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_country_name_key UNIQUE (country_name);


--
-- TOC entry 4852 (class 2606 OID 80739)
-- Name: countries countries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_pkey PRIMARY KEY (country_id);


--
-- TOC entry 4858 (class 2606 OID 80759)
-- Name: fields_of_study fields_of_study_field_of_study_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fields_of_study
    ADD CONSTRAINT fields_of_study_field_of_study_name_key UNIQUE (field_of_study_name);


--
-- TOC entry 4860 (class 2606 OID 80757)
-- Name: fields_of_study fields_of_study_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fields_of_study
    ADD CONSTRAINT fields_of_study_pkey PRIMARY KEY (field_of_study_id);


--
-- TOC entry 4854 (class 2606 OID 80750)
-- Name: levels levels_level_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.levels
    ADD CONSTRAINT levels_level_name_key UNIQUE (level_name);


--
-- TOC entry 4856 (class 2606 OID 80748)
-- Name: levels levels_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.levels
    ADD CONSTRAINT levels_pkey PRIMARY KEY (level_id);


--
-- TOC entry 4890 (class 2606 OID 81435)
-- Name: memberships memberships_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.memberships
    ADD CONSTRAINT memberships_pkey PRIMARY KEY (id);


--
-- TOC entry 4892 (class 2606 OID 81437)
-- Name: memberships memberships_userId_studyGroupId_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.memberships
    ADD CONSTRAINT "memberships_userId_studyGroupId_key" UNIQUE ("userId", "studyGroupId");


--
-- TOC entry 4880 (class 2606 OID 81393)
-- Name: otps otps_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.otps
    ADD CONSTRAINT otps_pkey PRIMARY KEY (otp_id);


--
-- TOC entry 4882 (class 2606 OID 81405)
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (token_id);


--
-- TOC entry 4884 (class 2606 OID 81407)
-- Name: refresh_tokens refresh_tokens_token_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_key UNIQUE (token);


--
-- TOC entry 4886 (class 2606 OID 81422)
-- Name: study_groups study_groups_groupCode_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.study_groups
    ADD CONSTRAINT "study_groups_groupCode_key" UNIQUE ("groupCode");


--
-- TOC entry 4888 (class 2606 OID 81420)
-- Name: study_groups study_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.study_groups
    ADD CONSTRAINT study_groups_pkey PRIMARY KEY (id);


--
-- TOC entry 4898 (class 2606 OID 81482)
-- Name: sub_topics sub_topics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sub_topics
    ADD CONSTRAINT sub_topics_pkey PRIMARY KEY (id);


--
-- TOC entry 4894 (class 2606 OID 81454)
-- Name: syllabi syllabi_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.syllabi
    ADD CONSTRAINT syllabi_pkey PRIMARY KEY (id);


--
-- TOC entry 4896 (class 2606 OID 81468)
-- Name: topics topics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.topics
    ADD CONSTRAINT topics_pkey PRIMARY KEY (id);


--
-- TOC entry 4862 (class 2606 OID 80766)
-- Name: universities universities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_pkey PRIMARY KEY (university_id);


--
-- TOC entry 4864 (class 2606 OID 80768)
-- Name: universities universities_university_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_university_name_key UNIQUE (university_name);


--
-- TOC entry 4874 (class 2606 OID 81385)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4876 (class 2606 OID 81381)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4878 (class 2606 OID 81383)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 4904 (class 2606 OID 80839)
-- Name: academics academics_college_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.academics
    ADD CONSTRAINT academics_college_id_fkey FOREIGN KEY (college_id) REFERENCES public.colleges(college_id) ON UPDATE CASCADE;


--
-- TOC entry 4905 (class 2606 OID 80829)
-- Name: academics academics_field_of_study_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.academics
    ADD CONSTRAINT academics_field_of_study_id_fkey FOREIGN KEY (field_of_study_id) REFERENCES public.fields_of_study(field_of_study_id) ON UPDATE CASCADE;


--
-- TOC entry 4906 (class 2606 OID 80824)
-- Name: academics academics_level_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.academics
    ADD CONSTRAINT academics_level_id_fkey FOREIGN KEY (level_id) REFERENCES public.levels(level_id) ON UPDATE CASCADE;


--
-- TOC entry 4907 (class 2606 OID 80834)
-- Name: academics academics_university_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.academics
    ADD CONSTRAINT academics_university_id_fkey FOREIGN KEY (university_id) REFERENCES public.universities(university_id) ON UPDATE CASCADE;


--
-- TOC entry 4916 (class 2606 OID 81495)
-- Name: additional_resources additional_resources_studyGroupId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.additional_resources
    ADD CONSTRAINT "additional_resources_studyGroupId_fkey" FOREIGN KEY ("studyGroupId") REFERENCES public.study_groups(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4902 (class 2606 OID 80788)
-- Name: colleges colleges_country_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.colleges
    ADD CONSTRAINT colleges_country_id_fkey FOREIGN KEY (country_id) REFERENCES public.countries(country_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4903 (class 2606 OID 80783)
-- Name: colleges colleges_university_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.colleges
    ADD CONSTRAINT colleges_university_id_fkey FOREIGN KEY (university_id) REFERENCES public.universities(university_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4911 (class 2606 OID 81443)
-- Name: memberships memberships_studyGroupId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.memberships
    ADD CONSTRAINT "memberships_studyGroupId_fkey" FOREIGN KEY ("studyGroupId") REFERENCES public.study_groups(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4912 (class 2606 OID 81438)
-- Name: memberships memberships_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.memberships
    ADD CONSTRAINT "memberships_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4908 (class 2606 OID 81394)
-- Name: otps otps_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.otps
    ADD CONSTRAINT otps_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4909 (class 2606 OID 81408)
-- Name: refresh_tokens refresh_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4910 (class 2606 OID 81423)
-- Name: study_groups study_groups_creatorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.study_groups
    ADD CONSTRAINT "study_groups_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES public.users(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4915 (class 2606 OID 81483)
-- Name: sub_topics sub_topics_topicId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sub_topics
    ADD CONSTRAINT "sub_topics_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES public.topics(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4913 (class 2606 OID 81455)
-- Name: syllabi syllabi_studyGroupId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.syllabi
    ADD CONSTRAINT "syllabi_studyGroupId_fkey" FOREIGN KEY ("studyGroupId") REFERENCES public.study_groups(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4914 (class 2606 OID 81469)
-- Name: topics topics_syllabusId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.topics
    ADD CONSTRAINT "topics_syllabusId_fkey" FOREIGN KEY ("syllabusId") REFERENCES public.syllabi(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4901 (class 2606 OID 80769)
-- Name: universities universities_country_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_country_id_fkey FOREIGN KEY (country_id) REFERENCES public.countries(country_id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2025-07-03 10:54:17

--
-- PostgreSQL database dump complete
--

