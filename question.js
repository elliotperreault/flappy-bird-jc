
loadQuestion();
document.getElementById("addQuestion").addEventListener("click", () => {
    ReturnAlert("question")
})



function ReturnAlert(question = "question") {

    var div = document.createElement('div');
    div.id = 'centeredDiv';
    div.textContent = question;
    document.getElementById('leftSide').appendChild(div);


    var input = document.createElement('input');
    input.id = 'QuestionInput';
    input.type = 'text';
    input.maxLength = 47;
    input.minLength = 1;
    input.placeholder = 'Enter your question';
    document.getElementById('centeredDiv').appendChild(input);


    var input = document.createElement('input');
    input.id = 'AnswerInput';
    input.type = 'text';
    input.minLength = 1;
    input.placeholder = 'Enter your answer';
    input.maxLength = 31;
    document.getElementById('centeredDiv').appendChild(input);





    var button = document.createElement('button');
    button.id = 'button';
    button.textContent = 'OK';
    button.onclick = function () {
        //add content to local storage
        var question = document.getElementById('QuestionInput').value;
        var answer = document.getElementById('AnswerInput').value;
        if (question === "" || answer === "") {
            return loadWarning("You can't leave a blank field")
        }



        var questionObj = JSON.parse(localStorage.getItem("question"));



        if (Object.keys(questionObj).length >= 15) {
            loadWarning("You can't add more than 15 questions")
            console.log("You can't add more than 15 questions")
        } else {
            questionObj[question] = answer;
            localStorage.setItem("question", JSON.stringify(questionObj));
            document.getElementById('leftSide').removeChild(document.getElementById('centeredDiv'));
            document.getElementById('leftSide').style.pointerEvents = 'auto';

            location.reload();
        }



    }
    document.getElementById('centeredDiv').appendChild(button);


    var button = document.createElement('button');
    button.id = 'button';
    button.textContent = 'Cancel';
    button.onclick = function () {
        console.log('button clicked');
        document.getElementById('leftSide').removeChild(document.getElementById('centeredDiv'));
        document.getElementById('leftSide').style.pointerEvents = 'auto';
    }
    document.getElementById('centeredDiv').appendChild(button);





    document.getElementById('leftSide').style.pointerEvents = 'none';
}

function loadQuestion() {
    leftSide = document.getElementById('leftSide')
    leftSide.innerHTML = '<h1>QUIZ</h1><hr/>';

    try {
        question = localStorage.getItem("question");
        if (question === null) {
            throw "error";
        }
        question = JSON.parse(question);
    } catch {
        localStorage.setItem("question", "{}");
    }

    //for each question in local storage
    for (var key in question) {
        // Create the outer div
        var itemDiv = document.createElement('div');
        itemDiv.className = 'item';

        // Create the question div
        var questionDiv = document.createElement('div');
        questionDiv.className = 'question';
        questionDiv.textContent = key;

        // Create the answer div
        var answerDiv = document.createElement('div');
        answerDiv.className = 'answer';
        answerDiv.textContent = question[key];

        // Append the question and answer divs to the item div
        itemDiv.appendChild(questionDiv);
        itemDiv.appendChild(answerDiv);

        // Append the item div to the list
        leftSide.appendChild(itemDiv);


        itemDiv.addEventListener('click', function (e) {
            //delete the question
            var questionObj = JSON.parse(localStorage.getItem("question"));
            delete questionObj[e.target.parentElement.getElementsByClassName('question')[0].textContent];
            localStorage.setItem("question", JSON.stringify(questionObj));

            //delete item from page
            leftSide.removeChild(e.target.parentElement);
        })

    }


    // Create the add button
    var addButton = document.createElement('div');
    addButton.textContent = 'Add Question';
    addButton.className = 'button';
    addButton.id = 'addQuestion';

    leftSide.appendChild(addButton);



}

function loadWarning(warnMessage) {
    if (document.getElementById('warning') == null) {
        var warning = document.createElement('div');
        warning.id = 'warning';
        warning.textContent = warnMessage;
        document.getElementById('centeredDiv').appendChild(warning);
        setTimeout(() => {
            document.getElementById('centeredDiv').removeChild(document.getElementById('warning'));
        }, 1000);
    }
}

