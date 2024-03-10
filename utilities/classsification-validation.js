const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
 *  classification Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
    return [
      // classification name is required and must be string
      body("classification_name")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a classification name."), // on error this message is sent.
    ]
  }

  /* ******************************
 * Check data and return errors or continue to classification
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inv/addnewclass", {
        errors,
        title: "classification",
        nav,
        classification_name,
      })
      return
    }
    next()
  }
  
  module.exports = validate