const express=require("express")
const app=express()
const users=require('./route/users_route.js')

const posts=require("./route/posts_route.js")
const session=require("express-session")
const flash=require("connect-flash")



const path=require('path')


app.set("view engine","ejs")








app.set("views",path.join(__dirname,"views"))

// cookie parser require
// const cookieParser=require("cookie-parser")


// app.use(cookieParser())
// app.get('/',(req,res)=>{
//     console.dir(req.cookies)
//     console.log("root")
//     res.send("hii")
// })

// app.get("/setcookie",(req,res)=>{
//     res.cookie("greet","hey")
//     res.send("hii i am root")
// })
// app.use("/users",users)
// app.use("/posts",posts)



// users route

// (/users) (/users/:id) (/users/new)


// app.get("/users",(req,res)=>{
//     res.send("get for users ")
// })

// app.post("/users",(req,res)=>{

//     res.send("post user")
// })


// app.delete("/users/:id",(req,res)=>{
//     res.send("delete for user id")
// })

// post route

// app.get("/posts",(req,res)=>{
//     res.send("get for posts ")
// })

// app.post("/posts",(req,res)=>{

//     res.send("post posts")
// })


// app.delete("/posts/:id",(req,res)=>{
//     res.send("delete for user id")
// })
// using router->organized code


// express session->npm package



// session->middleware ->fuction 

// app.use(session(
//     {
//         secret:"mysupersecretstring",
//         resave:false,
//         saveUninitialized:true
//     }
// ))

// app.get("/test",(req,res)=>{
//     res.send("test succesfully")
// })


// app.get("/reqcount",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }
//    else{
//     req.session.count=1
//    }
//     res.send(`u sent a request ${req.session.count} times`)
// })



const sessionOption=   {
    secret:"mysupersecretstring",
    resave:false,
    saveUninitialized:true
}







app.use(session(sessionOption))
app.use(flash())


app.get("/register",(req,res)=>{
    let {name}=req.query;
    req.flash('sucess',"user register")
    req.flash('error',"some error occured")
    if(name){
        req.session.name=name;
    }
    else{
        req.session.name="annonymous"
    }
    console.log(req.session)
    res.redirect('/hello')
})


// req.session-> { }  object h esme new variable use krskte h aur uski value save krskte 

app.get("/greet",(req,res)=>{
    let {name}=req.query;
  

    res.send(`hii ${req.session.name}`)
}
)

// res.locals


app.get("/hello", (req, res) => {

    res.locals.message=req.flash('sucess')
    res.locals.error=req.flash('error')
    let msg=req.flash('sucess')
    res.render("page.ejs", { name: req.session.name});
  });
  




app.listen(1200,()=>{
    console.log("server is listening to 1200")
})