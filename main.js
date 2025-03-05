const fs = require('fs');
const readline = require('readline');

// Load quiz data from file
const quizData = JSON.parse(fs.readFileSync('test.json', 'utf8'));

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let score = 0;
let currentQuestionIndex = 0;
const questions = quizData.quiz.question.filter(q => q._type === "multichoice");

function askQuestion() {
    if (currentQuestionIndex >= questions.length) {
        console.log(`Quiz finished! Your score: ${score}/${questions.length}`);
        rl.close();
        return;
    }

    const question = questions[currentQuestionIndex];
    console.log(`\nQuestion ${currentQuestionIndex + 1}: ${question.questiontext.text.replace(/<[^>]*>/g, '')}`);
    question.answer.forEach((ans, index) => {
        console.log(`${index + 1}. ${ans.text.replace(/<[^>]*>/g, '')}`);
    });

    rl.question('Your answer (enter the number): ', (answer) => {
        const selectedIndex = parseInt(answer) - 1;
        if (question.answer[selectedIndex] && question.answer[selectedIndex]._fraction > 0) {
            console.log('Correct!');
            score++;
        } else {
            console.log('Wrong answer.');
        }
        currentQuestionIndex++;
        askQuestion();
    });
}

askQuestion();