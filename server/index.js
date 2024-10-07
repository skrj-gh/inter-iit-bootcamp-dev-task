import express from "express";
import cors from "cors"
import run from "./gemini.js"
import multer from "multer"
import mongoose from "mongoose"
import SearchHistory from "./models/schema.js"
import crypto from 'crypto';
import dotenv from "dotenv"
dotenv.config()

const MAX_QUERY_LENGTH = 500;

const app = express();
app.use(cors());

const upload = multer({dest: "uploads/files",
                    limits: { fileSize: 100 * 1024 * 1024 }, 
                    fileFilter: function (req, file, cb) {
                        // Accept only certain file types (optional)
                        const filetypes = /jpeg|jpg|heic|png|webp|heif|pdf|js|py|txt|html|css|md|csv|xml|rtf|aac|aiff|mp3|wav|flac|ogg/;
                        const mimetype = filetypes.test(file.mimetype);
                
                        if (mimetype) {
                            return cb(null, true);
                        }
                        cb(new Error('Invalid file type!'));
                    }
                });

app.use(express.json());

function hashEmail(email) {
    return crypto.createHash('sha256').update(email).digest('hex');
}

// Function to store search history
async function storeSearchHistory(email, searchQuery, file) {
    try {
        if(file){
            return;
        }

        email = hashEmail(email);
        // console.log("hihi")
        // console.log(email)
        // console.log("fefe")
        
        // Find the user by email or create a new document
        let userHistory = await SearchHistory.findOne({ email: email });
        
        
        if (!userHistory) {
            userHistory = new SearchHistory({ email: email, searches: [searchQuery] });
        } else {
            userHistory.searches.push(searchQuery);
        }
        
        await userHistory.save();
        // console.log(`Search query "${searchQuery}" added for ${email}.`);
        
    } catch (error) {
        console.error('Error storing search history:', error);
    }
}



app.post("/run", upload.single("file"), async (req, res) => {
    const prompt = req.body.prompt;
    // console.log(req.file);
    const file = req.file;
    // console.log(req.body.email)
    // console.log(prompt);

    if (prompt.length > MAX_QUERY_LENGTH) {
        throw new Error("Search query is too long");
    }
    if( file && file.size > 104857600){
        throw new Error("File is too large");
    }

    let fileContent;
    let fileType;
    let mimeType;
    if(file){
        // console.log(file.path)
        fileContent =  file.path;
        if(file.mimetype === "audio/mpeg" || file.mimetype === "audio/mp3" || file.mimetype === "audio/wav" || file.mimetype === "audio/aiff" || file.mimetype === "audio/aac" || file.mimetype === "audio/ogg" || file.mimetype === "audio/flac"){
            fileType = "audio"
            mimeType = file.mimetype;
        }
        else if(file.mimetype==="image/jpeg" || file.mimetype==="image/jpg" || file.mimetype==="image/png" || file.mimetype==="image/webp" || file.mimetype==="image/heic" || file.mimetype==="image/heif"){
            fileType = "img"
            mimeType = file.mimetype
        }
        else{
            fileType = "pdf"
            mimeType = file.mimetype
        }
    }

    const response = await run(prompt, fileContent, fileType, mimeType)
    storeSearchHistory(req.body.email, req.body.prompt, file)
    // console.log(response)
    res.send(response)
});



// Function to fetch search history
async function fetchSearchHistory(email) {
    try {
        email = hashEmail(email);
        const userHistory = await SearchHistory.findOne({ email });
        if (userHistory) {
            return userHistory.searches;
        } else {
            return [];
        }
    } catch (error) {
        console.error('Error fetching search history:', error);
        return [];
    }
}

app.get('/history', async (req, res) => {
    const email = req.query.email;

    try {
        const history = await fetchSearchHistory(email);
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching search history' });
    }
});

const PORT = process.env.PORT
// console.log(PORT)

app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}...`)
})

const url = process.env.MONGO_URI

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((error) => console.error('Error connecting to MongoDB Atlas:', error));