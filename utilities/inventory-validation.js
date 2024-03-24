const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
 *  add invitory Data Validation Rules
 * ********************************* */
validate.newInvRules = () => {
    return [
      // make is required and must be string
      body("inv_make")
        .trim()
        .isLength({ min: 3 })
        .withMessage("Please provide a Make."), // on error this message is sent.
  
      // model is required and must be string
      body("inv_model")
        .trim()
        .isLength({ min: 3 })
        .withMessage("Please provide a Model."), // on error this message is sent.

        body("inv_description")
        .trim(),

        body("inv_image")
        .trim(),

        body("inv_thumbnail")
        .trim(),
  
      // price is required and must be a number 
      body("inv_price")
        .trim()
        .isCurrency()
        .withMessage("please provide a price."),
    
      // year is required and must be a number
      body("inv_year")
      .trim()
      .isInt()
      .isLength( {min: 4, max: 4} )
      .withMessage("please provide a year."),

        // miles for the vehicale is required and must be a number
        body("inv_miles")
        .trim()
        .isNumeric()
        .withMessage("please provide the miles."),
  
      // password is required and must be strong password
        body("inv_color")
        .trim()
    ]
  }

  /* ******************************
 * Check data and return errors or continue to add inventory
 * ***************************** */
validate.checkInvData = async (req, res, next) => {
    const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
    let errors = []
    errors = validationResult(req)
    console.log("im in check inv", inv_make)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      let classList = await utilities.buildClassificationList()
      res.render("inventory/addnewinv", {
        errors,
        title: "add new invintory",
        nav,
        classList,
        classification_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color
      })
      return
    }
    next()
  }

   /* ******************************
 * Check data and return errors or continue to edit inventory
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { classification_id, inv_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
  let errors = []
  errors = validationResult(req)
  console.log("im in check inv", inv_make)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/edit-inventory", {
      errors,
      title: "edit invintory",
      nav,
      classification_id,
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color
    })
    return
  }
  next()
}
  
  module.exports = validate