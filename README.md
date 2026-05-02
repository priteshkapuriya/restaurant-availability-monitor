# 🍽 Restaurant Availability Monitor

A full-stack application that monitors restaurant availability in real time, compares scheduled (expected) vs live (actual) status, detects mismatches, and visualizes historical trends.

---

## 🚀 Features

* Real-time restaurant availability tracking (via Swiggy public API)
* Scheduled vs Live availability comparison
* Automated monitoring using cron (runs every 2 minutes)
* Mismatch detection with clear visual indicators
* Historical trend visualization (Recharts)
* Persistent storage using SQLite
* Interactive dashboard (React + TypeScript)
* Table-based dashboard for clear comparison of availability states
* Loading states for better user experience

---

## 🧱 Architecture (Simplified View)

Frontend (React + TypeScript)
⬇
Backend (Node.js + Express + Scheduler)
⬇
Swiggy Public API
⬇
SQLite Database (history storage)

---

## ⚙️ Tech Stack

### Backend

* Node.js
* Express
* SQLite
* node-cron (scheduler)

### Frontend

* React
* TypeScript
* Recharts

---

## 🧠 Design Decisions

### Data Source

Swiggy public APIs were used to fetch real-time availability data.

* Initial attempt used menu API (blocked by anti-bot protection)
* Switched to listing API for reliability

---

### Scheduled vs Live Availability

* **Scheduled Status** → Derived from expected operating hours (10 AM – 11 PM)
* **Live Status** → Fetched from Swiggy API

> In production, scheduled availability would come from internal restaurant systems (e.g., POS or scheduling APIs).

---

### Mismatch Detection

Mismatch is calculated as:

Scheduled Status !== Live Status

---

### Data Persistence

Each monitoring run stores a snapshot:

* restaurant_id
* expected status
* actual status
* mismatch
* timestamp

This enables time-series trend analysis.

---

## ⏱ Automated Monitoring

The system uses a scheduler (`node-cron`) to automatically run availability checks every 2 minutes.

This simulates a production monitoring pipeline without requiring manual API triggers.

---

## 📊 Trends Visualization

* Click any restaurant card in the UI
* View historical availability patterns
* Compare scheduled vs live status over time

---

## 🧠 UI Design

The dashboard uses a card-based layout for better readability with a small dataset.

At scale (hundreds or thousands of restaurants), the UI can be adapted to:

* Table-based layout
* Virtualized lists
* Pagination and filtering

---

## 🧪 How to Run Locally

### 1. Clone Repository

git clone https://github.com/priteshkapuriya/restaurant-availability-monitor.git  
cd restaurant-monitor  

---

### 2. Run Backend

cd backend  
npm install  
npm run dev  

Backend runs on:
http://localhost:3001  

> Starts server with auto-reload and scheduled monitoring

---

### 3. Run Frontend

cd frontend  
npm install  
npm run dev  

Frontend runs on:
http://localhost:5173

---

## 📡 API Endpoints

### GET `/check`

Fetch latest availability and store snapshot

### GET `/trends/:id`

Fetch historical trend data for a restaurant

---

## ⚠️ Tradeoffs & Limitations

* Swiggy API is unofficial and may change
* Scheduled availability is simulated (not real schedule)
* Uses node-cron instead of distributed scheduler
* Swiggy listing API does not guarantee multiple outlets from the same restaurant chain
* A best-effort filtering approach is used to select a common chain (e.g., McDonald's), with fallback logic to ensure at least 5 restaurants are always returned
* No real-time notification system implemented

---

## 🔮 Future Improvements

* Replace node-cron with distributed scheduler (queue-based)
* Integrate real opening hours data source
* Add real-time alerting system (Slack/email)
* Support multiple cities
* Add filtering and pagination in UI
* Deploy using Docker + cloud infrastructure

---

## 🧠 Key Learnings

* Handling real-world API restrictions (403, anti-bot)
* Designing systems with imperfect data
* Building full-stack monitoring pipelines
* Balancing simplicity with scalability
* Making practical engineering tradeoffs
