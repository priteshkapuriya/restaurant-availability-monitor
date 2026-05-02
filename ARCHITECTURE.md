# 🧱 Production Architecture & System Design

## 📌 Overview

This system is designed to monitor restaurant availability at scale, detect mismatches between expected and actual states, and notify operations teams in near real-time.

The current implementation demonstrates a simplified version of this pipeline, while the architecture outlines how it would scale in production.

---

## 🏗 Proposed Production Architecture

```
Scheduler (Cron / Queue Trigger)
        ↓
Worker Service (Node.js / Python)
        ↓
External APIs (Swiggy)
        ↓
Message Queue (Kafka / SQS)
        ↓
Processing Service
        ↓
Database (PostgreSQL / Time-series DB)
        ↓
Notification Service
        ↓
Frontend Dashboard (React)
```

---

## 🔄 System Flow

1. A scheduler triggers periodic jobs (every 1–5 minutes)
2. Worker service fetches availability data for restaurants
3. Data is pushed into a message queue
4. Processing service:

   * Computes expected vs actual availability
   * Detects mismatches
5. Results are:

   * Stored in database
   * Sent to notification service if mismatch detected
6. Frontend fetches data via API for visualization

---

## ⚙️ Current Implementation (Assignment)

* **Scheduler**: Implemented using `node-cron` (runs every 2 minutes)
* **Worker + Processing**: Combined in Express backend (`checkRestaurants`)
* **Data Source**: Swiggy listing API
* **Database**: SQLite (local persistence)
* **Frontend**: React dashboard with card-based UI and trends visualization

---

## 🧩 Components

### 1. Frontend

* Built with React + TypeScript
* Table-based dashboard for clear comparison of availability states
* Displays:

  * Restaurant name, location, and link
  * Scheduled (expected) vs Live (actual) status
  * Mismatch indicators
  * Trend charts (Recharts)
* Includes loading states and interaction handling

---

### 2. Backend

* Node.js + Express server
* Responsibilities:

  * Fetch restaurant data
  * Compute expected availability
  * Detect mismatches
  * Store historical snapshots
  * Expose REST APIs

---

### 3. Scheduler

* Uses `node-cron` for periodic execution
* Runs monitoring job every 2 minutes
* Simulates a production pipeline trigger

---

### 4. Scraper Layer

* Integrates with Swiggy public APIs
* Extracts:

  * Restaurant metadata (name, location, link)
  * Availability status
* Handles nested API response parsing

---

### 5. Database (SQLite)

* Stores time-series snapshots
* Enables trend analysis
* Schema includes:

  * restaurant_id
  * expected_open
  * actual_open
  * mismatch
  * timestamp

---

## ⚙️ Resilience Strategy

* **Retry Mechanisms**: Failed API calls retried (can be extended)
* **Decoupling (Production)**: Message queue separates ingestion and processing
* **Idempotency**: Avoid duplicate writes (can be added via keys)
* **Fallback Handling**: Use last known state if API fails
* **Horizontal Scaling**: Worker services scale independently

---

## 📊 Data Currency at Scale (10,000+ Restaurants)

To maintain near real-time accuracy:

* Partition restaurants into batches (e.g., 500–1000 per worker)
* Use parallel workers for concurrent processing
* Schedule frequent checks (1–5 minutes)
* Use queue-based ingestion to avoid bottlenecks

Example:

* 10,000 restaurants
* 10 workers × 1,000 restaurants
* Full cycle completed within minutes

---

## 🚨 Real-Time Notification System

When mismatch is detected:

1. Processing service publishes event
2. Notification service consumes event
3. Alerts sent via:

   * Email
   * Slack / Webhooks
   * Dashboard indicators

Enhancements:

* Deduplication to avoid alert spam
* Severity-based alerts
* Rate limiting

---

## 💾 Data Storage Design

Recommended for production:

* PostgreSQL (relational + indexing)
* OR Time-series DB (e.g., TimescaleDB)

Optimizations:

* Index on restaurant_id + timestamp
* Partitioning for large datasets

---

## 💰 Cost Considerations (10,000 Restaurants)

### Components:

* Compute (workers)
* Message Queue
* Database
* External API calls

### Cost Strategy:

* Use auto-scaling workers (serverless or containers)
* Batch processing to reduce API overhead
* Optimize polling intervals

Estimated:

* Low to moderate cost (tens to low hundreds USD/month depending on frequency)

---

## 🔗 How Current Code Fits

| Production Component | Current Implementation |
| -------------------- | ---------------------- |
| Scheduler            | node-cron              |
| Worker Service       | Express backend        |
| Processing Logic     | Service layer          |
| Database             | SQLite                 |
| Frontend             | React dashboard        |

---

## ⚠️ Limitations

* Relies on unofficial Swiggy APIs
* Expected availability is simulated (not real schedule)
* Single-node deployment (no distributed scaling)
* No real-time notification system implemented
* Limited dataset (sample restaurants)
* Public APIs do not reliably provide multiple outlets from a single restaurant chain
* A best-effort filtering approach is used in the current implementation
* In production, this would be replaced with a curated dataset or internal source to guarantee chain consistency

---

## 🔮 Future Enhancements

* Replace node-cron with distributed scheduler (e.g., queue-based triggers)
* Introduce message queue (Kafka / SQS)
* Replace SQLite with PostgreSQL
* Implement alerting system (Slack/email)
* Add pagination/filtering for large datasets
* Deploy using Docker + cloud infrastructure

---

## 🧠 UI Scalability Consideration

The current UI uses a card-based layout optimized for a small dataset.

At scale (hundreds or thousands of restaurants), the UI would transition to:

* Table-based layout or virtualized list
* Pagination and filtering
* Search capabilities

---

## 🧠 Summary

The system demonstrates a complete monitoring pipeline with:

* Automated data ingestion
* Availability comparison logic
* Persistent storage
* Trend visualization
* Scalable production design approach

Designed with simplicity for local execution and extensibility for production scale.
