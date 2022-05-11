//define global variables_____________________________________
var timeLeft = 10;
var questionNumber = 0;
var quizAreaEl = $('.quiz-area');
var timerEl = $('#timer');
var scoreEl = $('#score');
var answerAreaEl = $('.answer-display');
var startButtonEL = $('#start-button');
//define array of q and a objects
var questionObjects = [
    // question1 
    {
        'question': 'what is 1',
        'answer': '1',
        'wrongAnswer1': 'a',
        'wrongAnswer2': 'b',
        'wrongAnswer3': 'c'
    },
    // question2 
    {
        'question': 'what is 2',
        'answer': '2',
        'wrongAnswer1': 'a',
        'wrongAnswer2': 'b',
        'wrongAnswer3': 'c'
    },
    // question3 
    {
        'question': 'what is 3',
        'answer': '3',
        'wrongAnswer1': 'a',
        'wrongAnswer2': 'b',
        'wrongAnswer3': 'c',
    },
    // question4 
    {
        'question': 'what is 4',
        'answer': '4',
        'wrongAnswer1': 'a',
        'wrongAnswer2': 'b',
        'wrongAnswer3': 'c'
    }
];

//execute____________________________________________________
timerEl.text(timeLeft);
//create high score array from local storage
var scoreArray = JSON.parse(localStorage.getItem("highScores"));
//check if array is empty and populate it with "empty" if it isnt
if (!scoreArray) {
    console.log('its empty');
    scoreArray = [
        'Empty',
        'Empty',
        'Empty',
        'Empty',
        'Empty',
        'Empty',
        'Empty',
        'Empty',
        'Empty',
        'Empty',
    ];
    //push to local storage
    localStorage.setItem("highScores", JSON.stringify(scoreArray));
};

//display high scores on page load
displayHighScores();


//when start button is clicked
startButtonEL.on('click', startButtonClick);





//functions_________________________________________________

//function to display high scores
function displayHighScores() {
    //write score title to quiz area
    var scoreTitleEL = $('<h2>');
    scoreTitleEL.text('High Scores');
    quizAreaEl.append(scoreTitleEL);
    //make ordered list in quiz area and populate it from scoreArray 
    var scoreListEl = $('<ol>');
    scoreListEl.attr('type', '1');
    quizAreaEl.append(scoreListEl);
    for (var i = 0; i < scoreArray.length; i++) {
        var scoreEl = $('<li>');
        scoreEl.text(scoreArray[i]);
        quizAreaEl.children('ol').append(scoreEl);
    };
};

//function for start button behavior
function startButtonClick(event) {
    event.preventDefault();
    startButtonEL.hide();
    startGame();
};

//function for starting game
function startGame() {
    startTimer();
    askQuestion(0);
};

// function to start timer
function startTimer() {
    timeLeft = 10;
    var timerInterval = setInterval(function() {
        timeLeft--;
        timerEl.text(timeLeft);
        console.log(timeLeft);
        
        if(timeLeft === 0) {
            clearInterval(timerInterval);
            gameOver();
        };
    }, 1000);
};

//function to present question
function askQuestion(localValue) {
    //clear quiz area
    quizAreaEl.text('');
    //get new question
    var currentQuestion = questionObjects[localValue];
    localValue++;
    var questionContent = currentQuestion['question'];
    var questionEl = $('<h3>');
    questionEl.text('Question ' + localValue + ': ' + questionContent);
    //display new question
    quizAreaEl.append(questionEl);
    //call function to display options
    displayOptions();
};

//function to present answers
function displayOptions() {
    console.log('possible answers displayed');
};

//function for game ended
function gameOver() {
    console.log('Game Over');
}


// console.log(scoreArray);

