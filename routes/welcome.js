const express = require("express")
const router = express.Router()
const {welcome} = require("../controler/welcome/welcome")
router.get('/',welcome)
module.exports = router;