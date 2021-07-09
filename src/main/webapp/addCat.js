{
    function addCategory() {
        const form = document.getElementById("addCatForm");
        const alert = document.getElementById("errorMessage");

        makeCall("POST", "AddCategory", form,
            function (req) {
                if(req.readyState === XMLHttpRequest.DONE){
                    const message = req.responseText;
                    switch(req.status){
                        case 200:{
                            alert.textContent = "";
                            getTree();
                            break;
                        }
                        case 400:{
                            alert.textContent = message;
                            break;
                        }
                        case 401:{
                            alert.textContent = message;
                            break;
                        }
                        case 403:{
                            window.location.href = req.getResponseHeader("Location");
                            window.sessionStorage.removeItem('user');
                            break;
                        }
                    }
                }
            }
        )
    }
}