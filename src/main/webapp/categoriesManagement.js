{
    function insertAfter(referenceNode, newNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    //fatherId is like "12"
    function findNextId(fatherId){
        let max = "";
        if(fatherId === "0"){
            for(let i=1; i<=9; i++){
                let result = document.getElementById("cat"+i);
                if(result != null){
                    if(i > max) max = i;
                }
            }
            return max+1;
        }
        const list = document.getElementsByTagName("td");
        let newList = [];
        for(let i=0; i<list.length; i++){
            if(list[i].id.substring(3).length === (fatherId.length+1) && list[i].textContent.startsWith(fatherId)){
                newList.push(list[i]);
            }
        }
        if(newList.length === 0){
            return fatherId+"1";
        }
        for(let i=0; i<newList.length; i++){
            let num = newList[i].textContent.split(" ", 1)[0];
            if(num > max) max = num;
        }
        return parseInt(max, 10)+1;
    }

    function getAll(){
        return document.getElementsByTagName("td");
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
        document.getElementById("errorMessage").style.display = "none";
        let alert = document.getElementById("id_alert");
        alert.style.display = "block";
        alert.innerHTML = str+"<span id=\"closebtn\" class=\"closebtn\">&times;</span>";
        document.getElementById("closebtn").addEventListener("click", (e) => {
            document.getElementById("id_alert").style.display = "none";
        });
    }

    function showError(str){
        document.getElementById("id_alert").style.display = "none";
        let alert = document.getElementById("errorMessage");
        alert.style.display = "block";
        alert.innerHTML = str+"<span id=\"closebtn2\" class=\"closebtn\">&times;</span>";
        document.getElementById("closebtn2").addEventListener("click", (e) => {
            document.getElementById("errorMessage").style.display = "none";
        });
    }

    //fatherId is like "cat..."
    function findUpperRow(fatherId){
        let fid;
        if(fatherId === "cat0") fid = "cat";
        else fid = fatherId;
        let max = ""; //initialization is essential for the comparison
        const list = document.querySelectorAll("[id^="+fid+"]");
        for(let i=0; i<list.length; i++){
            let num = list[i].id;
            if(num > max) max = num;
        }
        return max;
    }
}