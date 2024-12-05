const mongoose=require('mongoose');

const conn=async()=>{
   try 
   {
      const res=await mongoose.connect('mongodb+srv://abi:1234@abishekdb.cukfz.mongodb.net/');
      console.log("DB connected succussfully!");
   } 
   catch(error)
   {
     console.log(error);
   }
};
conn();