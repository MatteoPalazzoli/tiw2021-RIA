{
    (function(){ //avoid variables ending in the global scope
        window.addEventListener("load", () => {
            if (sessionStorage.getItem("user") === null) {
                window.location.href = "index.html";
            } else {
                getTree();
                document.getElementById("id_username").textContent = sessionStorage.getItem("user");
            }
        }, false);

        document.getElementById("addCatSubmit").addEventListener("click", (e) => {
            e.preventDefault();
            addCategory();
            document.getElementById("addCatForm").reset();
        });


        /* CATEGORY MOVING MANAGEMENT */
        let dragged;
        let ids = [];

        document.addEventListener("dragstart", function drag(event) {
            dragged = event.target;
            dragged.style.opacity = 0.5;
            let list = getOthers(dragged.id);
            for(let i=0; i<list.length; i++){
                list[i].classList.add("dropzone");
            }
        }, false);

        document.addEventListener("dragend", function( event ) {
            event.target.style.opacity = "";
        }, false);

        document.addEventListener("dragover", function( event ) {
            if(event.target.className === "dropzone"){
                event.preventDefault(); //allow drop
            }
        }, false);

        document.addEventListener("drop", function drop(event) {
            // prevent default action (open as link for some elements)
            event.preventDefault();
            let destRow = event.target.parentNode;
            // move dragged elem and children to the selected drop target
            if ( event.target.className === "dropzone" ) {
                let list = document.getElementsByClassName("dropzone");
                for(let i=0; i<list.length; i++){
                    list[i].classList.remove("dropzone");
                }
                //confirm dialog
                if(!confirm("Do you confirm?")) return;
                //additional input check
                let regExp = new RegExp("^cat\\d+$");
                if(event.target.id.startsWith(dragged.id) || !event.target.id.match(regExp) || !dragged.id.match(regExp)){
                    alert("This request is invalid!");
                    return;
                }
                let toMove = document.querySelectorAll("[id^="+dragged.id+"]");
                let nextId = findNextId(event.target.id.substring(3));
                let beforeRow = findUpperRow(event.target.id);
                ids.push(dragged.id, event.target.id);
                //adding new rows
                for(let i=toMove.length-1; i>=0; i--){
                    let newText = toMove[i].textContent.replace(dragged.id.substring(3), nextId);
                    let newRow = document.createElement("tr");
                    let newCell = document.createElement("td");
                    newCell.textContent = newText;
                    newCell.setAttribute("id", "cat"+ newText.split(" ", 1)[0]);
                    newCell.setAttribute("draggable", "true");
                    newRow.appendChild(newCell);
                    insertAfter(document.getElementById(beforeRow).parentNode, newRow);
                }
                //deleting old rows
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
                    const message = x.responseText;
                    switch(x.status){
                        case 200:{
                            showAlert(message)
                            break;
                        }
                        case 400:
                        case 401:
                        case 500:
                            showError(message);
                            break;
                        case 403:{
                            window.location.href = "index.html";
                            window.sessionStorage.removeItem('user');
                            break;
                        }
                    }
                }
                getTree();
                document.getElementById("saveButton").style.display = "none";
            });
        });
    })();
}