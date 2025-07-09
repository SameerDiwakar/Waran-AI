const fetch = require('node-fetch');

const HEALTH_URL = 'https://waran-ai.onrender.com/health';
const INTERVAL = 5 * 60 * 1000; // 5 minutes in ms

async function pingHealth() {
  try {
    const res = await fetch(HEALTH_URL);
    if (res.ok) {
      const data = await res.json();
    //   console.log(`[Health Ping] Success:`, data);
    } else {
      console.error(`[Health Ping] Failed: Status ${res.status}`);
    }
  } catch (err) {
    console.error('[Health Ping] Error:', err.message);
  }
}

// Initial ping
pingHealth();
// Ping every 5 minutes
setInterval(pingHealth, INTERVAL); 