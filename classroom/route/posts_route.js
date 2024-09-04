
const express=require("express")

const router=express.Router()

router.get("/",(req,res)=>{
    res.send("get for posts ")
})

router.post("/",(req,res)=>{

    res.send("post posts")
})


router.delete("/:id",(req,res)=>{
    res.send("delete for user id")
})

module.exports=router;