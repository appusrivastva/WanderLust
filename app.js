

const express=require('express');
const app=express();
const path=require("path")

const mongoose=require("mongoose");
const Listing=require("./models/listing.js")
const methodOverride=require("method-override")

app.use(methodOverride("_method"))
app.set("view engine","ejs")
app.use(express.urlencoded({extended:true}))
app.set("views",path.join(__dirname,"views"))
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

app.get("/listings",async (req,res)=>{
    const allListing=await Listing.find({})
    res.render("listings/index.ejs",{allListing})
})

// create:new and create route

app.get("/listings/new",async (req,res)=>{
    res.render("listings/new.ejs")
})
// show route->read

app.get("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/show.ejs",{listing})

})

// create route

app.post("/listings",async(req,res)=>{
    // let {title,description,image,price,country,}=req.body


const newlisting=new Listing(req.body.listing);
await newlisting.save();
res.redirect("/listings")










})


// update=>edit and update route

app.get("/listings/:id/edit",async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing})
})
app.put("/listings/:id",async(req,res)=>{
    const {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing})
    res.redirect(`/listings/${id}`)
})
// delete route

app.delete("/listings/:id",async (req,res)=>{
    const {id}=req.params;
    console.log(id)
   const deletedListing=await Listing.findByIdAndDelete(id)
   console.log(deletedListing)
   res.redirect("/listings")
    
})

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



app.listen(5080,()=>{
    console.log("server is listening to port 5080")
});