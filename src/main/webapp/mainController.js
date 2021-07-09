{
    window.addEventListener("load", () => {
        if (sessionStorage.getItem("user") === null) {
            window.location.href = "index.html";
        } else {
            document.getElementById("id_username").textContent = sessionStorage.getItem("user");
            getTree();
        }
    }, false);

    const form = document.getElementById("addCatForm");
    form.addEventListener("submit", addCategory);


}