const sendToken = (user, statusCode, res) => {
    const token = user.getJWTToekn();
  
    const option = {
      expires: new Date(
        Date.now() + 3 * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: false,
      sameSite: "None",
    };
    console.log(token);
    
    res.status(statusCode).cookie("token", token, option).json({
      success: true,
      token,
      user,
    });
  };
  
  export default sendToken;
//   module.exports = sendToken;
  