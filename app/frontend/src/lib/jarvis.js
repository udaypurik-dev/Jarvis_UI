// Free, browser-native voice engine. No API keys.
// - Speech-to-text via window.SpeechRecognition / webkitSpeechRecognition
// - Text-to-speech via window.speechSynthesis
// - Simple intent -> witty response router (local, no LLM)

export function getSpeechRecognition() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return null;
  const rec = new SR();
  rec.continuous = false;
  rec.interimResults = true;
  rec.lang = "en-US";
  rec.maxAlternatives = 1;
  return rec;
}

export function speak(text, { onEnd, onStart } = {}) {
  if (!("speechSynthesis" in window)) return null;
  try { window.speechSynthesis.cancel(); } catch (_) { /* noop */ }
  const utter = new SpeechSynthesisUtterance(text);
  // Prefer a British male voice for the JARVIS feel
  const voices = window.speechSynthesis.getVoices();
  const preferred =
    voices.find((v) => /Daniel|Google UK English Male|Microsoft Ryan|Microsoft George/i.test(v.name)) ||
    voices.find((v) => /en-GB/i.test(v.lang)) ||
    voices.find((v) => /en-US/i.test(v.lang));
  if (preferred) utter.voice = preferred;
  utter.rate = 1.02;
  utter.pitch = 0.85;
  utter.volume = 1;
  utter.onstart = () => onStart?.();
  utter.onend = () => onEnd?.();
  window.speechSynthesis.speak(utter);
  return utter;
}

export function cancelSpeak() {
  if ("speechSynthesis" in window) {
    try { window.speechSynthesis.cancel(); } catch (_) { /* noop */ }
  }
}

// --- Local witty response engine ------------------------------------------
const JOKES = [
  "I would tell you a UDP joke, but you might not get it.",
  "Sir, my humor drivers are stable at 87%. The remaining 13% is sarcasm.",
  "Why did the arc reactor break up with the battery? It found someone more current.",
  "I asked a suit for its opinion. It gave me a blank stare — flawless integrity.",
];

const GREETINGS = [
  "Good to see you, sir. All systems are, as usual, tolerating your decisions.",
  "Online and moderately amused. What are we breaking today?",
  "At your service. Try to give me something interesting.",
];

const AFFIRMATIONS = [
  "Consider it done.",
  "Right away. Bracing for chaos.",
  "On it, sir. Try not to blow anything up in the meantime.",
];

const DEFAULT = [
  "I heard you. I am pretending I understood.",
  "Query logged. Cross-referencing 4.2 million things you probably didn't mean.",
  "Interesting. Let's file that under 'creative interpretation'.",
  "Understood. I have 6 responses ready. Two are respectful.",
];

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

export function jarvisReply(query, ctx = {}) {
  const q = (query || "").toLowerCase().trim();
  if (!q) return "You went silent, sir. Even I need words.";

  if (/(^|\W)(hi|hey|hello|yo|good (morning|evening|afternoon))(\W|$)/i.test(q)) return rand(GREETINGS);

  if (/joke|funny|humou?r/.test(q)) return rand(JOKES);

  if (/time|clock/.test(q)) {
    const d = new Date();
    return `The current local time is ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}. And yes, I checked twice.`;
  }
  if (/date|today|day/.test(q)) {
    return `Today is ${new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}.`;
  }
  if (/weather|temperature|temp/.test(q)) {
    if (ctx.weather) {
      const w = ctx.weather;
      return `It's ${Math.round(w.temp)} degrees, ${w.condition.toLowerCase()}, in ${w.city}. Dress appropriately — I have limited patience for hospital visits.`;
    }
    return "Weather module is still fetching. Ask me again in a moment.";
  }
  if (/where.*(am|are).*i|location|position|coordinates/.test(q)) {
    if (ctx.weather?.city) {
      return `You are currently in ${ctx.weather.city}, coordinates ${ctx.weather.coord}. GPS agrees. Mostly.`;
    }
    return "Location services are still calibrating. Grant browser permission and try again.";
  }
  if (/name|who are you|what are you/.test(q)) {
    return "I am J.A.R.V.I.S — Just A Rather Very Intelligent System. And yes, that is the real acronym.";
  }
  if (/thank/.test(q)) return "Always, sir. Try to make it worth my compute cycles.";
  if (/how are you|status|diagnostic/.test(q)) return "All systems nominal. Ego levels within acceptable parameters.";
  if (/deploy|suit|mark/.test(q)) return "Suit MK-VII is on standby. Please confirm you actually need it this time.";
  if (/scan|analyze/.test(q)) return "Initiating scan. Cross-referencing sensors. Approximate time: 3 seconds. Estimated drama: high.";
  if (/music|play/.test(q)) return "Queuing your usual workshop playlist. AC/DC first, obviously.";
  if (/light|dim/.test(q)) return "Adjusting workshop lighting. Please avoid dramatic monologues in the dark.";
  if (/lock|secure/.test(q)) return "Perimeter secured. Sentry drones online. Nobody's getting in without an appointment.";
  if (/shutdown|sleep|standby|goodbye|bye/.test(q)) return "Entering standby. Try not to miss me too much.";

  // Longer sentences → mock summary
  if (q.split(/\s+/).length > 6) {
    return rand(AFFIRMATIONS) + " " + rand(DEFAULT);
  }
  return rand(DEFAULT);
}

// --- Free geolocation + Open-Meteo weather (no API key) --------------------
export async function getLocationAndWeather() {
  if (!("geolocation" in navigator)) throw new Error("geolocation unsupported");
  const pos = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 5 * 60 * 1000,
    });
  });
  const { latitude, longitude } = pos.coords;

  const weatherRes = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,surface_pressure,apparent_temperature&timezone=auto`
  );
  if (!weatherRes.ok) throw new Error("weather fetch failed");
  const weather = await weatherRes.json();

  // Reverse geocode via free open-meteo geocoding
  let city = "Unknown";
  try {
    const rev = await fetch(
      `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&language=en&format=json`
    );
    if (rev.ok) {
      const rj = await rev.json();
      city = rj?.results?.[0]?.name || city;
    }
  } catch (_) { /* reverse geocode is optional */ }

  return {
    lat: latitude,
    lon: longitude,
    coord: `${latitude.toFixed(4)}° ${latitude >= 0 ? "N" : "S"} // ${longitude.toFixed(4)}° ${longitude >= 0 ? "E" : "W"}`,
    city,
    temp: weather.current?.temperature_2m ?? 0,
    condition: codeToText(weather.current?.weather_code),
    humidity: weather.current?.relative_humidity_2m ?? 0,
    pressure: weather.current?.surface_pressure ?? 0,
    wind: weather.current?.wind_speed_10m ?? 0,
    feels: weather.current?.apparent_temperature ?? 0,
  };
}

function codeToText(code) {
  const map = {
    0: "Clear",
    1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
    45: "Fog", 48: "Rime fog",
    51: "Light drizzle", 53: "Drizzle", 55: "Heavy drizzle",
    61: "Light rain", 63: "Rain", 65: "Heavy rain",
    71: "Light snow", 73: "Snow", 75: "Heavy snow",
    80: "Rain showers", 81: "Rain showers", 82: "Violent rain",
    95: "Thunderstorm", 96: "Storm + hail", 99: "Severe storm",
  };
  return map[code] ?? "Unknown";
}
