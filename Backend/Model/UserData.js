const mongoose=require('mongoose');

const UserData=new mongoose.Schema({
    id:{
        type:String,
    },
    Linkedin:{
        type:String,
    },
    Leetcode:{
        type:String,
    },
    Github:{
        type:String,
    }
});
module.exports=mongoose.model('UserData123',UserData);