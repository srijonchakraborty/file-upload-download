document.addEventListener('DOMContentLoaded', getFileList);

async function getFileList() {
    const response = await fetch('/files');
    const html = await response.text();

    const fileListElement = document.getElementById('fileList');
    fileListElement.innerHTML = html;
}


async function uploadFiles() {
    const fileInput = document.getElementById('multipleFileInput');
    const files = fileInput.files;

    if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            const formData = new FormData();
            const file = fileInput.files[i];
            formData.append('file', file);

            try {
                const response = await fetch('/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    console.log('File uploaded successfully');
                } else {
                    console.error('Error uploading file');
                }
            }
            catch (error) {
                console.error('Error uploading file', error);
            }
        }

    } else {
        console.error('No files selected');
    }
}

async function downloadSelectedFiles() {
    const fileInputs = document.querySelectorAll('input[name="files"]:checked');
    const files = Array.from(fileInputs).map(input => input.value);
    const filesTexts = Array.from(fileInputs).map(input => input.parentNode.textContent.trim());
    
    try {
        document.getElementById('errorText').innerText = "";
        let count = 0;
        for (const file of files) {

            try {
                // Decode the double-encoded file path
                const decodedFile = decodeURIComponent(file);
                // Encode spaces and special characters in the file path
                const encodedFile = encodeURIComponent(decodedFile).replace(/%20/g, ' ');

                const url = `/download/single?file=${encodedFile}`;

                const response = await fetch(url);

                if (response.ok) {
                    // Create a blob from the response and initiate download
                    const blob = await response.blob();
                    const filename = decodedFile.split('/').pop();
                    const link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = filesTexts[count];// filename;
                    link.click();
                } else {
                    console.error(ee);
                }
                count++;
            }
            catch (error) {
                document.getElementById('errorText').innerText.append(filesTexts[count] + ':' + 'File Name Problem change the file name.');
                console.error('Inner Error downloading files', error);
            }
        }
    } catch (error) {
        console.error('Error downloading files', error);
    }
}