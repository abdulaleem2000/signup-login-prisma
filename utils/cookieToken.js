const getJwtToken = require("../helpers/getJwtToken");

const cookieToken = (user, res) => {
  const token = getJwtToken(user.id);
  user.password = undefined;

  res
    .status(200)
    .cookie("token", token, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24), //1 day from now
      httpOnly: true,
    })
    .json({
      //sending to frontend
      success: true,
      token,
      user, //user data
    });
};

module.exports = cookieToken;
