import passport from "passport";
import { Strategy as GithubStrategy } from "passport-github2";
import UserModel from "../models/user.model.js";


// Helper to fetch verified primary email from GitHub API
const getGitHubEmail = async (accessToken) => {
  try {
    const res = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `token ${accessToken}`,
        Accept: "application/vnd.github.v3+json"
      }
    });

    const data = await res.json();
    const primary = data.find((email) => email.primary && email.verified);
    return primary?.email?.toLowerCase();
  } catch (err) {
    console.error("Error fetching GitHub email:", err);
    return null;
  }
};

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_PASSPORT,
      callbackURL: "http://localhost:3000/api/v1/auth/github/callback",
      scope: ["user:email"],
      userAgent: "RishavOp"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const baseUsername = profile.username;
        const fullName = profile.displayName || "";

        let email = profile.emails?.[0]?.value?.toLowerCase();

        if (!email) {
          email = await getGitHubEmail(accessToken);
        }

        if (!email || !baseUsername) {
          return done(null,false)
        }

        // Check if user exists
        let user = await UserModel.findOne({ where: { email } });

        if (user) {
          if (user.auth_provider !== "github") {
            const info =  {errorCode: 101, message: "GitHub email missing" }
            return done(null,false)
          }
          return done(null, user); // GitHub user logging in again
        }

        // Ensure unique username
        let username = baseUsername;
        let suffix = 1;
        while (await UserModel.findOne({ where: { username } })) {
          username = `${baseUsername}_${suffix++}`;
        }

        email = email.toLowerCase();
        username = username.toLowerCase();
        const isVerified = true;

        // Create user
        user = await UserModel.create({
          username,
          email,
          password_hash: "OAuth-Login", // Not hashed, just a placeholder
          auth_provider: "github",
          fullName,
          is_verified: isVerified
        });

        return done(null, user);
      } catch (error) {
        return done(null,false)
      }
    }
  )
);