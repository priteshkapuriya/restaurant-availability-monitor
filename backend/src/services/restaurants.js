const db = require("../db/db");
const { fetchRestaurantData } = require("../scraper/swiggy");

// Simulating expected availability since API does not provide
// structured opening hours for all restaurants
// Assumption: restaurants operate between 10 AM – 11 PM
function isExpectedOpen() {
  const hour = new Date().getHours();
  return hour >= 10 && hour <= 23;
}

async function checkRestaurants() {
  const restaurants = await fetchRestaurantData();

  const results = [];

  for (const r of restaurants) {
    const expected = isExpectedOpen();
    const actual = r.isOpen;
    // Mismatch occurs when expected status differs from actual platform status
    const mismatch = expected !== actual;

    // Store snapshot for historical tracking and trend analysis
    db.run(
      `INSERT INTO restaurant_status 
       (restaurant_id, name, expected_open, actual_open, mismatch) 
       VALUES (?, ?, ?, ?, ?)`,
      [r.id, r.name, expected ? 1 : 0, actual ? 1 : 0, mismatch ? 1 : 0],
    );

    results.push({
      id: r.id,
      name: r.name,
      city: r.city,
      link: r.link,
      expectedOpen: expected,
      isOpen: actual,
      mismatch,
    });
  }

  return results;
}

function getRestaurantTrends(restaurantId) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT 
        timestamp,
        expected_open,
        actual_open,
        mismatch
       FROM restaurant_status
       WHERE restaurant_id = ?
       ORDER BY timestamp ASC`,
      [restaurantId],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      },
    );
  });
}

module.exports = { checkRestaurants, getRestaurantTrends };
