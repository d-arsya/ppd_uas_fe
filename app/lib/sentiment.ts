// lib/sentiment.ts
export type Sentiment = "positive" | "negative" | "neutral";

export const sentimentUtils = {
  // Get color for sentiment
  getColor(sentiment: Sentiment): string {
    switch (sentiment) {
      case "positive":
        return "#10b981"; // green
      case "negative":
        return "#ef4444"; // red
      case "neutral":
        return "#6b7280"; // gray
      default:
        return "#6b7280";
    }
  },

  // Get background color for sentiment
  getBgColor(sentiment: Sentiment): string {
    switch (sentiment) {
      case "positive":
        return "#d1fae5"; // light green
      case "negative":
        return "#fee2e2"; // light red
      case "neutral":
        return "#f3f4f6"; // light gray
      default:
        return "#f3f4f6";
    }
  },

  // Get emoji for sentiment
  getEmoji(sentiment: Sentiment): string {
    switch (sentiment) {
      case "positive":
        return "😊";
      case "negative":
        return "😔";
      case "neutral":
        return "😐";
      default:
        return "😐";
    }
  },

  // Get label for sentiment
  getLabel(sentiment: Sentiment): string {
    return sentiment.charAt(0).toUpperCase() + sentiment.slice(1);
  },

  // Format date
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  },
};
