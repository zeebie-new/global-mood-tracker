import React, { useState, useEffect, useRef } from "react";

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
  const [mood, setMood] = useState("");
  const [location, setLocation] = useState("");
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [currentView, setCurrentView] = useState("form");
  const globeRef = useRef();
  const sceneRef = useRef();
  const rendererRef = useRef();
  const frameRef = useRef();
  const [threeLoaded, setThreeLoaded] = useState(false);

  const moods = [
    { name: "Amazing", color: "#10B981", emoji: "🤩" },
    { name: "Great", color: "#3B82F6", emoji: "😊" },
    { name: "Good", color: "#8B5CF6", emoji: "🙂" },
    { name: "Okay", color: "#F59E0B", emoji: "😐" },
    { name: "Meh", color: "#EF4444", emoji: "😕" },
    { name: "Bad", color: "#DC2626", emoji: "😞" },
  ];

  const locationCoords = {
    "New York": { lat: 40.7128, lng: -74.0060, country: "United States" },
    "London": { lat: 51.5074, lng: -0.1278, country: "United Kingdom" },
    "Tokyo": { lat: 35.6762, lng: 139.6503, country: "Japan" },
    "Paris": { lat: 48.8566, lng: 2.3522, country: "France" },
    "Sydney": { lat: -33.8688, lng: 151.2093, country: "Australia" },
    "Mumbai": { lat: 19.0760, lng: 72.8777, country: "India" },
    "São Paulo": { lat: -23.5505, lng: -46.6333, country: "Brazil" },
    "Cairo": { lat: 30.0444, lng: 31.2357, country: "Egypt" },
    "Moscow": { lat: 55.7558, lng: 37.6176, country: "Russia" },
    "Beijing": { lat: 39.9042, lng: 116.4074, country: "China" },
    "Lagos": { lat: 6.5244, lng: 3.3792, country: "Nigeria" },
    "Mexico City": { lat: 19.4326, lng: -99.1332, country: "Mexico" },
    "Toronto": { lat: 43.6532, lng: -79.3832, country: "Canada" },
    "Berlin": { lat: 52.5200, lng: 13.4050, country: "Germany" },
    "Bangkok": { lat: 13.7563, lng: 100.5018, country: "Thailand" },
    "Dubai": { lat: 25.2048, lng: 55.2708, country: "UAE" },
    "Seoul": { lat: 37.5665, lng: 126.9780, country: "South Korea" },
    "Unknown": { lat: 0, lng: 0, country: "Unknown" }
  };

  // Load Three.js from CDN
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.onload = () => setThreeLoaded(true);
    document.head.appendChild(script);
    
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    loadMoods();
  }, []);

  useEffect(() => {
    if (currentView === "globe" && !loadingData && threeLoaded) {
      initGlobe();
    }
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [currentView, responses, loadingData, threeLoaded]);

  const loadMoods = async () => {
    try {
      const { data, error } = await supabase
        .from('moods')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);

      if (error) {
        console.error('Error loading moods:', error);
        setResponses([]); // Set empty array if error
      } else {
        const formattedMoods = data.map(item => ({
          mood: item.mood,
          location: item.location || "Unknown",
          time: new Date(item.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          timestamp: item.created_at,
          country: locationCoords[item.location || "Unknown"]?.country || "Unknown"
        }));
        setResponses(formattedMoods);
      }
    } catch (error) {
      console.error('Error:', error);
      setResponses([]); // Set empty array if error
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
            timestamp: new Date().toISOString(),
            country: locationCoords[location || "Unknown"]?.country || "Unknown"
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
  
  const getCountryStats = () => {
    const countryStats = {};
    responses.forEach(response => {
      const country = response.country;
      if (!countryStats[country]) {
        countryStats[country] = {
          total: 0,
          moods: {},
          cities: new Set(),
          dominantMood: "Okay",
          dominantColor: "#F59E0B"
        };
        moods.forEach(m => countryStats[country].moods[m.name] = 0);
      }
      countryStats[country].total++;
      countryStats[country].moods[response.mood]++;
      countryStats[country].cities.add(response.location);
      
      let maxCount = 0;
      Object.entries(countryStats[country].moods).forEach(([mood, count]) => {
        if (count > maxCount) {
          maxCount = count;
          countryStats[country].dominantMood = mood;
          const moodData = getMoodData(mood);
          countryStats[country].dominantColor = moodData?.color || "#F59E0B";
        }
      });
    });
    
    return Object.entries(countryStats)
      .map(([country, stats]) => ({
        country,
        ...stats,
        cities: Array.from(stats.cities)
      }))
      .sort((a, b) => b.total - a.total);
  };

  const initGlobe = () => {
    if (!globeRef.current || loadingData || !threeLoaded || !window.THREE) return;

    // Clean up previous globe
    if (rendererRef.current) {
      globeRef.current.removeChild(rendererRef.current.domElement);
    }

    const THREE = window.THREE;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, globeRef.current.offsetWidth / 400, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(globeRef.current.offsetWidth, 400);
    renderer.setClearColor(0x0f172a, 1);
    globeRef.current.appendChild(renderer.domElement);
    
    sceneRef.current = scene;
    rendererRef.current = renderer;

    // Create Earth globe with better materials
    const globeGeometry = new THREE.SphereGeometry(2, 64, 64);
    const globeMaterial = new THREE.MeshLambertMaterial({
      color: 0x1e40af,
      transparent: true,
      opacity: 0.7
    });
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globe);

    // Add atmosphere glow
    const atmosphereGeometry = new THREE.SphereGeometry(2.1, 32, 32);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x4f46e5,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);

    // Process mood data and create points
    const moodDistribution = {};
    responses.forEach(response => {
      const loc = response.location;
      if (!moodDistribution[loc]) {
        moodDistribution[loc] = {};
        moods.forEach(m => moodDistribution[loc][m.name] = 0);
      }
      moodDistribution[loc][response.mood]++;
    });

    // Create mood points on globe
    Object.entries(moodDistribution).forEach(([location, moodCounts]) => {
      const coords = locationCoords[location];
      if (!coords || (coords.lat === 0 && coords.lng === 0 && location !== "Unknown")) return;

      // Find dominant mood
      let dominantMood = "Okay";
      let maxCount = 0;
      Object.entries(moodCounts).forEach(([mood, count]) => {
        if (count > maxCount) {
          maxCount = count;
          dominantMood = mood;
        }
      });

      const moodData = getMoodData(dominantMood);
      const color = new THREE.Color(moodData?.color || "#F59E0B");
      
      // Convert lat/lng to 3D coordinates
      const phi = (90 - coords.lat) * (Math.PI / 180);
      const theta = (coords.lng + 180) * (Math.PI / 180);
      
      const x = 2.15 * Math.sin(phi) * Math.cos(theta);
      const y = 2.15 * Math.cos(phi);
      const z = 2.15 * Math.sin(phi) * Math.sin(theta);

      // Size based on total responses
      const totalMoods = Object.values(moodCounts).reduce((a, b) => a + b, 0);
      const size = Math.max(0.08, Math.min(0.25, totalMoods * 0.03));
      
      // Create main point
      const pointGeometry = new THREE.SphereGeometry(size, 16, 16);
      const pointMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: false
      });
      const point = new THREE.Mesh(pointGeometry, pointMaterial);
      point.position.set(x, y, z);
      scene.add(point);

      // Create glow effect
      const glowGeometry = new THREE.SphereGeometry(size * 1.8, 12, 12);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.4
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      glow.position.set(x, y, z);
      scene.add(glow);
    });

    // Improved lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    // Position camera
    camera.position.set(0, 0, 5);

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      globe.rotation.y += 0.003;
      atmosphere.rotation.y += 0.002;
      renderer.render(scene, camera);
    };
    animate();
  };

  const countryStats = getCountryStats();

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
              🌍 Globe View
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
                Share Your Mood
              </h2>

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

            <div
              style={{
                backgroundColor: "white",
                borderRadius: "20px",
                padding: "30px",
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
              }}
            >
              <h2 style={{ marginTop: "0", color: "#333", fontSize: "1.5rem" }}>
                🌟 Mood by Country
              </h2>

              {loadingData ? (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "#666" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "15px" }}>⏳</div>
                  <p>Loading global data...</p>
                </div>
              ) : countryStats.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "#666" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "15px" }}>🎭</div>
                  <p>No responses yet! Be the first to share your mood.</p>
                </div>
              ) : (
                <div style={{ maxHeight: "450px", overflowY: "auto" }}>
                  {countryStats.slice(0, 8).map((stat, index) => {
                    const moodData = getMoodData(stat.dominantMood);
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
                        onMouseEnter={(e) => e.target.style.transform = "translateX(5px)"}
                        onMouseLeave={(e) => e.target.style.transform = "translateX(0px)"}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                          <div>
                            <div style={{ fontSize: "1.3rem", fontWeight: "700", color: "#333", marginBottom: "5px" }}>
                              🌍 {stat.country}
                            </div>
                            <div style={{ fontSize: "1.1rem", fontWeight: "600", color: stat.dominantColor }}>
                              {moodData?.emoji} {stat.dominantMood} Mood
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
                        
                        <div style={{ fontSize: "0.9rem", color: "#666", marginBottom: "10px" }}>
                          📍 Cities: {stat.cities.join(", ")}
                        </div>
                        
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          {Object.entries(stat.moods)
                            .filter(([_, count]) => count > 0)
                            .sort((a, b) => b[1] - a[1])
                            .map(([mood, count]) => {
                              const moodInfo = getMoodData(mood);
                              return (
                                <div
                                  key={mood}
                                  style={{
                                    backgroundColor: moodInfo?.color || "#ccc",
                                    color: "white",
                                    padding: "4px 8px",
                                    borderRadius: "12px",
                                    fontSize: "0.8rem",
                                    fontWeight: "600"
                                  }}
                                >
                                  {moodInfo?.emoji} {count}
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
              🌍 Interactive Mood Globe
            </h2>
            <p style={{ textAlign: "center", color: "#666", marginBottom: "30px" }}>
              3D visualization of global moods. Each colored sphere represents a city, with size showing activity and color indicating dominant mood.
            </p>
            
            {loadingData || !threeLoaded ? (
              <div style={{ textAlign: "center", padding: "60px", color: "#666" }}>
                <div style={{ fontSize: "3rem", marginBottom: "15px" }}>🌍</div>
                <p>{!threeLoaded ? "Loading 3D engine..." : "Loading 3D globe..."}</p>
              </div>
            ) : responses.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px", color: "#666" }}>
                <div style={{ fontSize: "3rem", marginBottom: "15px" }}>🌍</div>
                <p>No mood data to display yet. Share your mood first!</p>
              </div>
            ) : (
              <div 
                ref={globeRef} 
                style={{ 
                  width: "100%", 
                  height: "400px", 
                  backgroundColor: "#0f172a",
                  borderRadius: "15px",
                  overflow: "hidden"
                }}
              />
            )}
            
            <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "15px" }}>
              {moods.map(mood => (
                <div key={mood.name} style={{ display: "flex", alignItems: "center", backgroundColor: "#f8f9fa", padding: "8px 12px", borderRadius: "20px" }}>
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      backgroundColor: mood.color,
                      borderRadius: "50%",
                      marginRight: "8px"
                    }}
                  />
                  <span style={{ fontSize: "0.9rem", fontWeight: "600" }}>{mood.emoji} {mood.name}</span>
                </div>
              ))}
            </div>
            
            {responses.length > 0 && (
              <div style={{ marginTop: "30px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
                <div style={{ textAlign: "center", padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "12px" }}>
                  <div style={{ fontSize: "2rem", marginBottom: "5px" }}>📊</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#333" }}>{responses.length}</div>
                  <div style={{ color: "#666" }}>Total Responses</div>
                </div>
                <div style={{ textAlign: "center", padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "12px" }}>
                  <div style={{ fontSize: "2rem", marginBottom: "5px" }}>🌍</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#333" }}>
                    {countryStats.length}
                  </div>
                  <div style={{ color: "#666" }}>Countries</div>
                </div>
                <div style={{ textAlign: "center", padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "12px" }}>
                  <div style={{ fontSize: "2rem", marginBottom: "5px" }}>🏙️</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#333" }}>
                    {new Set(responses.map(r => r.location)).size}
                  </div>
                  <div style={{ color: "#666" }}>Cities</div>
                </div>
                <div style={{ textAlign: "center", padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "12px" }}>
                  <div style={{ fontSize: "2rem", marginBottom: "5px" }}>⭐</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#333" }}>
                    {countryStats[0]?.dominantMood || "N/A"}
                  </div>
                  <div style={{ color: "#666" }}>Top Global Mood</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
