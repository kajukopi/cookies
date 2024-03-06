const short = require("short-uuid")
exports.sessions = (req, res, next) => {
  if (!req.cookies["session.sid"]) {
    res.cookie("session.sid", short().generate(), {
      maxAge: /* 6 * 60 *  */ 60 * 1000,
      path: "/",
      // httpOnly: true,
      secure: true,
    })
    next()
  } else {
    next()
  }
}
