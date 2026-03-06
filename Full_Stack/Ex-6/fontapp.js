const express = require('express');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// In-memory storage
let surveyResponses = [];

const htmlPage = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Customer Survey</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Merienda:wght@400;600;700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Merienda', cursive;
      background: #f5f0e8;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .card {
      background: #fff;
      border-radius: 16px;
      padding: 2.5rem;
      max-width: 560px;
      width: 100%;
      box-shadow: 0 8px 40px rgba(0,0,0,0.10);
    }
    h1 { font-family: 'Merienda', cursive; font-weight: 700; font-size: 2rem; color: #1a1a1a; margin-bottom: 0.3rem; }
    .subtitle { color: #888; font-size: 0.95rem; margin-bottom: 2rem; }
    .form-group { margin-bottom: 1.3rem; }
    label { display: block; font-weight: 600; font-size: 0.9rem; color: #333; margin-bottom: 0.4rem; }
    input, select, textarea {
      width: 100%; padding: 0.65rem 1rem; border: 1.5px solid #ddd;
      border-radius: 8px; font-family: 'Merienda', cursive; font-size: 0.95rem;
      color: #1a1a1a; background: #fafafa; transition: border-color 0.2s; outline: none;
    }
    input:focus, select:focus, textarea:focus { border-color: #c9a96e; background: #fff; }
    textarea { resize: vertical; min-height: 90px; }
    .stars { display: flex; flex-direction: row-reverse; gap: 6px; margin-top: 0.3rem; }
    .stars input[type="radio"] { display: none; }
    .stars label { font-size: 2rem; color: #ddd; cursor: pointer; transition: color 0.15s; margin: 0; }
    .stars label:hover, .stars label:hover ~ label,
    .stars input[type="radio"]:checked ~ label { color: #f5a623; }
    .radio-row { display: flex; gap: 1.5rem; margin-top: 0.3rem; }
    .radio-row label { display: flex; align-items: center; gap: 0.4rem; font-weight: 400; cursor: pointer; }
    .radio-row input[type="radio"] { width: auto; accent-color: #c9a96e; }
    button[type="submit"] {
      width: 100%; padding: 0.85rem; background: #1a1a1a; color: #fff;
      font-family: 'Merienda', cursive; font-size: 1rem; font-weight: 600;
      border: none; border-radius: 8px; cursor: pointer; margin-top: 0.5rem;
      letter-spacing: 0.03em; transition: background 0.2s;
    }
    button[type="submit"]:hover { background: #c9a96e; }
    .msg { margin-top: 1.2rem; padding: 0.85rem 1rem; border-radius: 8px; font-size: 0.95rem; display: none; }
    .msg.success { background: #eaf7ee; color: #2d7a3a; display: block; }
    .msg.error   { background: #fdecea; color: #c0392b; display: block; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Customer Survey</h1>
    <p class="subtitle">We value your feedback. It only takes a minute!</p>
    <form id="surveyForm">
      <div class="form-group">
        <label for="name">Full Name *</label>
        <input type="text" id="name" name="name" placeholder="John Smith" required />
      </div>
      <div class="form-group">
        <label for="email">Email Address *</label>
        <input type="email" id="email" name="email" placeholder="john@email.com" required />
      </div>
      <div class="form-group">
        <label for="category">Product / Service Category</label>
        <select id="category" name="category">
          <option value="">-- Select Category --</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="groceries">Groceries</option>
          <option value="furniture">Furniture</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div class="form-group">
        <label>Overall Rating *</label>
        <div class="stars">
          <input type="radio" id="s5" name="rating" value="5"><label for="s5">&#9733;</label>
          <input type="radio" id="s4" name="rating" value="4"><label for="s4">&#9733;</label>
          <input type="radio" id="s3" name="rating" value="3"><label for="s3">&#9733;</label>
          <input type="radio" id="s2" name="rating" value="2"><label for="s2">&#9733;</label>
          <input type="radio" id="s1" name="rating" value="1"><label for="s1">&#9733;</label>
        </div>
      </div>
      <div class="form-group">
        <label for="feedback">Your Feedback *</label>
        <textarea id="feedback" name="feedback" placeholder="Tell us about your experience..."></textarea>
      </div>
      <div class="form-group">
        <label>Would you recommend us?</label>
        <div class="radio-row">
          <label><input type="radio" name="recommend" value="Yes"> Yes</label>
          <label><input type="radio" name="recommend" value="No"> No</label>
          <label><input type="radio" name="recommend" value="Maybe"> Maybe</label>
        </div>
      </div>
      <button type="submit">Submit Feedback</button>
    </form>
    <div class="msg" id="msgBox"></div>
  </div>
  <script>
    document.getElementById('surveyForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      const form = e.target;
      const msgBox = document.getElementById('msgBox');
      msgBox.className = 'msg';
      msgBox.textContent = '';
      const rating = form.querySelector('input[name="rating"]:checked');
      if (!rating) {
        msgBox.className = 'msg error';
        msgBox.textContent = 'Please select a star rating.';
        return;
      }
      const data = {
        name: form.name.value,
        email: form.email.value,
        rating: rating.value,
        category: form.category.value,
        feedback: form.feedback.value,
        recommend: (form.querySelector('input[name="recommend"]:checked') || {}).value || 'Not specified'
      };
      try {
        const res = await fetch('/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const result = await res.json();
        if (result.success) {
          msgBox.className = 'msg success';
          msgBox.textContent = result.message;
          form.reset();
        } else {
          msgBox.className = 'msg error';
          msgBox.textContent = result.error || 'Something went wrong.';
        }
      } catch (err) {
        msgBox.className = 'msg error';
        msgBox.textContent = 'Could not connect to server.';
      }
    });
  </script>
</body>
</html>`;

// GET - Serve the survey form (HTML embedded in JS)
app.get('/', (req, res) => {
  res.send(htmlPage);
});

// GET - View all submitted responses
app.get('/responses', (req, res) => {
  res.json({ total: surveyResponses.length, responses: surveyResponses });
});

// POST - Handle survey submission
app.post('/submit', (req, res) => {
  const { name, email, rating, category, feedback, recommend } = req.body;

  if (!name || !email || !rating || !feedback) {
    return res.status(400).json({ error: 'Please fill in all required fields.' });
  }

  const response = {
    id: surveyResponses.length + 1,
    name, email,
    rating: parseInt(rating),
    category, feedback, recommend,
    submittedAt: new Date().toISOString()
  };

  surveyResponses.push(response);
  console.log('New response:', response);

  res.json({
    success: true,
    message: `Thank you, ${name}! Your feedback has been recorded.`,
    id: response.id
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Customer Survey App running at http://localhost:${port}`);
});