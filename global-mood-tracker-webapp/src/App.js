import React, { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase credentials
const supabaseUrl = 'https://yanrhgiateygysckenkf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhbnJoZ2lhdGV5Z3lzY2tlbmtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5ODExOTQsImV4cCI6MjA2NTU1NzE5NH0.baFtpvhBKwq3TJ3dusZQ2-1ru9u0oN_khqRjH4PAZWA';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function App() {
  const [mood, setMood] = useState("");
  const [location, setLocation] = useState("");
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [currentView, setCurrentView] = useState("form"); // "form" or "globe"

  const moods = [
    { name: "Amazing", color: "#10B981", emoji: "🤩" },
    { name: "Great", color: "#3B82F6", emoji: "😊" },
    { name: "Good", color: "#8B5CF6", emoji: "🙂" },
    { name: "Okay", color: "#F59E0B", emoji: "😐" },
    { name: "Meh", color: "#EF4444", emoji: "😕" },
    { name: "Bad", color: "#DC2626", emoji: "😞" },
  ];

  // Geographic coordinates for major cities/regions (simplified)
  const locationCoords = {
    "New York": { lat: 40.7128, lng: -74.0060 },
    "London": { lat: 51.5074, lng: -0.1278 },
    "Tokyo": { lat: 35.6762, lng: 139.6503 },
    "Paris": { lat: 48.8566, lng: 2.3522 },
    "Sydney": { lat: -33.8688, lng: 151.2093 },
    "Mumbai": { lat: 19.0760, lng: 72.8777 },
    "São Paulo": { lat: -23.5505, lng: -46.6333 },
    "Cairo": { lat: 30.0444, lng: 31.2357 },
    "Moscow": { lat: 55.7558, lng: 37.6176 },
    "Beijing": { lat: 39.9042, lng: 116.4074 },
    "Lagos": { lat: 6.5244, lng: 3.3792 },
    "Mexico City": { lat: 19.4326, lng: -99.1332 },
    "Toronto": { lat: 43.6532, lng: -79.3832 },
    "Berlin": { lat: 52.5200, lng: 13.4050 },
    "Bangkok": { lat: 13.7563, lng: 100.5018 },
    "Unknown": { lat: 0, lng: 0 }
  };

  // Load existing moods when component mounts
  useEffect(() => {
    loadMoods();
  }, []);

  const loadMoods = async () => {
    try {
      const { data, error } = await supabase
        .from('moods')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100); // Get more for the map

      if (error) {
        console.error('Error loading moods:', error);
      } else {
        const formattedMoods = data.map(item => ({
          mood: item.mood,
          location: item.location || "Unknown",
          time: new Date(item.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          timestamp: item.created_at
        }));
        setResponses(formattedMoods);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async () => {
    if (mood) {
      setLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('moods')
          .insert([
            {
              mood: mood,
              location: location || null,
            }
          ])
          .select();

        if (error) {
          console.error('Error saving mood:', error);
          alert('Error saving mood. Please try again.');
        } else {
          const newResponse = {
            mood,
            location: location || "Unknown",
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            timestamp: new Date().toISOString()
          };
          setResponses([newResponse, ...responses]);
          setMood("");
          setLocation("");
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error saving mood. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const getMoodData = (moodName) => moods.find((m) => m.name === moodName);

  // Get mood distribution for the globe
  const getMoodDistribution = () => {
    const distribution = {};
    responses.forEach(response => {
      const loc = response.location;
      if (!distribution[loc]) {
        distribution[loc] = {};
        moods.forEach(m => distribution[loc][m.name] = 0);
      }
      distribution[loc][response.mood]++;
    });
    return distribution;
  };

  const getLocationMoodColor = (location, distribution) => {
    const locationData = distribution[location];
    if (!locationData) return "#94a3b8";
    
    let maxCount = 0;
    let dominantMood = "Okay";
    
    Object.entries(locationData).forEach(([mood, count]) => {
      if (count > maxCount) {
        maxCount = count;
        dominantMood = mood;
      }
    });
    
    const moodData = getMoodData(dominantMood);
    return moodData ? moodData.color : "#94a3b8";
  };

  const moodDistribution = getMoodDistribution();

  const WorldMap = () => (
    <div style={{ position: "relative", width: "100%", height: "400px" }}>
      <svg
        viewBox="0 0 800 400"
        style={{ width: "100%", height: "100%", backgroundColor: "#1e293b" }}
      >
        {/* Simple world map representation */}
        <rect width="800" height="400" fill="#1e293b" />
        
        {/* Continents (simplified shapes) */}
        <path d="M100 150 L200 120 L300 140 L250 200 L150 220 Z" fill="#374151" /> {/* Europe */}
        <path d="M300 140 L450 120 L500 180 L400 240 L320 200 Z" fill="#374151" /> {/* Asia */}
        <path d="M80 160 L180 150 L200 200 L120 250 L60 220 Z" fill="#374151" /> {/* Africa */}
        <path d="M20 80 L150 60 L180 120 L50 140 Z" fill="#374151" /> {/* North America */}
        <path d="M40 220 L120 200 L140 280 L80 300 Z" fill="#374151" /> {/* South America */}
        <path d="M550 250 L650 240 L680 290 L580 300 Z" fill="#374151" /> {/* Australia */}
        
        {/* Mood points */}
        {Object.entries(moodDistribution).map(([location, moods]) => {
          const coords = locationCoords[location] || locationCoords["Unknown"];
          if (coords.lat === 0 && coords.lng === 0 && location !== "Unknown") return null;
          
          // Convert lat/lng to SVG coordinates (simplified projection)
          const x = ((coords.lng + 180) / 360) * 800;
          const y = ((90 - coords.lat) / 180) * 400;
          
          const totalMoods = Object.values(moods).reduce((a, b) => a + b, 0);
          const color = getLocationMoodColor(location, moodDistribution);
          const size = Math.max(4, Math.min(20, totalMoods * 2));
          
          return (
            <g key={location}>
              <circle
                cx={x}
                cy={y}
                r={size}
                fill={color}
                opacity={0.8}
                stroke="white"
                strokeWidth="2"
              />
              <circle
                cx={x}
                cy={y}
                r={size + 5}
                fill={color}
                opacity={0.3}
                className="mood-pulse"
              />
              <text
                x={x}
                y={y - size - 10}
                fill="white"
                fontSize="10"
                textAnchor="middle"
                fontWeight="bold"
              >
                {location !== "Unknown" ? location : ""}
              </text>
            </g>
          );
        })}
      </svg>
      
      {/* Legend */}
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          left: "10px",
          backgroundColor: "rgba(0,0,0,0.8)",
          padding: "10px",
          borderRadius: "8px",
          color: "white",
          fontSize: "12px"
        }}
      >
        <div style={{ marginBottom: "5px", fontWeight: "bold" }}>Mood Legend:</div>
        {moods.map(mood => (
          <div key={mood.name} style={{ display: "flex", alignItems: "center", marginBottom: "2px" }}>
            <div
              style={{
                width: "12px",
                height: "12px",
                backgroundColor: mood.color,
                borderRadius: "50%",
                marginRight: "8px"
              }}
            />
            <span>{mood.emoji} {mood.name}</span>
          </div>
        ))}
      </div>
      
      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.2); opacity: 0.4; }
          100% { transform: scale(1); opacity: 0.8; }
        }
        .mood-pulse {
          animation: pulse 2s infinite;
        }
      `}</style>
    </div>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
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
            🌍 Global Mood Tracker
          </h1>
          <p
            style={{
              fontSize: "1.2rem",
              color: "rgba(255,255,255,0.9)",
              margin: "10px 0",
            }}
          >
            Share your mood and see how the world is feeling
          </p>
          
          {/* View Toggle */}
          <div style={{ marginTop: "20px" }}>
            <button
              onClick={() => setCurrentView("form")}
              style={{
                padding: "12px 24px",
                marginRight: "10px",
                backgroundColor: currentView === "form" ? "white" : "rgba(255,255,255,0.2)",
                color: currentView === "form" ? "#667eea" : "white",
                border: "none",
                borderRadius: "25px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              📝 Share Mood
            </button>
            <button
              onClick={() => setCurrentView("globe")}
              style={{
                padding: "12px 24px",
                backgroundColor: currentView === "globe" ? "white" : "rgba(255,255,255,0.2)",
                color: currentView === "globe" ? "#667eea" : "white",
                border: "none",
                borderRadius: "25px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              🌍 Global View
            </button>
          </div>
        </div>

        {currentView === "form" ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
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
                    disabled={loading}
                    style={{
                      display: "block",
                      width: "100%",
                      margin: "8px 0",
                      padding: "15px",
                      backgroundColor: mood === m.name ? m.color : "#f8f9fa",
                      color: mood === m.name ? "white" : "#333",
                      border: mood === m.name ? `3px solid ${m.color}` : "2px solid #e9ecef",
                      borderRadius: "12px",
                      fontSize: "1.1rem",
                      fontWeight: "600",
                      cursor: loading ? "not-allowed" : "pointer",
                      transition: "all 0.2s ease",
                      transform: mood === m.name ? "scale(1.02)" : "scale(1)",
                      opacity: loading ? 0.7 : 1,
                    }}
                  >
                    {m.emoji} {m.name}
                  </button>
                ))}
              </div>

              {/* Location Input */}
              <input
                type="text"
                placeholder="📍 Your city (e.g., New York, London, Tokyo)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "15px",
                  fontSize: "1rem",
                  border: "2px solid #e9ecef",
                  borderRadius: "12px",
                  marginBottom: "20px",
                  outline: "none",
                  transition: "border-color 0.2s ease",
                  opacity: loading ? 0.7 : 1,
                }}
              />

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={!mood || loading}
                style={{
                  width: "100%",
                  padding: "18px",
                  fontSize: "1.2rem",
                  fontWeight: "700",
                  backgroundColor: mood && !loading ? "#667eea" : "#ccc",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  cursor: mood && !loading ? "pointer" : "not-allowed",
                  transition: "all 0.2s ease",
                }}
              >
                {loading ? "✨ Saving..." : mood ? "✨ Share My Mood" : "Select a mood first"}
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
              <h2 style={{ marginTop: "0", color: "#333", fontSize: "1.5rem" }}>
                🌟 Recent Moods ({responses.length})
              </h2>

              {loadingData ? (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "#666" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "15px" }}>⏳</div>
                  <p>Loading moods...</p>
                </div>
              ) : responses.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "#666" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "15px" }}>🎭</div>
                  <p>No responses yet!</p>
                </div>
              ) : (
                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                  {responses.slice(0, 10).map((response, index) => {
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
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <div>
                            <div style={{ fontSize: "1.1rem", fontWeight: "600", color: moodData?.color }}>
                              {moodData?.emoji} {response.mood}
                            </div>
                            <div style={{ color: "#666", fontSize: "0.9rem" }}>
                              📍 {response.location}
                            </div>
                          </div>
                          <div style={{ fontSize: "0.8rem", color: "#999" }}>
                            {response.time}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Globe View */
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "20px",
              padding: "30px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            }}
          >
            <h2 style={{ marginTop: "0", color: "#333", fontSize: "1.5rem", textAlign: "center" }}>
              🌍 Global Mood Map
            </h2>
            <p style={{ textAlign: "center", color: "#666", marginBottom: "30px" }}>
              See how different cities around the world are feeling. Circle size represents activity, color shows dominant mood.
            </p>
            
            {loadingData ? (
              <div style={{ textAlign: "center", padding: "60px", color: "#666" }}>
                <div style={{ fontSize: "3rem", marginBottom: "15px" }}>🌍</div>
                <p>Loading global mood data...</p>
              </div>
            ) : (
              <WorldMap />
            )}
            
            {/* Global Stats */}
            {responses.length > 0 && (
              <div style={{ marginTop: "30px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
                <div style={{ textAlign: "center", padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "12px" }}>
                  <div style={{ fontSize: "2rem", marginBottom: "5px" }}>📊</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#333" }}>{responses.length}</div>
                  <div style={{ color: "#666" }}>Total Responses</div>
                </div>
                <div style={{ textAlign: "center", padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "12px" }}>
                  <div style={{ fontSize: "2rem", marginBottom: "5px" }}>🌍</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#333" }}>
                    {Object.keys(moodDistribution).length}
                  </div>
                  <div style={{ color: "#666" }}>Cities Reporting</div>
                </div>
                <div style={{ textAlign: "center", padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "12px" }}>
                  <div style={{ fontSize: "2rem", marginBottom: "5px" }}>⭐</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#333" }}>
                    {(() => {
                      const moodCounts = {};
                      responses.forEach(r => moodCounts[r.mood] = (moodCounts[r.mood] || 0) + 1);
                      const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];
                      return topMood ? topMood[0] : "N/A";
                    })()}
                  </div>
                  <div style={{ color: "#666" }}>Most Common Mood</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
