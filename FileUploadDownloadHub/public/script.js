document.addEventListener('DOMContentLoaded', getFileList);

async function getFileList() {
    const response = await fetch('/files');
    //const items = await response.json();

    //const fileListElement = document.getElementById('fileList');
    //fileListElement.innerHTML = generateFileListHTML('', items);

    const html = await response.text();

    const fileListElement = document.getElementById('fileList');
    fileListElement.innerHTML = html;
}