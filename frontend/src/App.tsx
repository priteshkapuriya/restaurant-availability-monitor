import { useEffect, useState, useRef } from "react";
import axios from "axios";
import TrendChart from "./components/TrendChart";
import type { Restaurant, Trend } from "./types";
import "./App.css";

const API = "http://localhost:3001";

function App() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selected, setSelected] = useState<Restaurant | null>(null);
  const [trendData, setTrendData] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(false);
  const [trendLoading, setTrendLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const chartRef = useRef<HTMLDivElement | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/check`);
      setRestaurants(res.data);
      setLastUpdated(new Date().toLocaleTimeString());
    } finally {
      setLoading(false);
    }
  };

  const fetchTrends = async (id: string) => {
    setTrendLoading(true);
    try {
      const res = await axios.get(`${API}/trends/${id}`);
      setTrendData(res.data);
    } finally {
      setTrendLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container">
      {!loading && restaurants.length === 0 && (
        <div className="loader">No data available</div>
      )}
      <h1 className="title">🍽 Restaurant Monitor</h1>

      <div className="button-wrapper">
        <button className="button" disabled={loading} onClick={fetchData}>
          {loading ? "Refreshing..." : "Refresh Data"}
        </button>
      </div>

      <div className="table-wrapper">
        {loading ? (
          <div className="loader">Loading restaurants...</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Link</th>
                <th>Expected</th>
                <th>Actual</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {restaurants.map((r) => (
                <tr
                  key={r.id}
                  className={`row ${r.mismatch ? "row-mismatch" : "row-ok"}`}
                  onClick={() => {
                    setSelected(r);
                    fetchTrends(r.id);

                    setTimeout(() => {
                      chartRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                      });
                    }, 100);
                  }}
                >
                  <td>{r.name}</td>
                  <td>{r.city}</td>
                  <td>
                    <a href={r.link} target="_blank" rel="noreferrer">
                      View
                    </a>
                  </td>

                  <td className={r.expectedOpen ? "open" : "closed"}>
                    {r.expectedOpen ? "🟢 Open" : "🔴 Closed"}
                  </td>

                  <td className={r.isOpen ? "open" : "closed"}>
                    {r.isOpen ? "🟢 Open" : "🔴 Closed"}
                  </td>

                  <td className="status-text">
                    {r.mismatch ? "⚠️ Issue" : "✅ On Track"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {!loading && lastUpdated && (
        <p className="subtitle">Last updated at {lastUpdated}</p>
      )}

      {selected && (
        <div ref={chartRef} className="chart-section fixed-chart">
          <h2>📊 Trends: {selected.name}</h2>

          <div className="chart-container">
            <TrendChart data={trendData} />

            {trendLoading && (
              <div className="chart-overlay">
                Loading trends...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
