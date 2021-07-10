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

    let dragged;
    let ids = [];

    /* events fired on the draggable target */
    document.addEventListener("drag", function( event ) {

    }, false);

    document.addEventListener("dragstart", function( event ) {
        dragged = event.target;
        dragged.style.opacity = .5;
        document.getElementById("cat0").style.display = "block";
        let list = getChildren(dragged.id);
        list.forEach(c => {c.setAttribute("draggable", "false")});
        list = getOthers(dragged.id);
        list.forEach(c => {c.classList.add("dropzone")});
    }, false);

    document.addEventListener("dragend", function( event ) {
        // reset the transparency
        event.target.style.opacity = "";
        document.getElementById("cat0").style.display = "none";
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
            let list = document.getElementsByTagName("td");
            for(let i=0; i<list.length; i++){
                list[i].classList.remove("dropzone");
            }
            let toMove = document.querySelectorAll("[id^="+dragged.id+"]");
            for(let i=0; i<toMove.length; i++){
                toMove[i].parentNode.removeChild(toMove[i]);
                toMove[i].textContent.replace(dragged.id, findNextId(event.target.id));
                let row = document.createElement("tr");
                row.appendChild(toMove[i]);
                insertAfter(destRow, row);
            }
            ids.push(dragged.id, event.target.id);
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
}