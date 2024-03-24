/********************************
 * Account Controller
 * ******************************/

const utilities = require('../utilities')
const accountModel = require('../models/account-model')
const jwt = require("jsonwebtoken")
require("dotenv").config()

/*********************************
 *   Deliver login view
 * ********************************/ 

async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { 
      account_firstname, 
      account_lastname, 
      account_email, 
      account_password 
    } = req.body
  
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_password
    )
  
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
      })
    }
  }

  /* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
   if(process.env.NODE_ENV === 'development') {
     res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
     } else {
       res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
     }
   return res.redirect("/account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 }

 /* ****************************************
*  Deliver Account Manangment view
* *************************************** */
async function buildAccountManagment(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/accountManagment", {
    title: "account Management",
    nav,
    errors: null,
  })
}
 
 
 
async function accountUpdate(req, res, next) {
  let nav = await utilities.getNav()
  const {
    account_firstname,
    account_lastname,
    account_email,
  } = req.body
  const updateResult = await invModel.updateAccount({
    account_firstname,
    account_lastname,
    account_email,
  })
 
   if (updateResult) {
    const accountName = updateResult.account_firstname + " " + updateResult.account_lastname
    req.flash("notice", `The ${accountName} was successfully updated.`)
    res.redirect("/account/")
  } else {
    const accountName = `${account_firstname} ${account_lastname}`
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("/account/accountManagment", {
    title: "update " + accountName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    account_firstname,
    account_lastname,
    account_email,
    })
  }
}

  async function resetPassword(req, res, next) {
    let nav = await utilities.getNav()
    const {
      account_password,
    } = req.body

  const passwordResult = await invModel.updatePassword({
    account_password,
  })

  if (passwordResult) {
    const accountName = updateResult.account_firstname + " " + updateResult.account_lastname
    req.flash("notice", `The ${accountName} was successfully updated password.`)
    res.redirect("/account/")
  } else {
    const accountName = `${account_firstname} ${account_lastname}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("/account/accountManagment", {
    title: "update " + accountName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    account_password,
    })
  }
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManagment, accountUpdate, resetPassword}