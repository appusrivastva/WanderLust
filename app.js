

const express=require('express');
const app=express();
const path=require("path")
// multiple layout/templates create krne me
// common for all page->navbar
const ejsMate=require("ejs-mate")
const mongoose=require("mongoose");
const wrapAsync=require('./utils/wrapAsync.js')
// validate schema->server side ke liye schema
const {listingSchema} = require('./schema.js');

const Listing=require("./models/listing.js")
const methodOverride=require("method-override")
app.engine('ejs',ejsMate)
app.use(methodOverride("_method"))
app.set("view engine","ejs")
const ExpressError=require("./utils/ExpressError.js")
app.use(express.urlencoded({extended:true}))
app.set("views",path.join(__dirname,"views"))
app.use(express.static(path.join(__dirname,"/public")))

// db create
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust"
main().then(()=>{
    console.log('connected to db')
}).catch((err)=>{
    console.log(err)
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

// basic api create
app.get('/',(req,res)=>{
    res.send('hi,i am root ')
});


const validateListing=(req,res,next)=>{
    let {error}=  listingSchema.validate(req.body)

  if(error){
    let errMsg=error.details.map((el)=>el.message).join(",")
    throw new ExpressError(400,error)
  }
  else{
    next()
  }
}

app.get("/listings",wrapAsync(async (req,res)=>{
    
    const allListings=await Listing.find({})
    res.render("listings/index.ejs",{allListings})
}))

// create:new and create route

app.get("/listings/new",wrapAsync(async (req,res)=>{
    res.render("listings/new.ejs")
}))
// show route->read

app.get("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/show.ejs",{listing})

}))

// create route

app.post("/listings",validateListing,wrapAsync(async(req,res,next)=>{

    // if(!req.body.listing){
    //     throw new ExpressError(400,"send valid data for listing")
    // }
    const newlisting=new Listing(req.body.listing);


    // field missing-koi koi
    // use joy tool->to validate schema

    // if(!req.listen.price){
    //     throw new ExpressError(400,"price is missing")

    // }
await newlisting.save();
res.redirect("/listings")
    // let {title,description,image,price,country,}=req.body
//     try{
        

// const newlisting=new Listing(req.body.listing);
// await newlisting.save();
// res.redirect("/listings")

//     }
//     catch(err){
//         // error exist next ke through nex middlewarre ko call krenge jo error handle krega
//         next(err)

//     }



}))


// update=>edit and update route

app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    
    let {id}=req.params;
    console.log(id)
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing})
}))
app.put("/listings/:id",validateListing,async(req,res)=>{
    // if(!req.body.listing){
    //     throw new ExpressError(400,"send valid data for listing")
    // }
    const {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing})
    res.redirect(`/listings/${id}`)
})
// delete route

app.delete("/listings/:id",wrapAsync(async (req,res)=>{
    const {id}=req.params;
    console.log(id)
   const deletedListing=await Listing.findByIdAndDelete(id)
   console.log(deletedListing)
   res.redirect("/listings")
    
}))

// app.get("/testListing",async (req,res)=>{
//     let sampleListing=new Listing({
//         title:"my new vila",
//         description:"by the beach",
//         price:1200,
//         location:"Calangute,Goa",
//         country:"India"
//     })

//     await sampleListing.save()
//     res.send("succesful listing")

// })
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"))

})
// handle error->middleware define
app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong"}=err;
    // res.status(statusCode).send(message)
    // res.render("error.ejs",{err})
    res.status(statusCode).render("error.ejs",{message})
})


app.listen(5080,()=>{
    console.log("server is listening to port 5080")
});