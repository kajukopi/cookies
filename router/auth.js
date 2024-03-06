const {middleWareAuth} = require("../middleware/middleWareAuth")

const router = require("express").Router()

router.use(middleWareAuth)

module.exports = router
