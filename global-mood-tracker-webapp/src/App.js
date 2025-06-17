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

  // Fixed continent mapping with more comprehensive city coverage
  const getContinentFromLocation = (location) => {
    if (!location || location.trim() === "") {
      return "Unknown";
    }
    
    const locationLower = location.toLowerCase().trim();
    
    // North America - Added Orlando, Miami, and more US cities
    if (locationLower.includes('new york') || locationLower.includes('toronto') || 
        locationLower.includes('mexico city') || locationLower.includes('los angeles') || 
        locationLower.includes('chicago') || locationLower.includes('vancouver') || 
        locationLower.includes('montreal') || locationLower.includes('san francisco') || 
        locationLower.includes('washington') || locationLower.includes('boston') || 
        locationLower.includes('seattle') || locationLower.includes('miami') || 
        locationLower.includes('orlando') || locationLower.includes('tampa') ||
        locationLower.includes('dallas') || locationLower.includes('atlanta') || 
        locationLower.includes('phoenix') || locationLower.includes('denver') || 
        locationLower.includes('detroit') || locationLower.includes('philadelphia') ||
        locationLower.includes('houston') || locationLower.includes('las vegas') ||
        locationLower.includes('canada') || locationLower.includes('usa') || 
        locationLower.includes('united states') || locationLower.includes('america') || 
        locationLower.includes('mexico') || locationLower.includes('florida') ||
        locationLower.includes('california') || locationLower.includes('texas') ||
        locationLower.includes('new jersey') || locationLower.includes('nevada')) {
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
        locationLower.includes('russia') || locationLower.includes('europe') ||
        locationLower.includes('poland') || locationLower.includes('sweden') ||
        locationLower.includes('norway') || locationLower.includes('denmark') ||
        locationLower.includes('netherlands') || locationLower.includes('belgium')) {
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
        locationLower.includes('asia') || locationLower.includes('vietnam') ||
        locationLower.includes('malaysia') || locationLower.includes('indonesia') ||
        locationLower.includes('philippines') || locationLower.includes('pakistan') ||
        locationLower.includes('lahore') || locationLower.includes('karachi') ||
        locationLower.includes('islamabad')) {
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
    
    // Return "Unknown" instead of defaulting to Asia
    return "Unknown";
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
    
    // Process responses - exclude "Unknown" continent
    responses.forEach(response => {
      const continent = response.continent;
      if (continentStats[continent] && continent !== "Unknown") {
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
        <svg width="1000" height="600" viewBox="0 0 1000 600" style={{ maxWidth: "100%", height: "auto", backgroundColor: "#4a90e2", border: "3px solid #2c5aa0", borderRadius: "15px" }}>
          {/* Ocean background with wave pattern */}
          <defs>
            <pattern id="waves" x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse">
              <path d="M0 10 Q10 5 20 10 T40 10" stroke="#6bb6ff" strokeWidth="1" fill="none" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#waves)"/>
          
          {/* Grid lines for coordinate reference */}
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)"/>

          {/* North America */}
          <path
            d="M80 100 L200 80 L280 85 L320 95 L340 120 L330 160 L310 200 L280 240 L240 260 L180 270 L120 260 L80 240 L60 200 L50 160 L60 120 Z"
            fill={continentColors["North America"] || "#e5e7eb"}
            stroke="#1e40af"
            strokeWidth="2"
          />
          {/* Greenland */}
          <path d="M300 60 L340 55 L360 65 L350 85 L320 90 L300 80 Z" fill={continentColors["North America"] || "#e5e7eb"} stroke="#1e40af" strokeWidth="2"/>
          <text x="190" y="170" textAnchor="middle" fill="white" fontWeight="bold" fontSize="16" stroke="rgba(0,0,0,0.4)" strokeWidth="0.8">
            North America
          </text>
          
          {/* South America */}
          <path
            d="M180 300 L240 290 L280 300 L300 340 L310 400 L300 460 L280 500 L250 520 L220 510 L190 480 L170 440 L160 400 L165 360 L170 320 Z"
            fill={continentColors["South America"] || "#e5e7eb"}
            stroke="#1e40af"
            strokeWidth="2"
          />
          <text x="235" y="400" textAnchor="middle" fill="white" fontWeight="bold" fontSize="15" stroke="rgba(0,0,0,0.4)" strokeWidth="0.8">
            South America
          </text>
          
          {/* Europe */}
          <path
            d="M420 90 L520 80 L580 85 L600 95 L590 130 L570 150 L530 160 L480 155 L440 150 L410 130 L405 110 Z"
            fill={continentColors["Europe"] || "#e5e7eb"}
            stroke="#1e40af"
            strokeWidth="2"
          />
          {/* Scandinavia */}
          <path d="M480 50 L520 45 L540 55 L535 75 L515 80 L485 75 Z" fill={continentColors["Europe"] || "#e5e7eb"} stroke="#1e40af" strokeWidth="2"/>
          <text x="505" y="115" textAnchor="middle" fill="white" fontWeight="bold" fontSize="14" stroke="rgba(0,0,0,0.4)" strokeWidth="0.8">
            Europe
          </text>
          
          {/* Africa */}
          <path
            d="M420 180 L520 170 L580 175 L620 190 L630 230 L625 290 L620 350 L610 410 L590 450 L560 470 L520 480 L480 475 L440 465 L410 445 L390 410 L385 350 L390 290 L400 230 L410 190 Z"
            fill={continentColors["Africa"] || "#e5e7eb"}
            stroke="#1e40af"
            strokeWidth="2"
          />
          <text x="505" y="325" textAnchor="middle" fill="white" fontWeight="bold" fontSize="16" stroke="rgba(0,0,0,0.4)" strokeWidth="0.8">
            Africa
          </text>
          
          {/* Asia */}
          <path
            d="M630 60 L820 50 L880 60 L920 80 L940 120 L935 170 L920 220 L880 260 L820 280 L760 285 L700 280 L650 270 L610 250 L590 220 L580 180 L590 140 L610 100 Z"
            fill={continentColors["Asia"] || "#e5e7eb"}
            stroke="#1e40af"
            strokeWidth="2"
          />
          {/* India subcontinent */}
          <path d="M700 220 L750 215 L780 230 L775 260 L750 270 L720 265 L700 250 Z" fill={continentColors["Asia"] || "#e5e7eb"} stroke="#1e40af" strokeWidth="2"/>
          {/* Southeast Asia */}
          <path d="M780 280 L820 275 L840 285 L835 305 L815 310 L795 305 L780 295 Z" fill={continentColors["Asia"] || "#e5e7eb"} stroke="#1e40af" strokeWidth="2"/>
          <text x="765" y="165" textAnchor="middle" fill="white" fontWeight="bold" fontSize="18" stroke="rgba(0,0,0,0.4)" strokeWidth="0.8">
            Asia
          </text>
          
          {/* Australia */}
          <path
            d="M750 380 L840 375 L880 385 L900 405 L895 430 L875 445 L840 450 L800 445 L760 430 L745 405 Z"
            fill={continentColors["Australia"] || "#e5e7eb"}
            stroke="#1e40af"
            strokeWidth="2"
          />
          {/* New Zealand */}
          <ellipse cx="920" cy="420" rx="12" ry="25" fill={continentColors["Australia"] || "#e5e7eb"} stroke="#1e40af" strokeWidth="2"/>
          <text x="820" y="415" textAnchor="middle" fill="white" fontWeight="bold" fontSize="14" stroke="rgba(0,0,0,0.4)" strokeWidth="0.8">
            Australia
          </text>

          {/* Island chains and details */}
          <circle cx="880" cy="200" r="6" fill={continentColors["Asia"] || "#e5e7eb"} stroke="#1e40af" strokeWidth="1.5"/>
          <circle cx="900" cy="220" r="4" fill={continentColors["Asia"] || "#e5e7eb"} stroke="#1e40af" strokeWidth="1.5"/>
          <circle cx="860" cy="300" r="5" fill={continentColors["Asia"] || "#e5e7eb"} stroke="#1e40af" strokeWidth="1.5"/>
          
          {/* Caribbean */}
          <circle cx="250" cy="240" r="3" fill={continentColors["North America"] || "#e5e7eb"} stroke="#1e40af" strokeWidth="1"/>
          <circle cx="260" cy="245" r="2" fill={continentColors["North America"] || "#e5e7eb"} stroke="#1e40af" strokeWidth="1"/>
          
          {/* Madagascar */}
          <ellipse cx="630" cy="420" rx="8" ry="20" fill={continentColors["Africa"] || "#e5e7eb"} stroke="#1e40af" strokeWidth="1.5"/>
          
          {/* Iceland */}
          <circle cx="380" cy="70" r="6" fill={continentColors["Europe"] || "#e5e7eb"} stroke="#1e40af" strokeWidth="1.5"/>
          
          {/* Ocean labels */}
          <text x="200" y="50" textAnchor="middle" fill="white" fontSize="12" opacity="0.7" fontStyle="italic">Arctic Ocean</text>
          <text x="300" y="400" textAnchor="middle" fill="white" fontSize="12" opacity="0.7" fontStyle="italic">Atlantic Ocean</text>
          <text x="850" y="350" textAnchor="middle" fill="white" fontSize="12" opacity="0.7" fontStyle="italic">Pacific Ocean</text>
          <text x="650" y="320" textAnchor="middle" fill="white" fontSize="12" opacity="0.7" fontStyle="italic">Indian Ocean</text>
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
                          padding: " "20px",
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
                    {continentStats[0]?.dominantState || "N/A"}
                  </div>
                  <div style={{ color: "#666" }}>Top Global Feeling</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
