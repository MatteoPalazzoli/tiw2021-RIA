{
    window.addEventListener("load", () => {
        if (sessionStorage.getItem("user") === null) {
            window.location.href = "index.html";
        } else {
            document.getElementById("id_username").textContent = sessionStorage.getItem("user");
            getTree();
            const list = document.querySelectorAll("td");
            /*list.forEach( item => {
                item.addEventListener("dragstart", (e) => drag(list, e));
                item.addEventListener("dragover", (e) => {
                    allowDrop(e);
                })
                item.addEventListener("drop", (e) => {
                    drop(e);
                })
            })*/
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
        // store a ref. on the dragged elem
        dragged = event.target;
        // make it half transparent
        event.target.style.opacity = .5;
    }, false);

    document.addEventListener("dragend", function( event ) {
        // reset the transparency
        event.target.style.opacity = "";
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
            dragged.parentNode.removeChild( dragged );
            event.target.appendChild( dragged );
            ids.push(dragged.id, event.target.id);
            document.getElementById("saveButton").style.display = "block";
        }

    }, false);

    document.getElementById("saveButton").addEventListener("click", (e) => {
        let data = new FormData();
        data.append("list", ids.toString());
        makeCall("POST", "Move", data, function(x){
            if (x.readyState === XMLHttpRequest.DONE) {
                document.getElementById("errormessage").textContent = x.responseText;
            }
            getTree();
            document.getElementById("saveButton").style.display = "none";
        })
    })
}