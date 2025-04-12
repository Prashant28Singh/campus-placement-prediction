from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import pymysql

app = Flask(__name__)
CORS(app)

# Database connection
db = pymysql.connect(
    host="localhost",
    user="root",
    password="prashant",
    database="placement_db",
    cursorclass=pymysql.cursors.DictCursor
)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json

        # Insert into database
        with db.cursor() as cursor:
            sql = """INSERT INTO students 
                     (name, cgpa, internship, hackathon, majorProjects, miniProjects, communication, percentage12, percentage10, backlog) 
                     VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
            
            cursor.execute(sql, (
                data["name"], data["cgpa"], data["internship"], data["hackathon"],
                data["majorProjects"], data["miniProjects"], data["communication"],
                data["percentage12"], data["percentage10"], data["backlog"]
            ))
            db.commit()

        # Prediction logic
        score = (
            (data["cgpa"] * 10) + 
            (15 if data["internship"] else 0) + 
            (10 if data["hackathon"] else 0) + 
            (data["majorProjects"] * 5) + 
            (data["miniProjects"] * 2) + 
            (data["communication"] * 4) + 
            ((data["percentage12"] + data["percentage10"]) / 20) - 
            (data["backlog"] * 10)
        )

        normalized_score = min(max((score / 100) * 100, 0), 100)

        if 60 <= normalized_score <= 70:
            prediction = f"Congratulations {data['name']}! You have high chances of getting placed!"
            salary = "Expected Salary: INR 4,00,000 per annum"
        elif 70 < normalized_score <= 80:
            prediction = f"{data['name']}, you have moderate chances of getting placed."
            salary = "Expected Salary: INR 4,50,000 per annum"
        elif 80 < normalized_score <= 90:
            prediction = f"{data['name']}, you have good chances of getting placed."
            salary = "Expected Salary: INR 5,00,000 per annum"
        elif 40 <= normalized_score < 60:
            prediction = f"{data['name']}, you have average chances of getting placed."
            salary = "Expected Salary: INR 3,00,000 per annum"
        elif normalized_score > 90:
            prediction = f"{data['name']}, you have excellent chances of getting placed!"
            salary = "Expected Salary: INR 6 to 9 LPA, depending on your skills"
        else:
            prediction = f"{data['name']}, you might need to improve your profile."
            salary = "Focus on improving your skills."

        return jsonify({"prediction": prediction, "salary": salary})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Internal Server Error", "message": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
