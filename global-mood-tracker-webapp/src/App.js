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

  // Enhanced wellbeing states with more vibrant colors
  const wellbeingStates = [
    { name: "Thriving", color: "#10B981", emoji: "🌟" },
    { name: "Flourishing", color: "#06B6D4", emoji: "🌸" },
    { name: "Content", color: "#8B5CF6", emoji: "😌" },
    { name: "Balanced", color: "#14B8A6", emoji: "⚖️" },
    { name: "Steady", color: "#F59E0B", emoji: "🔄" },
    { name: "Uncertain", color: "#F97316", emoji: "🤔" },
    { name: "Overwhelmed", color: "#EF4444", emoji: "😵‍💫" },
    { name: "Struggling", color: "#DC2626", emoji: "💪" },
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
        dominantColor: "#14B8A6"
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
            continentStats[continent].dominantColor = stateData?.color || "#14B8A6";
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
            background: "linear-gradient(135deg, #1E40AF 0%, #3B82F6 30%, #06B6D4 70%, #0891B2 100%)",
            border: "4px solid #1e40af", 
            borderRadius: "20px", 
            boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
            animation: "oceanPulse 8s ease-in-out infinite alternate"
          }}
        >
          {/* Enhanced ocean background with animated gradients */}
          <defs>
            <radialGradient id="oceanGradient" cx="50%" cy="50%" r="80%">
              <stop offset="0%" stopColor="#0EA5E9"/>
              <stop offset="30%" stopColor="#0284C7"/>
              <stop offset="70%" stopColor="#0369A1"/>
              <stop offset="100%" stopColor="#1E40AF"/>
            </radialGradient>
            
            {/* Animated wave patterns */}
            <pattern id="waves" x="0" y="0" width="80" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 20 Q20 10 40 20 T80 20" stroke="#38BDF8" strokeWidth="2" fill="none" opacity="0.4">
                <animate attributeName="d" dur="6s" repeatCount="indefinite" 
                  values="M0 20 Q20 10 40 20 T80 20;M0 20 Q20 30 40 20 T80 20;M0 20 Q20 10 40 20 T80 20"/>
              </path>
              <path d="M0 25 Q25 15 50 25 T100 25" stroke="#7DD3FC" strokeWidth="1.5" fill="none" opacity="0.3">
                <animate attributeName="d" dur="8s" repeatCount="indefinite" 
                  values="M0 25 Q25 15 50 25 T100 25;M0 25 Q25 35 50 25 T100 25;M0 25 Q25 15 50 25 T100 25"/>
              </path>
            </pattern>
            
            <filter id="continentShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="4" dy="4" stdDeviation="3" floodOpacity="0.4"/>
            </filter>
            
            <filter id="continentGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            {/* Animated pulse for continents */}
            <style>
              {`
                @keyframes oceanPulse {
                  0% { filter: hue-rotate(0deg); }
                  100% { filter: hue-rotate(15deg); }
                }
                @keyframes continentPulse {
                  0%, 100% { transform: scale(1); }
                  50% { transform: scale(1.02); }
                }
                .continent {
                  animation: continentPulse 4s ease-in-out infinite;
                  transform-origin: center;
                  transition: all 0.3s ease;
                }
                .continent:hover {
                  filter: brightness(1.2) drop-shadow(0 0 10px currentColor);
                  transform: scale(1.05) !important;
                }
              `}
            </style>
          </defs>
          
          <rect width="100%" height="100%" fill="url(#oceanGradient)"/>
          <rect width="100%" height="100%" fill="url(#waves)"/>

          {/* North America - Enhanced with animation */}
          <g className="continent">
            <path
              d="M80 120 L240 90 L320 95 L380 105 L420 130 L430 160 L425 190 L410 230 L385 270 L350 300 L300 320 L240 330 L180 325 L130 310 L90 280 L70 240 L60 200 L65 160 L75 130 Z"
              fill={continentColors["North America"] || "#34D399"}
              stroke="#ffffff"
              strokeWidth="4"
              filter="url(#continentShadow)"
              style={{ filter: continentColors["North America"] ? `url(#continentGlow) drop-shadow(0 0 8px ${continentColors["North America"]}50)` : "url(#continentGlow)" }}
            />
            {/* Alaska */}
            <path d="M40 140 L80 135 L90 150 L85 170 L70 175 L45 170 L35 155 Z" 
              fill={continentColors["North America"] || "#34D399"} stroke="#ffffff" strokeWidth="3"/>
            {/* Greenland */}
            <path d="M380 70 L430 65 L450 75 L445 100 L425 110 L390 105 L380 85 Z" 
              fill={continentColors["North America"] || "#34D399"} stroke="#ffffff" strokeWidth="3"/>
            <text x="250" y="210" textAnchor="middle" fill="white" fontWeight="bold" fontSize="20" 
              stroke="rgba(0,0,0,0.7)" strokeWidth="2" filter="url(#continentShadow)">
              North America
            </text>
          </g>
          
          {/* South America - Enhanced */}
          <g className="continent">
            <path
              d="M220 380 L280 370 L330 375 L360 395 L380 430 L385 480 L375 530 L360 580 L335 620 L300 640 L260 635 L220 620 L190 590 L175 550 L170 510 L175 470 L185 430 L200 400 Z"
              fill={continentColors["South America"] || "#F59E0B"}
              stroke="#ffffff"
              strokeWidth="4"
              filter="url(#continentShadow)"
              style={{ filter: continentColors["South America"] ? `url(#continentGlow) drop-shadow(0 0 8px ${continentColors["South America"]}50)` : "url(#continentGlow)" }}
            />
            <text x="280" y="510" textAnchor="middle" fill="white" fontWeight="bold" fontSize="19" 
              stroke="rgba(0,0,0,0.7)" strokeWidth="2" filter="url(#continentShadow)">
              South America
            </text>
          </g>
          
          {/* Europe - Enhanced */}
          <g className="continent">
            <path
              d="M480 110 L580 100 L640 105 L670 120 L675 145 L665 170 L640 190 L600 200 L550 195 L510 185 L480 165 L470 140 L475 120 Z"
              fill={continentColors["Europe"] || "#8B5CF6"}
              stroke="#ffffff"
              strokeWidth="4"
              filter="url(#continentShadow)"
              style={{ filter: continentColors["Europe"] ? `url(#continentGlow) drop-shadow(0 0 8px ${continentColors["Europe"]}50)` : "url(#continentGlow)" }}
            />
            {/* Scandinavia */}
            <path d="M550 60 L590 55 L610 70 L605 90 L585 95 L555 90 Z" 
              fill={continentColors["Europe"] || "#8B5CF6"} stroke="#ffffff" strokeWidth="3"/>
            {/* British Isles */}
            <ellipse cx="460" cy="130" rx="18" ry="28" 
              fill={continentColors["Europe"] || "#8B5CF6"} stroke="#ffffff" strokeWidth="3"/>
            <text x="575" y="150" textAnchor="middle" fill="white" fontWeight="bold" fontSize="18" 
              stroke="rgba(0,0,0,0.7)" strokeWidth="2" filter="url(#continentShadow)">
              Europe
            </text>
          </g>
          
          {/* Africa - Enhanced */}
          <g className="continent">
            <path
              d="M480 220 L580 210 L640 215 L690 230 L710 260 L715 310 L710 370 L700 430 L685 490 L665 540 L630 570 L590 585 L540 580 L490 570 L450 550 L420 520 L405 480 L400 430 L405 380 L415 330 L430 280 L450 240 Z"
              fill={continentColors["Africa"] || "#EF4444"}
              stroke="#ffffff"
              strokeWidth="4"
              filter="url(#continentShadow)"
              style={{ filter: continentColors["Africa"] ? `url(#continentGlow) drop-shadow(0 0 8px ${continentColors["Africa"]}50)` : "url(#continentGlow)" }}
            />
            <text x="565" y="395" textAnchor="middle" fill="white" fontWeight="bold" fontSize="20" 
              stroke="rgba(0,0,0,0.7)" strokeWidth="2" filter="url(#continentShadow)">
              Africa
            </text>
          </g>
          
          {/* Asia - Enhanced */}
          <g className="continent">
            <path
              d="M720 80 L920 70 L980 80 L1020 100 L1050 140 L1055 190 L1040 240 L1010 290 L960 330 L900 350 L840 355 L780 350 L730 340 L690 320 L670 290 L655 250 L660 210 L675 170 L700 130 Z"
              fill={continentColors["Asia"] || "#06B6D4"}
              stroke="#ffffff"
              strokeWidth="4"
              filter="url(#continentShadow)"
              style={{ filter: continentColors["Asia"] ? `url(#continentGlow) drop-shadow(0 0 8px ${continentColors["Asia"]}50)` : "url(#continentGlow)" }}
            />
            {/* India subcontinent */}
            <path d="M800 280 L850 275 L880 295 L875 325 L850 340 L820 335 L800 315 Z" 
              fill={continentColors["Asia"] || "#06B6D4"} stroke="#ffffff" strokeWidth="3"/>
            {/* Southeast Asia islands */}
            <ellipse cx="920" cy="340" rx="28" ry="18" 
              fill={continentColors["Asia"] || "#06B6D4"} stroke="#ffffff" strokeWidth="3"/>
            <text x="870" y="215" textAnchor="middle" fill="white" fontWeight="bold" fontSize="22" 
              stroke="rgba(0,0,0,0.7)" strokeWidth="2" filter="url(#continentShadow)">
              Asia
            </text>
          </g>
          
          {/* Australia - Enhanced */}
          <g className="continent">
            <path
              d="M880 480 L980 475 L1020 485 L1040 505 L1035 530 L1015 545 L980 550 L940 545 L900 530 L875 505 Z"
              fill={continentColors["Australia"] || "#10B981"}
              stroke="#ffffff"
              strokeWidth="4"
              filter="url(#continentShadow)"
              style={{ filter: continentColors["Australia"] ? `url(#continentGlow) drop-shadow(0 0 8px ${continentColors["Australia"]}50)` : "url(#continentGlow)" }}
            />
            {/* New Zealand */}
            <ellipse cx="1070" cy="520" rx="15" ry="35" 
              fill={continentColors["Australia"] || "#10B981"} stroke="#ffffff" strokeWidth="3"/>
            <text x="955" y="520" textAnchor="middle" fill="white" fontWeight="bold" fontSize="18" 
              stroke="rgba(0,0,0,0.7)" strokeWidth="2" filter="url(#continentShadow)">
              Australia
            </text>
          </g>

          {/* Enhanced island details with glow */}
          <circle cx="1000" cy="250" r="10" fill={continentColors["Asia"] || "#06B6D4"} stroke="#ffffff" strokeWidth="3"
            style={{ filter: "drop-shadow(0 0 4px currentColor)" }}/>
          <circle cx="1020" cy="270" r="8" fill={continentColors["Asia"] || "#06B6D4"} stroke="#ffffff" strokeWidth="3"
            style={{ filter: "drop-shadow(0 0 4px currentColor)" }}/>
          
          {/* Caribbean with glow */}
          <circle cx="320" cy="290" r="6" fill={continentColors["North America"] || "#34D399"} stroke="#ffffff" strokeWidth="2"
            style={{ filter: "drop-shadow(0 0 3px currentColor)" }}/>
          <circle cx="330" cy="295" r="4" fill={continentColors["North America"] || "#34D399"} stroke="#ffffff" strokeWidth="2"
            style={{ filter: "drop-shadow(0 0 3px currentColor)" }}/>
          
          {/* Madagascar with glow */}
          <ellipse cx="720" cy="500" rx="12" ry="28" fill={continentColors["Africa"] || "#EF4444"} stroke="#ffffff" strokeWidth="3"
            style={{ filter: "drop-shadow(0 0 4px currentColor)" }}/>
          
          {/* Iceland with glow */}
          <circle cx="440" cy="90" r="10" fill={continentColors["Europe"] || "#8B5CF6"} stroke="#ffffff" strokeWidth="3"
            style={{ filter: "drop-shadow(0 0 4px currentColor)" }}/>
          
          {/* Enhanced decorative ocean labels */}
          <text x="300" y="60" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="16" fontStyle="italic" fontWeight="600"
            style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}>Arctic Ocean</text>
          <text x="150" y="450" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="16" fontStyle="italic" fontWeight="600"
            style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}>Atlantic</text>
          <text x="900" y="420" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="16" fontStyle="italic" fontWeight="600"
            style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}>Pacific Ocean</text>
          <text x="750" y="400" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="16" fontStyle="italic" fontWeight="600"
             style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}>Indian Ocean</text>

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
)
