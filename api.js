const {middleWareRouter} = require("./middleWareRouter")

const router = require("express").Router()

router.use(middleWareRouter)

module.exports = router
