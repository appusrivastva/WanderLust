const express=require("express")

const router=express.Router({mergeParams:true})

const ExpressError=require("../utils/ExpressError.js")
const wrapAsync=require('../utils/wrapAsync')


const {isLoggedIn,validateReview, isReviewAuthor}=require("../middleware.js")

const reviewController=require("../controllers/review_controller.js")








// review
// post route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview))

// review del ->route


router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview))
// ek listing ko delete krne par listing me multiple review honge










module.exports=router;














