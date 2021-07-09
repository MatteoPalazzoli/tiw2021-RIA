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
                            document.getElementById("id_alert").textContent = "The tree is empty.";
                            return;
                        }
                        listOfCategories.forEach( c => {
                            row = document.createElement("tr");
                            nameCell = document.createElement("td");
                            nameCell.textContent = c.id + " "+ c.name;
                            row.appendChild(nameCell);
                            table.appendChild(row);
                        });
                    } else if (req.status === 403) {
                        window.location.href = req.getResponseHeader("Location");
                        window.sessionStorage.removeItem('user');
                    }
                    else {
                        document.getElementById("id_alert").textContent = message;
                    }
                }
            }
        );
    }
}