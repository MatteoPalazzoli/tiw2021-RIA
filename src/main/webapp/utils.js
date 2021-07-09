/**
 * AJAX call management
 */

function makeCall(method, url, formElement, cback, reset = true) {
    var req = new XMLHttpRequest(); // visible by closure
    req.onreadystatechange = function() {
        switch(req.readyState) {
            case XMLHttpRequest.UNSENT:
                break;
            case XMLHttpRequest.OPENED:
                break;
            case XMLHttpRequest.HEADERS_RECEIVED:
            case XMLHttpRequest.LOADING:
                break;
            case XMLHttpRequest.DONE:
                cback(req);
                break;
        }
    }
    req.open(method, url, true);

    //req.setRequestHeader("Content-Type", "multipart/form-data");
    if (formElement == null) {
        req.send();
    } else if(formElement instanceof FormData) {
        req.send(formElement);
    } else {
        req.send(new FormData(formElement));
    }
    if (formElement !== null && reset === true) {
        //formElement.reset();
    }
}
