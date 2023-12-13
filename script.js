var listDiv = document.getElementById("list");
var list = document.getElementById("listlist");
var add = document.getElementById("add");
var expt = document.getElementById("export");
var impt = document.getElementById("import");
var deleteButton;

function getItems() {
    let toRet = []
    for (const i of list.children) {
        toRet.push(i.getAttribute("thanks"));
    }
    return toRet;
}

function saveItems() {
    localStorage.setItem("items", JSON.stringify(getItems()));
}

function loadItems() {
    let items = JSON.parse(localStorage.getItem("items"))
    for (const i of items) {
        let a = document.createElement("li");
        a.innerText = i;
        a.setAttribute("thanks", i);
        list.appendChild(a);
    }
}

function loadFromJSON(json) {
    let items = JSON.parse(json)
    for (const i of items) {
        let a = document.createElement("li");
        a.innerText = i;
        a.setAttribute("thanks", i);
        list.appendChild(a);
    }
}

list.addEventListener("click", function(e) {
    if (e.target.nodeName == "LI") {
        if (deleteButton) {
            deleteButton.remove();
        }
        deleteButton = document.createElement("button");
        deleteButton.innerText = "X";
        deleteButton.id = "delete";
        e.target.append(deleteButton);
    } else if (e.target.id == "delete") {
        if (confirm("Are you sure you want to delete this item?")) {
            e.target.parentNode.remove();
            saveItems();
        }
    } else if (deleteButton) {
        deleteButton.remove();
    }
});

add.addEventListener("click", function() {
    let item = prompt("What would you like to be thankful for?");
    let c = true;
    let compare = new difflib.getCloseMatches(item, getItems())
    if (compare.length != 0) {
        c = confirm("Some items look similar, heres what we found:\n" + compare.join("\n"));
    }
    if (c && item != "") {
        let a = document.createElement("li");
        a.innerText = item;
        a.setAttribute("thanks", item);
        list.appendChild(a);
        saveItems();
    }
});

expt.addEventListener("click", function(e) {
    const text = JSON.stringify(getItems());
    const blob = new Blob([text], {type: 'application/json'});
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'thankfulness.json';
    link.click()
});

impt.addEventListener("click", function() {
    const link = document.createElement("input")
    link.type = "file"
    link.accept = ".json"
    link.click()
    link.addEventListener("change", function() {
        let file = link.files[0]
        // https://stackoverflow.com/a/754398/19189469
        if (file && confirm("Are you sure you want to do this? This will overwrite all of your data on your device. So make sure to double check that this file is from this site")) {
            var reader = new FileReader();
            reader.readAsText(file, "UTF-8");
            reader.onload = function (evt) {
                list.innerHTML = "";
                loadFromJSON(evt.target.result);
                saveItems();
            }
            reader.onerror = function (evt) {
                alert("there was an error reading the file");
            }
        }
    })
});

if (!localStorage.getItem("firsttime")) {
    localStorage.setItem("firsttime", "true");
    document.getElementById("firsttimecontainer").style.visibility = "visible";
}

loadItems();