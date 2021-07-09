{
    function drag(event){
        const draggedId = event.target.id;
        event.dataTransfer.setData("ID", draggedId);
        let l = document.querySelectorAll("[id^=draggedId]");
        let i;
        for(i=0; i<l.length; i++){
            l[i].style.backgroundColor = "red";
        }
        /*let subList = list.filter( c => {
            return !c.id.startsWith(event.target.id);
        });
        subList.forEach( c => {
            c.addEventListener("dragover", (e) => {
                allowDrop(e);
            })
            c.addEventListener("drop", (e) => {
                drop(e);
            })
        })*/
    }

    function allowDrop(event){
        event.preventDefault();
    }

    function drop(event){
        event.preventDefault();
        const data = event.dataTransfer.getData("ID");
        event.target.appendChild(document.getElementById(data));
    }
}