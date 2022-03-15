const dropZone = document.querySelector(".drop-zone");
const browseBtn = document.querySelector(".browseBtn");
const fileInput = document.querySelector("#file-input");


dropZone.addEventListener("dragover", (event) => {
  event.preventDefault();
  dropZone.classList.add("dragged", "on-drag");
});

dropZone.addEventListener("dragleave", (event) => {
  dropZone.classList.remove("dragged", "on-drag");
});

dropZone.addEventListener("drop", (event) => {
  event.preventDefault();
  dropZone.classList.remove("dragged", "on-drag");
  
  const file = event.dataTransfer.files;

  if (file.length) {
    fileInput.file = file;
  }
  console.log(fileInput.file);
});
