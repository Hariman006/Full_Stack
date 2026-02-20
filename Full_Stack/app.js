const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

const style = `
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #1e1e1e; font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
    .card { background: #2b2b2b; border: 1px solid #3a3a3a; border-radius: 16px; padding: 2rem; width: 100%; max-width: 400px; box-shadow: 0 8px 32px rgba(0,0,0,0.4); }
    h1 { color: #93C572; font-size: 1.8rem; margin-bottom: 0.4rem; }
    p { color: #888; font-size: 0.85rem; margin-bottom: 1.5rem; }
    label { display: block; color: #ccc; font-size: 0.82rem; margin-bottom: 0.3rem; margin-top: 1rem; }
    input { width: 100%; padding: 0.7rem 1rem; background: #3a3a3a; border: 1.5px solid #444; border-radius: 8px; color: #f0f0f0; font-size: 0.95rem; outline: none; }
    input:focus { border-color: #93C572; }
    button { width: 100%; margin-top: 1.5rem; padding: 0.85rem; background: #93C572; color: #1e1e1e; border: none; border-radius: 8px; font-size: 1rem; font-weight: bold; cursor: pointer; }
    button:hover { background: #a8d88a; }
    .result { font-size: 2.5rem; font-weight: bold; color: #93C572; text-align: center; margin: 1rem 0; }
    .category { text-align: center; background: #3a3a3a; border-radius: 8px; padding: 0.6rem 1rem; color: #ccc; font-size: 0.95rem; margin-bottom: 1.5rem; }
    .info { display: flex; justify-content: space-between; color: #888; font-size: 0.8rem; margin-bottom: 1.5rem; }
    a { display: block; text-align: center; color: #93C572; text-decoration: none; border: 1.5px solid #93C572; border-radius: 8px; padding: 0.7rem; }
    a:hover { background: rgba(147,197,114,0.1); }
  </style>
`;

app.get("/", (req, res) => {
  res.send(`<!DOCTYPE html><html><head><title>BMI Calculator</title>${style}</head><body>
    <div class="card">
      <h1>BMI Calculator</h1>
      <p>Enter your details to find your Body Mass Index.</p>
      <form action="/bmicalculator" method="POST">
        <label>Name</label>
        <input type="text" name="name" placeholder="Your name" required>
        <label>Height (in meters)</label>
        <input type="number" name="height" step="0.01" placeholder="e.g. 1.75" required>
        <label>Weight (in kg)</label>
        <input type="number" name="weight" step="0.1" placeholder="e.g. 70" required>
        <button type="submit">Calculate BMI</button>
      </form>
    </div>
  </body></html>`);
});

app.post("/bmicalculator", (req, res) => {
  const name = req.body.name;
  const height = parseFloat(req.body.height);
  const weight = parseFloat(req.body.weight);

  if (!name || isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
    return res.send(`<!DOCTYPE html><html><head>${style}</head><body>
      <div class="card"><h1>Invalid Input</h1><p>Please enter valid values.</p><a href="/">Go Back</a></div>
    </body></html>`);
  }

  const bmi = (weight / (height * height)).toFixed(2);
  const category = bmi < 18.5 ? "Underweight" : bmi < 24.9 ? "Normal Weight" : bmi < 29.9 ? "Overweight" : "Obese";

  res.send(`<!DOCTYPE html><html><head><title>Your Result</title>${style}</head><body>
    <div class="card">
      <h1>Hello, ${name}!</h1>
      <p>Here are your BMI results.</p>
      <div class="result">${bmi}</div>
      <div class="category">Category: <strong>${category}</strong></div>
      <div class="info"><span>Height: ${height} m</span><span>Weight: ${weight} kg</span></div>
      <a href="/">← Calculate Again</a>
    </div>
  </body></html>`);
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));