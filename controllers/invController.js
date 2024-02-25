const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  if(!data || data.length === 0){
    const err = new Error('An internal server error has occured!')
      err.status = 404;
      err.message = "the category you are trying to view does not exist!"
      return next(err)
  }
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build by detail view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  const Inv_id = req.params.classificationId
  const data = await invModel.getInventoryByInvId(Inv_id)
  if(!data || data.length === 0){
    const err = new Error('An internal server error has occured!')
      err.status = 404;
      err.message = "the category you are trying to view does not exist!"
      return next(err)
  }
  const grid = await utilities.buildDetailGrid(data)
  let nav = await utilities.getNav()
  const Detailname = data[0].inv_model
  res.render("./inventory/classification", {
    title: Detailname + " vehicles",
    nav,
    grid,
  })
}


module.exports = invCont;
