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

// Build search view

invCont.buildInvSearch = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/search", {
    title: "search inventory",
    nav,
    search_results: ""
  });
};

// process search results

invCont.searchInvResult = async function (req, res, next) {
  let nav = await utilities.getNav();
  const { search_value } = req.query; // Assuming the search input is sent via query string
  try {
    const search_values = search_value.trim().split(/\s+/); // Convert search input to array
    console.log("im in searchInv", search_values)
    const search_results = await invModel.searchInv(search_values);
    res.render("./inventory/search", {
      title: "Search Results",
      nav,
      search_results
    });
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).send("Internal Server Error");
  }
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
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
      classificationSelect,
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
  
  let classList = await utilities.buildClassificationList()

  let nav = await utilities.getNav()
 
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
  const regResult = await invModel.AddNewInv({
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
  console.log(regResult)
  if (regResult) {
    console.log("im in inventorycontroller 1")
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
    console.log("im in inventorycontroller 2")
    req.flash("notice", "Sorry, adding the new classification failed.")
    res.status(501).render("./inventory/addnewclass", {
      title: "classification name",
      nav,
    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inventoryId)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryByInvId(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData[0].classification_id)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_description: itemData[0].inv_description,
    inv_image: itemData[0].inv_image,
    inv_thumbnail: itemData[0].inv_thumbnail,
    inv_price: itemData[0].inv_price,
    inv_miles: itemData[0].inv_miles,
    inv_color: itemData[0].inv_color,
    classification_id: itemData[0].classification_id
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
    inv_id
  } = req.body
  const updateResult = await invModel.updateInventory({
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
    inv_id
  })

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/management")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
    inv_id
    })
  }
}

// delete view

invCont.deleteView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryByInvId(inv_id)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  res.render("./inventory/delete-confirm",{
    title: "Delete" + itemName,
    nav,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_price: itemData[0].inv_price,
  })
} 

// Delete function

invCont.deleteItem = async function (req, res, next) {
  let nav = await utilities.getNav()
  const inv_id = parseInt(req.body.inv_id)

  const deleteResult = await invModel.deleteInventoryItem(inv_id)

  
  if (deleteResult) {
    req.flash("notice", 'the deletion was successful.')
    res.redirect('/inv/management')
  } else {
    req.flash("notice", 'Sorry, the delete failed.')
    res.redirect("/inv/delete/inv_id")
  }
}
module.exports = invCont;
