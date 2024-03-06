const {middleWareRouter} = require("../middleware/middleWareRouter")

const router = require("express").Router()

router.use(middleWareRouter)

module.exports = router
