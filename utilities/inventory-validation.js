const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
 *  Registration Data Validation Rules
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
  
      // price is required and must be a number 
      body("inv_price")
        .trim()
        .isCurrency()
        .withMessage("please provide a price."),
    
      // year is required and must be a number
      body("inv_year")
      .trim()
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
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkInvData = async (req, res, next) => {
    const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/addnewinv", {
        errors,
        title: "add new invintory",
        nav,
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
  
  module.exports = validate