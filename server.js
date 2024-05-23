const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
const mongoURI = process.env.MONGODB_URI || "mongodb+srv://admin:admin@cluster0.iw8pgql.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

const ScoreSchema = new mongoose.Schema({
    sessionId: String,
    score: Number,
    timestamp: { type: Date, default: Date.now }
});

const Score = mongoose.model('Score', ScoreSchema);

// Routes
app.post('/api/score', async (req, res) => {
    try {
        const { sessionId, score } = req.body;
        const existingScore = await Score.findOne({ sessionId });

        if (existingScore) {
            if (score > existingScore.score) {
                existingScore.score = score;
                existingScore.timestamp = Date.now();
                await existingScore.save();
                res.status(201).send('Score updated');
            } else {
                res.status(200).send('Existing score is higher or equal. No update needed.');
            }
        } else {
            const newScore = new Score({ sessionId, score });
            await newScore.save();
            res.status(201).send('New score saved');
        }
    } catch (error) {
        res.status(500).send('Error saving score');
    }
});

app.get('/api/scores', async (req, res) => {
    try {
        const scores = await Score.find().sort({ score: -1 }).limit(10);
        res.json(scores);
    } catch (error) {
        res.status(500).send('Error fetching scores');
    }
});

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '.')));

// Fallback to serve 'index.html' for any unknown routes (for SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
