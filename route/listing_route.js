const express=require("express")

const router=express.Router()

const ExpressError=require("../utils/ExpressError.js")
// validate schema->server side ke liye schema
const {listingSchema} = require('../schema.js');

const wrapAsync=require('../utils/wrapAsync')

const listingController=require("../controllers/listing_controller.js")
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");

const multer=require("multer")
const {storage}=require("../cloudConfig.js")
const uploads=multer({storage})



router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,uploads.single("listing[image]"), validateListing,wrapAsync(listingController.createListing));


// create:new and create route

router.get("/new",isLoggedIn,listingController.rendernewForm)


router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,validateListing,listingController.updateListing)
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))


router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm))


module.exports=router;