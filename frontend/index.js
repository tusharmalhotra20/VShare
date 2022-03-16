const dropZone = document.querySelector(".drop-zone");
const browseBtn = document.querySelector(".browseBtn");
const fileInput = document.querySelector("#file-input");

const baseURL = "https://innshare.herokuapp.com";
const uploadURL = `${baseURL}/api/files`;

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
  console.log(file);
  if (file.length) {
    fileInput.file = file;
  }
  uploadFile();
});

browseBtn.addEventListener("click", () => {
  fileInput.click();
});

const uploadFile = () => {
  const file = fileInput.file[0];
  const formData = new FormData();

  formData.append("myfile", file);

  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    // console.log(xhr.readyState);
  };
  xhr.open("POST", uploadURL)
  xhr.send(formData)
};
