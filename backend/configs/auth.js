import dotenv from "dotenv";
import passport from "passport";
import JwtStrategy from "passport-jwt";
import ExtractJwt from "passport-jwt";
import jwtCallback from "./passport.js";

dotenv.config();

const opts = {
  jwtFromRequest: ExtractJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(new JwtStrategy.Strategy(opts, jwtCallback));

const auth = passport.authenticate("jwt", { session: false });

export default auth;
