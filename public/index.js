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
const toast = document.querySelector(".toast");

const maxAllowedSize = 1024 * 1024; // 1mb

// const baseURL = "https://vshare-files.herokuapp.com";
const uploadURL = `/api/files`;
const emailURL = `/api/files/send`;

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
    showToast("Link copied", "#19A554");
  })
  .catch((err) => {
    console.error(err);
  });
});

const resetFileInput = () => {
  fileInput.value = "";
};

const uploadFile = () => {
  progressContainer.style.display = "block";

  if (fileInput.file.length > 1) {
    resetFileInput();
    showToast("Can upload a single file only!", "red");
    progressContainer.style.display = "none";
    return;
  }
  const file = fileInput.file[0];

  if (file.size > maxAllowedSize) {
    showToast("Can't upload a file, greater than 1 Mb", "red");
    resetFileInput();
    return;
  }
  const formData = new FormData();

  formData.append("uploaded_file", file);

  // initializes an XMLHttpRequest()
  const xhr = new XMLHttpRequest();

  //
  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      // console.log(xhr.response); // URL of the uploaded_file
      onUploadSuccess(JSON.parse(xhr.response));
    }
  };

  xhr.upload.onprogress = updateProgress;

  xhr.upload.onerror = () => {
    resetFileInput();
    showToast(`Error while uploading ${xhr.statusText}`);
  };

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

const onUploadSuccess = ({ file: url }) => {
  resetFileInput();
  emailForm[2].removeAttribute("disabled");
  progressContainer.style.display = "none";
  sharingContainer.style.display = "block";
  console.log(url);
  fileURLInput.value = url;
};

emailForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const url = fileURLInput.value;

  if (
    emailForm.elements["to_email"].value !==
    emailForm.elements["from_email"].value
  ) {
    const formData = {
      uuid: url.split("/").splice(-1, 1)[0],
      emailTo: emailForm.elements["to_email"].value,
      emailFrom: emailForm.elements["from_email"].value,
    };
    emailForm[2].setAttribute("disabled", "true");

    console.table(formData);

    fetch(emailURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then(({ success }) => {
        if (success) {
          sharingContainer.style.display = "none";
          showToast("Email Sent");
          emailForm.elements["to_email"].value = "";
          emailForm.elements["from_email"].value = "";
        }
      });
  } else {
    showToast("Sender and Receiver email cannot be same!", "red");
  }
});

let toastTimer;

const showToast = (msg, col = "#03a9f4") => {
  toast.style.background = col;
  toast.innerText = msg;
  toast.style.transform = `translate(-50%, 0)`;
  clearTimeout(toastTimer);
  setTimeout(() => {
    toastTimer = toast.style.transform = `translate(-50%, 60px)`;
  }, 4000);
};
