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
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));


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

app.get('/files-uploads', (req, res) => {
    const uploadDir = path.join(__dirname, 'uploads');

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

    html += '</form>';
    return html;
}


app.get('/download/single', (req, res) => {
    const file = req.query.file;

    if (!file) {
        return res.status(400).send('Invalid file specified');
    }

    const filePath = decodeURIComponent(file);

    if (!fs.existsSync(filePath)) {
        return res.status(404).send('File not found');
    }

    const fileContent = fs.readFileSync(filePath);

    res.set('Content-Type', 'application/octet-stream');
    res.set('Content-Disposition', `attachment; filename=${path.basename(filePath)}`);
    res.set('Content-Length', fileContent.length);

    res.end(fileContent, 'binary');
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});