
$(document).ready(function(){
    var numRight            =  0;
    var numWrong            =  0;
    var currentQuestionNum  =  0;
    var currentChoice;
    var currentRightAnswer;

    var triviaQuestions = []; /* here's the array of objects to store the questions and answers in*/

    /*----------------------------------------------*/
    // Timer Functionality
    /*----------------------------------------------*/
    var intervalID;
    var timer;
    // var timerRunning;
    var msgInterval = 15;

    function startTimer() {
        
            timer=msgInterval;
            intervalID = setInterval(function () {
          
                // console.log(":" + timer);

                if (--timer < 0) {
                    stopTimer();
                }
                $("#myTimer").text("Time Remaining: "+timer);
            }, 1000);
        
    }

    function resetTimer() {
        // console.log("in resetTimer intervalID is "+intervalID);
        clearInterval(intervalID);
        // console.log("resetTimer");
    }

    function stopTimer() {
       
        // console.log("in stopTimer, intervalID is "+intervalID);
        resetTimer();
        // console.log("Stopped Timer");
        // console.log("processing state of play from stopTimer");
        processStateOfPlay(-1,currentRightAnswer);
        // console.log("calling getQandA from stopTimer")
        getQandA();
      
      
      
    }


    /* Utility Functions */


        

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

    /*-------------------------------------*/
    /* Here are the functions that get the questions and answers from OPENTDB, the open trivia database */
    /* process the json that is returned, and load up the triviaQuestions array of objects that we'll use */
    /* to play the game. */

    function getAnswers(incorrectAnswersArray,correctAnswer,correctPos) {
        var j;
        var tempAnswerString="";
        var finalAnswersArray=[];
        

        // console.log("incorrectAnswersArray is ", incorrectAnswersArray);
        // console.log("Correct Answer is ", correctAnswer);
        // console.log("correctPos is ", correctPos);

        correctAnswer = cleanUpString(correctAnswer);
        for (j = 0; j < incorrectAnswersArray.length; j++) {
            // console.log("j is ",j);
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

          // console.log(trivia);
          for (i=0; i<trivia.results.length; i++){
            if (trivia.results[i].type == "multiple") {
                questionString = cleanUpString(trivia.results[i].question);
                // console.log("Question is ",questionString);
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
         // alert("triviaQuestions.length is "+triviaQuestions.length);
         // console.log(triviaQuestions);     
     
    }

    function initGame() {
        
        numRight            =  0;
        numWrong            =  0;
        currentQuestionNum  =  0;

        // console.log("I got here 2");
        // We'll get some questions via ajax from the Open Trivia DB API 
        $.ajax({
          url: "https://opentdb.com/api.php?amount=20&category=23",
          method: "GET"
        }).done(function(trivia) {
            // console.log(trivia);
            initQuestions(trivia); //and store the questions and answers in our triviaQuestions object.
            // console.log(triviaQuestions);      
          
        });

        // Until user clicks the "begin" button, we'll hide the questions, answers, and timer displays
        $("#questionsSection").hide();
        $("#answersSection").hide();
      
    }

    /*-----------------------------------------------*/
    /* Functions to actually play game: present a    */
    /* question and answers, take user's guess,      */
    /* process the guess, keep score, transition to  */
    /* new page.                                     */
    /*-----------------------------------------------*/

    function getQandA() {

        currentQuestionNum++;
        // console.log("in getQandA I have currentQuestionNum = ",currentQuestionNum);
        // console.log("in getQandA I have triviaQuestions.length = "+triviaQuestions.length);
        // alert("in getQandAtriviaQuestions.length is "+triviaQuestions.length);


        if (currentQuestionNum >= triviaQuestions.length) {
            // time to start over with the 0th question
            // console.log("resetting currentQuestionNum");
            currentQuestionNum = 0;
        }

        
        $("#myQuestion").text(triviaQuestions[currentQuestionNum].question);

        for (var i = 0; i<triviaQuestions[currentQuestionNum].answers.length; i++) {
            // console.log("i is ",i);
            var answerID = "#answer"+i;
            // console.log("Current answer is ",triviaQuestions[currentQuestionNum].answers[i]);
            $(answerID).text(triviaQuestions[currentQuestionNum].answers[i]);
        }
        currentRightAnswer = triviaQuestions[currentQuestionNum].correctAnswerNum;
        // console.log("current right answer is ",currentRightAnswer);
        resetTimer();
        startTimer();
        
    }

    function processStateOfPlay(currentChoice,currentRightAnswer) {

        if (currentChoice == currentRightAnswer) {
            numRight++;
            // console.log("Incremented numRight to ",numRight);
            $("#rightAnswers").text("#Right: "+numRight);
        } else {
            numWrong++;
            // console.log("Incremented numWrong to ", numWrong);
            $("#wrongAnswers").text("#Wrong: "+numWrong);
        }


    }


    /*-----------------------------------------------*/
    /* here are the event handling functions.        */
    /*-----------------------------------------------*/

    $(".btnLarge").click(function() {
                    $(this).blur();
                    
                    resetTimer();
                    switch ($(this).attr('id')){
                        
                        case "beginButton":
                            
                            // console.log("beginButton clicked");
                            currentQuestionNum = -1;
                            $("#questionsSection").show();
                            $("#answersSection").show();
                            getQandA();
                            
                            break;

                        case "helpButton":
                          
                            // console.log("helpButton clicked");
                            
                            break;

                        case "answer0":
                        
                            // alert("answer0 clicked");
                            currentChoice  = $(this).attr('value');
                            // console.log("currentChoice is "+currentChoice+" and currentRightAnswer is "+currentRightAnswer);
                            processStateOfPlay(currentChoice,currentRightAnswer);
                            
                            getQandA();
                            
                            break;
                        case "answer1":
                            
                            // console.log("answer1 clicked");
                            currentChoice  = $(this).attr('value');
                            // console.log("currentChoice is "+currentChoice+" and currentRightAnswer is "+currentRightAnswer);
                            processStateOfPlay(currentChoice,currentRightAnswer);
                           
                            getQandA();
                           
                            break;
                        case "answer2":
                            
                            // console.log("answer2 clicked");
                            currentChoice  = $(this).attr('value');
                            // console.log("currentChoice is "+currentChoice+" and currentRightAnswer is "+currentRightAnswer);
                            processStateOfPlay(currentChoice,currentRightAnswer);
                           
                            getQandA();
                            
                            break;
                        case "answer3":
                            
                            // console.log("answer3 clicked");
                            currentChoice  = $(this).attr('value');
                            // console.log("currentChoice is "+currentChoice+" and currentRightAnswer is "+currentRightAnswer);
                            
                            getQandA();
                            
                            break;
                        
                        default:
                            
                            alert("Unknown button!!");
                            getQandA();
                           
                            break;
                    }
                    
    });



    /*-------------------------------------------*/
    /* and here's the code */
    /* that calls the code to initial the game   */
    /*-------------------------------------------*/

    initGame();
});





