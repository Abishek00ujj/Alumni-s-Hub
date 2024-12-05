const router=require('express').Router();

const UserSchema=require('../Model/User123');

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


router.post('/GetUser/',async(req,res)=>{
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

module.exports = router;