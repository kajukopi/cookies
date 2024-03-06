const {middleWareAuth} = require("./middleWareAuth")

const router = require("express").Router()

router.use(middleWareAuth)

module.exports = router
