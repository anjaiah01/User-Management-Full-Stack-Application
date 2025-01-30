import express from 'express'
import User from "../models/User.js";
const UserRoutes = express.Router()  //Create router
//API for add users
UserRoutes.post('/add-user', async (req,res) => {
    try{
        const {name, email, mobile} = req.body;
        const newUser = new User({name,mobile,email})
        await newUser.save(); // save user in database
        res.status(201).json({message:"User added Successfully", user:newUser});
    }catch(error){
        res.status(500).json({error:error.message})
    }
})
// API for Getting All Users
UserRoutes.get("/users", async (req, res) => {
    try {
        const users = await User.find(); // Assuming you are using MongoDB and Mongoose
        if (users.length === 0) {
            return res.status(404).json({ message: "No users found" }); // If no users are found
        }
        return res.status(200).json(users); // Returning all users
    } catch (error) {
        return res.status(500).json({ error: error.message }); // Handling any errors
    }
});


//API for Remove Users 
UserRoutes.delete(`/delete-user/:id`, async (req, res) =>{
    try{
        const {id} = req.params;
        const userRemoved = await User.findByIdAndDelete(id)  
        if(!userRemoved){
            res.status(404).json({message:"User NOT Found"})
        }
        res.status(200).json({message:"user Deleted Successfully!",user:userRemoved})
    }catch(error){
        res.status(500).json({error:error.message})
    }
})

//API for Update the Existed User Details
UserRoutes.put("/update-user/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const updatedData = req.body;

        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" }); // 🔴 RETURN HERE TO AVOID MULTIPLE RESPONSES
        }

        return res.status(200).json({ message: "User updated successfully", updatedUser }); // 🔴 RETURN HERE TOO
    } catch (error) {
        return res.status(500).json({ error: error.message }); // ✅ Always return in catch block
    }
});

export default UserRoutes