// function showForm() {
//     document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
//     document.getElementById('form').classList.add('active');
// }

// function showResult() {
//     document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
//     document.getElementById('result').classList.add('active');
// }

// function predictPlacement(event) {
//     event.preventDefault();
    
//     const formData = {
//         name: document.getElementById('name').value,
//         cgpa: parseFloat(document.getElementById('cgpa').value),
//         internship: document.getElementById('internship').value === 'Yes',
//         hackathon: document.getElementById('hackathon').value === 'Yes',
//         majorProjects: parseInt(document.getElementById('majorProjects').value),
//         miniProjects: parseInt(document.getElementById('miniProjects').value),
//         communication: parseInt(document.getElementById('communication').value),
//         percentage12: parseFloat(document.getElementById('percentage12').value),
//         percentage10: parseFloat(document.getElementById('percentage10').value),
//         backlog: parseInt(document.getElementById('backlog').value)
//     };

//     // Simple prediction logic (you can make this more sophisticated)
//     let score = 0;
//     score += formData.cgpa * 10;
//     score += formData.internship ? 15 : 0;
//     score += formData.hackathon ? 10 : 0;
//     score += formData.majorProjects * 5;
//     score += formData.miniProjects * 2;
//     score += formData.communication * 4;
//     score += (formData.percentage12 + formData.percentage10) / 20;
//     score -= formData.backlog * 10;

//     const maxScore = 100;
//     const normalizedScore = Math.min(Math.max((score / maxScore) * 100, 0), 100);
    
//     let predictionText, salaryPrediction;
    
//     if (normalizedScore >= 60 && normalizedScore <= 70) {
//         predictionText = `Congratulations ${formData.name}! You have high chances of getting placed!!!`;
//         salaryPrediction = "Your Expected Salary will be INR 4,00,000 per annum";
//     }else if (normalizedScore >= 70 && normalizedScore <= 80) {
//         predictionText = `${formData.name}, you have moderate chances of getting placed.`;
//         salaryPrediction = "Your Expected Salary will be INR 4,50,000 per annum";
//     }
//      else if (normalizedScore >= 80 && normalizedScore <= 90) {
//         predictionText = `${formData.name}, you have moderate chances of getting placed.`;
//         salaryPrediction = "Your Expected Salary will be INR 5,00,000 per annum";
//     }else if (normalizedScore >= 40 && normalizedScore <= 60) {
//         predictionText = `${formData.name}, you have moderate chances of getting placed.`;
//         salaryPrediction = "Your Expected Salary will be INR 3,00,000 per annum";
//     }else if (normalizedScore >= 90) {
//         predictionText = `${formData.name}, you have high chances of getting placed.`;
//         salaryPrediction = "Your Expected Salary will be INR 6 to 9 per annum and vary as per you skills";
//     } 
//     else {
//         predictionText = `${formData.name}, you might need to improve your profile.`;
//         salaryPrediction = "Focus on improving your skills and profile";
//     }

//     document.getElementById('prediction-text').textContent = predictionText;
//     document.getElementById('salary-prediction').textContent = salaryPrediction;
    
//     showResult();
// }

// For python code...

// Make the function globally accessible
window.showForm = function () {
    document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
    document.getElementById('form').classList.add('active');
};


window.predictPlacement = function(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        cgpa: parseFloat(document.getElementById('cgpa').value),
        internship: document.getElementById('internship').value === 'Yes',
        hackathon: document.getElementById('hackathon').value === 'Yes',
        majorProjects: parseInt(document.getElementById('majorProjects').value),
        miniProjects: parseInt(document.getElementById('miniProjects').value),
        communication: parseInt(document.getElementById('communication').value),
        percentage12: parseFloat(document.getElementById('percentage12').value),
        percentage10: parseFloat(document.getElementById('percentage10').value),
        backlog: parseInt(document.getElementById('backlog').value)
    };

    fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
    })
    .then(async response => {
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Unknown error occurred");
        }
        return response.json();
    })
    .then(data => {
        // Directly display the result after prediction
        document.getElementById('prediction-text').textContent = data.prediction;
        document.getElementById('salary-prediction').textContent = data.salary;

        // Automatically show the result section
        document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
        document.getElementById('result').classList.add('active');
    })
    .catch(error => {
        console.error("Error:", error);
        alert(`Error: ${error.message}`);
    });
};
