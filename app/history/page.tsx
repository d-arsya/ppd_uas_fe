"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { apiClient, HistoryItem } from "@/lib/api";
import { sentimentUtils } from "@/lib/sentiment";

export default function HistoryPage() {
  const { token } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchHistory();
  }, [page]);

  const fetchHistory = async () => {
    if (!token) return;

    setLoading(true);
    setError("");

    try {
      const response = await apiClient.getHistory(token, page, itemsPerPage);
      setHistory(response.history);
      setTotalPages(response.pages);
      setTotal(response.total);
    } catch (err: any) {
      setError(err.message || "Failed to fetch history");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getSentimentStats = () => {
    const positive = history.filter((h) => h.sentiment === "positive").length;
    const negative = history.filter((h) => h.sentiment === "negative").length;
    const neutral = history.filter((h) => h.sentiment === "neutral").length;
    return { positive, negative, neutral };
  };

  const stats = getSentimentStats();

  return (
    <ProtectedRoute>
      <Navigation />

      <div className="container">
        <div className="card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <div>
              <h1 className="card-title" style={{ marginBottom: "5px" }}>
                📜 Your Prediction History
              </h1>
              <p style={{ color: "#6b7280" }}>
                All your past sentiment analysis results ({total} total
                predictions)
              </p>
            </div>
            <button
              onClick={fetchHistory}
              className="btn btn-primary"
              style={{ padding: "10px 20px" }}
            >
              🔄 Refresh
            </button>
          </div>

          {error && <div className="error">{error}</div>}

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p style={{ marginTop: "15px", color: "#6b7280" }}>
                Loading history...
              </p>
            </div>
          ) : history.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                color: "#6b7280",
              }}
            >
              <div style={{ fontSize: "64px", marginBottom: "20px" }}>📭</div>
              <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>
                No History Yet
              </h3>
              <p style={{ marginBottom: "20px" }}>
                Start analyzing text to build your prediction history
              </p>
              <Link href="/predict">
                <button className="btn btn-primary">
                  🔮 Make Your First Prediction
                </button>
              </Link>
            </div>
          ) : (
            <>
              <div style={{ overflowX: "auto" }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{ width: "60px" }}>ID</th>
                      <th>Text</th>
                      <th style={{ width: "150px" }}>Sentiment</th>
                      <th style={{ width: "200px" }}>Date & Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item) => (
                      <tr key={item.id}>
                        <td style={{ color: "#9ca3af", fontWeight: "600" }}>
                          #{item.id}
                        </td>
                        <td>
                          <p
                            style={{
                              margin: 0,
                              maxWidth: "500px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {item.text}
                          </p>
                        </td>
                        <td>
                          <span
                            className={`sentiment-badge sentiment-${item.sentiment}`}
                          >
                            {sentimentUtils.getEmoji(item.sentiment)}{" "}
                            {sentimentUtils.getLabel(item.sentiment)}
                          </span>
                        </td>
                        <td style={{ color: "#6b7280" }}>
                          {sentimentUtils.formatDate(item.timestamp)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                  >
                    ← Previous
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={page === pageNum ? "active" : ""}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          <div className="card">
            <h3
              style={{
                fontSize: "18px",
                marginBottom: "15px",
                color: "#10b981",
              }}
            >
              😊 Positive
            </h3>
            <p
              style={{
                fontSize: "48px",
                fontWeight: "700",
                color: "#10b981",
                marginBottom: "5px",
              }}
            >
              {stats.positive}
            </p>
            <p style={{ color: "#6b7280", fontSize: "14px" }}>
              predictions on this page
            </p>
          </div>

          <div className="card">
            <h3
              style={{
                fontSize: "18px",
                marginBottom: "15px",
                color: "#ef4444",
              }}
            >
              😔 Negative
            </h3>
            <p
              style={{
                fontSize: "48px",
                fontWeight: "700",
                color: "#ef4444",
                marginBottom: "5px",
              }}
            >
              {stats.negative}
            </p>
            <p style={{ color: "#6b7280", fontSize: "14px" }}>
              predictions on this page
            </p>
          </div>

          <div className="card">
            <h3
              style={{
                fontSize: "18px",
                marginBottom: "15px",
                color: "#6b7280",
              }}
            >
              😐 Neutral
            </h3>
            <p
              style={{
                fontSize: "48px",
                fontWeight: "700",
                color: "#6b7280",
                marginBottom: "5px",
              }}
            >
              {stats.neutral}
            </p>
            <p style={{ color: "#6b7280", fontSize: "14px" }}>
              predictions on this page
            </p>
          </div>

          <div className="card">
            <h3
              style={{
                fontSize: "18px",
                marginBottom: "15px",
                color: "#667eea",
              }}
            >
              📊 Total
            </h3>
            <p
              style={{
                fontSize: "48px",
                fontWeight: "700",
                color: "#667eea",
                marginBottom: "5px",
              }}
            >
              {total}
            </p>
            <p style={{ color: "#6b7280", fontSize: "14px" }}>
              all predictions
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
