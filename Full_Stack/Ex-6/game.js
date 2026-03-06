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
  <title>Player Feedback</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Press+Start+2P&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Poppins', sans-serif;
      background: #fef9f0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      background-image:
        radial-gradient(circle at 15% 20%, rgba(255,154,108,0.12) 0%, transparent 40%),
        radial-gradient(circle at 85% 80%, rgba(255,107,157,0.12) 0%, transparent 40%);
    }

    .wrapper { width: 100%; max-width: 540px; }

    /* ── TOP HEADER ── */
    .top-bar {
      background: linear-gradient(135deg, #ff9a6c, #ff6b9d);
      border-radius: 20px 20px 0 0;
      padding: 2rem 2rem 1.5rem;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    /* pixel grid overlay */
    .top-bar::before {
      content: '';
      position: absolute; inset: 0;
      background-image:
        linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px);
      background-size: 28px 28px;
    }

    .top-bar::after {
      content: '';
      position: absolute;
      width: 180px; height: 180px;
      background: rgba(255,255,255,0.08);
      border-radius: 50%;
      top: -60px; right: -40px;
    }

    .lives {
      font-size: 1.3rem;
      letter-spacing: 0.3rem;
      margin-bottom: 0.6rem;
      position: relative; z-index: 1;
    }

    .top-bar h1 {
      font-family: 'Press Start 2P', monospace;
      color: #fff;
      font-size: 1.05rem;
      line-height: 1.7;
      text-shadow: 3px 3px 0 rgba(0,0,0,0.2);
      position: relative; z-index: 1;
    }

    .top-bar h1 span { color: #fff3b0; }

    .score-bar {
      display: flex;
      justify-content: center;
      gap: 1.5rem;
      margin-top: 1rem;
      position: relative; z-index: 1;
    }

    .score-item {
      background: rgba(0,0,0,0.18);
      border-radius: 8px;
      padding: 0.35rem 0.9rem;
      font-family: 'Press Start 2P', monospace;
      font-size: 0.55rem;
      color: #fff3b0;
      letter-spacing: 0.05em;
    }

    /* ── CARD ── */
    .card {
      background: #fff;
      border-radius: 0 0 20px 20px;
      padding: 2rem;
      box-shadow: 0 10px 40px rgba(255,107,157,0.13);
      border: 3px solid transparent;
      border-top: none;
      background-clip: padding-box;
    }

    /* section label */
    .section-tag {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-family: 'Press Start 2P', monospace;
      font-size: 0.5rem;
      color: #ff6b9d;
      background: #fff0f6;
      border: 2px solid #ffc8de;
      border-radius: 6px;
      padding: 0.35rem 0.7rem;
      margin-bottom: 1rem;
      letter-spacing: 0.06em;
    }

    .field { margin-bottom: 1.1rem; }

    .field label {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.82rem;
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

    .field textarea { resize: vertical; min-height: 90px; }

    .row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

    /* ── HEALTH BAR RATING ── */
    .hp-row {
      display: flex;
      justify-content: space-between;
      gap: 0.4rem;
    }

    .hp-row input[type="radio"] { display: none; }

    .hp-row label {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.3rem;
      padding: 0.6rem 0.2rem;
      border: 2px solid #f0e6ff;
      border-radius: 12px;
      cursor: pointer;
      background: #fdfbff;
      transition: all 0.2s;
      font-size: 0.62rem;
      font-weight: 700;
      color: #bbb;
      font-family: 'Press Start 2P', monospace;
      text-align: center;
      line-height: 1.5;
    }

    .hp-row label .em { font-size: 1.5rem; font-family: 'Poppins', sans-serif; }

    .hp-row input[type="radio"]:checked + label {
      border-color: #ff6b9d;
      background: #fff0f6;
      color: #ff6b9d;
      box-shadow: 0 4px 14px rgba(255,107,157,0.2);
      transform: translateY(-3px);
    }

    .hp-row label:hover { border-color: #ffb3d1; transform: translateY(-2px); color: #ff9a6c; }

    /* hp bar under emoji */
    .hp-fill {
      width: 100%;
      height: 5px;
      border-radius: 99px;
      background: #f0e6ff;
      overflow: hidden;
    }

    .hp-fill div {
      height: 100%;
      border-radius: 99px;
      background: linear-gradient(90deg, #ff9a6c, #ff6b9d);
    }

    /* ── RECOMMEND BUTTONS ── */
    .btn-row { display: flex; gap: 0.6rem; }
    .btn-row input[type="radio"] { display: none; }
    .btn-row label {
      flex: 1;
      text-align: center;
      padding: 0.6rem 0.4rem;
      border: 2px solid #f0e6ff;
      border-radius: 10px;
      font-size: 0.8rem;
      font-weight: 700;
      color: #bbb;
      cursor: pointer;
      background: #fdfbff;
      transition: all 0.2s;
      font-family: 'Press Start 2P', monospace;
      line-height: 1.6;
    }
    .btn-row input[type="radio"]:checked + label {
      background: #fff0f6;
      border-color: #ff6b9d;
      color: #ff6b9d;
      box-shadow: 0 4px 12px rgba(255,107,157,0.15);
    }

    /* ── DIVIDER ── */
    .divider {
      border: none;
      border-top: 2px dashed #ffd6ea;
      margin: 1.4rem 0;
    }

    /* ── SUBMIT ── */
    button[type="submit"] {
      width: 100%;
      padding: 0.95rem;
      background: linear-gradient(135deg, #ff9a6c, #ff6b9d);
      color: #fff;
      font-family: 'Press Start 2P', monospace;
      font-size: 0.7rem;
      font-weight: 400;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      transition: opacity 0.2s, transform 0.15s;
      letter-spacing: 0.05em;
      line-height: 1.8;
      box-shadow: 0 5px 0 #d94e7a;
      position: relative;
      top: 0;
    }

    button[type="submit"]:hover { opacity: 0.92; top: 2px; box-shadow: 0 3px 0 #d94e7a; }
    button[type="submit"]:active { top: 5px; box-shadow: 0 0px 0 #d94e7a; }

    /* ── MESSAGE ── */
    .msg {
      display: none;
      text-align: center;
      margin-top: 1rem;
      padding: 0.9rem;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 600;
      font-family: 'Press Start 2P', monospace;
      line-height: 1.8;
    }
    .msg.success { background: #f0fdf4; color: #16a34a; display: block; }
    .msg.error   { background: #fff1f2; color: #e11d48; display: block; }
  </style>
</head>
<body>
  <div class="wrapper">

    <div class="top-bar">
      <div class="lives">❤️ ❤️ ❤️</div>
      <h1>SHARE YOUR<br/><span>THOUGHTS!</span></h1>
      <div class="score-bar">
        <div class="score-item">LEVEL 01</div>
        <div class="score-item">FEEDBACK QUEST</div>
        <div class="score-item">XP +100</div>
      </div>
    </div>

    <div class="card">
      <form id="surveyForm">

        <div class="section-tag">▶ PLAYER INFO</div>
        <div class="row">
          <div class="field">
            <label>👤 Player Name</label>
            <input type="text" name="name" placeholder="Enter username" required />
          </div>
          <div class="field">
            <label>📧 Email</label>
            <input type="email" name="email" placeholder="you@mail.com" required />
          </div>
        </div>
        <div class="field">
          <label>🛍️ Quest Category</label>
          <select name="category">
            <option value="">Select your quest...</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="groceries">Groceries</option>
            <option value="furniture">Furniture</option>
            <option value="other">Other</option>
          </select>
        </div>

        <hr class="divider"/>

        <div class="section-tag">▶ RATE YOUR RUN</div>
        <div class="field">
          <div class="hp-row">
            <input type="radio" id="m1" name="rating" value="1">
            <label for="m1">
              <span class="em">😠</span>
              <div class="hp-fill"><div style="width:20%"></div></div>
              RAGE<br/>QUIT
            </label>

            <input type="radio" id="m2" name="rating" value="2">
            <label for="m2">
              <span class="em">😕</span>
              <div class="hp-fill"><div style="width:40%"></div></div>
              GAME<br/>OVER
            </label>

            <input type="radio" id="m3" name="rating" value="3">
            <label for="m3">
              <span class="em">😐</span>
              <div class="hp-fill"><div style="width:60%"></div></div>
              RESPAWN
            </label>

            <input type="radio" id="m4" name="rating" value="4">
            <label for="m4">
              <span class="em">😊</span>
              <div class="hp-fill"><div style="width:80%"></div></div>
              HIGH<br/>SCORE
            </label>

            <input type="radio" id="m5" name="rating" value="5">
            <label for="m5">
              <span class="em">🤩</span>
              <div class="hp-fill"><div style="width:100%"></div></div>
              LEGENDARY
            </label>
          </div>
        </div>

        <hr class="divider"/>

        <div class="section-tag">▶ DROP YOUR REVIEW</div>
        <div class="field">
          <label>✏️ Mission Report</label>
          <textarea name="feedback" placeholder="Tell us what happened on your quest..."></textarea>
        </div>

        <div class="field">
          <label>🤝 Invite a friend to this quest?</label>
          <div class="btn-row">
            <input type="radio" id="ry" name="recommend" value="Yes"><label for="ry">👍<br/>YES!</label>
            <input type="radio" id="rm" name="recommend" value="Maybe"><label for="rm">🤔<br/>MAYBE</label>
            <input type="radio" id="rn" name="recommend" value="No"><label for="rn">👎<br/>NOPE</label>
          </div>
        </div>

        <button type="submit">▶ SUBMIT &amp; CLAIM XP 🚀</button>
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
        msgBox.textContent = '⚠ SELECT YOUR RATING FIRST!';
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
          msgBox.textContent = result.error || 'MISSION FAILED. TRY AGAIN!';
        }
      } catch (err) {
        msgBox.className = 'msg error';
        msgBox.textContent = 'SERVER OFFLINE. RECONNECTING...';
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
    return res.status(400).json({ error: 'ALL FIELDS REQUIRED, PLAYER!' });
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
    message: `+100 XP EARNED! THANKS ${name.toUpperCase()}! 🎉`,
    id: response.id
  });
});

app.listen(port, () => {
  console.log(`Survey App running at http://localhost:${port}`);
});