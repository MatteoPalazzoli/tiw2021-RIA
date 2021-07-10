{
    function getTree(){
        const table = document.getElementById("treeContainer");
        table.innerHTML = ""; //removing old rows
        makeCall("GET", "GetTree", null,
            function(req) {
                let row, nameCell;
                if (req.readyState === 4) {
                    const message = req.responseText;
                    if (req.status === 200) {
                        const listOfCategories = JSON.parse(req.responseText);
                        if (listOfCategories.length === 0) {
                            showAlert("The tree is empty.");
                            return;
                        }
                        row = document.createElement("tr");
                        nameCell = document.createElement("td");
                        nameCell.setAttribute("id", "cat0");
                        nameCell.textContent = "0 Root";
                        nameCell.style.display = "none";
                        row.appendChild(nameCell);
                        table.appendChild(row);
                        listOfCategories.forEach( c => {
                            row = document.createElement("tr");
                            nameCell = document.createElement("td");
                            nameCell.setAttribute("draggable", "true");
                            nameCell.setAttribute("id", "cat"+c.id);
                            let spaces = "";
                            for(let i=0; i<c.id.length; i++){
                                spaces += "&nbsp;&nbsp;&nbsp;&nbsp;";
                            }
                            nameCell.innerHTML = spaces+c.id + " "+ c.name;
                            row.appendChild(nameCell);
                            table.appendChild(row);
                        })
                    } else if (req.status === 403) {
                        window.location.href = req.getResponseHeader("Location");
                        window.sessionStorage.removeItem('user');
                    }
                    else {
                        showAlert(message);
                    }
                }
            }
        );
    }
}