// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')

// Deliver Login View
// unit 4, deliver login vie activity 
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Process login
router.post("/login", regValidate.loginRules(), regValidate.checkloginData, utilities.handleErrors(accountController.accountLogin))

// Deliver Registration View
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Process Regitration
router.post("/register", regValidate.registationRules(), regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount))

// Deliver Account Managment View
router.get("/accountManagment",utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagment))

// process Account update
router.post("/accountManagment", regValidate.registationRules(), regValidate.checkRegData, utilities.handleErrors(accountController.accountUpdate))

// process Password update
router.post("/accountManagment", regValidate.registationRules(), regValidate.checkRegData, utilities.handleErrors(accountController.resetPassword))

module.exports = router;