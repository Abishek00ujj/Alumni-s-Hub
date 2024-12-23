const router=require('express').Router();
const express = require("express");
const UserSchema=require('../Model/User123');
const UserData=require('../Model/UserData');
router.use(express.json());
router.post('/addUser',async(req,res)=>{
     try 
     {
         const {Name,Email,Year,Department}=req.body;
         const SaveData=new UserSchema({Name,Email,Year,Department});
         const response=await SaveData.save();
         console.log(response);
         res.status(201).json({ message: "User added successfully!", user: response });
     } 
     catch (error)
     {
        
     }
});
router.get('/GetUser',async(req,res)=>{
    try 
    {
        const datu=await UserSchema.find();
        if(datu)
        {
            res.status(200).json({ message: "Intha vaichuko!", data: datu });
        }
        else
        {
            res.status(400).json({ message: "No data found!"});
        }
    } 
    catch (error)
    {
        res.status(501).json({ message: "No data found!"});
    }
});

router.post('/addData',async(req,res)=>{
   try {
       const {id,Linkedin,Leetcode,Github}=req.body;
       const x=new UserData({id,Linkedin,Leetcode,Github});
       await x.save();
       res.status(200).json({message:"Nandri vanakam!",data:{
        id:id,
        Linkedin:Linkedin,
        Leetcode:Leetcode,
        Github:Github
    }});
   }
   catch (error)
   {
    
   }
});


router.post('/getData',async(req,res)=>{
    const {id}=req.body;
    try {
        const data=await UserData.findOne({id});
    if(data)
    {
        res.status(200).json({message:"Data available",data:data});
    }
    else
    {
        res.status(209).json({message:"Data not available"});
    }
    } catch (error) {
        
    }
})

module.exports = router;