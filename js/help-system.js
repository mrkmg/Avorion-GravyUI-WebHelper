define([], function () {
    const help = document.getElementById("help")
    const overlay = document.getElementById("overlay")
    window.toggleHelp = toggleHelp;
    function getHelp() {
        help.classList.add("show");
        overlay.classList.add("show");
    }
    function hideHelp() {
        help.classList.remove("show");
        overlay.classList.remove("show");
    }

    function toggleHelp() {
        if (help.classList.contains("show")) {
            hideHelp();
        } else {
            getHelp();
        }
    }

    if (localStorage.getItem("saw-help") !== "yes") {
        localStorage.setItem("saw-help", "yes");
        getHelp();
    }
});