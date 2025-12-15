"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Navigation() {
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="nav">
      <div className="nav-content">
        <Link href="/" className="nav-brand">
          📊 Sentiment Analysis
        </Link>
        <ul className="nav-links">
          <li>
            <Link
              href="/"
              className={`nav-link ${pathname === "/" ? "active" : ""}`}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/predict"
              className={`nav-link ${pathname === "/predict" ? "active" : ""}`}
            >
              Predict
            </Link>
          </li>
          <li>
            <Link
              href="/news"
              className={`nav-link ${pathname === "/news" ? "active" : ""}`}
            >
              News
            </Link>
          </li>
          <li>
            <Link
              href="/history"
              className={`nav-link ${pathname === "/history" ? "active" : ""}`}
            >
              History
            </Link>
          </li>
        </ul>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          {isAuthenticated ? (
            <>
              <span style={{ color: "#6b7280", fontSize: "14px" }}>
                👤 {user?.fullname}
              </span>
              <button
                onClick={logout}
                className="btn"
                style={{
                  padding: "8px 16px",
                  background: "#fee2e2",
                  color: "#991b1b",
                  fontSize: "14px",
                }}
              >
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login">
                <button
                  className="btn"
                  style={{
                    padding: "8px 16px",
                    background: "#f3f4f6",
                    color: "#4b5563",
                    fontSize: "14px",
                  }}
                >
                  Sign In
                </button>
              </Link>
              <Link href="/register">
                <button
                  className="btn btn-primary"
                  style={{
                    padding: "8px 16px",
                    fontSize: "14px",
                  }}
                >
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
