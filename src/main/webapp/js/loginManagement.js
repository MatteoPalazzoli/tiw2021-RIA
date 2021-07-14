/**
 * Login management
 */

(function() { // avoid variables ending up in the global scope
    document.getElementById("loginbutton").addEventListener('click', (e) => {
        e.preventDefault();
        const form = e.target.closest("form");
        if (form.checkValidity()) {
            makeCall("POST", 'CheckLogin', form,
                function(x) {
                    if (x.readyState === XMLHttpRequest.DONE) {
                        const message = x.responseText;
                        switch (x.status) {
                            case 200:
                                sessionStorage.setItem('user', message);
                                window.location.href = "home.html";
                                break;
                            case 400: // bad request
                                document.getElementById("errormessage").textContent = message;
                                break;
                            case 401: // unauthorized
                                document.getElementById("errormessage").textContent = message;
                                break;
                            case 500: // server error
                                document.getElementById("errormessage").textContent = message;
                                break;
                        }
                    }
                }
            );
        } else {
            form.reportValidity();
        }
    });
})();