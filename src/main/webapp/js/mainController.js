{

    window.addEventListener("load", () => {
        if (sessionStorage.getItem("user") === null) {
            window.location.href = "index.html";
        } else {
            document.getElementById("id_username").textContent = sessionStorage.getItem("user");
            getTree();
        }
    }, false);

    document.getElementById("addCatSubmit").addEventListener("click", (e) => {
        e.preventDefault();
        addCategory();
        e.target.reset();
    });


    /* CATEGORY MOVING MANAGEMENT */
    let dragged;
    let ids = [];

    document.addEventListener("dragstart", function( event ) {
        drag(event)
    }, false);

    document.addEventListener("dragend", function( event ) {
        event.target.style.opacity = "";
        let list = getAll();
        for(let i=0; i<list.length; i++){
            list[i].setAttribute("draggable", "true");
        }
    }, false);

    document.addEventListener("dragover", function( event ) {
        if(event.target.className === "dropzone"){
            event.preventDefault(); //allow drop
        }
    }, false);

    document.addEventListener("drop", function( event ) {
        drop(event);
    }, false);

    document.getElementById("saveButton").addEventListener("click", (e) => {
        let data = new FormData();
        data.append("list", ids.toString());
        ids = [];
        makeCall("POST", "Move", data, function(x){
            if (x.readyState === XMLHttpRequest.DONE) {
                const message = x.responseText;
                switch(x.status){
                    case 200:{
                        showAlert(message)
                        getTree();
                        break;
                    }
                    case 400:{
                        showError(message);
                        break;
                    }
                    case 401:{
                        showError(message);
                        break;
                    }
                    case 403:{
                        window.location.href = x.getResponseHeader("Location");
                        window.sessionStorage.removeItem('user');
                        break;
                    }
                }
            }
            document.getElementById("saveButton").style.display = "none";
        })
    })

    document.getElementById("addList").addEventListener("click", (e) => {
        ids.push(document.getElementById("param").value);
        document.getElementById("saveButton").style.display = "block";
    })

    function drag(event){
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
    }

    function drop(event){
        // prevent default action (open as link for some elements)
        event.preventDefault();
        let destRow = event.target.parentNode;
        let result = confirm("Do you confirm?");
        if(!result) return;
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
    }
}