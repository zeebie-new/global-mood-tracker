import React, { useState, useEffect } from "react";

const supabaseUrl = 'https://yanrhgiateygysckenkf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhbnJoZ2lhdGV5Z3lzY2tlbmtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5ODExOTQsImV4cCI6MjA2NTU1NzE5NH0.baFtpvhBKwq3TJ3dusZQ2-1ru9u0oN_khqRjH4PAZWA';

// Proper Supabase client implementation
const createClient = (url, key) => {
  const apiUrl = `${url}/rest/v1`;
  
  const makeRequest = async (endpoint, options = {}) => {
    const response = await fetch(`${apiUrl}${endpoint}`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
        ...options.headers
      },
      ...options
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return { data: null, error: data };
    }
    
    return { data, error: null };
  };
  
  return {
    from: (table) => ({
      select: (columns = '*') => ({
        order: (column, options = {}) => ({
          limit: (count) => ({
            then: async (callback) => {
              try {
                const orderParam = options.ascending === false ? `${column}.desc` : `${column}.asc`;
                const result = await makeRequest(`/${table}?select=${columns}&order=${orderParam}&limit=${count}`);
                callback(result);
              } catch (error) {
                callback({ data: null, error });
              }
            }
          })
        })
      }),
      insert: (data) => ({
        select: () => ({
          then: async (callback) => {
            try {
              const result = await makeRequest(`/${table}`, {
                method: 'POST',
                body: JSON.stringify(data)
              });
              callback(result);
            } catch (error) {
              callback({ data: null, error });
            }
          }
        })
      })
    })
  };
};

const supabase = createClient(supabaseUrl, supabaseKey);

export default function App() {
  const [feeling, setFeeling] = useState("");
  const [location, setLocation] = useState("");
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [currentView, setCurrentView] = useState("form");

  const wellbeingStates = [
    { name: "Thriving", color: "#059669", emoji: "🌟" },
    { name: "Flourishing", color: "#0891b2", emoji: "🌸" },
    { name: "Content", color: "#7c3aed", emoji: "😌" },
    { name: "Balanced", color: "#0d9488", emoji: "⚖️" },
    { name: "Steady", color: "#dc2626", emoji: "🔄" },
    { name: "Uncertain", color: "#ea580c", emoji: "🤔" },
    { name: "Overwhelmed", color: "#be123c", emoji: "😵‍💫" },
    { name: "Struggling", color: "#7f1d1d", emoji: "💪" },
  ];

  // Expanded city to continent mapping
  const getContinentFromLocation = (location) => {
    const locationLower = location.toLowerCase();
    
    // North America
    if (locationLower.includes('new york') || locationLower.includes('toronto') || 
        locationLower.includes('mexico city') || locationLower.includes('los angeles') || 
        locationLower.includes('chicago') || locationLower.includes('vancouver') || 
        locationLower.includes('montreal') || locationLower.includes('san francisco') || 
        locationLower.includes('washington') || locationLower.includes('boston') || 
        locationLower.includes('seattle') || locationLower.includes('miami') || 
        locationLower.includes('dallas') || locationLower.includes('atlanta') || 
        locationLower.includes('phoenix') || locationLower.includes('denver') || 
        locationLower.includes('canada') || locationLower.includes('usa') || 
        locationLower.includes('united states') || locationLower.includes('america') || 
        locationLower.includes('mexico')) {
      return "North America";
    }
    
    // Europe
    if (locationLower.includes('london') || locationLower.includes('paris') || 
        locationLower.includes('berlin') || locationLower.includes('moscow') || 
        locationLower.includes('madrid') || locationLower.includes('rome') || 
        locationLower.includes('amsterdam') || locationLower.includes('barcelona') || 
        locationLower.includes('vienna') || locationLower.includes('prague') || 
        locationLower.includes('stockholm') || locationLower.includes('oslo') || 
        locationLower.includes('copenhagen') || locationLower.includes('dublin') || 
        locationLower.includes('zurich') || locationLower.includes('brussels') || 
        locationLower.includes('uk') || locationLower.includes('england') || 
        locationLower.includes('france') || locationLower.includes('germany') || 
        locationLower.includes('spain') || locationLower.includes('italy') || 
        locationLower.includes('russia') || locationLower.includes('europe')) {
      return "Europe";
    }
    
    // Asia
    if (locationLower.includes('tokyo') || locationLower.includes('mumbai') || 
        locationLower.includes('beijing') || locationLower.includes('bangkok') || 
        locationLower.includes('dubai') || locationLower.includes('seoul') || 
        locationLower.includes('shanghai') || locationLower.includes('delhi') || 
        locationLower.includes('singapore') || locationLower.includes('hong kong') || 
        locationLower.includes('taipei') || locationLower.includes('manila') || 
        locationLower.includes('jakarta') || locationLower.includes('kuala lumpur') || 
        locationLower.includes('riyadh') || locationLower.includes('doha') || 
        locationLower.includes('japan') || locationLower.includes('china') || 
        locationLower.includes('india') || locationLower.includes('korea') || 
        locationLower.includes('thailand') || locationLower.includes('uae') || 
        locationLower.includes('asia')) {
      return "Asia";
    }
    
    // Africa
    if (locationLower.includes('cairo') || locationLower.includes('lagos') || 
        locationLower.includes('cape town') || locationLower.includes('johannesburg') || 
        locationLower.includes('nairobi') || locationLower.includes('casablanca') || 
        locationLower.includes('tunis') || locationLower.includes('accra') || 
        locationLower.includes('addis ababa') || locationLower.includes('dar es salaam') || 
        locationLower.includes('egypt') || locationLower.includes('nigeria') || 
        locationLower.includes('south africa') || locationLower.includes('kenya') || 
        locationLower.includes('morocco') || locationLower.includes('africa')) {
      return "Africa";
    }
    
    // South America
    if (locationLower.includes('são paulo') || locationLower.includes('sao paulo') || 
        locationLower.includes('rio de janeiro') || locationLower.includes('buenos aires') || 
        locationLower.includes('lima') || locationLower.includes('bogotá') || 
        locationLower.includes('bogota') || locationLower.includes('santiago') || 
        locationLower.includes('caracas') || locationLower.includes('quito') || 
        locationLower.includes('brazil') || locationLower.includes('argentina') || 
        locationLower.includes('peru') || locationLower.includes('colombia') || 
        locationLower.includes('chile') || locationLower.includes('south america')) {
      return "South America";
    }
    
    // Australia/Oceania
    if (locationLower.includes('sydney') || locationLower.includes('melbourne') || 
        locationLower.includes('brisbane') || locationLower.includes('perth') || 
        locationLower.includes('adelaide') || locationLower.includes('auckland') || 
        locationLower.includes('wellington') || locationLower.includes('australia') || 
        locationLower.includes('new zealand') || locationLower.includes('oceania')) {
      return "Australia";
    }
    
    // Default to Asia for any unrecognized location
    return "Asia";
  };

  useEffect(() => {
    loadWellbeingData();
  }, []);

  const loadWellbeingData = async () => {
    try {
      const { data, error } = await supabase
        .from('moods')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);

      if (error) {
        console.error('Error loading data:', error);
        setResponses([]);
      } else {
        const formattedData = data.map(item => ({
          feeling: item.mood,
          location: item.location || "Unknown",
          time: new Date(item.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          timestamp: item.created_at,
          continent: getContinentFromLocation(item.location || "")
        }));
        setResponses(formattedData);
      }
    } catch (error) {
      console.error('Error:', error);
      setResponses([]);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async () => {
    if (feeling) {
      setLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('moods')
          .insert([
            {
              mood: feeling,
              location: location || null,
            }
          ])
          .select();

        if (error) {
          console.error('Error saving data:', error);
          alert('Error saving your response. Please try again.');
        } else {
          const newResponse = {
            feeling,
            location: location || "Unknown",
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            timestamp: new Date().toISOString(),
            continent: getContinentFromLocation(location || "")
          };
          setResponses([newResponse, ...responses]);
          setFeeling("");
          setLocation("");
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error saving your response. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const getWellbeingData = (stateName) => wellbeingStates.find((s) => s.name === stateName);
  
  const getContinentStats = () => {
    const continentStats = {};
    const continents = ["North America", "Europe", "Asia", "Africa", "South America", "Australia"];
    
    // Initialize continents
    continents.forEach(continent => {
      continentStats[continent] = {
        total: 0,
        states: {},
        dominantState: "Balanced",
        dominantColor: "#0d9488"
      };
      wellbeingStates.forEach(s => continentStats[continent].states[s.name] = 0);
    });
    
    // Process responses
    responses.forEach(response => {
      const continent = response.continent;
      if (continentStats[continent]) {
        continentStats[continent].total++;
        continentStats[continent].states[response.feeling]++;
        
        // Find dominant state
        let maxCount = 0;
        Object.entries(continentStats[continent].states).forEach(([state, count]) => {
          if (count > maxCount) {
            maxCount = count;
            continentStats[continent].dominantState = state;
            const stateData = getWellbeingData(state);
            continentStats[continent].dominantColor = stateData?.color || "#0d9488";
          }
        });
      }
    });
    
    return Object.entries(continentStats)
      .filter(([_, stats]) => stats.total > 0)
      .map(([continent, stats]) => ({ continent, ...stats }))
      .sort((a, b) => b.total - a.total);
  };

  const continentStats = getContinentStats();

  const ContinentMap = () => {
    const continentColors = {};
    continentStats.forEach(stat => {
      continentColors[stat.continent] = stat.dominantColor;
    });

    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <svg width="900" height="500" viewBox="0 0 900 500" style={{ maxWidth: "100%", height: "auto", backgroundColor: "#e8f4f8" }}>
          {/* North America */}
          <path
            d="M60 80 L180 60 L220 75 L240 110 L220 140 L200 170 L160 185 L120 180 L80 160 L50 120 Z"
            fill={continentColors["North America"] || "#ddd"}
            stroke="#2563eb"
            strokeWidth="1.5"
          />
          <text x="145" y="125" textAnchor="middle" fill="white" fontWeight="bold" fontSize="14" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5">
            North America
          </text>
          
          {/* South America */}
          <path
            d="M140 220 L180 210 L200 230 L210 280 L200 320 L180 350 L160 360 L140 350 L120 320 L110 280 L120 240 Z"
            fill={continentColors["South America"] || "#ddd"}
            stroke="#2563eb"
            strokeWidth="1.5"
          />
          <text x="160" y="290" textAnchor="middle" fill="white" fontWeight="bold" fontSize="13" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5">
            South America
          </text>
          
          {/* Europe */}
          <path
            d="M320 70 L400 60 L440 65 L460 80 L450 110 L420 125 L380 130 L340 125 L310 100 Z"
            fill={continentColors["Europe"] || "#ddd"}
            stroke="#2563eb"
            strokeWidth="1.5"
          />
          <text x="385" y="95" textAnchor="middle" fill="white" fontWeight="bold" fontSize="13" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5">
            Europe
          </text>
          
          {/* Africa */}
          <path
            d="M320 140 L400 135 L440 140 L460 160 L450 220 L440 280 L420 320 L400 340 L370 350 L340 340 L320 320 L310 280 L305 220 L310 160 Z"
            fill={continentColors["Africa"] || "#ddd"}
            stroke="#2563eb"
            strokeWidth="1.5"
          />
          <text x="380" y="245" textAnchor="middle" fill="white" fontWeight="bold" fontSize="14" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5">
            Africa
          </text>
          
          {/* Asia */}
          <path
            d="M480 50 L680 45 L720 55 L750 75 L770 110 L760 150 L740 180 L700 195 L650 200 L600 195 L550 185 L500 170 L470 140 L460 100 Z"
            fill={continentColors["Asia"] || "#ddd"}
            stroke="#2563eb"
            strokeWidth="1.5"
          />
          <text x="615" y="125" textAnchor="middle" fill="white" fontWeight="bold" fontSize="16" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5">
            Asia
          </text>
          
          {/* Australia */}
          <path
            d="M620 280 L720 275 L750 285 L770 305 L760 325 L740 340 L700 345 L660 340 L630 325 L615 305 Z"
            fill={continentColors["Australia"] || "#ddd"}
            stroke="#2563eb"
            strokeWidth="1.5"
          />
          <text x="690" y="315" textAnchor="middle" fill="white" fontWeight="bold" fontSize="13" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5">
            Australia
          </text>

          {/* Add some decorative islands and details */}
          <circle cx="780" cy="140" r="8" fill={continentColors["Asia"] || "#ddd"} stroke="#2563eb" strokeWidth="1"/>
          <circle cx="790" cy="160" r="6" fill={continentColors["Asia"] || "#ddd"} stroke="#2563eb" strokeWidth="1"/>
          <circle cx="200" cy="380" r="5" fill={continentColors["South America"] || "#ddd"} stroke="#2563eb" strokeWidth="1"/>
          <circle cx="430" cy="370" r="4" fill={continentColors["Africa"] || "#ddd"} stroke="#2563eb" strokeWidth="1"/>
        </svg>
      </div>
    );
  };

  return (
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
               <div style={{ textAlign: "center", padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "12px
