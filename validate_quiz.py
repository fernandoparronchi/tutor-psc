import json
import os

def validate_unit(unit_id):
    filename = f"public/data/unit{unit_id}.json"
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Handle nested structure unitX.quiz or just unitX root
        content = data.get(f"unit{unit_id}", data)
        quiz = content.get("quiz", [])
        
        print(f"Checking Unit {unit_id}: {len(quiz)} questions")
        
        issues = []
        for idx, q in enumerate(quiz):
            q_issues = []
            
            # Check correctAnswer
            if "correctAnswer" not in q:
                q_issues.append("MISSING 'correctAnswer'")
            elif not isinstance(q["correctAnswer"], int):
                q_issues.append(f"INVALID 'correctAnswer' type: {type(q['correctAnswer'])}")
            
            # Check options
            if "options" not in q or not isinstance(q["options"], list) or len(q["options"]) < 2:
                 q_issues.append("INVALID 'options'")
            elif isinstance(q["correctAnswer"], int) and (q["correctAnswer"] < 0 or q["correctAnswer"] >= len(q["options"])):
                 q_issues.append(f"correctAnswer {q['correctAnswer']} out of bounds (options: {len(q['options'])})")

            # Check explanation
            if "explanation" not in q:
                q_issues.append("MISSING 'explanation'")
            elif not isinstance(q["explanation"], str) or not q["explanation"].strip():
                # Allow empty explanation? The user says "algunas me dicen... y otras no", implying emptiness is the issue.
                q_issues.append("EMPTY 'explanation'")

            if q_issues:
                issues.append(f"  Question {idx}: {', '.join(q_issues)}")
        
        if issues:
            print(f"ISSUES FOUND IN UNIT {unit_id}:")
            for i in issues:
                print(i)
        else:
            print(f"Unit {unit_id} OK")

    except Exception as e:
        print(f"Error processing Unit {unit_id}: {e}")

for i in range(1, 6):
    validate_unit(i)
