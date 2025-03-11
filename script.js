document.getElementById("cola").addEventListener("click", function() {
    fetch("http://drinkomat.cz/api?napoj=cola")
        .then(response => response.text())
        .then(data => console.log(data));
});

document.getElementById("sprite").addEventListener("click", function() {
    fetch("http://drinkomat.cz/api?napoj=sprite")
        .then(response => response.text())
        .then(data => console.log(data));
});
