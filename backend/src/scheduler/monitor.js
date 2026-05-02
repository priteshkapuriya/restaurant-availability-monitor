const cron = require("node-cron");
const { checkRestaurants } = require("../services/restaurants");

// Scheduler to automatically run monitoring pipeline
// every 2 minutes, simulating a production system
cron.schedule("*/2 * * * *", async () => {
  console.log("⏱ Running scheduled restaurant check...");

  try {
    await checkRestaurants();
    console.log("✅ Check completed");
  } catch (err) {
    console.error("❌ Error in scheduled job:", err.message);
  }
});