var count = 0;

options = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  hour12: false,
};

window.onload = function () {
  var saveBtn = document.getElementById("saveBtn");

  

  if (saveBtn != null) {
    saveBtn.addEventListener("click", function () {
      var editorText = CKEDITOR.instances["my-editor"].getData();
      var title = document.getElementById("title").value; 
      if (editorText === "") {
        alert("You must write something!");
        return;
      }

      var list = getLocalElementList();
      var writeApp = {};

      if (title === "") {
        title = "New Document";
      }

      writeApp.title = title;
      writeApp.text = editorText;
      writeApp.date = new Intl.DateTimeFormat("vi-VN", options).format(new Date());
      writeApp.stat = "default";

      console.log(writeApp);

      if (window.location.href.indexOf("key=") < 0) {
        if (list.length == 1) {
          writeApp.index = 0;
          editElement(writeApp, 0);
        } else {
          writeApp.index = list.length - 1;
          editElement(writeApp, list.length - 1);
        }
      } else {
        console.log(3);
        editElement(writeApp, getIndex());
      }

      alert("Save success!");

      // close tab
      // window.close();

      // refresh();
    });
  }

  refresh();
};

function getIndex() {
  var url = window.location.href;
  var index = url.indexOf("key=");
  index = url.substring(index + 4);

  // console.log(url + " " + index);

  if (index < 0) {
    return getLocalElementList().length - 1;
  }
  return index;
}

function newDoc() {
  var writeApp = {};

  writeApp.title = "New Document";
  writeApp.text = "";
  writeApp.date = new Intl.DateTimeFormat("vi-VN", options).format(new Date());
  writeApp.stat = "default";

  console.log(writeApp);

  writeApp.index = count++;
  addElement(writeApp);

  var url = "index.html";
  window.open(url, "_blank");

  refresh();
}

function removeElement(writeApp) {
  list = getLocalElementList();
  list[writeApp.index].stat = "deleted";

  setLocalElementList(list);
}

function addElement(writeApp) {
  var list = getLocalElementList();

  list.push(writeApp);
  setLocalElementList(list);
}

function editElement(writeApp, index) {
  var list = getLocalElementList();
  list[index] = writeApp;
  setLocalElementList(list);
}

function getLocalElementList() {
  var localList = localStorage.getItem("writeApplist");
  if (!localList) return [];
  return JSON.parse(localList);
}

function setLocalElementList(list) {
  localStorage.setItem("writeApplist", JSON.stringify(list));
}

function createNewElement(writeApp) {
  var doc = document.createElement("div");
  doc.className = "doc";
  doc.innerHTML = `
        <div class="card bg-light mb-3" style="max-width: 18rem;">
            <div class="card-header">
              ${writeApp.title}
              <div class="doc-date">${writeApp.date}</div>
            </div>
            <div class="card-body">
              <div class="delnedit"> 
                  <span class="doc-edit">Edit</span>  
                  <span class="doc-delete">Delete</span> 
              </div>
            </div>
        </div>
    `;
  doc.querySelector(".doc-delete").addEventListener("click", function () {
    removeElement(writeApp);
    refresh();
  });
  doc.querySelector(".doc-edit").addEventListener("click", function () {
    // open new tab
    var url = "index.html?key=" + writeApp.index;
    var win = window.open(url, "_blank");

    // send data to new tab
    var data = writeApp.text;
    var intervalId = setInterval(function () {
      if (win.CKEDITOR && win.CKEDITOR.instances["my-editor"]) {
        clearInterval(intervalId);
        win.CKEDITOR.instances["my-editor"].setData(data);
        var title = writeApp.title;
        win.document.getElementById("title").value = title;
        win.document.title = title + " - WriteApp";
      }
    }, 100);
  });

  document.getElementById("myDocs").appendChild(doc);
}

function refresh() {
  document.getElementById("myDocs").innerHTML = "";
  for (var doc of getLocalElementList()) {
    var status = doc.stat;
    if (status == "deleted") continue;

    createNewElement(doc);
  }
}
