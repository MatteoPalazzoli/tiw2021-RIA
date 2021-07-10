{
    function insertAfter(referenceNode, newNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    function findNextId(fatherId){
        let max = "";
        const list = document.querySelectorAll("[id^="+fatherId+"]");
        list.forEach( c => {
            let num = c.id.substr(2);
            if(num > max) max = num;
        });
        if(max.length === fatherId.length) return fatherId+"1";
        else return parseInt(max, 10)+1;
    }

    function getChildren(input){
        input = input.substring(3);
        let list = document.getElementsByTagName("td");
        let newList = [];
        for(let i=0; i<list.length; i++){
            if(list[i].textContent.startsWith(input) && list[i].textContent !== input.textContent){
                newList.push(list[i]);
            }
        }
        return newList;
    }

    function getOthers(input){
        input = input.substring(3);
        let list = document.getElementsByTagName("td");
        let newList = [];
        for(let i=0; i<list.length; i++){
            if(!list[i].textContent.startsWith(input) || list[i].textContent === input.textContent){
                newList.push(list[i]);
            }
        }
        return newList;
    }

    function showAlert(str){
        let alert = document.getElementById("id_alert");
        alert.style.display = "block";
        alert.innerHTML = str+"<span id=\"closebtn\" class=\"closebtn\">&times;</span>";
        document.getElementById("closebtn").addEventListener("click", (e) => {
            document.getElementById("id_alert").style.display = "none";
        });
    }

    function showError(str){
        let alert = document.getElementById("errorMessage");
        alert.style.display = "block";
        alert.innerHTML = str+"<span id=\"closebtn2\" class=\"closebtn\">&times;</span>";
        document.getElementById("closebtn2").addEventListener("click", (e) => {
            document.getElementById("errorMessage").style.display = "none";
        });
    }
}