const express = require("express");
const cors = require("cors");
const { checkRestaurants, getRestaurantTrends } = require("./services/restaurants");

// ✅ Initialize DB
require("./db/db");
require("./scheduler/monitor");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Restaurant Monitor API is running 🚀");
});

// check availability + mismatch
app.get("/check", async (req, res) => {
  const data = await checkRestaurants();
  res.json(data);
});

// Trends API
app.get("/trends/:id", async (req, res) => {
  try {
    const data = await getRestaurantTrends(req.params.id);
    res.json(data);
  } catch (err) {
    console.error(err); // helpful debug
    res.status(500).json({ error: "Failed to fetch trends" });
  }
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});