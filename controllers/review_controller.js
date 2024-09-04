const Review=require("../models/review.js")
const Listing=require("../models/listing.js")


module.exports.createReview=async (req,res)=>{
    console.log(req.params.id) 
 const listing =await Listing.findById(req.params.id)
 
 
 const newReview=new Review(req.body.review)
 
 console.log(newReview)
 listing.reviews.push(newReview)
 newReview.author=req.user._id
 console.log(newReview)
 await newReview.save()
 
 await listing.save()
 // res.send("New review Saved")
 req.flash("success", "New Review Created");
 
 res.redirect(`/listings/${listing._id}`)
 
 }


 module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    console.log(id)
    console.log(reviewId)
    await Listing.findByIdAndUpdate(id,{
    $pull:{
        reviews:reviewId
    }
   })

    await Review.findByIdAndDelete(reviewId)
    console.log("delted review")
 
    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`)

}
 