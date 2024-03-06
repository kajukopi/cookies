const {middleWareAuth} = require("../middleware/middleWareAuth")
const bcrypt = require("bcrypt")
const saltRounds = 11
const router = require("express").Router()

// router.use(middleWareAuth)

router.get("/", async (req, res) => {
  console.log(await verifyRequest(req, "get/status"))
  console.log(req.headers)
  console.log(req.baseUrl)
  console.log(req.url)
  console.log(req.originalUrl)
  res.json({status: true})
})

async function verifyRequest(req, path) {
  if (!req?.cookies["session.auth"] || !req?.cookies["session.sid"]) return {text: "sign-in first!!", path}
  const match = await bcrypt.compare(req.cookies["session.sid"], req.cookies["session.auth"])
  if (!match) return {text: "sign-in first!!", path}
  return true
}

module.exports = router
