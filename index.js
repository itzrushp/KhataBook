const express = require('express');
const app = express();

const path = require('path');
const fs = require('fs');

const HISAB_DIR = path.join(__dirname, 'HISAB_DIR'); // Directory to store all files
const PORT = 3000;

// Middlewares
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Check if the HISAB_DIR directory exists
if (!fs.existsSync(HISAB_DIR)) {
    fs.mkdirSync(HISAB_DIR);
}

// Routes
app.get('/', (req, res) => {
    fs.readdir(HISAB_DIR, (err, files)=>{
        if(err) {
            return res.status(500).send("Error reading directory");
        }
        const hisabFiles = files.filter(files=> files.endsWith('.txt'));
        res.render('index.ejs',{ hisabFiles});
    })
});
app.get("/create",(req, res) => {
     res.render('createhisab');
})
app.post('/create', (req, res) => {
    
    const { date , items } = req.body;

    if(!date || !items) {
        return res.status(400).send("Please provide date & content to save");
    }
    
    const hisabFile = path.join(HISAB_DIR, `${date}.txt`);
    
    fs.writeFile(hisabFile, items, (err) => {
        if(err){
            return res.status(500).send("Error Saving Hisab");
        }else{
            res.redirect('/#hisablist');
        }
    })
    
});

app.get('/edit', (req, res) => {
    res.render('edithisab');
});

app.get('/read', (req, res) => {
    res.render('readinghisab');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
