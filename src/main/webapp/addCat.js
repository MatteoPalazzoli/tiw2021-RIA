{
    function addCategory() {
        const form = document.getElementById("addCatForm");
        makeCall("POST", "AddCategory", form,
            function (req) {
                if(req.readyState === XMLHttpRequest.DONE){
                    const message = req.responseText;
                    switch(req.status){
                        case 200:{
                            showAlert("Category added.")
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