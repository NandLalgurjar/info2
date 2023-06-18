const jwt = require("jsonwebtoken")
const userModel = require('../model/userModel');

module.exports = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ").pop()
      const { user_id } = jwt.verify(token, process.env.TOKEN_KEY)
      req.user = await userModel.findOneAndUpdate({ _id: user_id, isDeleted: false }, { token }, { new: true })
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