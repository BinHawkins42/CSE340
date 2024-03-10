// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities")
const invController = require("../controllers/invController")
const classValidate = require('../utilities/classsification-validation')
const invValidate = require('../utilities/inventory-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
// Route to build detail view
router.get("/detail/:inv_id", invController.buildByInvId);
// Route to build management view
router.get("/management", utilities.handleErrors(invController.buildManagement));
// deliver add new classifiaction
router.get("/addnewclass", utilities.handleErrors(invController.buildAddNewClass));
// process new classification
router.post("/addnewclass", classValidate.classificationRules(), classValidate.checkRegData, utilities.handleErrors(invController.AddNewClass));
// deliver add new inventory view
router.get("/addnewinv", utilities.handleErrors(invController.buildAddNewInv));
// process new inventory
router.post("/addnewinv", invValidate.newInvRules(), invValidate.checkInvData, utilities.handleErrors(invController.AddNewInv));
module.exports = router;