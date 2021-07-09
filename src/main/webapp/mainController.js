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
        let list = getSubTree(dragged.id);
        list.filter(c => c.id !== dragged.id).forEach( c => {
            c.classList.remove("draggable");
            c.setAttribute("draggable", "false")});
    }, false);

    document.addEventListener("dragend", function( event ) {
        // reset the transparency
        event.target.style.opacity = "";
        document.getElementById("cat0").style.display = "none";
    }, false);

    /* events fired on the drop targets */
    document.addEventListener("dragover", function( event ) {
        // prevent default to allow drop
        event.preventDefault();
    }, false);

    document.addEventListener("dragenter", function( event ) {
        // highlight potential drop target when the draggable element enters it
        if ( event.target.className === "draggable" ) {
            event.target.style.background = "purple";
        }

    }, false);

    document.addEventListener("dragleave", function( event ) {
        // reset background of potential drop target when the draggable element leaves it
        if ( event.target.className === "draggable" ) {
            event.target.style.background = "";
        }

    }, false);

    document.addEventListener("drop", function( event ) {
        // prevent default action (open as link for some elements)
        event.preventDefault();
        // move dragged elem to the selected drop target
        if ( event.target.className === "draggable" ) {
            event.target.style.background = "";
            let draggedId = dragged.id;
            let toMove = document.querySelectorAll("[id^=draggedId]")
            let nextId = findNextId(event.target.id);
            toMove.forEach( item => {
                document.getElementById(item.id).parentNode.removeChild(item);
                item.id.replace(draggedId, nextId);
            })
            insertAfter(event.target.parentNode, dragged.parentNode);
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
                document.getElementById("id_alert").textContent = x.responseText;
            }
            getTree();
            document.getElementById("saveButton").style.display = "none";
        })
    })
}