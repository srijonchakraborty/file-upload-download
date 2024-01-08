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