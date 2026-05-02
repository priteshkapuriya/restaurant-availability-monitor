const axios = require("axios");

// Using Swiggy listing API.
// Aggregating restaurants from all sections,
// applying best-effort same-chain filtering,
// and ensuring fallback to maintain stability.

async function fetchRestaurantData() {
  try {
    const url =
      "https://www.swiggy.com/dapi/restaurants/list/v5?lat=23.0225&lng=72.5714";

    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const cards = response.data?.data?.cards || [];

    let allRestaurants = [];

    cards.forEach((c) => {
      const restaurants =
        c?.card?.card?.gridElements?.infoWithStyle?.restaurants;

      if (restaurants) {
        allRestaurants.push(...restaurants.map((r) => r.info));
      }
    });

    // Normalize helper
    const normalize = (str) =>
      str.toLowerCase().replace(/[^a-z0-9]/g, "");

    const target = normalize("mcdonald");

    const filtered = allRestaurants.filter((r) =>
      normalize(r.name).includes(target)
    );

    // Safe fallback using IDs
    const selectedIds = new Set(filtered.map((r) => r.id));

    const remaining = allRestaurants.filter(
      (r) => !selectedIds.has(r.id)
    );

    const selected = [
      ...filtered,
      ...remaining.slice(0, 5 - filtered.length)
    ].slice(0, 5);

    return selected.map((r) => ({
      id: r.id,
      name: r.name,
      city: r.areaName,

      link: `https://www.swiggy.com/restaurants/${r.name
        .toLowerCase()
        .replace(/\s+/g, "-")}-${r.id}`,

      isOpen: r.availability?.opened || false,
      nextCloseTime: r.availability?.nextCloseTime || null
    }));
  } catch (error) {
    console.error("Error fetching Swiggy data:", error.message);
    return [];
  }
}

module.exports = { fetchRestaurantData };