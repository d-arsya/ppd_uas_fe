"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { apiClient, PredictionResponse } from "@/lib/api";
import { sentimentUtils } from "@/lib/sentiment";

export default function PredictPage() {
  const { token } = useAuth();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState("");

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) {
      setError("Please enter some text to analyze");
      return;
    }

    if (!token) {
      setError("You must be logged in to predict sentiment");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const prediction = await apiClient.predictSentiment(text, token);
      setResult(prediction);
    } catch (err: any) {
      setError(err.message || "Failed to predict sentiment");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setText("");
    setResult(null);
    setError("");
  };

  return (
    <ProtectedRoute>
      <Navigation />

      <div className="container">
        <div className="card">
          <h1 className="card-title">🔮 Sentiment Prediction</h1>
          <p style={{ color: "#6b7280", marginBottom: "30px" }}>
            Enter any text to analyze its sentiment. Perfect for financial news,
            headlines, or any content.
          </p>

          <form onSubmit={handlePredict}>
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                Text to Analyze
              </label>
              <textarea
                className="textarea"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="e.g., The company announced excellent quarterly results..."
                rows={6}
              />
            </div>

            {error && <div className="error">{error}</div>}

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Analyzing..." : "🔍 Analyze Sentiment"}
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="btn"
                style={{ background: "#f3f4f6", color: "#4b5563" }}
              >
                Clear
              </button>
            </div>
          </form>

          {loading && (
            <div className="loading">
              <div className="spinner"></div>
              <p style={{ marginTop: "15px", color: "#6b7280" }}>
                Analyzing sentiment...
              </p>
            </div>
          )}

          {result && (
            <div
              style={{
                marginTop: "30px",
                padding: "30px",
                background: sentimentUtils.getBgColor(result.sentiment),
                borderRadius: "12px",
                border: `3px solid ${sentimentUtils.getColor(
                  result.sentiment
                )}`,
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "64px", marginBottom: "15px" }}>
                  {sentimentUtils.getEmoji(result.sentiment)}
                </div>
                <h2
                  style={{
                    fontSize: "32px",
                    marginBottom: "10px",
                    color: sentimentUtils.getColor(result.sentiment),
                  }}
                >
                  {sentimentUtils.getLabel(result.sentiment)}
                </h2>
                <p style={{ color: "#6b7280", fontSize: "16px" }}>
                  "{result.text}"
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="card-title">💡 Tips for Best Results</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
            }}
          >
            <div
              style={{
                padding: "20px",
                background: "#f9fafb",
                borderRadius: "8px",
              }}
            >
              <h3
                style={{
                  fontSize: "16px",
                  marginBottom: "10px",
                  color: "#667eea",
                }}
              >
                📝 Be Clear
              </h3>
              <p style={{ color: "#6b7280", fontSize: "14px" }}>
                Use complete sentences for more accurate predictions
              </p>
            </div>
            <div
              style={{
                padding: "20px",
                background: "#f9fafb",
                borderRadius: "8px",
              }}
            >
              <h3
                style={{
                  fontSize: "16px",
                  marginBottom: "10px",
                  color: "#667eea",
                }}
              >
                💼 Financial Context
              </h3>
              <p style={{ color: "#6b7280", fontSize: "14px" }}>
                Works best with financial news and business headlines
              </p>
            </div>
            <div
              style={{
                padding: "20px",
                background: "#f9fafb",
                borderRadius: "8px",
              }}
            >
              <h3
                style={{
                  fontSize: "16px",
                  marginBottom: "10px",
                  color: "#667eea",
                }}
              >
                ⚡ Quick Analysis
              </h3>
              <p style={{ color: "#6b7280", fontSize: "14px" }}>
                Get instant results powered by AI sentiment analysis
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: "18px", marginBottom: "15px" }}>
            📚 Example Texts to Try
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {[
              "The company announced excellent quarterly results with record profits.",
              "Stock prices plummeted after disappointing earnings report.",
              "The merger will be completed by end of year pending regulatory approval.",
            ].map((example, idx) => (
              <div
                key={idx}
                onClick={() => setText(example)}
                style={{
                  padding: "15px",
                  background: "#f9fafb",
                  borderRadius: "8px",
                  cursor: "pointer",
                  border: "2px solid transparent",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#667eea";
                  e.currentTarget.style.background = "#eef2ff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "transparent";
                  e.currentTarget.style.background = "#f9fafb";
                }}
              >
                <p style={{ color: "#4b5563", fontSize: "14px" }}>
                  "{example}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
