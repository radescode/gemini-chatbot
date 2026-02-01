/**
 * Chatbot Gemini Flash API
 * Oleh: Rades Wandri
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
// Reverting to GoogleGenAI as suggested by the SyntaxError
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error('FATAL ERROR: GEMINI_API_KEY is not defined in your .env file.');
  process.exit(1);
}

// Using the correct constructor format for GoogleGenAI
const genAI = new GoogleGenAI(GEMINI_API_KEY);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server ready on http://localhost:${PORT}`);
});

app.post('/api/chat', async (req, res) => {
    try {
        const { conversation } = req.body;
        if (!Array.isArray(conversation)) {
            return res.status(400).json({ error: 'Conversation history must be an array.' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const contents = conversation.map(({ role, text }) => ({
            role,
            parts: [{ text }]
        }));

        const result = await model.generateContent({ contents });
        const response = await result.response;
        const text = response.text();
        
        res.status(200).json({ result: text });

    } catch (e) {
        // Provide detailed error logging in the server console
        console.error('Error during Gemini API call:', e);
        res.status(500).json({ error: 'Failed to get response from AI. Check server logs for details.' });
    }
});