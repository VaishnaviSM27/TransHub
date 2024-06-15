const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname)));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/transhub', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Define a schema
const messageSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    emailAddress: String,
    mobileNumber: String,
    message: String
});

// Define a model
const Message = mongoose.model('Message', messageSchema);

// Routes
app.post('/send-message', async (req, res) => {
    const { firstName, lastName, emailAddress, mobileNumber, message } = req.body;

    // Create a new message instance
    const newMessage = new Message({
        firstName,
        lastName,
        emailAddress,
        mobileNumber,
        message
    });

    try {
        // Save the message to the database
        await newMessage.save();
        res.send('Message received and saved successfully!');
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).send('Error saving message');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
