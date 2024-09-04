const Listing=require("./models/listing")
const Review=require("./models/review.js")
const ExpressError=require("./utils/ExpressError.js")
// validate schema->server side ke liye schema
const {listingSchema} = require('./schema.js');

const {reviewSchema}=require("./schema.js")

 module.exports.isLoggedIn= (req,res,next)=>{
  console.log(req)
  console.log(req.path)
  //  /new

  console.log(req.originalUrl)
  //  /listings/new
    console.log(req.user)
if(!req.isAuthenticated()){
  // redirect url
req.session.redirectUrl=req.originalUrl
console.log(req.session.redirectUrl)
  req.flash("error","You Must Be Logged In ")
  return res.redirect("/login")

}
next()
}

module.exports.saveRedirectUrl=(req,res,next)=>{
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;

  }
  next()
}


module.exports.isOwner=async (req,res,next)=>{
  const {id}=req.params;
  
  let listing=await Listing.findById(id)
  if( !listing.owner._id.equals(res.locals.currentUser._id)){
    req.flash("error","You aren't owner of this listings")
    return res.redirect(`/listings/${id}`)
  }
  next()
}

module.exports.validateListing=(req,res,next)=>{
  let {error}=  listingSchema.validate(req.body)

if(error){
  let errMsg=error.details.map((el)=>el.message).join(",")
  throw new ExpressError(400,error)
}
else{
  next()
}
}

// validate review

module.exports.validateReview=(req,res,next)=>{
    let {error} =reviewSchema.validate(req.body)
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",")
        throw new ExpressError(400,errMsg)
    }
    else{
        next()
    }
}

module.exports.isReviewAuthor=async (req,res,next)=>{
  let {id,reviewId}=req.params
  let review=await Review.findById(reviewId)
  if(!review.author._id.equals(res.locals.currentUser._id)){
    req.flash("error","You didn't author of this review")
    return res.redirect(`/listings/${id}`)
  }
  next()
}