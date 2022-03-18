const dropZone = document.querySelector(".drop-zone");
const browseBtn = document.querySelector(".browseBtn");
const fileInput = document.querySelector("#file-input");
const bgProgress = document.querySelector(".bg-progress");
const percentDiv = document.querySelector("#percent");
const progressBar = document.querySelector(".progress-bar");
const progressContainer = document.querySelector(".progress-container");
const fileURLInput = document.querySelector("#fileURL");
const copyBtn = document.querySelector("#copyBtn");
const sharingContainer = document.querySelector(".sharing-container");
const emailForm = document.querySelector("#emailForm");

const maxAllowedSize = 100 * 1024 * 1024; //100mb

const baseURL = "https://vshare-files.herokuapp.com";
const uploadURL = `${baseURL}/api/files`;
const emailURL = `${baseURL}/api/files/send`;

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
  // console.log(event.dataTransfer);
  // console.log(file);
  if (file.length) {
    fileInput.file = file;
  }
  uploadFile();
});

fileInput.addEventListener("change", (event) => {
  const file = event.target.files;
  // console.log(file);
  if (file.length) {
    fileInput.file = file;
  }
  uploadFile();
});

browseBtn.addEventListener("click", () => {
  fileInput.click();
});

copyBtn.addEventListener("click", (event) => {
  fileURLInput.select();
  navigator.clipboard
    .writeText(fileURLInput.value)
    .then(() => {
      console.log("URL copied");
    })
    .catch((err) => {
      console.error(err);
    });
});

const uploadFile = () => {
  progressContainer.style.display = "block";
  const file = fileInput.file[0];
  const formData = new FormData();

  formData.append("uploaded_file", file);

  // initializes an XMLHttpRequest()
  const xhr = new XMLHttpRequest();

  //
  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      // console.log(xhr.response); // URL of the uploaded_file
      showLink(JSON.parse(xhr.response));
    }
  };

  xhr.upload.onprogress = updateProgress;

  xhr.open("POST", uploadURL);
  xhr.send(formData);
};

const updateProgress = (event) => {
  const percent = Math.round((event.loaded / event.total) * 100);
  // console.log(percent);
  bgProgress.style.width = `${percent}%`;
  percentDiv.innerText = `${percent}%`;
  // console.log(progressBar.style.transform);
  progressBar.style.transform = `scaleX(${percent / 100})`;
};

const showLink = ({ file: url }) => {
  progressContainer.style.display = "none";
  sharingContainer.style.display = "block";
  console.log(url);
  fileURLInput.value = url;
};

emailForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const url = fileURLInput.value;
  const formData = {
    uuid: url.split("/").splice(-1, 1)[0],
    emailTo: emailForm.elements["to_email"].value,
    emailFrom: emailForm.elements["from_email"].value,
  };
  console.table(formData);

  fetch(emailURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
});
