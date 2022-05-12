//define global variables_____________________________________
var timeLeft = 60;
var stopTime = false;
var questionNumber = 0;
var score = 0;
var yourName = "";
var loseTime = false;
var timePenalty = 2;
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
//display score
scoreEl.text(score);
//display timer
timerEl.text(timeLeft);
//create high score array from local storage
var scoreArray = JSON.parse(localStorage.getItem("highScores"));
//check if array is empty and populate it with "empty" if it isnt
if (!scoreArray) {
    scoreArray = [
        {
            'initials': 'Empty',
            'score': 0, 
        },
        {
            'initials': 'Empty',
            'score': 0, 
        },
        {
            'initials': 'Empty',
            'score': 0, 
        },
        {
            'initials': 'Empty',
            'score': 0, 
        },
        {
            'initials': 'Empty',
            'score': 0, 
        },
        {
            'initials': 'Empty',
            'score': 0, 
        },
        {
            'initials': 'Empty',
            'score': 0, 
        },
        {
            'initials': 'Empty',
            'score': 0, 
        },
        {
            'initials': 'Empty',
            'score': 0, 
        },
        {
            'initials': 'Empty',
            'score': 0, 
        }
    ];
    //push to local storage
    localStorage.setItem("highScores", JSON.stringify(scoreArray));
};

//display high scores on page load
displayHighScores();


//when start button is clicked execute this function
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
        var initials = scoreArray[i].initials;
        var oldScore = scoreArray[i].score;
        var scoreEl = $('<li>');
        scoreEl.text(initials + " - " + oldScore);
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
    askQuestion(questionNumber);
};

// function to start timer
function startTimer() {
    timeLeft = 60;
    var timerInterval = setInterval(function() {
        timeLeft--;
        //subtract time for wrong answer
        if (loseTime === true) {
            timeLeft = timeLeft - timePenalty;
            loseTime = false;
        }
        //update timer in window
        timerEl.text(timeLeft);

        //stop game if timer stops or runs out
        if(timeLeft <= 0 || stopTime) {
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
    displayOptions(questionNumber);
};

//function to present answers
function displayOptions(localValue) {
    //get new question
    var currentQuestion = questionObjects[localValue];
    var clickedAnswer = '';
    var clickedButton;
    localValue++;
    //define correct answer and array of possible answers
    var correctAnswer = currentQuestion['answer'];
    var allAnswers = [
        correctAnswer, 
        currentQuestion['wrongAnswer1'],
        currentQuestion['wrongAnswer2'],
        currentQuestion['wrongAnswer3']
    ];
    //randomize array
    allAnswers = allAnswers.sort( ()=>Math.random()-0.5 );
    //display all answers as buttons
    for (i = 0; i < allAnswers.length; i++) {
        var answerEl = $('<button>');
        answerEl.text(allAnswers[i]);
        quizAreaEl.append(answerEl);
    }
    // call function to check answer on click
    $('button').click(function() {
        clickedAnswer = $(this).text();
        checkAnswer(correctAnswer, clickedAnswer);
    });
};

//function to check the answer and populate answer area
function checkAnswer(correct, clicked) {
    var correctness = "";
    //check for correct answer
    if (correct === clicked) {
        score++;
        scoreEl.text(score);
        correctness = "Correct!"
    } else {
        correctness = "Incorrect";
        loseTime = true;
    };
    //display last answer and correctness
    var lastAnswerEL = $('<h3>');
    lastAnswerEL.text('Your last answer was: ' + clicked);
    var correctEL = $('<h2>');
    correctEL.text(correctness);
    answerAreaEl.text('');
    answerAreaEl.append(lastAnswerEL, correctEL);
    //check if there are more questions
    questionNumber++;
    if (questionNumber >= questionObjects.length) {
        stopTime = true;
    } else {
        askQuestion(questionNumber);
    };
};

//function for game ended
function gameOver() {
    //clear quiz area
    quizAreaEl.text('');
    //print game over in quiz area
    var thatsAll = $('<h2>');
    thatsAll.text('Game Over');
    quizAreaEl.append(thatsAll);
    //call function to retreive initials
    checkInitials();
    //creat score object
    var newScoreObject = {
        "initials": yourName,
        "score": score
    };
    //check score against high scores and add to array if top 10
    for (i = 0; i < scoreArray.length; i++) {
        var madeList = false;
        var oldScore = scoreArray[i].score;
        var initails = scoreArray[i].initials;
        if (oldScore <= score) {
            scoreArray.splice(i, 0, newScoreObject);
            scoreArray.splice(10, 1);
            madeList = true;
            break;
        };
    };
    //write new high scores to local memory
    localStorage.setItem("highScores", JSON.stringify(scoreArray));
    //display high scroes
    displayHighScores();
    //append score to end if didnt make top 10
    if (!madeList) {
        var scoreEl = $('<li>');
        scoreEl.text(yourName + " - " + score);
        quizAreaEl.children('ol').append(scoreEl);
    };
    playAgainButton();
};

function checkInitials() {
    //alert to enter initails for score
    yourName = prompt("Enter your initials:");
    if (yourName.length !== 3) {
        alert('Initials must be 3 characters');
        checkInitials();
    };
    yourName = yourName.toUpperCase();
};

function playAgainButton() {
    var playAgainEL = $('<button>');
    playAgainEL.attr('id', 'start-button');
    playAgainEL.text('Play Again?');
    answerAreaEl.text('');
    answerAreaEl.append(playAgainEL); 
    //set behavior for button click
    playAgainEL.on('click', playAgainClick);
};

function playAgainClick(event) {
    event.preventDefault();
    //reset variables
    timeLeft = 60;
    stopTime = false;
    questionNumber = 0;
    score = 0;
    yourName = "";
    loseTime = false;
    //hide button
    startButtonEL = $('#start-button');
    startButtonEL.hide();
    //start game
    startGame();
};


