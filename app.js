/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

What you will learn in this lecture:

- How to create the fundamental game variables
- How to generate a random number
- How to manipulate the DOM
- How to read from the DOM
- How to change CSS styles

YOUR 3 CHALLENGES
Change the game to follow these rules:

1. A player looses his ENTIRE score when he rolls two 6 in a row. After that, it's the next player's turn. (Hint: Always save the previous dice roll in a separate variable)
2. Add an input field to the HTML where players can set the winning score, so that they can change the predefined score of 100. (Hint: you can read that value with the .value property in JavaScript. This is a good oportunity to use google to figure this out :)
3. Add another dice to the game, so that there are two dices now. The player looses his current score when one of them is a 1. (Hint: you will need CSS to position the second dice, so take a look at the CSS code for the first one.)
*/


var scores, roundScore, activePlayer, gamePlaying, previousDice;

init();


// querySelector: return the first element that matches a specified CSS selector(s) in the document
//document.querySelector('#score-0').textContent = dice;
// activePlayer is either 0 or 1 --> refers to the div 'player-current-score'

///document.querySelector('#current-' + activePlayer).textContent = dice;

// If you want to use a HTML tag to manipulate the content of an element (e.g. change the font style) then use innerHTML
//document.querySelector('#current-' + activePlayer).innerHTML = '<em>' + dice + '</em>';
var x = document.querySelector('#score-0').textContent;
console.log(x);


// getElementById is a bit faster than querySelector
// Initial state: set all scores to 0
document.getElementById('score-0').textContent = '0';
document.getElementById('current-0').textContent = '0';
document.getElementById('score-1').textContent = '0';
document.getElementById('current-1').textContent = '0';
document.getElementById('dice-1').style.display = 'none';
document.getElementById('dice-2').style.display = 'none';


/* addEventListener has two arguments
   1. arg.: type of Event (String)
   2. call-back function (function is passed to another function as an argument)
      or anonymous function (directly in the function, doesn't have a name)
 */
function nextPlayer() {
    // If current active player is 0 then set activePlayer to 1, otherwise to 0
    activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;
    roundScore = 0;

    // after a round set current score for each player back to 0
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';
    document.querySelector('.player-0-panel').classList.toggle('active');
    document.querySelector('.player-1-panel').classList.toggle('active');

    // Don't show the dice when next player begins
   // document.getElementById('dice-1').style.display = 'none';
   // document.getElementById('dice-2').style.display = 'none';
}

//document.querySelector('btn-roll').addEventListener('click', btn);
document.querySelector('.btn-roll').addEventListener('click', function () {
    if (gamePlaying) {
        // 1. Random number
        // Calculate random number in the range of 1 to 6 with Math.random()
        // Truncate decimal places with
        var dice1 = Math.floor(Math.random() * 6) + 1;
        console.log(dice1);
        var dice2 = Math.floor(Math.random() * 6) + 1;
        console.log(dice2);

        // 2. Display the result
        var dice1DOM = document.getElementById('dice-1');
        dice1DOM.style.display = 'block';
        dice1DOM.src = 'dice-' + dice1 + '.PNG';
        var dice2DOM = document.getElementById('dice-2');
        dice2DOM.style.display = 'block';
        dice2DOM.src = 'dice-' + dice2 + '.PNG';

        // player looses score when rolling a 6 two times in a row
        if (previousDice === 6 && dice1 === 6) {
            console.log("Rolled a 6 two times in a row");
            roundScore = 0;
            scores[activePlayer] = 0;
            document.getElementById('score-' + activePlayer).textContent = '0';
            nextPlayer();
        }


        // 3. Update the round score IF the rolled number was Not a 1
        if (dice1 !== 1 && dice2 !== 1) {
            if (dice1 !== dice2) {
                roundScore += dice1 + dice2;
            } else { // if the same number is rolled, the score of every dice counts twice as much when it's added to the round score
                roundScore += 2 * dice1 + 2 * dice2;
            }
            document.getElementById('current-' + activePlayer).textContent = roundScore;
        } else {
            roundScore = 0;
            document.getElementById('current-' + activePlayer).textContent = roundScore;
            nextPlayer();
        }
        previousDice = dice1 + dice2;
    }
});

// passing init as a function, don't use braces here because then the init would be called immediately and not only on the event listener
document.querySelector('.btn-new').addEventListener('click', init);

function init() {
    gamePlaying = true;
    document.querySelector('.player-0-panel').classList.remove('active');
    document.querySelector('.player-1-panel').classList.remove('active');

    scores = [0,0]; // at the beginning every player has a score of 0
    roundScore = 0;
    activePlayer = 0; // O: player1 ; 1: player2

    document.getElementById('dice-1').style.display = 'none';
    document.getElementById('dice-2').style.display = 'none';

    document.getElementById('score-0').textContent = '0';
    document.getElementById('current-0').textContent = '0';
    document.getElementById('score-1').textContent = '0';
    document.getElementById('current-1').textContent = '0';
    document.getElementById('name-0').textContent = 'Player 1';
    document.getElementById('name-1').textContent = 'Player 2';
    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('winner');
    document.querySelector('.player-0-panel').classList.remove('active');
    document.querySelector('.player-1-panel').classList.remove('active');
    // if player zero was active Player then here would be added a second active class; therefore first remove and then add the active class
    document.querySelector('.player-0-panel').classList.add('active');

}

/**
 * Saves the round score of the active player when the button 'Hold' is clicked
 */
document.querySelector('.btn-hold').addEventListener('click', function () {
    if(gamePlaying) {
        // 1. Add current score to global score
        scores[activePlayer] += roundScore; // For the index that represents the active player, add round score

        // 2. Update the UI
        document.getElementById('score-' + activePlayer).textContent = scores[activePlayer]; // display the total score for active player


        // 3. Check if player won the game
        var input = document.querySelector('.final-score').value;
        var winningScore;
        // Undefined, 0, null or "" are COERCED to false
        // Anything else is COERCED to true

        if(input) {
            winningScore = input;
            console.log(winningScore);
        } else {
            winningScore = 100;
        }


        if (scores[activePlayer] >= winningScore) {
            document.getElementById('dice-1').style.display = 'none';
            document.getElementById('dice-2').style.display = 'none';
            document.getElementById('name-' + activePlayer).textContent = 'Winner';
            // add the winner CSS class in order to display the winner more appealing
            document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
            document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
            gamePlaying = false;
        } else {
            nextPlayer();
        }
    }
});