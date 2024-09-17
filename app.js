

const express=require('express');
const app=express();
const path=require("path")
if(process.env.NODE_ENV !="production"){
    require("dotenv").config()
}

// console.log(process.env.SECRET)
// multiple layout/templates create krne me
// common for all page->navbar
const ejsMate=require("ejs-mate")
const mongoose=require("mongoose");
const methodOverride=require("method-override")
const ExpressError=require("./utils/ExpressError.js")
const listingRouter=require("./route/listing_route.js")
const reviewRouter=require("./route/review_route.js");
const userRouter=require("./route/user.js");
const flash=require("connect-flash")
const passport=require("passport")
const LocalStrategy=require("passport-local")

const User=require("./models/user.js")

const session=require("express-session")
const mongostore=require("connect-mongo");
const MongoStore = require('connect-mongo');










app.engine('ejs',ejsMate)
app.use(methodOverride("_method"))
app.set("view engine","ejs")
app.use(express.urlencoded({extended:true}))
app.set("views",path.join(__dirname,"views"))
app.use(express.static(path.join(__dirname,"/public")))



// db create

const DB_URL=process.env.ATLASDB_URL;
main().then(()=>{
    console.log('connected to db')
}).catch((err)=>{
    console.log(err)
});

async function main(){
    await mongoose.connect(DB_URL);
}

// // basic api create
// app.get('/',(req,res)=>{
//     res.send('hi,i am root ')
// });
const store=MongoStore.create({
    mongoUrl:DB_URL,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600
})

store.on("error",()=>{
    console.log("Error in Mongo Session Store")
})
const sessionOption={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,

    }
}


app.use(session(sessionOption))
app.use(flash())
app.use(passport.initialize())

app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser=req.user
    next();
});

app.use("/listings",listingRouter)

app.use("/listings/:id/reviews",reviewRouter)
app.use("/",userRouter)

// app.get("/demouser",async(req,res,next)=>{
//    let fakeuser=new User({
//     email:"student@gmail.com",
//     username:"apnastudent"
//    })

//    const newUser=await User.register(fakeuser,"apna@123")
//    console.log(newUser)
//    res.send(`username is ${newUser.username} password is ${newUser.password} email is ${newUser.emaill}` )
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