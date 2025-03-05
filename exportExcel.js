const fs = require("fs");
const xlsx = require("xlsx");


const jsonData = JSON.parse(fs.readFileSync("test.json", "utf-8"));


const questions = jsonData.quiz.question.filter(q => q._type === "multichoice");

const data = [["Question", "Answer 1", "Answer 2", "Answer 3", "Answer 4", "Answer 5", "Correct Answers"]];

questions.forEach(q => {
    const questionText = q.questiontext.text.replace(/<[^>]+>/g, "").trim(); 

    let answers = q.answer.map(a => a.text.replace(/<[^>]+>/g, "").trim());

    const correctAnswers = q.answer
        .filter(a => parseFloat(a._fraction) > 0) 
        .map(a => a.text.replace(/<[^>]+>/g, "").trim()); 

    while (answers.length < 5) {
        answers.push("");
    }


    data.push([questionText, answers[0], answers[1], answers[2], answers[3], answers[4], correctAnswers.join("\n")]);
});


const wb = xlsx.utils.book_new();
const ws = xlsx.utils.aoa_to_sheet(data);
xlsx.utils.book_append_sheet(wb, ws, "Questions");

xlsx.writeFile(wb, "quiz_questions.xlsx");

console.log("✅ Excel file created: quiz_questions.xlsx");
