const mongoose=require('mongoose');

const UserSchema=mongoose.Schema({
        Name:{
            type:"String",
            required:true,
        },
        Email:{
            type:"String",
            required:true,
        },
        Year:{
            type:"String",
            required:true,
        },
        Department:{
            type:"String",
            required:true,
        },
});


module.exports=mongoose.model("User123",UserSchema);