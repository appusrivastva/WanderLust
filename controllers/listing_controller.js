const Listing = require("../models/listing.js");



module.exports.index=async (req,res)=>{
    
    const allListings=await Listing.find({})
    res.render("listings/index.ejs",{allListings})
}
module.exports.rendernewForm=async (req,res)=>{
 
    res.render("listings/new.ejs")
}
module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id)
    .populate({path:"reviews",populate:{
      path:"author"
    },})
    .populate("owner");
    if(!listing){
      req.flash("error", "Listing you you requested for does not exist");
      res.redirect("/listings")
    }
    console.log(listing)
    res.render("listings/show.ejs",{listing})

}
module.exports.createListing=async (req, res, next) => {
  let url=req.file.path
  let filename=req.file.filename
  console.log(url ," ", filename)
    const newlisting = new Listing(req.body.listing);
    newlisting.owner=req.user._id
    newlisting.image={url,filename}
    console.log(req.user._id)
    await newlisting.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
  }

  module.exports.renderEditForm=async(req,res)=>{
    
    let {id}=req.params;
    console.log(id)
    
    const listing=await Listing.findById(id);
    if(!listing){
      req.flash("error", "Listing you requested for does not exist");
      res.redirect("/listing")
    }
    let OringnalImgurl=listing.image.url;
    OringnalImgurl.replace("/upload","/upload/w_250")
    res.render("listings/edit.ejs",{listing,OringnalImgurl})
}

module.exports.updateListing=async(req,res)=>{
    // if(!req.body.listing){
    //     throw new ExpressError(400,"send valid data for listing")
    // }

    const {id}=req.params;
  
    // let listing=await Listing.findById(id)
    // if(currentUser && !listing.owner._id.equals(res.locals.currentUser._id)){
    //   req.flash("error","You don't have permission to edit")
    //   return res.redirect(`/listings/${id}`)
    // }
      let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing})
      if(typeof req.file !=="undefined"){
      let url=req.file.path
      let filename=req.file.filename
      console.log(url ," ", filename)

      listing.image={url,filename}
      await listing.save()
      }
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`)
}
module.exports.destroyListing=async (req,res)=>{
    const {id}=req.params;
    console.log(id)
   const deletedListing=await Listing.findByIdAndDelete(id)
   console.log(deletedListing)
   req.flash("success", "Listing Deleted");
   res.redirect("/listings")
    
}