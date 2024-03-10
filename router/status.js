const {middleWareAuth} = require("../middleware/middleWareAuth")
const bcrypt = require("bcrypt")
const saltRounds = 11
const router = require("express").Router()

// router.use(middleWareAuth)

router.get("/", async (req, res) => {
  const check = await verifyRequest(req, "get/status")
  res.json(check)
})

async function verifyRequest(req, path) {
  if (!req?.cookies["session.auth"] || !req?.cookies["session.sid"]) return {status: false, text: "sign-in first!!", path}
  const match = await bcrypt.compare(req.cookies["session.sid"], req.cookies["session.auth"])
  if (!match) return {status: false, text: "sign-in first!!", path}
  return {status: true}
}

module.exports = router
