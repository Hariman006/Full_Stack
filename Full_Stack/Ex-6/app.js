const express = require('express');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let surveyResponses = [];

const htmlPage = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Share Your Thoughts!</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Poppins', sans-serif;
      background: #fef9f0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .wrapper { width: 100%; max-width: 520px; }

    /* Top illustration bar */
    .top-bar {
      background: linear-gradient(135deg, #ff9a6c, #ff6b9d);
      border-radius: 20px 20px 0 0;
      padding: 2rem;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .top-bar::before {
      content: '';
      position: absolute;
      width: 200px; height: 200px;
      background: rgba(255,255,255,0.1);
      border-radius: 50%;
      top: -60px; right: -40px;
    }

    .top-bar .icon { font-size: 3rem; margin-bottom: 0.5rem; }
    .top-bar h1 { color: #fff; font-size: 1.6rem; font-weight: 700; }
    .top-bar p  { color: rgba(255,255,255,0.85); font-size: 0.9rem; margin-top: 0.3rem; }

    /* Form card */
    .card {
      background: #fff;
      border-radius: 0 0 20px 20px;
      padding: 2rem;
      box-shadow: 0 10px 40px rgba(255,107,157,0.12);
    }

    .field { margin-bottom: 1.2rem; }

    .field label {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.85rem;
      font-weight: 600;
      color: #555;
      margin-bottom: 0.4rem;
    }

    .field input,
    .field select,
    .field textarea {
      width: 100%;
      padding: 0.7rem 1rem;
      border: 2px solid #f0e6ff;
      border-radius: 12px;
      font-family: 'Poppins', sans-serif;
      font-size: 0.9rem;
      color: #333;
      background: #fdfbff;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .field input:focus,
    .field select:focus,
    .field textarea:focus {
      border-color: #ff6b9d;
      box-shadow: 0 0 0 4px rgba(255,107,157,0.1);
    }

    .field textarea { resize: vertical; min-height: 95px; }

    .row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

    /* Mood selector */
    .mood-wrap {
      display: flex;
      justify-content: space-between;
      gap: 0.5rem;
    }

    .mood-wrap input[type="radio"] { display: none; }

    .mood-wrap label {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.3rem;
      padding: 0.6rem 0.3rem;
      border: 2px solid #f0e6ff;
      border-radius: 14px;
      cursor: pointer;
      background: #fdfbff;
      transition: all 0.2s;
      font-size: 0.7rem;
      font-weight: 600;
      color: #aaa;
    }

    .mood-wrap label span.em { font-size: 1.6rem; }

    .mood-wrap input[type="radio"]:checked + label {
      border-color: #ff6b9d;
      background: #fff0f6;
      color: #ff6b9d;
      box-shadow: 0 4px 12px rgba(255,107,157,0.15);
      transform: translateY(-2px);
    }

    .mood-wrap label:hover {
      border-color: #ffb3d1;
      transform: translateY(-2px);
    }

    /* Recommend toggle */
    .toggle-row { display: flex; gap: 0.6rem; }
    .toggle-row input[type="radio"] { display: none; }
    .toggle-row label {
      flex: 1;
      text-align: center;
      padding: 0.55rem;
      border: 2px solid #f0e6ff;
      border-radius: 10px;
      font-size: 0.85rem;
      font-weight: 600;
      color: #aaa;
      cursor: pointer;
      background: #fdfbff;
      transition: all 0.2s;
    }
    .toggle-row input[type="radio"]:checked + label {
      background: #fff0f6;
      border-color: #ff6b9d;
      color: #ff6b9d;
    }

    /* Divider */
    .divider {
      border: none;
      border-top: 2px dashed #f5e6ff;
      margin: 1.4rem 0;
    }

    button[type="submit"] {
      width: 100%;
      padding: 0.9rem;
      background: linear-gradient(135deg, #ff9a6c, #ff6b9d);
      color: #fff;
      font-family: 'Poppins', sans-serif;
      font-size: 1rem;
      font-weight: 700;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      transition: opacity 0.2s, transform 0.15s;
      letter-spacing: 0.02em;
    }

    button[type="submit"]:hover { opacity: 0.9; transform: translateY(-2px); }

    .msg {
      display: none;
      text-align: center;
      margin-top: 1rem;
      padding: 0.9rem;
      border-radius: 12px;
      font-size: 0.9rem;
      font-weight: 600;
    }
    .msg.success { background: #f0fdf4; color: #16a34a; display: block; }
    .msg.error   { background: #fff1f2; color: #e11d48; display: block; }
  </style>
</head>
<body>
  <div class="wrapper">

    <div class="top-bar">
      <div class="icon">&#x1F4AC;</div>
      <h1>We'd love your feedback!</h1>
      <p>It helps us do better — promise it's quick 🙌</p>
    </div>

    <div class="card">
      <form id="surveyForm">

        <div class="row">
          <div class="field">
            <label>👤 Your Name</label>
            <input type="text" name="name" required />
          </div>
          <div class="field">
            <label>📧 Email</label>
            <input type="email" name="email"required />
          </div>
        </div>

        <div class="field">
          <label>🛍️ What did you shop for?</label>
          <select name="category">
            <option value="">Pick a category...</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="groceries">Groceries</option>
            <option value="furniture">Furniture</option>
            <option value="other">Other</option>
          </select>
        </div>

        <hr class="divider"/>

        <div class="field">
          <label>😊 How are you feeling about us?</label>
          <div class="mood-wrap">
            <input type="radio" id="m1" name="rating" value="1">
            <label for="m1"><span class="em">😠</span>Terrible</label>

            <input type="radio" id="m2" name="rating" value="2">
            <label for="m2"><span class="em">😕</span>Bad</label>

            <input type="radio" id="m3" name="rating" value="3">
            <label for="m3"><span class="em">😐</span>Okay</label>

            <input type="radio" id="m4" name="rating" value="4">
            <label for="m4"><span class="em">😊</span>Good</label>

            <input type="radio" id="m5" name="rating" value="5">
            <label for="m5"><span class="em">🤩</span>Loved it!</label>
          </div>
        </div>

        <div class="field">
          <label>✏️ Tell us more!</label>
          <textarea name="feedback" placeholder="What did you like? Anything we can improve?"></textarea>
        </div>

        <div class="field">
          <label>🤝 Would you recommend us to a friend?</label>
          <div class="toggle-row">
            <input type="radio" id="ry" name="recommend" value="Yes"><label for="ry">👍 Definitely!</label>
            <input type="radio" id="rm" name="recommend" value="Maybe"><label for="rm">🤔 Maybe</label>
            <input type="radio" id="rn" name="recommend" value="No"><label for="rn">👎 Not really</label>
          </div>
        </div>

        <button type="submit">Send my feedback 🚀</button>
      </form>

      <div class="msg" id="msgBox"></div>
    </div>

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
        msgBox.textContent = '😅 Please pick a mood first!';
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
          msgBox.textContent = result.error || 'Oops, something went wrong!';
        }
      } catch (err) {
        msgBox.className = 'msg error';
        msgBox.textContent = '😬 Could not reach the server.';
      }
    });
  </script>
</body>
</html>`;

// GET - Serve the survey form
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
    return res.status(400).json({ error: 'Please fill in all required fields!' });
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
    message: `Yay! Thanks for your feedback, ${name}! 🎉`,
    id: response.id
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Survey App running at http://localhost:${port}`);
});