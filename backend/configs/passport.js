import User from "../models/userModel.js";

const jwtCallback = async (jwt_payload, done) => {
  const user = await User.findById(jwt_payload.id);

  if (user) {
    return done(null, user.id);
  }
  return done(null, false);
};

export default jwtCallback;
