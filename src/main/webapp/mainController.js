{
    window.addEventListener("load", () => {
        if (sessionStorage.getItem("user") === null) {
            window.location.href = "index.html";
        } else {
            document.getElementById("id_username").textContent = sessionStorage.getItem("user");
            getTree();
        }
    }, false);

    const addBtn = document.getElementById("addCatSubmit");
    addBtn.addEventListener("click", (e) => {
        e.preventDefault();
        addCategory();
    });


    /* CATEGORY MOVING MANAGEMENT */
    let dragged;
    let ids = [];

    document.addEventListener("dragstart", function( event ) {
        dragged = event.target;
        dragged.style.opacity = .5;
        let list = getChildren(dragged.id);
        for(let i=0; i<list.length; i++){
            list[i].setAttribute("draggable", "false");
        }
        list = getOthers(dragged.id);
        for(let i=0; i<list.length; i++){
            list[i].classList.add("dropzone");
        }
    }, false);

    document.addEventListener("dragend", function( event ) {
        event.target.style.opacity = "";
        let list = getAll();
        for(let i=0; i<list.length; i++){
            list[i].setAttribute("draggable", "true");
        }
    }, false);

    /* events fired on the drop targets */
    document.addEventListener("dragover", function( event ) {
        // prevent default to allow drop on drop zones
        if(event.target.className === "dropzone"){
            event.preventDefault();
        }
    }, false);

    document.addEventListener("dragenter", function( event ) {
    }, false);

    document.addEventListener("dragleave", function( event ) {
    }, false);

    document.addEventListener("drop", function( event ) {
        // prevent default action (open as link for some elements)
        event.preventDefault();
        let destRow = event.target.parentNode;
        // move dragged elem and children to the selected drop target
        if ( event.target.className === "dropzone" ) {
            let list = document.getElementsByClassName("dropzone");
            for(let i=0; i<list.length; i++){
                list[i].classList.remove("dropzone");
            }
            let toMove = document.querySelectorAll("[id^="+dragged.id+"]");
            let nextId = findNextId(event.target.textContent.split(" ", 1)[0]);
            let beforeRow = findUpperRow(event.target.id);
            ids.push(dragged.id, event.target.id);
            for(let i=toMove.length-1; i>=0; i--){
                let newText = toMove[i].textContent.replace(dragged.id.substring(3), nextId);
                let newRow = document.createElement("tr");
                let nameCell = document.createElement("td");
                nameCell.textContent = newText;
                nameCell.setAttribute("id", "cat"+ newText.split(" ", 1)[0]);
                nameCell.setAttribute("draggable", "true");
                newRow.appendChild(nameCell);
                insertAfter(document.getElementById(beforeRow).parentNode, newRow);
            }
            for(let i=0; i<toMove.length; i++){
                toMove[i].parentNode.parentNode.removeChild(toMove[i].parentNode);
            }
            document.getElementById("saveButton").style.display = "block";
        }

    }, false);

    document.getElementById("saveButton").addEventListener("click", (e) => {
        let data = new FormData();
        data.append("list", ids.toString());
        ids = [];
        makeCall("POST", "Move", data, function(x){
            if (x.readyState === XMLHttpRequest.DONE) {
                showAlert(x.responseText);
            }
            getTree();
            document.getElementById("saveButton").style.display = "none";
        })
    })

    /*document.getElementById("addList").addEventListener("click", (e) => {
        ids.push(document.getElementById("param").value);
        document.getElementById("saveButton").style.display = "block";
    })*/
}