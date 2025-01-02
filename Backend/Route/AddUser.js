const router=require('express').Router();
const express = require("express");
const UserSchema=require('../Model/User123');
const UserData=require('../Model/UserData');
router.use(express.json());
router.post('/addUser', async (req, res) => {
    try {
        const { Name, Email, Year, Department } = req.body;
        const existingUser = await UserSchema.findOne({ Email });
        if (existingUser) {
            return res.status(201).json({ message: "User already exists!", data: existingUser });
        }
        const SaveData = new UserSchema({ Name, Email, Year, Department });
        const response = await SaveData.save();
        res.status(201).json({ message: "User added successfully!", user: response });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error while adding user." });
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
    console.error(error);
    res.status(500).json({ message: "Server error while fetching user data." });
   }
});


router.post('/getData',async(req,res)=>{
    const {id}=req.body;
    console.log(id);
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
        console.error(error);
        res.status(500).json({ message: "Server error while fetching user data." });
    }
})
router.post('/GetUserdata',async(req,res)=>{
    const {id}=req.body;
    console.log("Received ID:", id); 
    try {
        const data=await UserSchema.findOne({id});
    if(data)
    {
        res.status(200).json({message:"user data fetched",data:data});
    }
    else
    {
        res.status(209).json({message:"Data not available"});
    }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error while fetching user data." });
    }
})


router.put('/follow',async(req,res)=>{
    const {userId,followerId}=req.body;

    if(!userId || !followerId)
    {
        return res.status(400).json({message:"user ID and Follower ID are required"});
    }

    try{
       const user=await UserData.findOne({id:userId});

       if(!user)
       {
        return res.status(404).json({message:"user not found!"});
       }

       if(!user.Following.includes(followerId))
       {
          user.Following.push(followerId);
          await user.save();
       }

       const follower=await UserData.findOne({id:followerId});

       if(!follower)
       {
           return res.status(404).json({message:"Follower not found!"});
       }
       
    if(!follower.Followers.includes(userId))
    {
        follower.Followers.push(userId);
        await follower.save();
    }
    res.status(200).json({ message: 'Follower added successfully' });
    }
    catch(err)
    {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
    }
})

router.put('/unfollow', async (req, res) => {
    const { userId, followerId } = req.body;

    if (!userId || !followerId)
    {
        return res.status(400).json({ message: "User ID and Follower ID are required" });
    }
    try{
        const user = await UserData.findOne({ id: userId });
        if(!user)
        {
            return res.status(404).json({message: "User not found!"});
        }
        if(user.Following.includes(followerId))
        {
            user.Following = user.Following.filter((id) => id !== followerId);
            await user.save();
        }
        const follower = await UserData.findOne({ id: followerId });

        if (!follower)
        {
            return res.status(404).json({ message: "Follower not found!" });
        }

        if (follower.Followers.includes(userId))
        {
            follower.Followers = follower.Followers.filter((id) => id !== userId);
            await follower.save();
        }

        res.status(200).json({ message: "Unfollowed successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred" });
    }
});


module.exports = router;