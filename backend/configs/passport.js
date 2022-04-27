import User from "../models/userModel.js";

const jwtCallback = async (jwt_payload, done) => {
  const user = await User.findOne({ email: jwt_payload.email });

  if (user) {
    return done(null, user.id);
  }
  return done(null, false);
};

export default jwtCallback;
