
var timer               = 20;
var msgExpire           =  5;
var questionExpire      = 20;
var pageBeingTimed      = false;

var numRight            =  0;
var numWrong            =  0;
var currentQuestion     =  0;
var currentRightAnswer;
var nextQuestion        =  true;      

var intervalId;

var disableClick;
var i;



function delayTimer(delaySecs) {
    
    if (disableClick == false) {
        // we don't have a timer running, so go ahead and set one
        disableClick = true;
        console.log("delaySecs is ",delaySecs);
        timer = delaySecs;
        console.log("Calling setInterval");
        intervalId = setInterval(countDown, 1000);
        console.log("Back from setInterval");
        
    } else {
      console.log("disableClick was ",disableClick);
    }

}
     

function countDown() {

    console.log("In countDown, timer is ",timer);
    if (pageBeingTimed) {
        $("#myTimer").text("Time Remaining: "+timer);
    }
    timer--;

    console.log("In countDown, timer is ",timer);
    if (pageBeingTimed) {
        $("#myTimer").text("Time Remaining: "+timer);
    }
    if (timer === 0) {
       console.log("Timer counted down to 0");
       

       clearInterval(intervalId);
       disableClick = false;
    }

}



var triviaQuestions = [];
    

function getRandomInteger(lowerLimit,upperLimit){
            return Math.floor(Math.random()*(upperLimit-lowerLimit+1)+lowerLimit);
}

function cleanUpString(inString){
        var cleanString;

        cleanString=inString.replace(/&quot;/g,"\'");
        cleanString=cleanString.replace(/&#039;/g,"\'");
        cleanString=cleanString.replace(/&/g,"");
        cleanString=cleanString.replace(/acute;/g,"");

        return cleanString;
}

function getAnswers(incorrectAnswersArray,correctAnswer,correctPos) {
    var j;
    var tempAnswerString="";
    var finalAnswersArray=[];
    

    console.log("incorrectAnswersArray is ", incorrectAnswersArray);
    console.log("Correct Answer is ", correctAnswer);
    console.log("correctPos is ", correctPos);

    correctAnswer = cleanUpString(correctAnswer);
    for (j = 0; j < incorrectAnswersArray.length; j++) {
        console.log("j is ",j);
        finalAnswersArray.push(cleanUpString(incorrectAnswersArray[j]));
    }

    if (correctPos ==  finalAnswersArray.length) {
        finalAnswersArray.push(correctAnswer);
    } else {
        tempAnswerString = finalAnswersArray[correctPos];
        finalAnswersArray[correctPos] = correctAnswer;
        finalAnswersArray.push(tempAnswerString);
    }

    return(finalAnswersArray);

}

function initQuestions(trivia){
     var i,j;
     var questionString;
     var answerString;
     var correctAnswer;
     var answers=[];
     var correctPos;

      console.log(trivia);
      for (i=0; i<trivia.results.length; i++){
        if (trivia.results[i].type == "multiple") {
            questionString = cleanUpString(trivia.results[i].question);
            console.log("Question is ",questionString);
            correctAnswer = trivia.results[i].correct_answer;

            correctPos = getRandomInteger(0,trivia.results[i].incorrect_answers.length);
            answers = getAnswers(trivia.results[i].incorrect_answers,correctAnswer,correctPos);

            triviaQuestions.push(
                {correctAnswerNum: correctPos,
                 answers: answers,
                 question: questionString,
                }
            );
        }
            
     }
     console.log(triviaQuestions);     
 
}

function initGame() {
    msgTimer         =  5;
    questionTimer    = 20;
    numRight         =  0;
    numWrong         =  0;
    currentQuestion  =  0;

    console.log("I got here 2");
    // We'll get some questions via ajax from the Open Trivia DB API 
    $.ajax({
      url: "https://opentdb.com/api.php?amount=20&category=23",
      method: "GET"
    }).done(function(trivia) {
        console.log(trivia);
        initQuestions(trivia); //and store the questions and answers in our triviaQuestions object.
        console.log(triviaQuestions);      
      
    });

    // Until user clicks the "begin" button, we'll hide the questions, answers, and timer displays
    $("#questionsSection").hide();
    $("#answersSection").hide();
    nextQuestion = false;
    pageBeingTimed = true;
    disableClick = false;
    delayTimer(questionExpire);
}

$(document).ready(function(){
    initGame();
});







/* var triviaGame = {
    
    triviaQ:  [question: "",
               answers: ["","","",""],
               correctAnswerNum: 0;
    ],
    lastInputQuestion=0,
    questionCounter = 0,
    correctlyAnswered = 0,
    incorrectlyAnswered = 0, 
    getRandomInteger: function(lowerLimit,upperLimit){
        return Math.floor(Math.random()*(upperLimit-lowerLimit+1)+lowerLimit);
    },
    ,
    buildTriviaQ: function(results, questionIndex) {
        var question;
        var tmp;
        var correctAnswer;
        var badAnswer;

        question = cleanUpString(results.question);
        this.triviaQ[questionIndex] = question;
        this.triviaQ[questionIndex].correctAnswerNum = getRandomInteger(0,results.incorrect_answers.length+1);
        for (var i=0; i< this.triviaQ[questionIndex].answers.length; i++) {
                badAnswer = cleanUpString(results.incorrect_answers[i]);
                this.triviaQ[questionIndex].answers.push(badAnswer);
        }

        if (this.triviaQ[questionIndex].correctAnswerNum > )


        push.correctAnswerNums(results.)
    }
}




*/
/*
var timer = 5;

var intervalId;

var disableClick;

function delayRestart() {
    // Borrowing code from the interval example from 19 Oct class.
    // We'll count down 5 secs until we restart game.
    // And we'll ignore button clicks while we wait!
      disableClick = true;
      intervalId = setInterval(countDown, 1000);
}

function countDown() {

    timer--;

    $("#userScore").text("You " + crystalGame.stateOfPlay + " -- Game will restart in " + timer + " seconds");

    if (timer === 0) {
       crystalGame.stateOfPlay = "continue";
       timer=5;
       clearInterval(intervalId);
       crystalGame.resetGame();
    }
}

    
// The crystalGame Object, with its properties and methods

	var crystalGame = {
		userWins:               0,
		userLosses:             0,
		amethystVal: 			0,
		emeraldVal:  			0,
		rubyVal:     			0,
		sapphireVal: 			0,
		targetScore:   			0,
		userScore:   			0,
		lowerLimitGame:    	   19,
		upperLimitGame:       120,
        lowerLimitCrystal:      1,
        upperLimitCrystal:     12,
        stateOfPlay:    "continue",

        getRandomInteger: function(lowerLimit,upperLimit){
        	return Math.floor(Math.random()*(upperLimit-lowerLimit+1)+lowerLimit);
        },

        resetGame: function() {
            this.userScore = 0;

            // Init the targetScore to a pseudo-random number in the prescribed range
            this.targetScore = this.getRandomInteger(this.lowerLimitGame,this.upperLimitGame);
           
            // Initialize the gems' values to pseudo-random numbers in the prescribed range
            this.amethystVal = this.getRandomInteger(this.lowerLimitCrystal,this.upperLimitCrystal);
            this.emeraldVal = this.getRandomInteger(this.lowerLimitCrystal,this.upperLimitCrystal);
            this.rubyVal = this.getRandomInteger(this.lowerLimitCrystal,this.upperLimitCrystal);
            this.sapphireVal = this.getRandomInteger(this.lowerLimitCrystal,this.upperLimitCrystal);

            // And put the initial values up on the display
            $("#num2Guess").text(this.targetScore);
            $("#userScore").text("0");
            disableClick = false;
        },

        startGame: function() {
            // First, get initial values for userScore, targetScore and the gems' values
        	this.resetGame();

            this.userWins   = 0;
            this.userLosses = 0; 

            // Display the initial values
        	$("#numWins").text("Wins: 0");
        	$("#numLosses").text("Losses: 0");
        	$("#num2Guess").text(this.targetScore);
        },

        

        processStateOfPlay: function() {
            // This is the logic that determines whether the user won or lost.
            // User wins if the current this.userScore matches the 
            // this.targetScore. If user has won, we increment this.UserWins
            // count, display the updated wins count, and reset the game.
            // User loses if the current this.userScore is greater than
            // this.targetScore.  If user has lost, we increment this.UserLosses,
            // display the updated losses count, and reset the game.
            // If his.userScore is less than this.targetScore, we let user 
            // keep on playing!

            if (this.userScore == this.targetScore){
                this.userWins++;
                $("#numWins").text("Wins: "+this.userWins);
                this.stateOfPlay = "won";
                $("#userScore").text("You " + crystalGame.stateOfPlay + " -- Game will restart in " + timer + " seconds");
                delayRestart();
            } else if (this.userScore > this.targetScore){
                this.userLosses++;
                $("#numLosses").text("Losses: "+this.userLosses);
                this.stateOfPlay = "lost";
                $("#userScore").text("You " + crystalGame.stateOfPlay + " -- Game will restart in " + timer + " seconds");
                delayRestart();
            } else {
                // Don't update the displayed Wins and Losses. Let user
                // continue to play the game.
                this.stateOfPlay = "continue";
            }
        }

	} // End of the crystalGame object

// An on click listener to all elements that have the class "gemstone"
// It updates the score, based on which gem the user clicked, and then
// calls the logic that determines whether user won or lost.
      $(".gemstone").on("click", function() {
        if (disableClick) {

        } else {
                switch ($(this).attr('value')){
                    case "amethyst":
                        crystalGame.userScore += crystalGame.amethystVal;
                        break;
                    case "emerald":
                        crystalGame.userScore += crystalGame.emeraldVal;
                        break;
                    case "ruby":
                        crystalGame.userScore += crystalGame.rubyVal;
                        break;
                    case "sapphire":
                        crystalGame.userScore += crystalGame.sapphireVal;
                        break;
                    default:
                        alert("Unknown gem!!");
                        break;
                }
                $('#userScore').text(crystalGame.userScore);

                // find out whether user won or lost
                crystalGame.processStateOfPlay();
        }
      });

    //Start the game
	crystalGame.startGame();

});*/