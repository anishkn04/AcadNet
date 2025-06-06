import passport from 'passport';
import { Strategy as GithubStrategy } from "passport-github2";
import User from '../models/user.model.js';

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_PASSPORT,
      callbackURL: 'https://localhost:3000/api/v1/auth/github/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const baseUsername = profile.username;
        const fullName = profile.displayName || '';
        const email = profile.emails?.[0]?.value?.toLowerCase();

        if (!email || !baseUsername) {
          return done(new Error('GitHub account does not provide necessary details'), null);
        }

        // Check if user with this email already exists
        let user = await User.findOne({ email });

        if (user) {
          // Prevent login if email is used for non-GitHub auth
          if (user.authProvider !== 'github') {
            return done(new Error('Email already used with a different auth method'), null);
          }

          return done(null, user); // GitHub user logging in again
        }

        // Ensure unique username
        let username = baseUsername;
        let suffix = 1;
        while (await User.findOne({ username })) {
          username = `${baseUsername}_${suffix++}`;
        }

        // Create new user
        user = new User({
          username,
          email,
          password: 'OAuth-Login', // Dummy password, won't be hashed
          authProvider: 'github',
          fullName
        });

        try {
          await user.save();
          return done(null, user);
        } catch (err) {
          // Catch duplicate key error (in case of race condition)
          if (err.code === 11000 && err.keyPattern?.email) {
            return done(new Error('Email already exists'), null);
          }
          return done(err, null);
        }

      } catch (error) {
        return done(error, null);
      }
    }
  )
);
