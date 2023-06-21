const jwt = require("jsonwebtoken")
const userModel = require('../model/userModel');

module.exports = async (req, res, next) => {
  try {
    if (req.cookies.accessToken) {
      const token = req.cookies.accessToken
      const decode = jwt.verify(token, process.env.accessToken);
      console.log(decode, "data")
      req.user = await userModel.findOne({ _id: decode._id, isdeleted: false });
      console.log(req.user)
      if (req.user) {
        next()
      } else {
        return res.status(401).json({
          status: false,
          message: "Unauthorized",
          data: []
        })
      }
    } else {
      return res.status(401).json({
        status: false,
        message: "Token Not Found",
        data: []
      })
    }
  } catch (error) {
    return res.status(401).json({
      status: false,
      message: "Invalid Token",
      data: []
    })
  }
}