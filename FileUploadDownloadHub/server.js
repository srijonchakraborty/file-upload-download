const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Set up multer for handling file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Handle single file upload
app.post('/upload', upload.single('file'), (req, res) => {
    res.send('File uploaded successfully');
});

// Serve a page with the folder structure and file items
app.get('/files', (req, res) => {
    const uploadDir = path.join(__dirname, 'downloads');

    fs.readdir(uploadDir, { withFileTypes: true }, (err, items) => {
        if (err) {
            return res.status(500).send('Error reading upload directory');
        }

        const html = generateFileListHTML(uploadDir, items);
        res.send(html);
    });
});

// Generate HTML for displaying the folder structure and file items
function generateFileListHTML(currentPath, items) {
    let html = '<p>File Explorer</p>';
    html += '<form id="downloadForm">';

    items.forEach(item => {
        const itemPath = path.join(currentPath, item.name);
        const isDirectory = item.isDirectory();

        html += '<div>';

        if (isDirectory) {
            html += `<strong>${item.name}/</strong>`;
            const subItems = fs.readdirSync(itemPath, { withFileTypes: true });
            html += generateFileListHTML(itemPath, subItems);
        } else {
            html += `<input type="checkbox" name="files" value="${encodeURIComponent(itemPath)}" /> `;
            html += `${item.name}`;
        }

        html += '</div>';
    });

    html += '<button type="button" onclick="downloadSelectedFiles()">Download Selected Files</button>';
    html += '</form>';
    return html;
}


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});