// get database
const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
      const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
      return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
      return error.message
    }
  }

  /* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail(account_email) {
  try {
    console.log =("im in acountbyemail")
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* *****************************
*   update account
* *************************** */
async function updateAccount({account_firstname, account_lastname, account_email,}){
  try {
    const sql = "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 RETURNING *"
    return await pool.query(sql, [account_firstname, account_lastname, account_email,])
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   update account
* *************************** */
async function updatePassword({account_password}){
  try {
    const sql = "UPDATE account SET account_password = $1 RETURNING *"
    return await pool.query(sql, [account_password])
  } catch (error) {
    return error.message
  }
}


  module.exports = { registerAccount, getAccountByEmail, updateAccount, updatePassword }