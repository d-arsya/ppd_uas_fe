"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div>
      <Navigation />

      <div className="container">
        <div className="card">
          <h1 className="card-title">
            Welcome{isAuthenticated && user ? `, ${user.fullname}` : ""} 👋
          </h1>
          <p
            style={{ color: "#6b7280", marginBottom: "30px", fontSize: "18px" }}
          >
            Analyze financial news headlines and predict sentiment with AI
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
              marginTop: "40px",
            }}
          >
            <Link href="/predict" style={{ textDecoration: "none" }}>
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  padding: "30px",
                  borderRadius: "12px",
                  color: "white",
                  cursor: "pointer",
                  transition: "transform 0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-5px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                <div style={{ fontSize: "48px", marginBottom: "15px" }}>🔮</div>
                <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>
                  Predict Sentiment
                </h3>
                <p style={{ opacity: 0.9 }}>
                  Analyze text and get sentiment predictions
                </p>
              </div>
            </Link>

            <Link href="/news" style={{ textDecoration: "none" }}>
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                  padding: "30px",
                  borderRadius: "12px",
                  color: "white",
                  cursor: "pointer",
                  transition: "transform 0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-5px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                <div style={{ fontSize: "48px", marginBottom: "15px" }}>📰</div>
                <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>
                  Latest News
                </h3>
                <p style={{ opacity: 0.9 }}>
                  Browse analyzed financial news headlines
                </p>
              </div>
            </Link>

            <Link href="/history" style={{ textDecoration: "none" }}>
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                  padding: "30px",
                  borderRadius: "12px",
                  color: "white",
                  cursor: "pointer",
                  transition: "transform 0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-5px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                <div style={{ fontSize: "48px", marginBottom: "15px" }}>📜</div>
                <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>
                  Your History
                </h3>
                <p style={{ opacity: 0.9 }}>
                  View your past sentiment predictions
                </p>
              </div>
            </Link>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          <div className="card">
            <h3
              style={{
                fontSize: "18px",
                marginBottom: "15px",
                color: "#667eea",
              }}
            >
              ✨ Features
            </h3>
            <ul
              style={{ listStyle: "none", color: "#6b7280", lineHeight: "2" }}
            >
              <li>• Real-time sentiment analysis</li>
              <li>• Financial news monitoring</li>
              <li>• Prediction history tracking</li>
              <li>• AI-powered insights</li>
            </ul>
          </div>

          <div className="card">
            <h3
              style={{
                fontSize: "18px",
                marginBottom: "15px",
                color: "#f5576c",
              }}
            >
              🎯 How It Works
            </h3>
            <ul
              style={{ listStyle: "none", color: "#6b7280", lineHeight: "2" }}
            >
              <li>1. Enter your text</li>
              <li>2. Click analyze</li>
              <li>3. Get instant results</li>
              <li>4. Review your history</li>
            </ul>
          </div>

          <div className="card">
            <h3
              style={{
                fontSize: "18px",
                marginBottom: "15px",
                color: "#00f2fe",
              }}
            >
              📊 Sentiment Types
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <span className="sentiment-badge sentiment-positive">
                😊 Positive
              </span>
              <span className="sentiment-badge sentiment-negative">
                😔 Negative
              </span>
              <span className="sentiment-badge sentiment-neutral">
                😐 Neutral
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
