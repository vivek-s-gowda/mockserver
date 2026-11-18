// day-11-mockserver/src/themes.js
// Vaporwave Dream Primary Theme and aesthetic API console themes

export const THEMES = {
  vaporwaveDream: {
    id: 'vaporwaveDream',
    name: 'Vaporwave Dream',
    isPrimary: true,
    colors: {
      primary: '#c084fc',       // Pastel Lavender
      secondary: '#fb7185',     // Neon Coral
      accent: '#34d399',        // Mint Sorbet
      bg: '#1a1026',            // Deep Mauve
      card: '#241736',          // Dark Cassette Mauve
      cardHover: '#331f4c',     // Lifted Surface
      border: '#4c2875',        // Violet Mauve Border
      text: '#fdf4ff',          // Lavender White
      textMuted: '#e9d5ff',     // Soft Lilac Muted
      badge: 'rgba(192, 132, 252, 0.15)',
      glow: 'rgba(192, 132, 252, 0.25)'
    }
  },
  cyberpunkNeon: {
    id: 'cyberpunkNeon',
    name: 'Cyberpunk Neon',
    colors: {
      primary: '#00f2fe',
      secondary: '#ff007f',
      accent: '#39ff14',
      bg: '#060814',
      card: '#0c1024',
      cardHover: '#161c3b',
      border: '#1f2a58',
      text: '#e2f8ff',
      textMuted: '#7dd3fc',
      badge: 'rgba(0, 242, 254, 0.15)',
      glow: 'rgba(0, 242, 254, 0.25)'
    }
  },
  tokyoNight: {
    id: 'tokyoNight',
    name: 'Tokyo Night',
    colors: {
      primary: '#8b5cf6',
      secondary: '#38bdf8',
      accent: '#a78bfa',
      bg: '#0a0e1a',
      card: '#121829',
      cardHover: '#1c243d',
      border: '#2a365c',
      text: '#f1f5f9',
      textMuted: '#94a3b8',
      badge: 'rgba(139, 92, 246, 0.15)',
      glow: 'rgba(139, 92, 246, 0.25)'
    }
  },
  nordicGlacier: {
    id: 'nordicGlacier',
    name: 'Nordic Glacier',
    colors: {
      primary: '#38bdf8',
      secondary: '#67e8f9',
      accent: '#818cf8',
      bg: '#08111e',
      card: '#0f1f38',
      cardHover: '#162e54',
      border: '#1e3a8a',
      text: '#f0f9ff',
      textMuted: '#93c5fd',
      badge: 'rgba(56, 189, 248, 0.15)',
      glow: 'rgba(56, 189, 248, 0.25)'
    }
  }
};

export const DEFAULT_THEME_ID = 'vaporwaveDream';
