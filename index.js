const express = require('express');
const axios = require('axios');
const schedule = require('node-schedule');
const path = require('path');

const app = express();
const port = 3000;

// Serve static files (CSS, images)
app.use(express.static(path.join(__dirname, 'public')));

// URLs to monitor
const websiteURL = 'https://5692d43c-f3be-4d97-a69b-869d65461f29-00-2v9a9zfcc3f13.riker.replit.dev/';
const botURL = 'https://ninjabot.betteruptime.com/';

let websiteStatus = 'Unknown';
let botStatus = 'Unknown';
let lastChecked = 'Not yet checked';

// Function to check the status of the website and bot
async function checkWebsiteStatus() {
  try {
    const response = await axios.get(websiteURL);
    websiteStatus = response.status === 200 ? 'Online' : 'Down';
  } catch (error) {
    websiteStatus = 'Down';
  }

  try {
    const response = await axios.get(botURL);
    botStatus = response.status === 200 ? 'Online' : 'Down';
  } catch (error) {
    botStatus = 'Down';
  }

  lastChecked = new Date().toLocaleString();
  console.log(`Checked status at: ${lastChecked}`);
}

// Schedule the check to run every minute
schedule.scheduleJob('*/1 * * * *', checkWebsiteStatus);

// Serve the status page (static HTML)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'views', 'index.html')); // Ensure this path is correct
});

// Return status as JSON
app.get('/status', (req, res) => {
  res.json({
    websiteStatus,
    botStatus,
    lastChecked
  });
});

// 404 handler - after all other routes
app.get('*', (req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'src', 'views', '404.html')); // Ensure this path is correct
});

// Start the server
app.listen(port, () => {
  console.log(`Status page is running at http://localhost:${port}`);
  checkWebsiteStatus(); // Initial check on startup
});
