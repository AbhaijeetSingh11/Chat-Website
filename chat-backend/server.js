const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const ChatMessage = require('./models/ChatMessage');

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
mongoose.connect(process.env.MONGO_URI);
console.log("MongoDB URI:", process.env.MONGO_URI);


app.get('/messages', async (req,res)=>{
    try{
        const messages = await ChatMessage.find();
        res.json(messages);
    } catch(error){
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}); 

app.post('/messages', async(req,res)=>{
    try{
        const{user, message} = req.body;
        if(!user || !message){
            return res.status(400)
            .json({error:"user and message are required"});
        }

        const chatMessage = new ChatMessage({
            user,
            message,
        });

        await ChatMessage.save();
        res.json(chatMessage);
    } catch (error){
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});