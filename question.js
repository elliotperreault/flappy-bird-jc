
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
    input.placeholder = 'Enter your question';
    document.getElementById('centeredDiv').appendChild(input);


    var input = document.createElement('input');
    input.id = 'AnswerInput';
    input.type = 'text';
    input.placeholder = 'Enter your answer';
    document.getElementById('centeredDiv').appendChild(input);





    var button = document.createElement('button');
    button.id = 'button';
    button.textContent = 'OK';
    button.onclick = function () {
        //add content to local storage
        var question = document.getElementById('QuestionInput').value;
        var answer = document.getElementById('AnswerInput').value;
        console.log(question);
        console.log(answer);
        var questionObj = JSON.parse(localStorage.getItem("question"));
        questionObj[question] = answer;
        localStorage.setItem("question", JSON.stringify(questionObj));


        console.log('button clicked');
        document.getElementById('leftSide').removeChild(document.getElementById('centeredDiv'));
        document.getElementById('leftSide').style.pointerEvents = 'auto';

        location.reload();


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
    }


    // Create the add button
    var addButton = document.createElement('div');
    addButton.textContent = 'Add Question';
    addButton.className = 'button';
    addButton.id = 'addQuestion';

    leftSide.appendChild(addButton);

}