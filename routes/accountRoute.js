// Needed Resources
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require("../utilities/account-validation");

// Deliver Login View
// unit 4, deliver login vie activity
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Process login
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkloginData,
  utilities.handleErrors(accountController.accountLogin)
);

// Deliver Registration View
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);

// Process Regitration
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Deliver Account Managment View
router.get(
  "/",
  utilities.checkLogin,
  utilities.checkJWTToken,
  utilities.handleErrors(accountController.buildAccountManagment)
);

router.get(
  "/update",
  utilities.checkLogin,
  utilities.checkJWTToken,
  utilities.handleErrors(accountController.buildAccountupdate)
)

// process Account update
router.post(
  "/update",
  regValidate.registationRules(),
  utilities.checkLogin,
  utilities.handleErrors(accountController.updateAccount)
);

// process Password update
router.post(
  "/update/:password",
  regValidate.resetPasswordRules(),
  utilities.checkLogin,
  utilities.handleErrors(accountController.updatePassword)
);

router.get(
  "/logout",
  utilities.handleErrors((req,res) => {res.clearCookie("jwt"); res.redirect("/");})
)

module.exports = router;
