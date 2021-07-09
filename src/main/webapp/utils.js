/**
 * AJAX call management
 */

function makeCall(method, url, formElement, cback, reset = true) {
    const req = new XMLHttpRequest(); // visible by closure
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
    if (formElement == null) {
        req.send();
    } else if(formElement instanceof FormData) {
        req.send(formElement);
    } else {
        req.send(new FormData(formElement));
    }
    if (formElement !== null && reset === true) {
        formElement.reset();
    }
}

function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function findNextId(fatherId){
    let max = "";
    const list = document.querySelectorAll("[id^=fatherId]");
    list.forEach( c => {
        c.id = c.id.substr(0, 3);
        if(c.id > max) max = c.id;
    });
    if(max.length === fatherId.length) return fatherId+"1";
    else return parseInt(max, 10)+1;
}

function getSubTree(input){
    return document.querySelectorAll("[id^=input]");
}
