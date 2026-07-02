import mongoose from "mongoose";


const userSchema= new mongoose.Schema(
    {
        username:{
            type:String,
            require:true,
            trim:true
        },
        email:{
            type:String,
            require:true,
            unique:true,
            lowercase:true,
            trim:true
        },
        password:{
            type:String,
            require:true
        },
        role:{
            type:String,
            enum:["Job-Seeker","Employer"],
            default:"Job-Seeker"
        },

      
    },
      {timestamps:true}
);
export default mongoose.model("User",userSchema);