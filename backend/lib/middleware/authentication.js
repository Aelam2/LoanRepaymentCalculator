import dotenv from "dotenv";
import passport from "passport";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
import { Strategy as GoogleStrategy } from "passport-google-token";
import FacebookTokenStrategy from "passport-facebook-token";
import LocalStrategy from "passport-local";
import { sequelize, Users } from "../models/models";
import { isUnique } from "../helpers/errorHelper";

dotenv.config();

//JSON WEB TOKEN STRATEGIRY
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromHeader("authorization"),
      secretOrKey: process.env.JWT_SECRET
    },
    async (payload, done) => {
      try {
        // Find the user specified in token
        const user = await Users.findOne({ where: { UserID: payload.sub } });

        // If user doesn't exist, handle it
        if (!user) {
          return done(null, false);
        }

        // otherwise, return the user
        return done(null, user);
      } catch (err) {
        console.log(err);
        done(err, false);
      }
    }
  )
);

// GOOGLE OAUTH STRATEGY
passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check whether this user currently exists in our DB
        const existingUser = await Users.findOne({ where: { GoogleID: profile.id } });
        if (existingUser) {
          // Update LastLogin timestamp for user
          existingUser.update({ LastLogin: sequelize.fn("GETDATE") });

          // Return existing user
          return done(null, existingUser);
        }

        // Check if Email was ever used with existing local login
        await isUnique(Users, "Email", profile.emails[0].value);

        // Create new user with their Google Credentials
        const newUser = await Users.create({
          CreationMethod: "google",
          GoogleID: profile.id,
          Email: profile.emails[0].value,
          FirstName: profile.name.givenName,
          LastName: profile.name.familyName,
          LastLogin: sequelize.fn("GETDATE")
        });

        done(null, newUser);
      } catch (err) {
        done(err, false, err.message);
      }
    }
  )
);

// FACEBOOK OAUTH STRATEGY
passport.use(
  "facebook",
  new FacebookTokenStrategy(
    {
      clientID: process.env.FACEBOOK_OAUTH_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_OAUTH_CLIENT_SECRET
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check whether this user currently exists in our DB
        const existingUser = await Users.findOne({ where: { FacebookID: profile.id } });
        if (existingUser) {
          // Update LastLogin timestamp for user
          existingUser.update({ LastLogin: sequelize.fn("GETDATE") });

          // Return existing user
          return done(null, existingUser);
        }

        // Check if Email was ever used with existing local login
        await isUnique(Users, "Email", profile.emails[0].value);

        // Create new user with their Google Credentials
        const newUser = await Users.create({
          CreationMethod: "facebook",
          FacebookID: profile.id,
          Email: profile.emails[0].value || null,
          FirstName: profile.name.givenName,
          LastName: profile.name.familyName,
          LastLogin: sequelize.fn("GETDATE")
        });

        done(null, newUser);
      } catch (err) {
        done(err, false, err.message);
      }
    }
  )
);

// LOCAL STRATEGY
passport.use(
  new LocalStrategy(
    {
      usernameField: "UserName",
      passwordField: "Password"
    },
    async (UserName, Password, done) => {
      try {
        // Find the User via their UserName
        let user = await Users.scope("withPassword").findOne({ where: { UserName } });

        // If not, Handle it
        if (!user) {
          return done(null, false);
        }

        // Check if password is correct
        const isMatch = await user.isValidPassword(Password);

        // If not, handle it
        if (!isMatch) {
          return done(null, false);
        }

        // Update LastLogin timestamp for user
        user.update({
          LastLogin: sequelize.fn("GETDATE")
        });

        // Otherwise, return the User
        return done(false, user);
      } catch (err) {
        done(err, false);
      }
    }
  )
);
