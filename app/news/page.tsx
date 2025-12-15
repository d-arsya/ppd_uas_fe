"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { apiClient, NewsItem } from "@/lib/api";
import { sentimentUtils } from "@/lib/sentiment";

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchNews();
  }, [page]);

  const fetchNews = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiClient.getNews(page, itemsPerPage);
      setNews(response.news);
      setTotalPages(response.pages);
      setTotal(response.total);
    } catch (err: any) {
      setError(err.message || "Failed to fetch news");
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

  return (
    <div>
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
                📰 Latest News
              </h1>
              <p style={{ color: "#6b7280" }}>
                Financial news headlines with sentiment analysis ({total} total
                articles)
              </p>
            </div>
            <button
              onClick={fetchNews}
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
                Loading news...
              </p>
            </div>
          ) : (
            <>
              <div>
                {news.map((item) => (
                  <div key={item.article_id} className="news-item">
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="news-image"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    )}
                    <div className="news-content">
                      <h3 className="news-title">{item.title}</h3>
                      <p className="news-description">{item.description}</p>
                      <div className="news-meta">
                        <span
                          className={`sentiment-badge sentiment-${item.sentiment}`}
                        >
                          {sentimentUtils.getEmoji(item.sentiment)}{" "}
                          {sentimentUtils.getLabel(item.sentiment)}
                        </span>
                        <span>
                          📅 {sentimentUtils.formatDate(item.pubDate)}
                        </span>
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "#667eea",
                            textDecoration: "none",
                            fontWeight: "600",
                          }}
                        >
                          Read more →
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
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
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
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
              😊 Positive News
            </h3>
            <p
              style={{
                fontSize: "32px",
                fontWeight: "700",
                color: "#10b981",
                marginBottom: "5px",
              }}
            >
              {news.filter((n) => n.sentiment === "positive").length}
            </p>
            <p style={{ color: "#6b7280", fontSize: "14px" }}>
              articles on this page
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
              😔 Negative News
            </h3>
            <p
              style={{
                fontSize: "32px",
                fontWeight: "700",
                color: "#ef4444",
                marginBottom: "5px",
              }}
            >
              {news.filter((n) => n.sentiment === "negative").length}
            </p>
            <p style={{ color: "#6b7280", fontSize: "14px" }}>
              articles on this page
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
              😐 Neutral News
            </h3>
            <p
              style={{
                fontSize: "32px",
                fontWeight: "700",
                color: "#6b7280",
                marginBottom: "5px",
              }}
            >
              {news.filter((n) => n.sentiment === "neutral").length}
            </p>
            <p style={{ color: "#6b7280", fontSize: "14px" }}>
              articles on this page
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
