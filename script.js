// script.js
//change

let deck, dealerHand, playerHand, balance, currentBet;
const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const popupOverlay = document.getElementById("popup-overlay");
const messageText = document.getElementById("message");
const closeButton = document.getElementById("close-button");
const newgame = document.getElementById('pop-new-game');

const balanceBet= document.getElementById('')
//Hide button
const hitButton = document.getElementById("btn-hit");

const standButton = document.getElementById("btn-stand");
const newGameButton = document.getElementById("btn-new-game");
const placeBetButton = document.getElementById("btn-place-bet");
const resetBetButton = document.getElementById("btn-reset-bet");

document.getElementById('btn-hit').addEventListener('click', hit);
document.getElementById('btn-stand').addEventListener('click', stand);
document.getElementById('btn-new-game').addEventListener('click', newGame);
document.getElementById('pop-new-game').addEventListener('click', newGame);
document.getElementById('btn-place-bet').addEventListener('click', placeBet);
document.getElementById('btn-reset-bet').addEventListener('click', resetBet);

document.querySelectorAll('.coin').forEach(coin => {
    coin.addEventListener('click', () => {
        const value = parseInt(coin.getAttribute('data-value'));
        console.log("Coin value:", value);
        updateBet(value);
    });
});

function updateBet(coinValue) {
    let currentBetElement = document.getElementById('current-bet');
    let currentBetText = currentBetElement.textContent;
    let currentBet = parseInt(currentBetText.split(' ')[2]);

    if(balance ===0){
        document.getElementById('mes').textContent = `Your current balance is $${balance}`;
        return;
    }
    
    if (!isNaN(currentBet) && (currentBet + coinValue) <= balance) { // Add check to ensure current bet doesn't exceed balance
        currentBet += coinValue;
        currentBetElement.textContent = "Current Bet: " + currentBet;
    } else {
        document.getElementById('message').textContent = 'Invalid bet amount or exceeds balance';
    }
}

function newGame() {
    deck = createDeck();
    shuffleDeck(deck);
    dealerHand = [];
    playerHand = [];
    currentBet = 0;
    balance = balance !== undefined ? balance : 1000; // Initialize balance if not already set
    updateGame();
    document.getElementById('current-bet').textContent = `Current Bet: ${currentBet}`;
    document.getElementById('btn-hit').disabled = true;
    document.getElementById('btn-stand').disabled = true;
    document.getElementById('mes').textContent = '';
    document.getElementById('message').textContent = '';
    // document.getElementById('bet-amount').disabled = false;
    document.getElementById('btn-place-bet').disabled = false;
    document.getElementById('btn-reset-bet').disabled = false;
    document.getElementById('btn-new-game').disabled = true;
    document.getElementById('balance-amount').textContent = balance;

    document.querySelectorAll('.coin').forEach(coin => {
        coin.classList.remove('disabled'); // Enable all coins
    });

    //Hide button
    showBetButtons();
    
}

function placeBet() {
    const currentBetText = document.getElementById('current-bet').textContent;
    const betAmount = parseInt(currentBetText.split(' ')[2]);
    
    if (betAmount > 0 && betAmount <= balance) {
        currentBet = betAmount;
        balance -= currentBet;
        dealerHand = [drawCard(), drawCard()];
        playerHand = [drawCard(), drawCard()];
        updateGame(false, true, true);
        document.getElementById('btn-hit').disabled = false;
        document.getElementById('btn-stand').disabled = false;
        document.getElementById('mes').textContent = '';
        document.getElementById('message').textContent = '';
        document.getElementById('btn-place-bet').disabled = true;
        document.getElementById('btn-reset-bet').disabled = true;
        document.getElementById('btn-new-game').disabled = true;
        document.getElementById('balance-amount').textContent = balance;
            
        document.querySelectorAll('.coin').forEach(coin => {
            coin.classList.add('disabled'); // Enable all coins
        });

        //Hide butttons
        showGameButtons();
    } else {
        document.getElementById('message').textContent = 'Invalid bet amount or exceeds balance';
    }
} 
    


function resetBet() {
    document.getElementById('current-bet').textContent = "Current Bet: 0";
    // document.querySelectorAll('.coin').forEach(coin => {
    //     coin.classList.remove('disabled'); // Enable all coins
    // });
}

function createDeck() {
    let deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
    return deck;
}

function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function drawCard() {
    return deck.pop();
}

function getHandValue(hand) {
    let value = 0;
    let numAces = 0;
    for (let card of hand) {
        if (card.value === 'A') {
            numAces++;
            value += 11;
        } else if (['K', 'Q', 'J'].includes(card.value)) {
            value += 10;
        } else {
            value += parseInt(card.value);
        }
    }
    while (value > 21 && numAces > 0) {
        value -= 10;
        numAces--;
    }
    return value;
}

function getCardImage(card) {
    return `images/${card.value}_of_${card.suit}.png`;
}

function updateGame(revealDealerCard = false, animateDealer = false, animatePlayer = false) {
    document.getElementById('dealer-hand').innerHTML = '';
    document.getElementById('player-hand').innerHTML = '';
    
    for (let i = 0; i < dealerHand.length; i++) {
        let cardDiv = createCardElement(dealerHand[i], i === 0 && !revealDealerCard, animateDealer && i >= dealerHand.length - 1);
        document.getElementById('dealer-hand').appendChild(cardDiv);
    }

    for (let i = 0; i < playerHand.length; i++) {
        let cardDiv = createCardElement(playerHand[i], false, animatePlayer && i === playerHand.length - 1);
        document.getElementById('player-hand').appendChild(cardDiv);
    }

    document.getElementById('dealer-points').textContent = revealDealerCard ? `Total: ${getHandValue(dealerHand)}` : 'Total: ?';
    document.getElementById('player-points').textContent = `Total: ${getHandValue(playerHand)}`;
    document.getElementById('balance-amount').textContent = balance;

    if (getHandValue(playerHand) > 21) {
        endGame('You exceeded 21 and busted! Dealer wins!');
    }
}

function createCardElement(card, isBack = false, animate = false) {
    let cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    if (isBack) {
        cardDiv.classList.add('flip');
    }
    if (animate) {
        cardDiv.classList.add('draw');
    }

    let front = document.createElement('div');
    front.className = 'front';
    front.style.backgroundImage = `url(${getCardImage(card)})`;

    let back = document.createElement('div');
    back.className = 'back';
    back.style.backgroundImage = 'url(images/back.png)';

    cardDiv.appendChild(front);
    cardDiv.appendChild(back);

    return cardDiv;
}

function stand() {
    while (getHandValue(dealerHand) < 17) {
        dealerHand.push(drawCard());
    }
    updateGame(true, true, false);

    // Flip the dealer's hidden card
    let dealerHandDiv = document.getElementById('dealer-hand').firstChild;
    setTimeout(() => dealerHandDiv.classList.remove('flip'), 500);  // Change to remove flip class after a delay to trigger animation

    let dealerValue = getHandValue(dealerHand);
    let playerValue = getHandValue(playerHand);

    if (dealerValue > 21) {
        balance += currentBet * 2;
        document.getElementById('balance-amount').textContent = balance;
        endGame("Dealer exceeded 21 and busted! You win!");
    } else if (playerValue > dealerValue) {
        balance += currentBet * 2;
        document.getElementById('balance-amount').textContent = balance;
        endGame("You have the higher total. You win!");
    } else if (playerValue < dealerValue) {
        endGame("Dealer's total beats yours. Dealer wins!");
    } else {
        balance += currentBet;
        document.getElementById('balance-amount').textContent = balance;
        endGame("It's a tie! You and dealer are equal.");
    }
}


function hit() {
    playerHand.push(drawCard());
    updateGame(false, false, true);
}

function endGame(message) {
    setTimeout(() => {
        popupOverlay.style.display = "flex";
        popupOverlay.style.zIndex = "100";
        document.getElementById('mes').textContent = '';
        document.getElementById('message').textContent = message;
        document.getElementById('btn-hit').disabled = true;
        document.getElementById('btn-stand').disabled = true;
        // document.getElementById('bet-amount').disabled = false;
        document.getElementById('btn-place-bet').disabled = true;
        document.getElementById('btn-reset-bet').disabled = true;
        document.getElementById('btn-new-game').disabled = false;
        currentBet = 0;
        document.getElementById('current-bet').textContent = `Current Bet: ${currentBet}`;

        showNew();

        if (message === "You have the higher total. You win!" || message === "Dealer exceeded 21 and busted! You win!") {
            document.getElementById('message').innerHTML = `${message} <br><br> <img src="images/trophy1.png" alt="Trophy" id="trophy">`;

            var scalar = 2;
            var unicorn = confetti.shapeFromText({ text: '💵', scalar });

            var defaults = {
            spread: 500,
            ticks: 80,
            gravity: 0,
            decay: 0.96,
            startVelocity: 20,
            shapes: [unicorn],
            scalar
            };

            function shoot() {
            confetti({
                ...defaults,
                particleCount: 30
            });

            confetti({
                ...defaults,
                particleCount: 30,
                flat: true
            });

            confetti({
                ...defaults,
                particleCount: 30,
                scalar: scalar / 2,
                shapes: ['circle']
            });
            }

            setTimeout(shoot, 200);
            setTimeout(shoot, 400);
            setTimeout(shoot, 600);
        }
    }, 500);
}
   
    newGame();

    // Function to show the popup overlay with a message
    newgame.addEventListener("click", () => {
        popupOverlay.style.display = "none";
    });

    // Event listener for closing the popup overlay
    closeButton.addEventListener("click", () => {
        popupOverlay.style.display = "none";
    });

    // Hide the popup overlay when the document is loaded
    document.addEventListener("DOMContentLoaded", () => {
        popupOverlay.style.display = "none";
    });

    function showGameButtons() {
        hitButton.classList.remove("hidden");
        standButton.classList.remove("hidden");
        newGameButton.classList.remove("hidden");
        placeBetButton.classList.add("hidden");
        resetBetButton.classList.add("hidden");
      }
    
      function showBetButtons() {
        hitButton.classList.add("hidden");
        standButton.classList.add("hidden");
        newGameButton.classList.add("hidden");
        placeBetButton.classList.remove("hidden");
        resetBetButton.classList.remove("hidden");
      }

      function showNew(){
        hitButton.classList.add("hidden");
        standButton.classList.add("hidden");
        newGameButton.classList.remove("hidden");
        placeBetButton.classList.add("hidden");
        resetBetButton.classList.add("hidden");
      }

      //Cursor
      
        const cursor = document.querySelector(".cursor");
        window.addEventListener("mousemove", (e) => {
            cursor.style.top = e.pageY + "px";
            cursor.style.left = e.pageX + "px";
        });
