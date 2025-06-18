import passport from "passport";
import { Strategy as GithubStrategy } from "passport-github2";
import User from "../models/user.model.js";


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
        let user = await User.findOne({ email });

        if (user) {
          if (user.authProvider !== "github") {
            const info =  {errorCode: 101, message: "GitHub email missing" }
            return done(null,false)
          }
          return done(null, user); // GitHub user logging in again
        }

        // Ensure unique username
        let username = baseUsername;
        let suffix = 1;
        while (await User.findOne({ username })) {
          username = `${baseUsername}_${suffix++}`;
        }

        email = email.toLowerCase();
        username = username.toLowerCase();
        const isVerified = true;

        // Create user
        user = new User({
          username,
          email,
          password: "OAuth-Login", // Not hashed, just a placeholder
          authProvider: "github",
          fullName,
          isVerified
        });

        await user.save();
        return done(null, user);
      } catch (error) {
        return done(null,false)
      }
    }
  )
);