const fs = require('fs');

const units = [1, 2, 3, 4, 5];

units.forEach(id => {
    try {
        const data = JSON.parse(fs.readFileSync(`public/data/unit${id}.json`, 'utf8'));
        const content = data[`unit${id}`] || data;
        const quiz = content.quiz || [];

        console.log(`Checking Unit ${id}: ${quiz.length} questions`);

        quiz.forEach((q, idx) => {
            let issues = [];
            if (q.correctAnswer === undefined) issues.push("MISSING 'correctAnswer'");
            if (typeof q.correctAnswer !== 'number') issues.push(`INVALID 'correctAnswer' type: ${typeof q.correctAnswer}`);
            if (!q.explanation) issues.push("MISSING 'explanation'");
            if (!q.options || q.options.length === 0) issues.push("MISSING or EMPTY 'options'");

            if (issues.length > 0) {
                console.log(`  Question ${idx}: ${issues.join(', ')}`);
                // console.log(JSON.stringify(q, null, 2));
            }
        });
    } catch (e) {
        console.error(`Error reading/parsing Unit ${id}:`, e.message);
    }
});
