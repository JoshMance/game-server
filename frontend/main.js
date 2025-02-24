import { playGame } from './playGame.js';

// The abstract states in which the app can be in
// mapped to their page div ids
// Each page fills the entire screen
let STATE = {
    HOME: "#homeScreen",
    GAME:  "#gameScreen",
    ERROR: "#errorScreen"
};
let currentState = STATE.HOME;


// Shows the page for the target state, hides
// the pages for all other states
function showState(target) {
    for (let key of Object.keys(STATE)) {
        if (STATE[key] == target) {
            $(STATE[key]).show();
        }
        else {
            $(STATE[key]).hide();
        }
    }
    currentState = target;
}

// The site loop consists of the user moving betwean a home and game state.
// The user starts in the home state, can then enter the game state, and then returns
// to the home state upon exiting the game state.
$(document).ready(function() {

    showState(STATE.HOME);

    $("#playButton").click(function() {
        showState(STATE.GAME);
        playGame();
    });

    $(document).on("keydown", function(event) {
        if (event.key === "Escape" && (currentState == STATE.GAME)) {
            showState(STATE.HOME);
        }
    });

});