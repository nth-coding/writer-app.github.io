window.onload = function () {
    var saveBtn = document.getElementById('saveBtn');
    if (saveBtn != null) {
        saveBtn.addEventListener('click', function () {
            var editorText = CKEDITOR.instances['my-editor'].getData();
            if (editorText === '') {
                alert("You must write something!");
                return;
            }

            var list = getLocalElementList();
            var writeApp = {};

            writeApp.text = editorText;
            writeApp.date = new Date().toDateString();
            writeApp.index = getIndex();

            // addElement(writeApp);
            // removeElement(list[getIndex() - 1].text);
            if (getIndex() == 0) {
                editElement(writeApp, getIndex());
            } else {
                editElement(writeApp, getIndex() - 1);
            }

            alert("Save success!");

            // close tab
            // window.close();

            refresh();
        })
    }

    refresh();
}

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

    writeApp.text = '';
    writeApp.date = new Date().toDateString();
    writeApp.index = getLocalElementList().length;
    addElement(writeApp);

    var url = "index.html";
    window.open(url, '_blank');

    refresh();
}

function removeElement(writeAppText) {
    var list = getLocalElementList();
    for (var t of list) {
        if (t.text == writeAppText) {
            list.splice(list.indexOf(t), 1);
            break;
        }
    }
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
    var localList = localStorage.getItem('writeApplist');
    if (!localList) return [];
    return JSON.parse(localList);
}

function setLocalElementList(list) {
    localStorage.setItem('writeApplist', JSON.stringify(list));
}

function createNewElement(writeApp) {
    var doc = document.createElement('div');
    doc.className = 'doc';
    doc.innerHTML = `
        <div class="doc-text">${writeApp.text}</div>
        <div class="doc-date">${writeApp.date}</div>
        <div class="doc-delete">Delete</div>
        <div class="doc-edit">Edit</div>
        </br>
    `;
    doc.querySelector('.doc-delete').addEventListener('click', function () {
        removeElement(writeApp.text);
        refresh();
    })
    doc.querySelector('.doc-edit').addEventListener('click', function () {
        // open new tab
        var url = "index.html?key=" + writeApp.index;
        var win = window.open(url, '_blank');

        // send data to new tab
        var data = writeApp.text;
        var intervalId = setInterval(function () {
            if (win.CKEDITOR && win.CKEDITOR.instances['my-editor']) {
                clearInterval(intervalId);
                win.CKEDITOR.instances['my-editor'].setData(data);
            }
        }, 100);
    });

    document.getElementById('myDocs').appendChild(doc);
}

function refresh() {
    document.getElementById('myDocs').innerHTML = '';
    for (var doc of getLocalElementList()) {
        createNewElement(doc);
    }
}