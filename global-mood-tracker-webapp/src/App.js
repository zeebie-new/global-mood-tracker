import React, { useState, useEffect } from "react";

const supabaseUrl = 'https://yanrhgiateygysckenkf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhbnJoZ2lhdGV5Z3lzY2tlbmtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5ODExOTQsImV4cCI6MjA2NTU1NzE5NH0.baFtpvhBKwq3TJ3dusZQ2-1ru9u0oN_khqRjH4PAZWA';

// Proper Supaaaaaaaaaaaabase client implemntation
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
    { name: "Flourishing", color: "#FFC0CB", emoji: "🌸" },
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
    locationLower.includes('new jersey') || locationLower.includes('nevada') ||
    
    // Additional Major US Cities
    locationLower.includes('san diego') || locationLower.includes('san antonio') ||
    locationLower.includes('austin') || locationLower.includes('fort worth') ||
    locationLower.includes('charlotte') || locationLower.includes('columbus') ||
    locationLower.includes('indianapolis') || locationLower.includes('san jose') ||
    locationLower.includes('jacksonville') || locationLower.includes('baltimore') ||
    locationLower.includes('milwaukee') || locationLower.includes('nashville') ||
    locationLower.includes('oklahoma city') || locationLower.includes('memphis') ||
    locationLower.includes('louisville') || locationLower.includes('portland') ||
    locationLower.includes('tucson') || locationLower.includes('fresno') ||
    locationLower.includes('sacramento') || locationLower.includes('kansas city') ||
    locationLower.includes('mesa') || locationLower.includes('virginia beach') ||
    locationLower.includes('omaha') || locationLower.includes('colorado springs') ||
    locationLower.includes('raleigh') || locationLower.includes('long beach') ||
    locationLower.includes('minneapolis') || locationLower.includes('cleveland') ||
    locationLower.includes('pittsburgh') || locationLower.includes('cincinnati') ||
    locationLower.includes('salt lake city') || locationLower.includes('richmond') ||
    locationLower.includes('buffalo') || locationLower.includes('albany') ||
    locationLower.includes('rochester') || locationLower.includes('syracuse') ||
    
    // Canadian Cities
    locationLower.includes('calgary') || locationLower.includes('edmonton') ||
    locationLower.includes('ottawa') || locationLower.includes('winnipeg') ||
    locationLower.includes('quebec city') || locationLower.includes('hamilton') ||
    locationLower.includes('kitchener') || locationLower.includes('london') ||
    locationLower.includes('halifax') || locationLower.includes('victoria') ||
    locationLower.includes('saskatoon') || locationLower.includes('regina') ||
    locationLower.includes('sherbrooke') || locationLower.includes('barrie') ||
    locationLower.includes('kelowna') || locationLower.includes('abbotsford') ||
    locationLower.includes('kingston') || locationLower.includes('sudbury') ||
    locationLower.includes('thunder bay') || locationLower.includes('saint john') ||
    
    // Mexican Cities
    locationLower.includes('guadalajara') || locationLower.includes('puebla') ||
    locationLower.includes('tijuana') || locationLower.includes('leon') ||
    locationLower.includes('juarez') || locationLower.includes('torreon') ||
    locationLower.includes('merida') || locationLower.includes('chihuahua') ||
    locationLower.includes('san luis potosi') || locationLower.includes('aguascalientes') ||
    locationLower.includes('mexicali') || locationLower.includes('tampico') ||
    locationLower.includes('veracruz') || locationLower.includes('acapulco') ||
    locationLower.includes('cancun') || locationLower.includes('mazatlan') ||
    locationLower.includes('morelia') || locationLower.includes('xalapa') ||
    locationLower.includes('oaxaca') || locationLower.includes('cuernavaca') ||
    
    // Additional US States
    locationLower.includes('arizona') || locationLower.includes('colorado') ||
    locationLower.includes('georgia') || locationLower.includes('illinois') ||
    locationLower.includes('indiana') || locationLower.includes('maryland') ||
    locationLower.includes('massachusetts') || locationLower.includes('michigan') ||
    locationLower.includes('minnesota') || locationLower.includes('missouri') ||
    locationLower.includes('north carolina') || locationLower.includes('ohio') ||
    locationLower.includes('oregon') || locationLower.includes('pennsylvania') ||
    locationLower.includes('tennessee') || locationLower.includes('utah') ||
    locationLower.includes('virginia') || locationLower.includes('wisconsin') ||
    locationLower.includes('alabama') || locationLower.includes('arkansas') ||
    locationLower.includes('connecticut') || locationLower.includes('delaware') ||
    locationLower.includes('hawaii') || locationLower.includes('idaho') ||
    locationLower.includes('iowa') || locationLower.includes('kansas') ||
    locationLower.includes('kentucky') || locationLower.includes('louisiana') ||
    locationLower.includes('maine') || locationLower.includes('mississippi') ||
    locationLower.includes('montana') || locationLower.includes('nebraska') ||
    locationLower.includes('new hampshire') || locationLower.includes('new mexico') ||
    locationLower.includes('north dakota') || locationLower.includes('oklahoma') ||
    locationLower.includes('rhode island') || locationLower.includes('south carolina') ||
    locationLower.includes('south dakota') || locationLower.includes('vermont') ||
    locationLower.includes('west virginia') || locationLower.includes('wyoming') ||
    locationLower.includes('alaska') ||
    
    // Canadian Provinces/Territories
    locationLower.includes('ontario') || locationLower.includes('quebec') ||
    locationLower.includes('british columbia') || locationLower.includes('alberta') ||
    locationLower.includes('manitoba') || locationLower.includes('saskatchewan') ||
    locationLower.includes('nova scotia') || locationLower.includes('new brunswick') ||
    locationLower.includes('newfoundland') || locationLower.includes('prince edward island') ||
    locationLower.includes('northwest territories') || locationLower.includes('nunavut') ||
    locationLower.includes('yukon') ||
    
    // Mexican States
    locationLower.includes('jalisco') || locationLower.includes('nuevo leon') ||
    locationLower.includes('baja california') || locationLower.includes('sonora') ||
    locationLower.includes('chihuahua') || locationLower.includes('veracruz') ||
    locationLower.includes('yucatan') || locationLower.includes('puebla') ||
    locationLower.includes('guanajuato') || locationLower.includes('michoacan') ||
    locationLower.includes('oaxaca') || locationLower.includes('guerrero') ||
    locationLower.includes('tamaulipas') || locationLower.includes('sinaloa') ||
    locationLower.includes('coahuila') || locationLower.includes('quintana roo')) {
    
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
    locationLower.includes('netherlands') || locationLower.includes('belgium') ||
    
    // All European Cities (Major and Minor)
    locationLower.includes('lisbon') || locationLower.includes('athens') ||
    locationLower.includes('budapest') || locationLower.includes('warsaw') ||
    locationLower.includes('munich') || locationLower.includes('milan') ||
    locationLower.includes('naples') || locationLower.includes('valencia') ||
    locationLower.includes('seville') || locationLower.includes('porto') ||
    locationLower.includes('florence') || locationLower.includes('venice') ||
    locationLower.includes('lyon') || locationLower.includes('marseille') ||
    locationLower.includes('toulouse') || locationLower.includes('nice') ||
    locationLower.includes('hamburg') || locationLower.includes('cologne') ||
    locationLower.includes('frankfurt') || locationLower.includes('stuttgart') ||
    locationLower.includes('manchester') || locationLower.includes('birmingham') ||
    locationLower.includes('glasgow') || locationLower.includes('edinburgh') ||
    locationLower.includes('liverpool') || locationLower.includes('bristol') ||
    locationLower.includes('leeds') || locationLower.includes('cardiff') ||
    locationLower.includes('belfast') || locationLower.includes('sheffield') ||
    locationLower.includes('nottingham') || locationLower.includes('leicester') ||
    locationLower.includes('helsinki') || locationLower.includes('gothenburg') ||
    locationLower.includes('malmo') || locationLower.includes('bergen') ||
    locationLower.includes('trondheim') || locationLower.includes('stavanger') ||
    locationLower.includes('aarhus') || locationLower.includes('odense') ||
    locationLower.includes('aalborg') || locationLower.includes('tampere') ||
    locationLower.includes('turku') || locationLower.includes('espoo') ||
    locationLower.includes('reykjavik') || locationLower.includes('krakow') ||
    locationLower.includes('gdansk') || locationLower.includes('wroclaw') ||
    locationLower.includes('poznan') || locationLower.includes('lodz') ||
    locationLower.includes('st petersburg') || locationLower.includes('saint petersburg') ||
    locationLower.includes('novosibirsk') || locationLower.includes('yekaterinburg') ||
    locationLower.includes('nizhny novgorod') || locationLower.includes('kazan') ||
    locationLower.includes('samara') || locationLower.includes('omsk') ||
    locationLower.includes('chelyabinsk') || locationLower.includes('rostov') ||
    locationLower.includes('ufa') || locationLower.includes('volgograd') ||
    locationLower.includes('perm') || locationLower.includes('brno') ||
    locationLower.includes('ostrava') || locationLower.includes('bratislava') ||
    locationLower.includes('kosice') || locationLower.includes('debrecen') ||
    locationLower.includes('szeged') || locationLower.includes('pecs') ||
    locationLower.includes('miskolc') || locationLower.includes('ljubljana') ||
    locationLower.includes('maribor') || locationLower.includes('zagreb') ||
    locationLower.includes('split') || locationLower.includes('rijeka') ||
    locationLower.includes('osijek') || locationLower.includes('belgrade') ||
    locationLower.includes('novi sad') || locationLower.includes('nis') ||
    locationLower.includes('kragujevac') || locationLower.includes('sarajevo') ||
    locationLower.includes('banja luka') || locationLower.includes('tuzla') ||
    locationLower.includes('zenica') || locationLower.includes('skopje') ||
    locationLower.includes('bitola') || locationLower.includes('kumanovo') ||
    locationLower.includes('ohrid') || locationLower.includes('sofia') ||
    locationLower.includes('plovdiv') || locationLower.includes('varna') ||
    locationLower.includes('burgas') || locationLower.includes('bucharest') ||
    locationLower.includes('cluj napoca') || locationLower.includes('timisoara') ||
    locationLower.includes('iasi') || locationLower.includes('constanta') ||
    locationLower.includes('craiova') || locationLower.includes('brasov') ||
    locationLower.includes('galati') || locationLower.includes('tirana') ||
    locationLower.includes('durres') || locationLower.includes('vlore') ||
    locationLower.includes('shkoder') || locationLower.includes('pristina') ||
    locationLower.includes('prizren') || locationLower.includes('peja') ||
    locationLower.includes('ferizaj') || locationLower.includes('podgorica') ||
    locationLower.includes('niksic') || locationLower.includes('pljevlja') ||
    locationLower.includes('bar') || locationLower.includes('geneva') ||
    locationLower.includes('basel') || locationLower.includes('bern') ||
    locationLower.includes('lausanne') || locationLower.includes('winterthur') ||
    locationLower.includes('lucerne') || locationLower.includes('st gallen') ||
    locationLower.includes('lugano') || locationLower.includes('graz') ||
    locationLower.includes('linz') || locationLower.includes('salzburg') ||
    locationLower.includes('innsbruck') || locationLower.includes('klagenfurt') ||
    locationLower.includes('villach') || locationLower.includes('coimbra') ||
    locationLower.includes('braga') || locationLower.includes('funchal') ||
    locationLower.includes('aveiro') || locationLower.includes('viseu') ||
    locationLower.includes('setubal') || locationLower.includes('thessaloniki') ||
    locationLower.includes('patras') || locationLower.includes('heraklion') ||
    locationLower.includes('larissa') || locationLower.includes('volos') ||
    locationLower.includes('ioannina') || locationLower.includes('kavala') ||
    locationLower.includes('rhodes') || locationLower.includes('istanbul') ||
    locationLower.includes('edirne') || locationLower.includes('tekirdag') ||
    locationLower.includes('kirklareli') ||
    
    // Minor Cities and Towns
    locationLower.includes('oxford') || locationLower.includes('cambridge') ||
    locationLower.includes('canterbury') || locationLower.includes('york') ||
    locationLower.includes('bath') || locationLower.includes('exeter') ||
    locationLower.includes('brighton') || locationLower.includes('bournemouth') ||
    locationLower.includes('blackpool') || locationLower.includes('chester') ||
    locationLower.includes('durham') || locationLower.includes('norwich') ||
    locationLower.includes('coventry') || locationLower.includes('bradford') ||
    locationLower.includes('preston') || locationLower.includes('hull') ||
    locationLower.includes('swansea') || locationLower.includes('newport') ||
    locationLower.includes('aberdeen') || locationLower.includes('dundee') ||
    locationLower.includes('stirling') || locationLower.includes('inverness') ||
    locationLower.includes('perth') || locationLower.includes('derry') ||
    locationLower.includes('londonderry') || locationLower.includes('armagh') ||
    locationLower.includes('cork') || locationLower.includes('galway') ||
    locationLower.includes('limerick') || locationLower.includes('waterford') ||
    locationLower.includes('kilkenny') || locationLower.includes('derry') ||
    locationLower.includes('nantes') || locationLower.includes('strasbourg') ||
    locationLower.includes('montpellier') || locationLower.includes('bordeaux') ||
    locationLower.includes('lille') || locationLower.includes('rennes') ||
    locationLower.includes('reims') || locationLower.includes('le havre') ||
    locationLower.includes('saint etienne') || locationLower.includes('toulon') ||
    locationLower.includes('grenoble') || locationLower.includes('dijon') ||
    locationLower.includes('angers') || locationLower.includes('villeurbanne') ||
    locationLower.includes('le mans') || locationLower.includes('brest') ||
    locationLower.includes('tours') || locationLower.includes('amiens') ||
    locationLower.includes('limoges') || locationLower.includes('clermont ferrand') ||
    locationLower.includes('besancon') || locationLower.includes('orléans') ||
    locationLower.includes('metz') || locationLower.includes('rouen') ||
    locationLower.includes('mulhouse') || locationLower.includes('caen') ||
    locationLower.includes('nancy') || locationLower.includes('avignon') ||
    locationLower.includes('cannes') || locationLower.includes('perpignan') ||
    locationLower.includes('dusseldorf') || locationLower.includes('dresden') ||
    locationLower.includes('leipzig') || locationLower.includes('hannover') ||
    locationLower.includes('nuremberg') || locationLower.includes('duisburg') ||
    locationLower.includes('bochum') || locationLower.includes('wuppertal') ||
    locationLower.includes('bielefeld') || locationLower.includes('bonn') ||
    locationLower.includes('munster') || locationLower.includes('karlsruhe') ||
    locationLower.includes('mannheim') || locationLower.includes('augsburg') ||
    locationLower.includes('wiesbaden') || locationLower.includes('gelsenkirchen') ||
    locationLower.includes('monchengladbach') || locationLower.includes('braunschweig') ||
    locationLower.includes('chemnitz') || locationLower.includes('kiel') ||
    locationLower.includes('aachen') || locationLower.includes('halle') ||
    locationLower.includes('magdeburg') || locationLower.includes('freiburg') ||
    locationLower.includes('krefeld') || locationLower.includes('lubeck') ||
    locationLower.includes('oberhausen') || locationLower.includes('erfurt') ||
    locationLower.includes('mainz') || locationLower.includes('rostock') ||
    locationLower.includes('kassel') || locationLower.includes('hagen') ||
    locationLower.includes('potsdam') || locationLower.includes('saarbrucken') ||
    locationLower.includes('hamm') || locationLower.includes('mulheim') ||
    locationLower.includes('ludwigshafen') || locationLower.includes('oldenburg') ||
    locationLower.includes('leverkusen') || locationLower.includes('osnabrück') ||
    locationLower.includes('solingen') || locationLower.includes('heidelberg') ||
    locationLower.includes('turin') || locationLower.includes('palermo') ||
    locationLower.includes('genoa') || locationLower.includes('bologna') ||
    locationLower.includes('catania') || locationLower.includes('bari') ||
    locationLower.includes('messina') || locationLower.includes('verona') ||
    locationLower.includes('padova') || locationLower.includes('trieste') ||
    locationLower.includes('brescia') || locationLower.includes('taranto') ||
    locationLower.includes('prato') || locationLower.includes('parma') ||
    locationLower.includes('modena') || locationLower.includes('reggio calabria') ||
    locationLower.includes('reggio emilia') || locationLower.includes('perugia') ||
    locationLower.includes('ravenna') || locationLower.includes('livorno') ||
    locationLower.includes('cagliari') || locationLower.includes('foggia') ||
    locationLower.includes('rimini') || locationLower.includes('salerno') ||
    locationLower.includes('ferrara') || locationLower.includes('sassari') ||
    locationLower.includes('syracuse') || locationLower.includes('pescara') ||
    locationLower.includes('monza') || locationLower.includes('bergamo') ||
    locationLower.includes('trento') || locationLower.includes('vicenza') ||
    locationLower.includes('terni') || locationLower.includes('bolzano') ||
    locationLower.includes('novara') || locationLower.includes('piacenza') ||
    locationLower.includes('ancona') || locationLower.includes('andria') ||
    locationLower.includes('arezzo') || locationLower.includes('udine') ||
    locationLower.includes('cesena') || locationLower.includes('lecce') ||
    locationLower.includes('bilbao') || locationLower.includes('alicante') ||
    locationLower.includes('cordoba') || locationLower.includes('valladolid') ||
    locationLower.includes('vigo') || locationLower.includes('gijon') ||
    locationLower.includes('hospitalet') || locationLower.includes('la coruna') ||
    locationLower.includes('vitoria gasteiz') || locationLower.includes('granada') ||
    locationLower.includes('elche') || locationLower.includes('oviedo') ||
    locationLower.includes('badalona') || locationLower.includes('cartagena') ||
    locationLower.includes('terrassa') || locationLower.includes('jerez') ||
    locationLower.includes('sabadell') || locationLower.includes('mostoles') ||
    locationLower.includes('alcala de henares') || locationLower.includes('pamplona') ||
    locationLower.includes('fuenlabrada') || locationLower.includes('almeria') ||
    locationLower.includes('leganes') || locationLower.includes('santander') ||
    locationLower.includes('burgos') || locationLower.includes('castellon') ||
    locationLower.includes('alcorcon') || locationLower.includes('albacete') ||
    locationLower.includes('getafe') || locationLower.includes('salamanca') ||
    locationLower.includes('huelva') || locationLower.includes('logrono') ||
    locationLower.includes('badajoz') || locationLower.includes('tarragona') ||
    locationLower.includes('leon') || locationLower.includes('cadiz') ||
    locationLower.includes('lleida') || locationLower.includes('marbella') ||
    locationLower.includes('dos hermanas') || locationLower.includes('mataro') ||
    locationLower.includes('torrevieja') || locationLower.includes('parla') ||
    locationLower.includes('alcobendas') || locationLower.includes('torrejon') ||
    locationLower.includes('reus') || locationLower.includes('ourense') ||
    locationLower.includes('guadalajara') || locationLower.includes('lugo') ||
    locationLower.includes('santiago') || locationLower.includes('caceres') ||
    locationLower.includes('lorca') || locationLower.includes('coslada') ||
    locationLower.includes('talavera') || locationLower.includes('el ejido') ||
    locationLower.includes('zamora') || locationLower.includes('girona') ||
    locationLower.includes('segovia') || locationLower.includes('cuenca') ||
    locationLower.includes('jaen') || locationLower.includes('palencia') ||
    locationLower.includes('orense') || locationLower.includes('avila') ||
    locationLower.includes('soria') || locationLower.includes('teruel') ||
    locationLower.includes('huesca') || locationLower.includes('toledo') ||
    locationLower.includes('ceuta') || locationLower.includes('melilla') ||
    locationLower.includes('faro') || locationLower.includes('leiria') ||
    locationLower.includes('evora') || locationLower.includes('beja') ||
    locationLower.includes('castelo branco') || locationLower.includes('guarda') ||
    locationLower.includes('portalegre') || locationLower.includes('santarem') ||
    locationLower.includes('torres vedras') || locationLower.includes('sintra') ||
    locationLower.includes('cascais') || locationLower.includes('almada') ||
    locationLower.includes('barreiro') || locationLower.includes('amadora') ||
    locationLower.includes('matosinhos') || locationLower.includes('gondomar') ||
    locationLower.includes('vila nova de gaia') || locationLower.includes('maia') ||
    locationLower.includes('guimaraes') || locationLower.includes('barcelos') ||
    locationLower.includes('santo tirso') || locationLower.includes('famalicao') ||
    locationLower.includes('katowice') || locationLower.includes('bialystok') ||
    locationLower.includes('bydgoszcz') || locationLower.includes('lublin') ||
    locationLower.includes('czestochowa') || locationLower.includes('radom') ||
    locationLower.includes('sosnowiec') || locationLower.includes('torun') ||
    locationLower.includes('kielce') || locationLower.includes('gliwice') ||
    locationLower.includes('zabrze') || locationLower.includes('bytom') ||
    locationLower.includes('olsztyn') || locationLower.includes('bielsko biala') ||
    locationLower.includes('rzeszow') || locationLower.includes('rybnik') ||
    locationLower.includes('ruda slaska') || locationLower.includes('tychy') ||
    locationLower.includes('opole') || locationLower.includes('gorzow') ||
    locationLower.includes('elblag') || locationLower.includes('walbrzych') ||
    locationLower.includes('wloclawek') || locationLower.includes('tarnow') ||
    locationLower.includes('chorzow') || locationLower.includes('koszalin') ||
    locationLower.includes('kalisz') || locationLower.includes('legnica') ||
    locationLower.includes('grudziadz') || locationLower.includes('jaworzno') ||
    locationLower.includes('slupsk') || locationLower.includes('jastrzebie') ||
    locationLower.includes('nowy sacz') || locationLower.includes('jelenia gora') ||
    locationLower.includes('konin') || locationLower.includes('piotrków') ||
    locationLower.includes('lubin') || locationLower.includes('inowroclaw') ||
    locationLower.includes('ostrów') || locationLower.includes('stargard') ||
    locationLower.includes('gniezno') || locationLower.includes('sieradz') ||
    locationLower.includes('ostroleka') || locationLower.includes('zawiercie') ||
    locationLower.includes('oświęcim') || locationLower.includes('starachowice') ||
    locationLower.includes('pila') || locationLower.includes('lomza') ||
    locationLower.includes('belchatow') || locationLower.includes('zgierz') ||
    locationLower.includes('tczew') || locationLower.includes('malbork') ||
    locationLower.includes('kutno') || locationLower.includes('raciborz') ||
    locationLower.includes('nysa') || locationLower.includes('zielona gora') ||
    locationLower.includes('leszno') || locationLower.includes('wodzislaw') ||
    locationLower.includes('tarnowskie gory') || locationLower.includes('kędzierzyn') ||
    locationLower.includes('skierniewice') || locationLower.includes('ostrowiec') ||
    locationLower.includes('chełm') || locationLower.includes('zamość') ||
    locationLower.includes('biała podlaska') || locationLower.includes('pulawy') ||
    locationLower.includes('stalowa wola') || locationLower.includes('krosno') ||
    locationLower.includes('przemysl') || locationLower.includes('mielec') ||
    locationLower.includes('debica') || locationLower.includes('tarnobrzeg') ||
    locationLower.includes('nowy targ') || locationLower.includes('zakopane') ||
    locationLower.includes('pszczyna') || locationLower.includes('otwock') ||
    locationLower.includes('pruszkow') || locationLower.includes('piaseczno') ||
    locationLower.includes('legionowo') || locationLower.includes('marki') ||
    locationLower.includes('wolomin') || locationLower.includes('milanowek') ||
    locationLower.includes('konstancin') || locationLower.includes('grodzisk') ||
    locationLower.includes('zyrardow') || locationLower.includes('sochaczew') ||
    locationLower.includes('pruszków') || locationLower.includes('raszyn') ||
    locationLower.includes('ursus') || locationLower.includes('bemowo') ||
    locationLower.includes('wola') || locationLower.includes('ochota') ||
    locationLower.includes('mokotow') || locationLower.includes('wilanow') ||
    locationLower.includes('ursynow') || locationLower.includes('natolin') ||
    locationLower.includes('kabaty') || locationLower.includes('rembertow') ||
    locationLower.includes('wawer') || locationLower.includes('wesola') ||
    locationLower.includes('sulejowek') || locationLower.includes('halinow') ||
    locationLower.includes('jozefow') || locationLower.includes('otwock') ||
    locationLower.includes('karczew') || locationLower.includes('celestynow') ||
    locationLower.includes('góra kalwaria') || locationLower.includes('piaseczno') ||
    
    // Additional Countries
    locationLower.includes('portugal') || locationLower.includes('greece') ||
    locationLower.includes('austria') || locationLower.includes('switzerland') ||
    locationLower.includes('finland') || locationLower.includes('iceland') ||
    locationLower.includes('ireland') || locationLower.includes('scotland') ||
    locationLower.includes('wales') || locationLower.includes('northern ireland') ||
    locationLower.includes('czech republic') || locationLower.includes('slovakia') ||
    locationLower.includes('hungary') || locationLower.includes('slovenia') ||
    locationLower.includes('croatia') || locationLower.includes('serbia') ||
    locationLower.includes('bosnia') || locationLower.includes('herzegovina') ||
    locationLower.includes('montenegro') || locationLower.includes('albania') ||
    locationLower.includes('north macedonia') || locationLower.includes('macedonia') ||
    locationLower.includes('bulgaria') || locationLower.includes('romania') ||
    locationLower.includes('moldova') || locationLower.includes('ukraine') ||
    locationLower.includes('belarus') || locationLower.includes('lithuania') ||
    locationLower.includes('latvia') || locationLower.includes('estonia') ||
    locationLower.includes('kosovo') || locationLower.includes('luxembourg') ||
    locationLower.includes('liechtenstein') || locationLower.includes('monaco') ||
    locationLower.includes('san marino') || locationLower.includes('vatican') ||
    locationLower.includes('andorra') || locationLower.includes('malta') ||
    locationLower.includes('cyprus') || locationLower.includes('turkey') ||
    
    // Regional Terms
    locationLower.includes('scandinavia') || locationLower.includes('scandinavian') ||
    locationLower.includes('balkans') || locationLower.includes('balkan') ||
    locationLower.includes('eastern europe') || locationLower.includes('western europe') ||
    locationLower.includes('central europe') || locationLower.includes('southern europe') ||
    locationLower.includes('northern europe') || locationLower.includes('mediterranean') ||
    locationLower.includes('iberian peninsula') || locationLower.includes('british isles') ||
    locationLower.includes('benelux') || locationLower.includes('baltic states') ||
    locationLower.includes('soviet union') || locationLower.includes('ussr') ||
    locationLower.includes('yugoslavia') || locationLower.includes('czechoslovakia') ||
    locationLower.includes('great britain') || locationLower.includes('britain') ||
    locationLower.includes('european union') || locationLower.includes('eu')) {
    
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
    locationLower.includes('islamabad') ||
    
    // Major Asian Cities
    locationLower.includes('osaka') || locationLower.includes('yokohama') ||
    locationLower.includes('nagoya') || locationLower.includes('kyoto') ||
    locationLower.includes('fukuoka') || locationLower.includes('sapporo') ||
    locationLower.includes('hiroshima') || locationLower.includes('sendai') ||
    locationLower.includes('guangzhou') || locationLower.includes('shenzhen') ||
    locationLower.includes('tianjin') || locationLower.includes('wuhan') ||
    locationLower.includes('chengdu') || locationLower.includes('nanjing') ||
    locationLower.includes('xian') || locationLower.includes('hangzhou') ||
    locationLower.includes('suzhou') || locationLower.includes('qingdao') ||
    locationLower.includes('dalian') || locationLower.includes('kunming') ||
    locationLower.includes('kolkata') || locationLower.includes('chennai') ||
    locationLower.includes('bangalore') || locationLower.includes('hyderabad') ||
    locationLower.includes('ahmedabad') || locationLower.includes('pune') ||
    locationLower.includes('surat') || locationLower.includes('jaipur') ||
    locationLower.includes('lucknow') || locationLower.includes('kanpur') ||
    locationLower.includes('nagpur') || locationLower.includes('indore') ||
    locationLower.includes('bhopal') || locationLower.includes('patna') ||
    locationLower.includes('vadodara') || locationLower.includes('ludhiana') ||
    locationLower.includes('agra') || locationLower.includes('varanasi') ||
    locationLower.includes('chandigarh') || locationLower.includes('coimbatore') ||
    locationLower.includes('kochi') || locationLower.includes('guwahati') ||
    locationLower.includes('bhubaneswar') || locationLower.includes('faisalabad') ||
    locationLower.includes('rawalpindi') || locationLower.includes('gujranwala') ||
    locationLower.includes('peshawar') || locationLower.includes('multan') ||
    locationLower.includes('quetta') || locationLower.includes('sialkot') ||
    locationLower.includes('sargodha') || locationLower.includes('bahawalpur') ||
    locationLower.includes('busan') || locationLower.includes('incheon') ||
    locationLower.includes('daegu') || locationLower.includes('daejeon') ||
    locationLower.includes('gwangju') || locationLower.includes('ulsan') ||
    locationLower.includes('suwon') || locationLower.includes('pyongyang') ||
    locationLower.includes('ho chi minh city') || locationLower.includes('saigon') ||
    locationLower.includes('hanoi') || locationLower.includes('haiphong') ||
    locationLower.includes('da nang') || locationLower.includes('can tho') ||
    locationLower.includes('cebu city') || locationLower.includes('davao') ||
    locationLower.includes('caloocan') || locationLower.includes('zamboanga') ||
    locationLower.includes('quezon city') || locationLower.includes('makati') ||
    locationLower.includes('surabaya') || locationLower.includes('medan') ||
    locationLower.includes('bandung') || locationLower.includes('bekasi') ||
    locationLower.includes('tangerang') || locationLower.includes('semarang') ||
    locationLower.includes('palembang') || locationLower.includes('makassar') ||
    locationLower.includes('yogyakarta') || locationLower.includes('denpasar') ||
    locationLower.includes('george town') || locationLower.includes('ipoh') ||
    locationLower.includes('johor bahru') || locationLower.includes('kota kinabalu') ||
    locationLower.includes('kuching') || locationLower.includes('chiang mai') ||
    locationLower.includes('phuket') || locationLower.includes('pattaya') ||
    locationLower.includes('abu dhabi') || locationLower.includes('sharjah') ||
    locationLower.includes('jeddah') || locationLower.includes('mecca') ||
    locationLower.includes('medina') || locationLower.includes('dammam') ||
    locationLower.includes('manama') || locationLower.includes('kuwait city') ||
    locationLower.includes('muscat') || locationLower.includes('amman') ||
    locationLower.includes('damascus') || locationLower.includes('aleppo') ||
    locationLower.includes('beirut') || locationLower.includes('baghdad') ||
    locationLower.includes('basra') || locationLower.includes('mosul') ||
    locationLower.includes('erbil') || locationLower.includes('tehran') ||
    locationLower.includes('mashhad') || locationLower.includes('isfahan') ||
    locationLower.includes('shiraz') || locationLower.includes('tabriz') ||
    locationLower.includes('kabul') || locationLower.includes('kandahar') ||
    locationLower.includes('herat') || locationLower.includes('colombo') ||
    locationLower.includes('dhaka') || locationLower.includes('chittagong') ||
    locationLower.includes('sylhet') || locationLower.includes('yangon') ||
    locationLower.includes('mandalay') || locationLower.includes('phnom penh') ||
    locationLower.includes('siem reap') || locationLower.includes('vientiane') ||
    locationLower.includes('almaty') || locationLower.includes('nur sultan') ||
    locationLower.includes('tashkent') || locationLower.includes('bishkek') ||
    locationLower.includes('dushanbe') || locationLower.includes('ashgabat') ||
    locationLower.includes('yerevan') || locationLower.includes('baku') ||
    locationLower.includes('tbilisi') ||
    
    // Countries and Regions
    locationLower.includes('saudi arabia') || locationLower.includes('iran') ||
    locationLower.includes('iraq') || locationLower.includes('israel') ||
    locationLower.includes('palestine') || locationLower.includes('jordan') ||
    locationLower.includes('lebanon') || locationLower.includes('syria') ||
    locationLower.includes('turkey') || locationLower.includes('cyprus') ||
    locationLower.includes('armenia') || locationLower.includes('azerbaijan') ||
    locationLower.includes('georgia') || locationLower.includes('afghanistan') ||
    locationLower.includes('bangladesh') || locationLower.includes('bhutan') ||
    locationLower.includes('nepal') || locationLower.includes('sri lanka') ||
    locationLower.includes('maldives') || locationLower.includes('myanmar') ||
    locationLower.includes('cambodia') || locationLower.includes('laos') ||
    locationLower.includes('mongolia') || locationLower.includes('north korea') ||
    locationLower.includes('south korea') || locationLower.includes('taiwan') ||
    locationLower.includes('brunei') || locationLower.includes('east timor') ||
    locationLower.includes('timor leste') || locationLower.includes('kazakhstan') ||
    locationLower.includes('uzbekistan') || locationLower.includes('turkmenistan') ||
    locationLower.includes('kyrgyzstan') || locationLower.includes('tajikistan') ||
    locationLower.includes('bahrain') || locationLower.includes('kuwait') ||
    locationLower.includes('oman') || locationLower.includes('qatar') ||
    locationLower.includes('yemen') || locationLower.includes('middle east') ||
    locationLower.includes('southeast asia') || locationLower.includes('south asia') ||
    locationLower.includes('east asia') || locationLower.includes('central asia') ||
    locationLower.includes('western asia') || locationLower.includes('far east') ||
    locationLower.includes('arabian peninsula') || locationLower.includes('levant') ||
    locationLower.includes('caucasus') || locationLower.includes('persian gulf') ||
    locationLower.includes('gulf states') || locationLower.includes('gcc') ||
    locationLower.includes('subcontinent') || locationLower.includes('indochina') ||
    locationLower.includes('siberia')) {
    
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
  </h3>
    <div style={{ 
      display: "grid", 
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
      gap: "20px" 
    }}>
      {/* continent stats content would go here */}
    </div>
  </div>
)}
        </svg>
      </div>
    );
  };

  return (
    <div style={{ 
      fontFamily: "system-ui, -apple-system, sans-serif", 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "20px"
    }}>
      <div style={{ 
        maxWidth: "1400px", 
        margin: "0 auto", 
        background: "rgba(255, 255, 255, 0.95)",
        borderRadius: "20px",
        padding: "30px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
      }}>
        <h1 style={{ 
          fontSize: "2.5rem", 
          textAlign: "center", 
          marginBottom: "30px", 
          color: "#87CEEB",
          fontWeight: "700"
        }}>
          🌍 Global Wellbeing Monitor
        </h1>

        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          marginBottom: "30px",
          gap: "15px"
        }}>
          <button
            onClick={() => setCurrentView("form")}
            style={{
              padding: "12px 24px",
              borderRadius: "10px",
              border: "none",
              background: currentView === "form" ? "#3b82f6" : "#e5e7eb",
              color: currentView === "form" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
          >
            Share Current Mood
          </button>
          <button
            onClick={() => setCurrentView("map")}
            style={{
              padding: "12px 24px",
              borderRadius: "10px",
              border: "none",
              background: currentView === "map" ? "#3b82f6" : "#e5e7eb",
              color: currentView === "map" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
          >
            World Map
          </button>
          <button
            onClick={() => setCurrentView("stats")}
            style={{
              padding: "12px 24px",
              borderRadius: "10px",
              border: "none",
              background: currentView === "stats" ? "#3b82f6" : "#e5e7eb",
              color: currentView === "stats" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
          >
            Statistics
          </button>
        </div>

        {currentView === "form" && (
          <div style={{ marginBottom: "40px" }}>
            <div style={{ marginBottom: "25px" }}>
              <label style={{ 
                display: "block", 
                marginBottom: "10px", 
                fontWeight: "600", 
                color: "#374151",
                fontSize: "1.1rem"
              }}>
                How are you feeling right now? 🌟
              </label>
              <select
                value={feeling}
                onChange={(e) => setFeeling(e.target.value)}
                style={{
                  width: "100%",
                  padding: "15px",
                  borderRadius: "10px",
                  border: "2px solid #d1d5db",
                  fontSize: "1rem",
                  background: "white",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}
              >
                <option value="">Select your wellbeing state...</option>
                {wellbeingStates.map((state) => (
                  <option key={state.name} value={state.name}>
                    {state.emoji} {state.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: "25px" }}>
              <label style={{ 
                display: "block", 
                marginBottom: "10px", 
                fontWeight: "600", 
                color: "#374151",
                fontSize: "1.1rem"
              }}>
                Where are you? 📍 (Optional)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., New York, London, Tokyo..."
                style={{
                  width: "100%",
                  padding: "15px",
                  borderRadius: "10px",
                  border: "2px solid #d1d5db",
                  fontSize: "1rem",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!feeling || loading}
              style={{
                width: "100%",
                padding: "15px",
                borderRadius: "10px",
                border: "none",
                background: !feeling || loading ? "#9ca3af" : "#10b981",
                color: "white",
                fontSize: "1.1rem",
                fontWeight: "600",
                cursor: !feeling || loading ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
              }}
            >
              {loading ? "Sharing..." : "Share Your Feeling ✨"}
            </button>
          </div>
        )}

        {currentView === "map" && (
          <ContinentMap />
        )}

        {currentView === "stats" && (
          <div>
            {loadingData ? (
              <div style={{ textAlign: "center", padding: "50px", color: "#6b7280" }}>
                <div style={{ fontSize: "1.5rem" }}>🌍</div>
                <p>Loading global wellbeing data...</p>
              </div>
            ) : (
              <>
                {continentStats.length > 0 && (
                  <div style={{ marginBottom: "40px" }}>
                    <h3 style={{ color: "#374151", fontSize: "1.5rem", marginBottom: "20px", textAlign: "center" }}>
                      🌍 Continental Wellbeing Overview
                    </h3>
                    <div style={{ 
                      display: "grid", 
                      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
                      gap: "20px" 
                    }}>
                      {continentStats.map((stat, index) => (
                        <div
                          key={stat.continent}
                          style={{
                            background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                            borderRadius: "15px",
                            padding: "20px",
                            border: `3px solid ${stat.dominantColor}`,
                            boxShadow: `0 8px 25px ${stat.dominantColor}20`,
                            transition: "all 0.3s ease"
                          }}
                        >
                          <h4 style={{ 
                            color: stat.dominantColor, 
                            fontSize: "1.3rem", 
                            marginBottom: "15px",
                            fontWeight: "700"
                          }}>
                            {stat.continent}
                          </h4>
                          <div style={{ marginBottom: "10px" }}>
                            <span style={{ fontSize: "0.9rem", color: "#6b7280" }}>
                              Total Responses: 
                            </span>
                            <span style={{ fontWeight: "600", color: "#374151", marginLeft: "5px" }}>
                              {stat.total}
                            </span>
                          </div>
                          <div style={{ marginBottom: "15px" }}>
                            <span style={{ fontSize: "0.9rem", color: "#6b7280" }}>
                              Dominant State: 
                            </span>
                            <div style={{ 
                              display: "inline-flex", 
                              alignItems: "center", 
                              marginLeft: "10px",
                              padding: "5px 12px",
                              background: stat.dominantColor,
                              color: "white",
                              borderRadius: "20px",
                              fontSize: "0.85rem",
                              fontWeight: "600"
                            }}>
                              {getWellbeingData(stat.dominantState)?.emoji} {stat.dominantState}
                            </div>
                          </div>
                          <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                            {Object.entries(stat.states)
                              .filter(([_, count]) => count > 0)
                              .map(([state, count]) => `${state}: ${count}`)
                              .join(", ")
                            }
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 style={{ color: "#374151", fontSize: "1.5rem", marginBottom: "20px", textAlign: "center" }}>
                    💭 Recent Global Feelings ({responses.length})
                  </h3>
                  {responses.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "50px", color: "#6b7280" }}>
                      <div style={{ fontSize: "3rem", marginBottom: "20px" }}>🌟</div>
                      <p style={{ fontSize: "1.2rem" }}>Be the first to share how you're feeling!</p>
                    </div>
                  ) : (
                    <div style={{ 
                      display: "grid", 
                      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
                      gap: "15px",
                      maxHeight: "600px",
                      overflowY: "auto",
                      padding: "10px"
                    }}>
                      {responses.slice(0, 50).map((response, index) => {
                        const wellbeingData = getWellbeingData(response.feeling);
                        return (
                          <div
                            key={index}
                            style={{
                              background: "white",
                              borderRadius: "12px",
                              padding: "15px",
                              border: `2px solid ${wellbeingData?.color || "#e5e7eb"}`,
                              boxShadow: `0 4px 12px ${wellbeingData?.color || "#000000"}15`,
                              transition: "transform 0.2s ease, box-shadow 0.2s ease"
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.transform = "translateY(-2px)";
                              e.target.style.boxShadow = `0 8px 20px ${wellbeingData?.color || "#000000"}25`;
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = "translateY(0)";
                              e.target.style.boxShadow = `0 4px 12px ${wellbeingData?.color || "#000000"}15`;
                            }}
                          >
                            <div style={{ 
                              display: "flex", 
                              alignItems: "center", 
                              marginBottom: "8px" 
                            }}>
                              <span style={{ fontSize: "1.2rem", marginRight: "8px" }}>
                                {wellbeingData?.emoji || "😊"}
                              </span>
                              <span style={{ 
                                fontWeight: "600", 
                                color: wellbeingData?.color || "#374151",
                                fontSize: "1rem"
                              }}>
                                {response.feeling}
                              </span>
                            </div>
                            <div style={{ 
                              fontSize: "0.85rem", 
                              color: "#6b7280", 
                              marginBottom: "5px" 
                            }}>
                              📍 {response.location} • {response.continent}
                            </div>
                            <div style={{ 
                              fontSize: "0.8rem", 
                              color: "#9ca3af" 
                            }}>
                              🕒 {response.time}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

    
