let time = 0;
let timeCounter;
let lose;
let level;
let moves = 0;
let pairs = 0;
let is_time;
let difficulty = 0;
let gameArray = [];
let allCards = [];
let actualPairs = [];

for (let x = 1; x <= 35; x++){
    if (x < 10){
        x = "0" + x.toString();
    }
    allCards.push('../cards/card_' + x + '.png');
}

function initGame() {
    const queryString = window.location.search; // zwraca cały url
    const urlParams = new URLSearchParams(queryString); // odcina to co jest po ? wyciąga klucze i wartości
    is_time = urlParams.get('is_time'); // wyciągam konkretną wartość
    level = urlParams.get('level_of_difficulty'); // wyciągam konkretną wartość
    let gameField = document.getElementById("board");
    if (is_time === "yes"){
        create_time(level);
        timeCounter = setInterval(decrease_time, 1000);
        lose = setInterval(lose_with_timeout, 1000);
        displayHighestScoreWithTime();
    }
    else {
        displayHighestScoreWithoutTime();
    }
    pairs = create_pairs(level);
    difficulty = create_pairs(level);
    pairCardsToLevel(difficulty);
    shuffleCards();
    createArr(difficulty, gameField);
    leftClick();
    rightClick();
}

function create_pairs(level){
    if (level === "easy"){
        return  8;
    }
    else if (level === "normal"){
        return  16;
    }
    else if (level === "hard"){
        return  32;
    }
}

function create_time(level){
    if (level === "easy"){
        time = 61;
    }
    else if (level === "normal"){
        time = 301;
    }
    else if (level === "hard"){
        time = 601;
    }
}

function displayHighestScoreWithTime() {
    if (level === 'easy') {
        document.getElementById('highest_score').innerHTML = "<h4>Best time: " + sessionStorage.getItem("timeEasy") + "</h4>";
    }
    else if (level === 'normal') {
        document.getElementById('highest_score').innerHTML = "<h4>Best time: " + sessionStorage.getItem("timeNormal") + "</h4>";
    }
    else if (level === 'hard') {
        document.getElementById('highest_score').innerHTML = "<h4>Best time: " + sessionStorage.getItem("timeHard") + "</h4>";
    }
}


function displayHighestScoreWithoutTime() {
    if (level === 'easy') {
        document.getElementById('highest_score').innerHTML = "<h4>Fewest movements: " + sessionStorage.getItem("movesEasy") + "</h4>";
    }
    else if (level === 'normal') {
        document.getElementById('highest_score').innerHTML = "<h4>Fewest movements: " + sessionStorage.getItem("movesNormal") + "</h4>";
    }
    else if (level === 'hard') {
        document.getElementById('highest_score').innerHTML = "<h4>Fewest movements: " + sessionStorage.getItem("movesHard") + "</h4>";
    }
}


function decrease_time(){
    time -= 1;
    document.getElementsByClassName('time_box')[0].innerHTML = "<h3>Time left: " + time + "</h3>";
}

function decrease_pairs(){
    pairs -= 1;
    if (pairs === 0 && is_time === 'yes'){
        win_with_timeout();
    }
    if (pairs === 0 && is_time === 'no'){
        win_without_timeout();
    }

}

function increase_moves(){
    moves += 1;
    document.getElementsByClassName('move_box')[0].innerHTML = "<h3>Total moves: " + moves + "</h3>";
}

function win_with_timeout(){
    clearInterval(timeCounter);
    clearInterval(lose);
    alert('YOU WIN');
    saveItemToSessionStorageWithTime();
    location.href = 'index.html';

}

function win_without_timeout(){
    alert('YOU WIN');
    saveItemToSessionStorageWithoutTime();
    location.href = 'index.html';
}


function saveItemToSessionStorageWithTime() {

        if (level === 'easy') {
            if (sessionStorage.getItem('time') < time) {
                sessionStorage.removeItem('userNameTimeEasy');
                sessionStorage.removeItem('timeEasy');
                sessionStorage.setItem('userNameTimeEasy', "(nazwa użytkownika)");
                sessionStorage.setItem('timeEasy', time);
            }
        }
        else if (level === 'normal') {
            if (sessionStorage.getItem('time') < time) {
                sessionStorage.removeItem('userNameTimeNormal');
                sessionStorage.removeItem('timeNormal');
                sessionStorage.setItem('userNameTimeNormal', "(nazwa użytkownika)");
                sessionStorage.setItem('timeNormal', time);
            }
        }
        else if (level === 'hard') {
            if (sessionStorage.getItem('time') < time) {
                sessionStorage.removeItem('userNameTimeHard');
                sessionStorage.removeItem('timeHard');
                sessionStorage.setItem('userNameTimeHard', "(nazwa użytkownika)");
                sessionStorage.setItem('timeHard', time);
            }
        }
}

function saveItemToSessionStorageWithoutTime() {
    if (level === 'easy') {
        if (sessionStorage.getItem('movesEasy') < moves) {
            sessionStorage.removeItem('userNameEasy');
            sessionStorage.removeItem('movesEasy');
            sessionStorage.setItem('userNameEasy', "(nazwa użytkownika)");
            sessionStorage.setItem('movesEasy', moves);
        }
    }
    if (level === 'normal') {
        if (sessionStorage.getItem('movesNormal') < moves) {
            sessionStorage.removeItem('userNameNormal');
            sessionStorage.removeItem('movesNormal');
            sessionStorage.setItem('userNameNormal', "(nazwa użytkownika)");
            sessionStorage.setItem('movesNormal', moves);
        }
    }
    if (level === 'hard') {
        if (sessionStorage.getItem('movesHard') < moves) {
            sessionStorage.removeItem('userNameHard');
            sessionStorage.removeItem('movesHard');
            sessionStorage.setItem('userNameHard', "(nazwa użytkownika)");
            sessionStorage.setItem('movesHard', moves);
        }
    }
}


function lose_with_timeout(){
    if (time === 0){
        clearInterval(timeCounter);
        clearInterval(lose);
        alert('TIME IS OVER');
        location.href = 'index.html';
    }
}

function pairCardsToLevel(difficulty) {
    while (gameArray.length < difficulty * 2) {
        let item = allCards[Math.floor(Math.random()*allCards.length)];
        if (!gameArray.includes(item)) {
            gameArray.push(item);
            gameArray.push(item);
        }
    }
}

function shuffleCards() {
    let currentIndex = gameArray.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [gameArray[currentIndex], gameArray[randomIndex]] = [gameArray[randomIndex], gameArray[currentIndex]];
    }
}

function createArr(difficulty, gameField) {
    console.log(difficulty);
    let rows = (difficulty * 2) / 8;
    let cols = (difficulty * 2) / rows;
    for (let row = 0; row < rows; row++) {
        let rowElement = addRow(gameField);
        for (let col = 0; col < cols; col++) {
            addCell(rowElement, row, col, gameArray);
            gameArray.shift();
        }
    }
    // zatrzymanie czasu  zatrzymanie możliwości klikania for??
    // odwrócenie elementów, podmiana obrazka na back.png
}

function addRow(gameField) {
    gameField.insertAdjacentHTML('beforeend',
        `<div class="row"></div>`);
    return gameField.lastElementChild;
}

function addCell(rowElement, row, col, gameArray) {
    rowElement.insertAdjacentHTML('beforeend',
        `<div class="card" data-row="${row}" data-col="${col}" image="${gameArray[0]}"><img src="../cards/back.png"></div>`);
}

function leftClick(){
    const fields = document.querySelectorAll('.board .row .card');
    for (let field of fields) {
            // we add the same event listener for the right click (so called contextmenu) event
            field.addEventListener('click', function (event) {
                // so if you left click on any field...
                let card_image = field.getAttribute('image'); // pobiera atrybut obiektu na który klikamy
                //console.log(card_image)
                field.innerHTML = '<img src=' + card_image +'>';
                actualPairs.push(field);

                if (actualPairs.length === 2){
                    console.dir(document.querySelector('.board'));
                    document.querySelector('.board').style.pointerEvents = 'none'; // zatrzymanie ruuchu na planszy
                    if (actualPairs[0].getAttribute('image') === actualPairs[1].getAttribute('image')){
                        theSameCards();
                    }
                    else {
                        differentCards();
                    }
                    document.querySelector('.board').style.pointerEvents = 'auto'; // wznowienie ruuchu na planszy
                    increase_moves();
                }
            });
        }
}

function rightClick(){
    const fields = document.querySelectorAll('.board .row .card');
    for (let field of fields) {
            // we add the same event listener for the right click (so called contextmenu) event
            field.addEventListener('contextmenu', function (event) {
                // so if you left click on any field...
                event.preventDefault();
            });
        }
}

function theSameCards(){
    for (let card of actualPairs){
        card.style.opacity = 0.3;
        card.style.pointerEvents = 'none'; // turn off clicking on the element
    }
    decrease_pairs();
    actualPairs = []; // czyszczenie tablicy

}

function differentCards(){
    setTimeout(() => {
        for (let card of actualPairs) {
            card.innerHTML = '<img src="../cards/back.png">';
        }
        actualPairs = []; // czyszczenie tablicy
    }, 1000); // wstrzymanie czasu
}
