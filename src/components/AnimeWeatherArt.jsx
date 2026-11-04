export default function AnimeWeatherArt({ timeOfDay = 'afternoon' }) {
  const isMorning = timeOfDay === 'morning';
  const isEvening = timeOfDay === 'evening';

  // Dynamic sky palettes for anime aesthetic
  const skyGrad = isMorning
    ? 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #a1c4fd 100%)'
    : isEvening
    ? 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #312e81 80%, #4c1d95 100%)'
    : 'linear-gradient(135deg, #38bdf8 0%, #818cf8 60%, #c084fc 100%)';

  return (
    <div className="anime-art-container" style={{ background: skyGrad }}>
      {/* Ambient background glow & stars */}
      <div className="anime-glow-aura" />
      <div className="anime-stars">
        <span className="star s1">✦</span>
        <span className="star s2">★</span>
        <span className="star s3">✦</span>
        <span className="star s4">★</span>
        <span className="star s5">✦</span>
      </div>

      {/* Main Anime Mascot Vector Illustration */}
      <svg
        className="anime-svg"
        viewBox="0 0 340 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          {/* Sun / Moon Gradients */}
          <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="70%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </radialGradient>
          <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="65%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#94a3b8" />
          </radialGradient>

          {/* Cloud Body Gradient */}
          <linearGradient id="animeCloud" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="75%" stopColor="#f0f7ff" />
            <stop offset="100%" stopColor="#dbeafe" />
          </linearGradient>

          {/* Blush Gradient */}
          <radialGradient id="blush" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff70a6" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#ff70a6" stopOpacity="0" />
          </radialGradient>

          {/* Shadow Filter */}
          <filter id="softShadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="rgba(15,23,42,0.18)" />
          </filter>
        </defs>

        {/* Sun or Crescent Moon in background */}
        {isEvening ? (
          <g className="anime-moon" transform="translate(195, 30)">
            <circle cx="45" cy="45" r="38" fill="url(#moonGlow)" filter="url(#softShadow)" />
            <path
              d="M 60 10 A 38 38 0 1 0 78 72 A 34 34 0 1 1 60 10 Z"
              fill="#f8fafc"
              opacity="0.9"
            />
            {/* Sleeping Moon Face */}
            <path d="M 46 45 Q 52 49 58 45" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M 40 38 Q 44 35 48 38" stroke="#475569" strokeWidth="2" strokeLinecap="round" fill="none" />
            <circle cx="56" cy="48" r="4.5" fill="url(#blush)" />
          </g>
        ) : (
          <g className="anime-sun" transform="translate(180, 25)">
            {/* Sun Rays */}
            <g className="anime-sun-rays" opacity="0.8">
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                <line
                  key={i}
                  x1="50"
                  y1="50"
                  x2={50 + 58 * Math.cos((angle * Math.PI) / 180)}
                  y2={50 + 58 * Math.sin((angle * Math.PI) / 180)}
                  stroke="#fbbf24"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              ))}
            </g>
            <circle cx="50" cy="50" r="40" fill="url(#sunGlow)" filter="url(#softShadow)" />
          </g>
        )}

        {/* Floating background micro cloud */}
        <path
          d="M 30 110 Q 30 95 45 95 Q 52 80 70 82 Q 88 84 94 98 Q 105 100 105 110 Q 105 120 90 120 L 40 120 Q 30 120 30 110 Z"
          fill="#ffffff"
          opacity="0.65"
          className="cloud-bg-drift"
        />

        {/* MAIN ANIME CLOUD CHARACTER */}
        <g className="anime-character" filter="url(#softShadow)">
          {/* Cloud Body Puffs */}
          <path
            d="M 85 195 
               C 60 195 45 175 48 150 
               C 50 125 75 115 95 122 
               C 105 95 140 85 170 95 
               C 195 80 235 90 248 120 
               C 275 125 295 148 290 172 
               C 285 195 265 205 245 200 
               C 230 215 115 215 85 195 Z"
            fill="url(#animeCloud)"
          />

          {/* Rosy Blush Cheeks */}
          <ellipse cx="112" cy="165" rx="14" ry="9" fill="url(#blush)" />
          <ellipse cx="228" cy="165" rx="14" ry="9" fill="url(#blush)" />

          {/* Big Sparkly Anime Left Eye */}
          <g className="anime-eye left-eye">
            <ellipse cx="135" cy="150" rx="12" ry="16" fill="#1e293b" />
            <circle cx="131" cy="144" r="5" fill="#ffffff" />
            <circle cx="139" cy="156" r="2.5" fill="#ffffff" />
            <ellipse cx="135" cy="159" rx="8" ry="4" fill="#38bdf8" opacity="0.8" />
          </g>

          {/* Big Sparkly Anime Right Eye */}
          <g className="anime-eye right-eye">
            <ellipse cx="205" cy="150" rx="12" ry="16" fill="#1e293b" />
            <circle cx="201" cy="144" r="5" fill="#ffffff" />
            <circle cx="209" cy="156" r="2.5" fill="#ffffff" />
            <ellipse cx="205" cy="159" rx="8" ry="4" fill="#38bdf8" opacity="0.8" />
          </g>

          {/* Cute Anime Open Smile */}
          <path
            d="M 160 162 Q 170 176 180 162"
            stroke="#1e293b"
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="#f43f5e"
          />

          {/* Sparkle on head */}
          <text x="75" y="105" fontSize="18" fill="#facc15" className="sparkle-head">✨</text>
        </g>
      </svg>

      {/* Floating Glassmorphism Metric Badges */}
      <div className="floating-badge badge-top">
        <span className="badge-ico">⛅</span>
        <div className="badge-text">
          <strong>24°C</strong> · Calm Sky
        </div>
      </div>

      <div className="floating-badge badge-bottom">
        <span className="badge-ico">🛡️</span>
        <div className="badge-text">
          <strong>Safe</strong> · No Hazards
        </div>
      </div>
    </div>
  );
}
