{
    function addCategory() {
        makeCall("POST", "AddCategory", form,
            function (req) {
                if(req.readyState === XMLHttpRequest.DONE){
                    const message = req.responseText;
                    if (req.status === 200) {
                        document.getElementById("alertMessage").textContent = "";
                    } else if (req.status === 403) {
                        window.location.href = req.getResponseHeader("Location");
                        window.sessionStorage.removeItem('user');
                    }
                    else {
                        self.alert.textContent = message;
                        self.reset();
                    }
                }
            }
        )
    }
}