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
  const [feeling, setFeeling] = useState("");
  const [location, setLocation] = useState("");
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [currentView, setCurrentView] = useState("form");
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

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

  // City coordinates for mapping
  const cityCoordinates = {
    // North America
    'new york': [40.7128, -74.0060],
    'toronto': [43.6532, -79.3832],
    'mexico city': [19.4326, -99.1332],
    'los angeles': [34.0522, -118.2437],
    'chicago': [41.8781, -87.6298],
    'vancouver': [49.2827, -123.1207],
    'montreal': [45.5017, -73.5673],
    'san francisco': [37.7749, -122.4194],
    'washington': [38.9072, -77.0369],
    'boston': [42.3601, -71.0589],
    'seattle': [47.6062, -122.3321],
    'miami': [25.7617, -80.1918],
    'orlando': [28.5383, -81.3792],
    'tampa': [27.9506, -82.4572],
    'dallas': [32.7767, -96.7970],
    'atlanta': [33.7490, -84.3880],
    'phoenix': [33.4484, -112.0740],
    'denver': [39.7392, -104.9903],
    'detroit': [42.3314, -83.0458],
    'philadelphia': [39.9526, -75.1652],
    'houston': [29.7604, -95.3698],
    'las vegas': [36.1699, -115.1398],
    
    // Europe
    'london': [51.5074, -0.1278],
    'paris': [48.8566, 2.3522],
    'berlin': [52.5200, 13.4050],
    'moscow': [55.7558, 37.6176],
    'madrid': [40.4168, -3.7038],
    'rome': [41.9028, 12.4964],
    'amsterdam': [52.3676, 4.9041],
    'barcelona': [41.3851, 2.1734],
    'vienna': [48.2082, 16.3738],
    'prague': [50.0755, 14.4378],
    'stockholm': [59.3293, 18.0686],
    'oslo': [59.9139, 10.7522],
    'copenhagen': [55.6761, 12.5683],
    'dublin': [53.3498, -6.2603],
    'zurich': [47.3769, 8.5417],
    'brussels': [50.8503, 4.3517],
    
    // Asia
    'tokyo': [35.6762, 139.6503],
    'mumbai': [19.0760, 72.8777],
    'beijing': [39.9042, 116.4074],
    'bangkok': [13.7563, 100.5018],
    'dubai': [25.2048, 55.2708],
    'seoul': [37.5665, 126.9780],
    'shanghai': [31.2304, 121.4737],
    'delhi': [28.7041, 77.1025],
    'singapore': [1.3521, 103.8198],
    'hong kong': [22.3193, 114.1694],
    'taipei': [25.0330, 121.5654],
    'manila': [14.5995, 120.9842],
    'jakarta': [6.2088, 106.8456],
    'kuala lumpur': [3.1390, 101.6869],
    'riyadh': [24.7136, 46.6753],
    'doha': [25.2760, 51.5200],
    'lahore': [31.5497, 74.3436],
    'karachi': [24.8607, 67.0011],
    'islamabad': [33.6844, 73.0479],
    
    // Africa
    'cairo': [30.0444, 31.2357],
    'lagos': [6.5244, 3.3792],
    'cape town': [-33.9249, 18.4241],
    'johannesburg': [-26.2041, 28.0473],
    'nairobi': [-1.2921, 36.8219],
    'casablanca': [33.5731, -7.5898],
    'tunis': [36.8065, 10.1815],
    'accra': [5.6037, -0.1870],
    'addis ababa': [9.1450, 38.7617],
    'dar es salaam': [-6.7924, 39.2083],
    
    // South America
    'são paulo': [-23.5558, -46.6396],
    'sao paulo': [-23.5558, -46.6396],
    'rio de janeiro': [-22.9068, -43.1729],
    'buenos aires': [-34.6118, -58.3960],
    'lima': [-12.0464, -77.0428],
    'bogotá': [4.7110, -74.0721],
    'bogota': [4.7110, -74.0721],
    'santiago': [-33.4489, -70.6693],
    'caracas': [10.4806, -66.9036],
    'quito': [-0.1807, -78.4678],
    
    // Australia/Oceania
    'sydney': [-33.8688, 151.2093],
    'melbourne': [-37.8136, 144.9631],
    'brisbane': [-27.4698, 153.0251],
    'perth': [-31.9505, 115.8605],
    'adelaide': [-34.9285, 138.6007],
    'auckland': [-36.8485, 174.7633],
    'wellington': [-41.2865, 174.7762]
  };

  const getCoordinatesFromLocation = (locationStr) => {
    if (!locationStr) return null;
    const normalized = locationStr.toLowerCase().trim();
    return cityCoordinates[normalized] || null;
  };

  const getContinentFromLocation = (location) => {
    if (!location || location.trim() === "") {
      return "Unknown";
    }
    
    const locationLower = location.toLowerCase().trim();
    
    // North America
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
    
    return "Unknown";
  };

  // Initialize Leaflet map
  useEffect(() => {
    if (currentView === "map" && mapRef.current && !mapInstanceRef.current) {
      // Load Leaflet CSS and JS dynamically
      const loadLeaflet = async () => {
        // Load CSS
        if (!document.querySelector('link[href*="leaflet"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
          document.head.appendChild(link);
        }

        // Load JS
        if (!window.L) {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
          document.head.appendChild(script);
          
          await new Promise((resolve) => {
            script.onload = resolve;
          });
        }

        // Initialize map
        if (window.L && mapRef.current) {
          mapInstanceRef.current = window.L.map(mapRef.current, {
            center: [20, 0],
            zoom: 2,
            zoomControl: true,
            worldCopyJump: true,
            maxBounds: [[-90, -180], [90, 180]],
            maxBoundsViscosity: 1.0
          });

          // Add beautiful tile layer
          window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '© OpenStreetMap contributors © CartoDB',
            subdomains: 'abcd',
            maxZoom: 19
          }).addTo(mapInstanceRef.current);

          // Update markers when map is ready
          updateMapMarkers();
        }
      };

      loadLeaflet();
    }
  }, [currentView]);

  // Update map markers when responses change
  useEffect(() => {
    if (mapInstanceRef.current && currentView === "map") {
      updateMapMarkers();
    }
  }, [responses, currentView]);

  const updateMapMarkers = () => {
    if (!mapInstanceRef.current || !window.L) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current.removeLayer(marker);
    });
    markersRef.current = [];

    // Group responses by location
    const locationGroups = {};
    responses.forEach(response => {
      const coords = getCoordinatesFromLocation(response.location);
      if (coords) {
        const key = `${coords[0]},${coords[1]}`;
        if (!locationGroups[key]) {
          locationGroups[key] = {
            coords,
            location: response.location,
            responses: []
          };
        }
        locationGroups[key].responses.push(response);
      }
    });

    // Create markers for each location group
    Object.values(locationGroups).forEach(group => {
      const { coords, location, responses: locationResponses } = group;
      
      // Count feelings for this location
      const feelingCounts = {};
      locationResponses.forEach(r => {
        feelingCounts[r.feeling] = (feelingCounts[r.feeling] || 0) + 1;
      });

      // Find dominant feeling
      let dominantFeeling = "Balanced";
      let maxCount = 0;
      Object.entries(feelingCounts).forEach(([feeling, count]) => {
        if (count > maxCount) {
          maxCount = count;
          dominantFeeling = feeling;
        }
      });

      const feelingData = wellbeingStates.find(s => s.name === dominantFeeling);
      const size = Math.min(Math.max(locationResponses.length * 3, 15), 40);

      // Create custom icon
      const icon = window.L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            width: ${size}px;
            height: ${size}px;
            background: ${feelingData?.color || '#0d9488'};
            border: 3px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: ${Math.max(size * 0.4, 10)}px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: pulse 2s infinite;
          ">${feelingData?.emoji || '⚖️'}</div>
          <style>
            @keyframes pulse {
              0% { transform: scale(1); }
              50% { transform: scale(1.1); }
              100% { transform: scale(1); }
            }
          </style>
        `,
        iconSize: [size, size],
        iconAnchor: [size/2, size/2]
      });

      // Create marker
      const marker = window.L.marker(coords, { icon }).addTo(mapInstanceRef.current);

      // Create popup content
      const popupContent = `
        <div style="min-width: 200px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <h3 style="margin: 0 0 10px 0; color: #333; font-size: 1.2rem;">📍 ${location}</h3>
          <p style="margin: 0 0 10px 0; color: #666;">
            <strong>${locationResponses.length}</strong> ${locationResponses.length === 1 ? 'response' : 'responses'}
          </p>
          <div style="margin-bottom: 10px;">
            <div style="
              background: ${feelingData?.color || '#0d9488'};
              color: white;
              padding: 8px 12px;
              border-radius: 20px;
              display: inline-block;
              font-weight: bold;
              margin-bottom: 8px;
            ">
              ${feelingData?.emoji || '⚖️'} ${dominantFeeling}
            </div>
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 4px;">
            ${Object.entries(feelingCounts).map(([feeling, count]) => {
              const state = wellbeingStates.find(s => s.name === feeling);
              return `
                <div style="
                  background: ${state?.color || '#ccc'};
                  color: white;
                  padding: 2px 6px;
                  border-radius: 10px;
                  font-size: 0.75rem;
                  font-weight: 600;
                ">
                  ${state?.emoji || '⚖️'} ${count}
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      markersRef.current.push(marker);
    });
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

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1e40af 0%, #7c3aed 50%, #ec4899 100%)",
        padding: "20px",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1
            style={{
              fontSize: "3.5rem",
              color: "white",
              margin: "0",
              textShadow: "3px 3px 6px rgba(0,0,0,0.4)",
              fontWeight: "800",
            }}
          >
            💙 How Are We Feeling Today?
          </h1>
          <p
            style={{
              fontSize: "1.3rem",
              color: "rgba(255,255,255,0.95)",
              margin: "15px 0",
              textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
            }}
          >
            Share how you're feeling and see how the world is doing
          </p>
          
          <div style={{ marginTop: "25px" }}>
            <button
              onClick={() => setCurrentView("form")}
              style={{
                padding: "15px 30px",
                marginRight: "15px",
                backgroundColor: currentView === "form" ? "white" : "rgba(255,255,255,0.2)",
                color: currentView === "form" ? "#1e40af" : "white",
                border: "none",
                borderRadius: "30px",
                fontWeight: "700",
                fontSize: "1rem",
                cursor: "pointer",
                transition: "all 0.3s ease",
                transform: currentView === "form" ? "translateY(-2px)" : "translateY(0)",
                boxShadow: currentView === "form" ? "0 8px 20px rgba(0,0,0,0.2)" : "0 4px 10px rgba(0,0,0,0.1)"
              }}
            >
              📝 Share Your Feeling
            </button>
            <button
              onClick={() => setCurrentView("map")}
              style={{
                padding: "15px 30px",
                backgroundColor: currentView === "map" ? "white" : "rgba(255,255,255,0.2)",
                color: currentView === "map" ? "#1e40af" : "white",
                border: "none",
                borderRadius: "30px",
                fontWeight: "700",
                fontSize: "1rem",
                cursor: "pointer",
                transition: "all 0.3s ease",
                transform: currentView === "map" ? "translateY(-2px)" : "translateY(0)",
                boxShadow: currentView === "map" ? "0 8px 20px rgba(0,0,0,0.2)" : "0 4px 10px rgba(0,0,0,0.1)"
              }}
            >
              🗺️ Live World Map
            </button>
          </div>
        </div>

        {currentView === "form" ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "25px",
                padding: "40px",
                boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <h2 style={{ marginTop: "0", color: "#333", fontSize: "1.8rem", fontWeight: "700" }}>
                How are you feeling today?
              </h2>

              <div style={{ marginBottom: "30px" }}>
                {wellbeingStates.map((state) => (
                  <button
                    key={state.name}
                    onClick={() => setFeeling(state.name)}
                    disabled={loading}
                    style={{
                      display: "block",
                      width: "100%",
                      margin: "10px 0",
                      padding: "18px",
                      backgroundColor: feeling === state.name ? state.color : "#f8f9fa",
                      color: feeling === state.name ? "white" : "#333",
                      border: feeling === state.name ? `3px solid ${state.color}` : "2px solid #e9ecef",
                      borderRadius: "15px",
                      fontSize: "1.2rem",
                      fontWeight: "700",
                      cursor: loading ? "not-allowed" : "pointer",
                      transition: "all 0.3s ease",
                      transform: feeling === state.name ? "scale(1.03)" : "scale(1)",
                      opacity: loading ? 0.7 : 1,
                      boxShadow: feeling === state.name ? `0 8px 20px ${state.color}40` : "0 2px 8px rgba(0,0,0,0.1)",
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
                          padding: " 20px",
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
