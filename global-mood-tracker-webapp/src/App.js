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

  // Fixed continent mapping with comprehensive coverage including South America
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
    
    // South America - FIXED with comprehensive coverage
    if (locationLower.includes('são paulo') || locationLower.includes('sao paulo') || 
        locationLower.includes('rio de janeiro') || locationLower.includes('rio') ||
        locationLower.includes('buenos aires') || locationLower.includes('buenos aires') ||
        locationLower.includes('lima') || locationLower.includes('bogotá') || 
        locationLower.includes('bogota') || locationLower.includes('santiago') || 
        locationLower.includes('caracas') || locationLower.includes('quito') || 
        locationLower.includes('montevideo') || locationLower.includes('asuncion') ||
        locationLower.includes('la paz') || locationLower.includes('sucre') ||
        locationLower.includes('georgetown') || locationLower.includes('paramaribo') ||
        locationLower.includes('cayenne') || locationLower.includes('brasilia') ||
        locationLower.includes('brazil') || locationLower.includes('brasil') ||
        locationLower.includes('argentina') || locationLower.includes('peru') || 
        locationLower.includes('colombia') || locationLower.includes('chile') || 
        locationLower.includes('venezuela') || locationLower.includes('ecuador') ||
        locationLower.includes('bolivia') || locationLower.includes('uruguay') ||
        locationLower.includes('paraguay') || locationLower.includes('guyana') ||
        locationLower.includes('suriname') || locationLower.includes('french guiana') ||
        locationLower.includes('south america') || locationLower.includes('sudamerica')) {
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
      <div style={{ textAlign: "center", padding: "10px" }}>
        <svg 
          width="100%" 
          height="auto" 
          viewBox="0 0 1200 700" 
          style={{ 
            maxWidth: "100%", 
            height: "auto", 
            backgroundColor: "#2563eb", 
            border: "4px solid #1e40af", 
            borderRadius: "20px", 
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)" 
          }}
        >
          {/* Ocean background with subtle gradient */}
          <defs>
            <radialGradient id="oceanGradient" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor="#3b82f6"/>
              <stop offset="100%" stopColor="#1e40af"/>
            </radialGradient>
            <pattern id="waves" x="0" y="0" width="60" height="30" patternUnits="userSpaceOnUse">
              <path d="M0 15 Q15 8 30 15 T60 15" stroke="#60a5fa" strokeWidth="1.5" fill="none" opacity="0.3"/>
              <path d="M0 20 Q20 13 40 20 T80 20" stroke="#93c5fd" strokeWidth="1" fill="none" opacity="0.2"/>
            </pattern>
            <filter id="continentShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="3" dy="3" stdDeviation="2" floodOpacity="0.3"/>
            </filter>
          </defs>
          <rect width="100%" height="100%" fill="url(#oceanGradient)"/>
          <rect width="100%" height="100%" fill="url(#waves)"/>

          {/* North America - Improved shape */}
          <path
            d="M80 120 L240 90 L320 95 L380 105 L420 130 L430 160 L425 190 L410 230 L385 270 L350 300 L300 320 L240 330 L180 325 L130 310 L90 280 L70 240 L60 200 L65 160 L75 130 Z"
            fill={continentColors["North America"] || "#e5e7eb"}
            stroke="#ffffff"
            strokeWidth="3"
            filter="url(#continentShadow)"
          />
          {/* Alaska */}
          <path d="M40 140 L80 135 L90 150 L85 170 L70 175 L45 170 L35 155 Z" fill={continentColors["North America"] || "#e5e7eb"} stroke="#ffffff" strokeWidth="2"/>
          {/* Greenland */}
          <path d="M380 70 L430 65 L450 75 L445 100 L425 110 L390 105 L380 85 Z" fill={continentColors["North America"] || "#e5e7eb"} stroke="#ffffff" strokeWidth="2"/>
          <text x="250" y="210" textAnchor="middle" fill="white" fontWeight="bold" fontSize="18" stroke="rgba(0,0,0,0.6)" strokeWidth="1">
            North America
          </text>
          
          {/* South America - Fixed shape to prevent ocean overlap */}
          <path
            d="M220 380 L280 370 L330 375 L360 395 L380 430 L385 480 L375 530 L360 580 L335 620 L300 640 L260 635 L220 620 L190 590 L175 550 L170 510 L175 470 L185 430 L200 400 Z"
            fill={continentColors["South America"] || "#e5e7eb"}
            stroke="#ffffff"
            strokeWidth="3"
            filter="url(#continentShadow)"
          />
          <text x="280" y="510" textAnchor="middle" fill="white" fontWeight="bold" fontSize="17" stroke="rgba(0,0,0,0.6)" strokeWidth="1">
            South America
          </text>
          
          {/* Europe - Better definition */}
          <path
            d="M480 110 L580 100 L640 105 L670 120 L675 145 L665 170 L640 190 L600 200 L550 195 L510 185 L480 165 L470 140 L475 120 Z"
            fill={continentColors["Europe"] || "#e5e7eb"}
            stroke="#ffffff"
            strokeWidth="3"
            filter="url(#continentShadow)"
          />
          {/* Scandinavia */}
          <path d="M550 60 L590 55 L610 70 L605 90 L585 95 L555 90 Z" fill={continentColors["Europe"] || "#e5e7eb"} stroke="#ffffff" strokeWidth="2"/>
          {/* British Isles */}
          <ellipse cx="460" cy="130" rx="15" ry="25" fill={continentColors["Europe"] || "#e5e7eb"} stroke="#ffffff" strokeWidth="2"/>
          <text x="575" y="150" textAnchor="middle" fill="white" fontWeight="bold" fontSize="16" stroke="rgba(0,0,0,0.6)" strokeWidth="1">
            Europe
          </text>
          
          {/* Africa - Enhanced shape */}
          <path
            d="M480 220 L580 210 L640 215 L690 230 L710 260 L715 310 L710 370 L700 430 L685 490 L665 540 L630 570 L590 585 L540 580 L490 570 L450 550 L420 520 L405 480 L400 430 L405 380 L415 330 L430 280 L450 240 Z"
            fill={continentColors["Africa"] || "#e5e7eb"}
            stroke="#ffffff"
            strokeWidth="3"
            filter="url(#continentShadow)"
          />
          <text x="565" y="395" textAnchor="middle" fill="white" fontWeight="bold" fontSize="18" stroke="rgba(0,0,0,0.6)" strokeWidth="1">
            Africa
          </text>
          
          {/* Asia - More detailed */}
          <path
            d="M720 80 L920 70 L980 80 L1020 100 L1050 140 L1055 190 L1040 240 L1010 290 L960 330 L900 350 L840 355 L780 350 L730 340 L690 320 L670 290 L655 250 L660 210 L675 170 L700 130 Z"
            fill={continentColors["Asia"] || "#e5e7eb"}
            stroke="#ffffff"
            strokeWidth="3"
            filter="url(#continentShadow)"
          />
          {/* India subcontinent */}
          <path d="M800 280 L850 275 L880 295 L875 325 L850 340 L820 335 L800 315 Z" fill={continentColors["Asia"] || "#e5e7eb"} stroke="#ffffff" strokeWidth="2"/>
          {/* Southeast Asia islands */}
          <ellipse cx="920" cy="340" rx="25" ry="15" fill={continentColors["Asia"] || "#e5e7eb"} stroke="#ffffff" strokeWidth="2"/>
          <text x="870" y="215" textAnchor="middle" fill="white" fontWeight="bold" fontSize="20" stroke="rgba(0,0,0,0.6)" strokeWidth="1">
            Asia
          </text>
          
          {/* Australia - Better proportioned */}
          <path
            d="M880 480 L980 475 L1020 485 L1040 505 L1035 530 L1015 545 L980 550 L940 545 L900 530 L875 505 Z"
            fill={continentColors["Australia"] || "#e5e7eb"}
            stroke="#ffffff"
            strokeWidth="3"
            filter="url(#continentShadow)"
          />
          {/* New Zealand */}
          <ellipse cx="1070" cy="520" rx="12" ry="30" fill={continentColors["Australia"] || "#e5e7eb"} stroke="#ffffff" strokeWidth="2"/>
          <text x="955" y="520" textAnchor="middle" fill="white" fontWeight="bold" fontSize="16" stroke="rgba(0,0,0,0.6)" strokeWidth="1">
            Australia
          </text>

          {/* Island details */}
          <circle cx="1000" cy="250" r="8" fill={continentColors["Asia"] || "#e5e7eb"} stroke="#ffffff" strokeWidth="2"/>
          <circle cx="1020" cy="270" r="6" fill={continentColors["Asia"] || "#e5e7eb"} stroke="#ffffff" strokeWidth="2"/>
          
          {/* Caribbean */}
          <circle cx="320" cy="290" r="4" fill={continentColors["North America"] || "#e5e7eb"} stroke="#ffffff" strokeWidth="1.5"/>
          <circle cx="330" cy="295" r="3" fill={continentColors["North America"] || "#e5e7eb"} stroke="#ffffff" strokeWidth="1.5"/>
          
          {/* Madagascar */}
          <ellipse cx="720" cy="500" rx="10" ry="25" fill={continentColors["Africa"] || "#e5e7eb"} stroke="#ffffff" strokeWidth="2"/>
          
          {/* Iceland */}
          <circle cx="440" cy="90" r="8" fill={continentColors["Europe"] || "#e5e7eb"} stroke="#ffffff" strokeWidth="2"/>
          
          {/* Decorative ocean labels with better styling */}
          <text x="300" y="60" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="14" fontStyle="italic" fontWeight="500">Arctic Ocean</text>
          <text x="150" y="450" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="14" fontStyle="italic" fontWeight="500">Atlantic</text>
          <text x="900" y="420" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="14" fontStyle="italic" fontWeight="500">Pacific Ocean</text>
          <text x="750" y="400" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="14" fontStyle="italic" fontWeight="500">Indian Ocean</text>
          
          {/* Decorative compass rose */}
          <g transform="translate(1100, 100)">
            <circle r="25" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
            <path d="M0,-20 L5,0 L0,20 L-5,0 Z" fill="rgba(255,255,255,0.8)"/>
            <text y="-30" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="12" fontWeight="bold">N</text>
          </g>
        </svg>
      </div>
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1e40af 0%, #7c3aed 50%, #ec4899 100%)",
        padding: window.innerWidth < 768 ? "10px" : "20px",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: window.innerWidth < 768 ? "20px" : "40px" }}>
          <h1
            style={{
              fontSize: window.innerWidth < 768 ? "2rem" : "3.5rem",
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
              fontSize: window.innerWidth < 768 ? "1rem" : "1.3rem",
              color: "rgba(255,255,255,0.95)",
              margin: "15px 0",
              textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
              padding: "0 10px"
            }}
          >
            Share how you're feeling and see how the world is doing
          </p>
          
          <div style={{ marginTop: "25px", display: "flex", flexDirection: window.innerWidth < 768 ? "column" : "row", justifyContent: "center", gap: window.innerWidth < 768 ? "10px" : "15px", alignItems: "center" }}>
            <button
              onClick={() => setCurrentView("form")}
              style={{
                padding: window.innerWidth < 768 ? "12px 24px" : "15px 30px",
                backgroundColor: currentView === "form" ? "white" : "rgba(255,255,255,0.2)",
                color: currentView === "form" ? "#1e40af" : "white",
                border: "none",
                borderRadius: "30px",
                fontWeight: "700",
                fontSize: window.innerWidth < 768 ? "0.9rem" : "1rem",
                cursor: "pointer",
                transition: "all 0.3s ease",
                transform: currentView === "form" ? "translateY(-2px)" : "translateY(0)",
                boxShadow: currentView === "form" ? "0 8px 20px rgba(0,0,0,0.2)" : "0 4px 10px rgba(0,0,0,0.1)",
                width: window.innerWidth < 768 ? "100%" : "auto",
                maxWidth: window.innerWidth < 768 ? "300px" : "none"
              }}
            >
              📝 Share Your Feelings.
            </button>
            <button
              onClick={() => setCurrentView("map")}
              style={{
                padding: window.innerWidth < 768 ? "12px 24px" : "15px 30px",
                backgroundColor: currentView === "map" ? "white" : "rgba(255,255,255,0.2)",
                color: currentView === "map" ? "#1e40af" : "white",
                border: "none",
                borderRadius: "30px",
                fontWeight: "700",
                fontSize: window.innerWidth < 768 ? "0.9rem" : "1rem",
                cursor: "pointer",
                transition: "all 0.3s ease",
                transform: currentView === "map" ? "translateY(-2px)" : "translateY(0)",
                boxShadow: currentView === "map" ? "0 8px 20px rgba(0,0,0,0.2)" : "0 4px 10px rgba(0,0,0,0.1)",
                width: window.innerWidth < 768 ? "100%" : "auto",
                maxWidth: window.innerWidth < 768 ? "300px" : "none"
              }}
            >
              🗺️ World Map
            </button>
          </div>
        </div>

        {currentView === "form" ? (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: window.innerWidth <"1fr" : "1fr 1fr", 
            gap: window.innerWidth < 768 ? "20px" : "40px" 
          }}>
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "25px",
                padding: window.innerWidth < 768 ? "20px" : "40px",
                boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <h2 style={{ 
                marginTop: "0", 
                color: "#333", 
                fontSize: window.innerWidth < 768 ? "1.4rem" : "1.8rem", 
                fontWeight: "700" 
              }}>
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
                      padding: window.innerWidth < 768 ? "12px" : "18px",
                      backgroundColor: feeling === state.name ? state.color : "#f8f9fa",
                      color: feeling === state.name ? "white" : "#333",
                      border: feeling === state.name ? `3px solid ${state.color}` : "2px solid #e9ecef",
                      borderRadius: "15px",
                      fontSize: window.innerWidth < 768 ? "1rem" : "1.2rem",
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
                  fontSize: window.innerWidth < 768 ? "1rem" : "1.2rem",
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

            {window.innerWidth >= 768 && (
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
            )}
          </div>
        ) : (
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "20px",
              padding: window.innerWidth < 768 ? "15px" : "30px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            }}
          >
            <h2 style={{ 
              marginTop: "0", 
              color: "#333", 
              fontSize: window.innerWidth < 768 ? "1.3rem" : "1.5rem", 
              textAlign: "center" 
            }}>
              🗺️ Global Feelings Map
            </h2>
            <p style={{ 
              textAlign: "center", 
              color: "#666", 
              marginBottom: "30px",
              fontSize: window.innerWidth < 768 ? "0.9rem" : "1rem"
            }}>
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
                
                <div style={{ 
                  marginTop: "20px", 
                  display: "flex", 
                  justifyContent: "center", 
                  flexWrap: "wrap", 
                  gap: window.innerWidth < 768 ? "8px" : "15px" 
                }}>
                  {wellbeingStates.map(state => (
                    <div key={state.name} style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      backgroundColor: "#f8f9fa", 
                      padding: window.innerWidth < 768 ? "6px 10px" : "8px 12px", 
                      borderRadius: "20px",
                      fontSize: window.innerWidth < 768 ? "0.8rem" : "0.9rem"
                    }}>
                      <div
                        style={{
                          width: "12px",
                          height: "12px",
                          backgroundColor: state.color,
                          borderRadius: "50%",
                          marginRight: "8px"
                        }}
                      />
                      <span style={{ fontWeight: "600" }}>{state.emoji} {state.name}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
            
            {responses.length > 0 && (
              <div style={{ 
                marginTop: "30px", 
                display: "grid", 
                gridTemplateColumns: window.innerWidth < 768 ? "1fr" : "repeat(auto-fit, minmax(150px, 1fr))", 
                gap: "20px" 
              }}>
                <div style={{ textAlign: "center", padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "12px" }}>
                  <div style={{ fontSize: "2rem", marginBottom: "5px" }}>📊</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#333" }}>{responses.length}</div>
                  <div style={{ color: "#666", fontSize: window.innerWidth < 768 ? "0.9rem" : "1rem" }}>Total Responses</div>
                </div>
                <div style={{ textAlign: "center", padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "12px" }}>
                  <div style={{ fontSize: "2rem", marginBottom: "5px" }}>⭐</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#333" }}>
                    {continentStats[0]?.dominantState || "N/A"}
                  </div>
                  <div style={{ color: "#666", fontSize: window.innerWidth < 768 ? "0.9rem" : "1rem" }}>Top Global Feeling</div>
                </div>
              </div>
            )}

            {/* Mobile-only continent stats */}
            {window.innerWidth < 768 && continentStats.length > 0 && (
              <div style={{ marginTop: "30px" }}>
                <h3 style={{ color: "#333", fontSize: "1.2rem", marginBottom: "20px", textAlign: "center" }}>
                  🌍 Feelings by Continent
                </h3>
                <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                  {continentStats.map((stat, index) => {
                    const stateData = getWellbeingData(stat.dominantState);
                    return (
                      <div
                        key={index}
                        style={{
                          padding: "15px",
                          marginBottom: "10px",
                          backgroundColor: "#f8f9fa",
                          borderRadius: "12px",
                          borderLeft: `4px solid ${stat.dominantColor}`,
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                          <div>
                            <div style={{ fontSize: "1rem", fontWeight: "700", color: "#333", marginBottom: "3px" }}>
                              🌍 {stat.continent}
                            </div>
                            <div style={{ fontSize: "0.9rem", fontWeight: "600", color: stat.dominantColor }}>
                              {stateData?.emoji} {stat.dominantState}
                            </div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#333" }}>
                              {stat.total}
                            </div>
                            <div style={{ fontSize: "0.7rem", color: "#666" }}>
                              responses
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
