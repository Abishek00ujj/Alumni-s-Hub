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
    },
    Followers:{
        type:[String],
        default:[]
    },
    Following:{
        type:[String],
        default:[]
    }
});
module.exports=mongoose.model('UserData123',UserData);