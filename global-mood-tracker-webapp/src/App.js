import React, { useState } from "react";

export default function App() {
  const [mood, setMood] = useState("");
  const [location, setLocation] = useState("");
  const [responses, setResponses] = useState([]);

  const moods = [
    { name: "Amazing", color: "#10B981", emoji: "🤩" },
    { name: "Great", color: "#3B82F6", emoji: "😊" },
    { name: "Good", color: "#8B5CF6", emoji: "🙂" },
    { name: "Okay", color: "#F59E0B", emoji: "😐" },
    { name: "Meh", color: "#EF4444", emoji: "😕" },
    { name: "Bad", color: "#DC2626", emoji: "😞" },
  ];

  const handleSubmit = () => {
    if (mood) {
      const newResponse = {
        mood,
        location: location || "Unknown",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setResponses([...responses, newResponse]);
      setMood("");
      setLocation("");
    }
  };

  const getMoodData = (moodName) => moods.find((m) => m.name === moodName);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1
            style={{
              fontSize: "3rem",
              color: "white",
              margin: "0",
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            🌍 Global Mood
          </h1>
          <p
            style={{
              fontSize: "1.2rem",
              color: "rgba(255,255,255,0.9)",
              margin: "10px 0",
            }}
          >
            How are you feeling today?
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "30px",
          }}
        >
          {/* Input Side */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "20px",
              padding: "30px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            }}
          >
            <h2 style={{ marginTop: "0", color: "#333", fontSize: "1.5rem" }}>
              Share Your Mood
            </h2>

            {/* Mood Buttons */}
            <div style={{ marginBottom: "25px" }}>
              {moods.map((m) => (
                <button
                  key={m.name}
                  onClick={() => setMood(m.name)}
                  style={{
                    display: "block",
                    width: "100%",
                    margin: "8px 0",
                    padding: "15px",
                    backgroundColor: mood === m.name ? m.color : "#f8f9fa",
                    color: mood === m.name ? "white" : "#333",
                    border:
                      mood === m.name
                        ? `3px solid ${m.color}`
                        : "2px solid #e9ecef",
                    borderRadius: "12px",
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    transform: mood === m.name ? "scale(1.02)" : "scale(1)",
                  }}
                  onMouseOver={(e) => {
                    if (mood !== m.name) {
                      e.target.style.backgroundColor = "#e9ecef";
                      e.target.style.transform = "scale(1.01)";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (mood !== m.name) {
                      e.target.style.backgroundColor = "#f8f9fa";
                      e.target.style.transform = "scale(1)";
                    }
                  }}
                >
                  {m.emoji} {m.name}
                </button>
              ))}
            </div>

            {/* Location Input */}
            <input
              type="text"
              placeholder="📍 Your location (optional)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{
                width: "100%",
                padding: "15px",
                fontSize: "1rem",
                border: "2px solid #e9ecef",
                borderRadius: "12px",
                marginBottom: "20px",
                outline: "none",
                transition: "border-color 0.2s ease",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#667eea")}
              onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
            />

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!mood}
              style={{
                width: "100%",
                padding: "18px",
                fontSize: "1.2rem",
                fontWeight: "700",
                backgroundColor: mood ? "#667eea" : "#ccc",
                color: "white",
                border: "none",
                borderRadius: "12px",
                cursor: mood ? "pointer" : "not-allowed",
                transition: "all 0.2s ease",
                transform: mood ? "scale(1)" : "scale(0.98)",
              }}
              onMouseOver={(e) => {
                if (mood) {
                  e.target.style.backgroundColor = "#5a67d8";
                  e.target.style.transform = "scale(1.02)";
                }
              }}
              onMouseOut={(e) => {
                if (mood) {
                  e.target.style.backgroundColor = "#667eea";
                  e.target.style.transform = "scale(1)";
                }
              }}
            >
              {mood ? "✨ Share My Mood" : "Select a mood first"}
            </button>
          </div>

          {/* Results Side */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "20px",
              padding: "30px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            }}
          >
            <h2
              style={{
                marginTop: "0",
                color: "#333",
                fontSize: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              🌟 Live Responses ({responses.length})
            </h2>

            {responses.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 20px",
                  color: "#666",
                  fontSize: "1.1rem",
                }}
              >
                <div style={{ fontSize: "3rem", marginBottom: "15px" }}>🎭</div>
                <p>No responses yet!</p>
                <p style={{ fontSize: "0.9rem" }}>
                  Be the first to share your mood
                </p>
              </div>
            ) : (
              <div
                style={{
                  maxHeight: "400px",
                  overflowY: "auto",
                  paddingRight: "10px",
                }}
              >
                {responses
                  .slice(-10)
                  .reverse()
                  .map((response, index) => {
                    const moodData = getMoodData(response.mood);
                    return (
                      <div
                        key={index}
                        style={{
                          padding: "15px",
                          marginBottom: "12px",
                          backgroundColor: "#f8f9fa",
                          borderRadius: "12px",
                          borderLeft: `5px solid ${moodData?.color || "#ccc"}`,
                          transition: "transform 0.2s ease",
                        }}
                        onMouseOver={(e) =>
                          (e.target.style.transform = "translateX(5px)")
                        }
                        onMouseOut={(e) =>
                          (e.target.style.transform = "translateX(0px)")
                        }
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                          }}
                        >
                          <div>
                            <div
                              style={{
                                fontSize: "1.1rem",
                                fontWeight: "600",
                                color: moodData?.color || "#333",
                                marginBottom: "5px",
                              }}
                            >
                              {moodData?.emoji} {response.mood}
                            </div>
                            <div
                              style={{
                                color: "#666",
                                fontSize: "0.9rem",
                              }}
                            >
                              📍 {response.location}
                            </div>
                          </div>
                          <div
                            style={{
                              fontSize: "0.8rem",
                              color: "#999",
                            }}
                          >
                            {response.time}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}

            {/* Quick Stats */}
            {responses.length > 0 && (
              <div
                style={{
                  marginTop: "20px",
                  padding: "15px",
                  backgroundColor: "#f1f3f4",
                  borderRadius: "12px",
                }}
              >
                <div style={{ fontSize: "0.9rem", color: "#666" }}>
                  <div>
                    📊 Total responses: <strong>{responses.length}</strong>
                  </div>
                  <div>
                    🕒 Latest:{" "}
                    <strong>{responses[responses.length - 1]?.mood}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
