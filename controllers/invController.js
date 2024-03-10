const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  if (!data || data.length === 0) {
    const err = new Error("An internal server error has occured!");
    err.status = 404;
    err.message = "the category you are trying to view does not exist!";
    return next(err);
  }
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

/* ***************************
 *  Build by detail view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  const Inv_id = req.params.inv_id;
  const data = await invModel.getInventoryByInvId(Inv_id);
  if (!data || data.length === 0) {
    const err = new Error("An internal server error has occured!");
    err.status = 404;
    err.message = "the category you are trying to view does not exist!";
    return next(err);
  }
  const grid = await utilities.buildDetailGrid(data);
  let nav = await utilities.getNav();
  const Detailname = data[0].inv_model;
  res.render("./inventory/detail", {
    title: Detailname + " vehicles",
    nav,
    grid,
  });
};

/***************************
 * Build inv management view
 ***************************/ 

invCont.buildManagement = async function(req, res, next) {

  let nav = await utilities.getNav()
  res.render("./inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
  })
};

/***************************
 * Build add new classification
 * ***************************/

invCont.buildAddNewClass = async function(req, res, next) {

  let nav = await utilities.getNav()
  res.render("./inventory/addnewclass", {
      title: "add new classification",
      nav,
      errors: null,
  })
};

/***************************
 * process classification data
 * ***************************/

invCont.AddNewClass = async function (req, res) {
  let nav = await utilities.getNav()
  const { 
classification_name
  } = req.body

  const regResult = await invModel.addnewclass(
    classification_name
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${classification_name}. Please log in.`
    )
    res.status(201).render("./inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, adding the new classification failed.")
    res.status(501).render("./inventory/addnewclass", {
      title: "classification name",
      nav,
    })
  }
}

/**********************************
 * Build add new invintory view
 * *******************************/

invCont.buildAddNewInv = async function(req, res, next) {

  let nav = await utilities.getNav()
  let classList = await utilities.buildClassificationList()
  res.render("./inventory/addnewinv", {
      title: "add new invintory",
      nav,
      classList,
      errors: null,
  })
};

invCont.AddNewInv = async function (req, res) {
  let nav = await utilities.getNav()
  let classList = await utilities.buildClassificationList()
  const { 
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

  } = req.body

  const regResult = await invModel.addnewclass(
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
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, new invintory thank you.`
    )
    res.status(201).render("./inventory/addnewinv", {
      title: "add New Invintory",
      nav,
      classList,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, adding the new classification failed.")
    res.status(501).render("./inventory/addnewclass", {
      title: "classification name",
      nav,
    })
  }
}



module.exports = invCont;
