const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

let quizResults = [];

app.post('/api/roommate-quiz', (req, res) => {
  const formData = req.body;
  quizResults.push(formData);
  console.log('Received form data:', formData);
  res.status(200).send('Results received successfully!');
});

app.get('/api/roommate-quiz/results', (req, res) => {
  res.json(quizResults);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});