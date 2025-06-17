import React, { useState, useEffect } from "react";

// ... (rest of your imports and createClient/supabase setup)

export default function App() {
  // ... (your existing state and functions)

  return (
    <> {/* This is a React Fragment */}
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)",
          padding: "20px",
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <h1
              style={{
                fontSize: "3rem",
                color: "white",
                margin: "0",
                textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              💙 How Are We Feeling Today?
            </h1>
            <p
              style={{
                fontSize: "1.2rem",
                color: "rgba(255,255,255,0.9)",
                margin: "10px 0",
              }}
            >
              Share how you're feeling and see how the world is doing
            </p>
            
            <div style={{ marginTop: "20px" }}>
              <button
                onClick={() => setCurrentView("form")}
                style={{
                  padding: "12px 24px",
                  marginRight: "10px",
                  backgroundColor: currentView === "form" ? "white" : "rgba(255,255,255,0.2)",
                  color: currentView === "form" ? "#1e40af" : "white",
                  border: "none",
                  borderRadius: "25px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                📝 Share Your Feeling
              </button>
              <button
                onClick={() => setCurrentView("map")}
                style={{
                  padding: "12px 24px",
                  backgroundColor: currentView === "map" ? "white" : "rgba(255,255,255,0.2)",
                  color: currentView === "map" ? "#1e40af" : "white",
                  border: "none",
                  borderRadius: "25px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                🗺️ World Map
              </button>
            </div>
          </div>

          {currentView === "form" ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "20px",
                  padding: "30px",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                }}
              >
                <h2 style={{ marginTop: "0", color: "#333", fontSize: "1.5rem" }}>
                  How are you feeling today?
                </h2>

                <div style={{ marginBottom: "25px" }}>
                  {wellbeingStates.map((state) => (
                    <button
                      key={state.name}
                      onClick={() => setFeeling(state.name)}
                      disabled={loading}
                      style={{
                        display: "block",
                        width: "100%",
                        margin: "8px 0",
                        padding: "15px",
                        backgroundColor: feeling === state.name ? state.color : "#f8f9fa",
                        color: feeling === state.name ? "white" : "#333",
                        border: feeling === state.name ? `3px solid ${state.color}` : "2px solid #e9ecef",
                        borderRadius: "12px",
                        fontSize: "1.1rem",
                        fontWeight: "600",
                        cursor: loading ? "not-allowed" : "pointer",
                        transition: "all 0.2s ease",
                        transform: feeling === state.name ? "scale(1.02)" : "scale(1)",
                        opacity: loading ? 0.7 : 1,
                        boxSizing: "border-box"
                      }}
                    >
                      {state.emoji} {state.name}
                    </button>
                  ))}
                </div>

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
                    boxSizing: "border-box"
                  }}
                />

                <button
                  onClick={handleSubmit}
                  disabled={!feeling || loading}
                  style={{
                    width: "100%",
                    padding: "18px",
                    fontSize: "1.2rem",
                    fontWeight: "700",
                    backgroundColor: feeling && !loading ? "#1e40af" : "#ccc",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    cursor: feeling && !loading ? "pointer" : "not-allowed",
                    transition: "all 0.2s ease",
                  }}
                >
                  {loading ? "✨ Sharing..." : feeling ? "✨ Share My Feeling" : "Select how you're feeling"}
                </button>
              </div>

              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "20px",
                  padding: "30px",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                }}
              >
                <h2 style={{ marginTop: "0", color: "#333", fontSize: "1.5rem" }}>
                  🌍 Feelings by Continent
                </h2>

                {loadingData ? (
                  <div style={{ textAlign: "center", padding: "40px 20px", color: "#666" }}>
                    <div style={{ fontSize: "3rem", marginBottom: "15px" }}>⏳</div>
                    <p>Loading global data...</p>
                  </div>
                ) : continentStats.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px 20px", color: "#666" }}>
                    <div style={{ fontSize: "3rem", marginBottom: "15px" }}>🌍</div>
                    <p>No responses yet! Be the first to share how you're feeling.</p>
                  </div>
                ) : (
                  <div style={{ maxHeight: "450px", overflowY: "auto" }}>
                    {continentStats.map((stat, index) => {
                      const stateData = getWellbeingData(stat.dominantState);
                      return (
                        <div
                          key={index}
                          style={{
                            padding: "20px",
                            marginBottom: "15px",
                            backgroundColor: "#f8f9fa",
                            borderRadius: "15px",
                            borderLeft: `6px solid ${stat.dominantColor}`,
                            transition: "transform 0.2s ease",
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.transform = "translateX(5px)"}
                          onMouseLeave={(e) => e.currentTarget.style.transform = "translateX(0px)"}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                            <div>
                              <div style={{ fontSize: "1.3rem", fontWeight: "700", color: "#333", marginBottom: "5px" }}>
                                🌍 {stat.continent}
                              </div>
                              <div style={{ fontSize: "1.1rem", fontWeight: "600", color: stat.dominantColor }}>
                                {stateData?.emoji} {stat.dominantState}
                              </div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#333" }}>
                                {stat.total}
                              </div>
                              <div style={{ fontSize: "0.8rem", color: "#666" }}>
                                responses
                              </div>
                            </div>
                          </div>
                          
                          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                            {Object.entries(stat.states)
                              .filter(([_, count]) => count > 0)
                              .sort((a, b) => b[1] - a[1])
                              .map(([state, count]) => {
                                const stateInfo = getWellbeingData(state);
                                return (
                                  <div
                                    key={state}
                                    style={{
                                      backgroundColor: stateInfo?.color || "#ccc",
                                      color: "white",
                                      padding: "4px 8px",
                                      borderRadius: "12px",
                                      fontSize: "0.8rem",
                                      fontWeight: "600"
                                    }}
                                  >
                                    {stateInfo?.emoji} {count}
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "20px",
                padding: "30px",
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
              }}
            >
              <h2 style={{ marginTop: "0", color: "#333", fontSize: "1.5rem", textAlign: "center" }}>
                🗺️ Global Feelings Map
              </h2>
              <p style={{ textAlign: "center", color: "#666", marginBottom: "30px" }}>
                Each continent is colored by its most common feeling
              </p>
              
              {loadingData ? (
                <div style={{ textAlign: "center", padding: "60px", color: "#666" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "15px" }}>🗺️</div>
                  <p>Loading global data...</p>
                </div>
              ) : responses.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px", color: "#666" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "15px" }}>🗺️</div>
                  <p>No data to display yet. Share your feeling first!</p>
                </div>
              ) : (
                <>
                  <ContinentMap />
                  
                  <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "15px" }}>
                    {wellbeingStates.map(state => (
                      <div key={state.name} style={{ display: "flex", alignItems: "center", backgroundColor: "#f8f9fa", padding: "8px 12px", borderRadius: "20px" }}>
                        <div
                          style={{
                            width: "12px",
                            height: "12px",
                            backgroundColor: state.color,
                            borderRadius: "50%",
                            marginRight: "8px"
                          }}
                        />
                        <span style={{ fontSize: "0.9rem", fontWeight: "600" }}>{state.emoji} {state.name}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
              
              {responses.length > 0 && (
                <div style={{ marginTop: "30px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
                  <div style={{ textAlign: "center", padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "12px" }}>
                    <div style={{ fontSize: "2rem", marginBottom: "5px" }}>📊</div>
                    <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#333" }}>{responses.length}</div>
                    <div style={{ color: "#666" }}>Total Responses</div>
                  </div>
                  <div style={{ textAlign: "center", padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "12px" }}>
                    <div style={{ fontSize: "2rem", marginBottom: "5px" }}>⭐</div>
                    <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#333" }}>
                      {responses.length > 0 && getWellbeingData(getContinentStats().find(c => c.total > 0)?.dominantState || 'Balanced')?.emoji}
                      {' '}
                      {responses.length > 0 && getContinentStats().find(c => c.total > 0)?.dominantState || 'No Data'}
                    </div>
                    <div style={{ color: "#666" }}>Top Global Feeling</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
