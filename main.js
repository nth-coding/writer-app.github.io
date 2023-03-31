window.onload = function() {
    // event click button add
    var btn = document.getElementById('saveBtn');
    btn.addEventListener('click', function() {
        var text = document.querySelector('[role=textbox]').innerText;
        if (text === '') {
            alert("You must write something!");
            return;
        }

        var writeApp = {};
        writeApp.text = text;
        writeApp.date = new Date().toDateString();

        addElement(writeApp);
        alert("Add success!");
        refresh();

        // document.querySelector('[role=textbox]').value = '';
    })

    var checkBtn = document.getElementById('checkBtn');
    checkBtn.addEventListener('click', function(e) {
        e.preventDefault();
        // var editor = CKEDITOR.instances.content;
        // editor.setData('<p>Some <strong>sample</strong> text</p>');
        document.querySelector('[data-placeholder="Type here"]').innerText = '<p>Some <strong>sample</strong> text</p>';
        // refresh();

        alert("Check success!");
    })

    refresh();
}

function getLocalElementList() {
    var localList = localStorage.getItem('writeApplist');
    if (!localList) return [];
    return JSON.parse(localList);
}

function setLocalElementList(list) {
    localStorage.setItem('writeApplist', JSON.stringify(list));
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
    doc.querySelector('.doc-delete').addEventListener('click', function() {
        removeElement(writeApp.text);
        refresh();
    })
    doc.querySelector('.doc-edit').addEventListener('click', function() {
        // open new tab
        var url = "index.html";
        var win = window.open(url, '_blank');

        // send data to new tab
        win.onload = function() {
            win.document.querySelector('[role=textbox]').innerText = writeApp.text;
        }
        win.focus();
    })
    document.getElementById('myDocs').appendChild(doc); 
}

function refresh() {
    document.getElementById('myDocs').innerHTML = '';
    for (var doc of getLocalElementList()) {
        createNewElement(doc);
    }
}