const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Log requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Contact Form Endpoint
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields: name, email, message" });
  }

  // Simulated Database Save
  console.log(`\n--- NEW CONTACT SUBMISSION ---`);
  console.log(`Name: ${name}`);
  console.log(`Email: ${email}`);
  console.log(`Message: ${message}`);
  console.log(`------------------------------\n`);

  return res.status(200).json({ success: true, message: "Connection established successfully." });
});

// AI Agent Proxy Chat Endpoint
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    console.log(`Proxying message to AI agent: "${message}"`);
    // Connect to Python agent running on port 8000
    const agentResponse = await fetch('http://127.0.0.1:8000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!agentResponse.ok) {
      const errText = await agentResponse.text();
      console.error(`Agent error response: ${errText}`);
      throw new Error(`Python agent returned status ${agentResponse.status}`);
    }

    const data = await agentResponse.json();
    return res.status(200).json({ reply: data.reply });
  } catch (err) {
    console.error("Failed to proxy request to AI Agent:", err.message);
    return res.status(502).json({
      error: "Bad Gateway",
      reply: "Sorry, I am having trouble connecting to the barbell racks right now. Please verify that the Python agent service is active."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Iron Core Express Server listening on port ${PORT}`);
});
