/********************************
 * Account Controller
 * ******************************/

const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
require("dotenv").config();

/*********************************
 *   Deliver login view
 * ********************************/

async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
  });
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
let hashedPassword
try {
  // regular password and cost (salt is generated automatically)
  hashedPassword = await bcrypt.hashSync(account_password, 10)
} catch (error) {
  req.flash("notice", 'Sorry, there was an error processing the registration.')
  res.status(500).render("account/register", {
    title: "Registration",
    nav,
    errors: null,
  })
}

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    });
  }
}



/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {

    req.flash("notice", "Please check your credentials and try again.");
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
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      );
      if (process.env.NODE_ENV === "development") {

            res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      }else{
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 });
      }
      
      return res.redirect("/account/");
    }
  } catch (error) {

    return new Error("Access Forbidden");
  }
}

/* ****************************************
 *  Deliver Account Manangment view
 * *************************************** */

async function buildAccountManagment(req, res,) {
  let nav = await utilities.getNav();

  additional = await utilities.getAdditional(res.locals.accountData.account_type)

  res.render("account/accountManagment", {
    title: "Welcome " + res.locals.accountData.account_firstname,
    additional: additional,
    nav,
    errors: null,
  });
}


async function buildAccountupdate(req, res,) {
  let nav = await utilities.getNav()
  accountData = res.locals.accountData

  res.render("account/update", {
    title: "Account update",
    nav,
    errors: null,
    account_id: accountData.account_id,
    account_email: accountData.account_email,
    account_lastname: accountData.account_lastname,
    account_firstname: accountData.account_firstname,
  })
}


async function updateAccount(req, res, next) {
  try {
    let nav = await utilities.getNav();
    const { account_firstname, account_lastname, account_email, account_id } = req.body;
    const updateResult = await accountModel.updateAccount({
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    });
      // Rebuild the JWT with new data delete 
      updateResult.account_password; 
      const accessToken = jwt.sign(updateResult, process.env.ACCESS_TOKEN_SECRET, 
        { expiresIn: 3600 * 1000, }); 
        res.cookie("jwt", accessToken, 
        { httpOnly: true, maxAge: 3600 * 1000 }
        );
    if (updateResult) {
      const accountName = `${updateResult.account_firstname} ${updateResult.account_lastname}`;
      req.flash("notice", `${accountName} was successfully updated.`);
      res.redirect("/account/update");

    } else {
      const accountName = `${account_firstname} ${account_lastname}`;
      req.flash("notice", "Sorry, the update failed.");
      res.status(501).render("/account/update", {  // Assuming "updateAccount" is the correct path
        title: `Update ${accountName}`,
        nav,
        errors: null,
        account_firstname,
        account_lastname,
        account_email,
        account_id,
      });
    }
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
}

// async function  updateAccount(req, res, next) {
//   let nav = await utilities.getNav();
//   const { account_firstname, account_lastname, account_email, account_id } = req.body;
//   const updateResult = await accountModel.updateAccount({
//     account_firstname,
//     account_lastname,
//     account_email,
//     account_id,
//   });

//   if (updateResult) {
//     const accountName =
//       updateResult.account_firstname + " " + updateResult.account_lastname;
//     req.flash("notice", `${accountName} was successfully updated.`);
//     res.redirect("/account/");
//   } else {
//     const accountName = `${account_firstname} ${account_lastname}`;
//     req.flash("notice", "Sorry, the update failed.");
//     res.status(501).render("/account/updateAccount", {
//       title: "update " + accountName,
//       nav,
//       errors: null,
//       account_firstname,
//       account_lastname,
//       account_email,
//       account_id,
//     });
//   }
// }

// async function updatePassword(req, res, next) {
//   console.log("you in updatePassword1")
//   let nav = await utilities.getNav();
//   const { account_password, account_id} = req.body;
//   let hashedPassword
// try {
//   console.log("you in updatePassword2")
//   // regular password and cost (salt is generated automatically)
//   hashedPassword = await bcrypt.hashSync(account_password, 10)
// } catch (error) {
//   console.log("you in updatePassword3")
//   req.flash("notice", 'Sorry, there was an error processing the registration.')
//   res.status(500).render("account/update", {
//     title: "account update",
//     nav,
//     errors: null,
//   })
// }
//  try{ await accountModel.updatePassword({
//     hashedPassword,
//     account_id,
//   });}
//   catch(error){    console.log("you in updatePassword6")
//   const accountName = `${res.locals.accountData.account_firstname} ${res.locals.accountData.account_lastname}`;
//   req.flash("notice", "Sorry, the insert failed.");
//   res.status(501).render("/account/update", {
//     title: "update " + accountName,
//     nav,
//     errors: null,
//     account_id,
//   });}
//   console.log("you in updatePassword4")
//     const accountName =
//       res.locals.accountData.account_firstname + " " + res.locals.accountData.account_lastname;
//     req.flash(
//       "notice",
//       `${accountName} successfully updated password.`
//     );
//     res.redirect("/account/update");



// }

async function updatePassword(req, res, next) {
  let nav = await utilities.getNav();
  const { account_password, account_id } = req.body;
  let hashedPassword;
  
  try {

    // Hashing the password asynchronously
    hashedPassword = await bcrypt.hash(account_password, 10);
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.');
    return res.status(500).render("account/update", {
      title: "Account Update",
      nav,
      errors: null,
    });
  }

  try {
    await accountModel.updatePassword(
      hashedPassword,
      account_id,
    );
  } catch (error) {
    const accountName = `${res.locals.accountData.account_firstname} ${res.locals.accountData.account_lastname}`;
    req.flash("notice", "Sorry, the password update failed.");
    return res.status(501).render("/account/update", {
      title: "Update " + accountName,
      nav,
      errors: null,
      account_id,
    });
  }
  const accountName = `${res.locals.accountData.account_firstname} ${res.locals.accountData.account_lastname}`;
  req.flash("notice", `${accountName} successfully updated password.`);
  res.redirect("/account/update");
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccountManagment,
  updateAccount,
  updatePassword,
  buildAccountupdate,
};
