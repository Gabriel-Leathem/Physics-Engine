function show(id) {
    document.getElementById(id).style.display = "block";
}

function hide(id) {
    document.getElementById(id).style.display = "none";
}

show("webpage-state-always");
hide("webpage-state-how-it-works");
hide("webpage-state-simulation");
hide("webpage-state-about");

document.getElementById("how-it-works").addEventListener('click', function() {
    show("webpage-state-how-it-works");
    hide("webpage-state-home");
    hide("webpage-state-about");
    hide("webpage-state-simulation");
});

document.getElementById("home").addEventListener('click', function() {
    show("webpage-state-home");
    hide("webpage-state-how-it-works");
    hide("webpage-state-simulation");
    hide("webpage-state-about");
});

document.getElementById("about").addEventListener('click', function() {
    show("webpage-state-about");
    hide("webpage-state-how-it-works");
    hide("webpage-state-simulation");
    hide("webpage-state-home");
});

document.getElementById("simulation").addEventListener('click', function() {
    show("webpage-state-simulation");
    hide("webpage-state-how-it-works");
    hide("webpage-state-home");
    hide("webpage-state-about");
    hide("webpage-state-always")
});