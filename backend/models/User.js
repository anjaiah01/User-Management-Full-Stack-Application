import mongoose from "mongoose"

//Define the Schema (Structure of the Collection)
const UserSchema = new mongoose.Schema({
    name:{type:String, required:true},
    mobile:{type:Number, required:true},
    email:{type:String, required:true, unique:true},
});

//Create Model (User Collection)
const User = mongoose.model('User', UserSchema)
export default User