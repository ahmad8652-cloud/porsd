import { Contingent, AppData, AppHeaderSettings, AppThemeSettings } from '../types/index.js';

export const INITIAL_CONTINGENTS: string[] = [
  'UPT SD Negeri 93 Gresik',
  'UPT SD Negeri 94 Gresik',
  'UPT SD Negeri 95 Gresik',
  'UPT SD Negeri 96 Gresik',
  'UPT SD Negeri 97 Gresik',
  'UPT SD Negeri 98 Gresik',
  'UPT SD Negeri 99 Gresik',
  'UPT SD Negeri 100 Gresik',
  'UPT SD Negeri 101 Gresik',
  'UPT SD Negeri 102 Gresik',
  'UPT SD Negeri 103 Gresik',
  'UPT SD Negeri 104 Gresik',
  'UPT SD Negeri 105 Gresik',
  'UPT SD Negeri 106 Gresik',
  'UPT SD Negeri 107 Gresik',
  'UPT SD Negeri 108 Gresik',
  'UPT SD Negeri 109 Gresik',
  'UPT SD Negeri 110 Gresik',
  'UPT SD Negeri 111 Gresik',
  'UPT SD Negeri 112 Gresik',
  'UPT SD Negeri 113 Gresik',
  'UPT SD Negeri 114 Gresik',
  'UPT SD Negeri 115 Gresik',
  'UPT SD Negeri 116 Gresik',
  'UPT SD Negeri 117 Gresik',
  'SD Muhammadiyah Benjeng',
  'SD Ma’arif NU 45',
  'SD NU Munggugebang'
];

/**
 * Generates an SVG emblem data URI for a school
 */
export function generateDefaultSchoolLogo(name: string, index: number): string {
  // Extract short name
  let short = '';
  if (name.includes('UPT SD Negeri')) {
    const num = name.replace('UPT SD Negeri', '').replace('Gresik', '').trim();
    short = `SDN ${num}`;
  } else if (name.includes('Muhammadiyah')) {
    short = 'SD M';
  } else if (name.includes('Ma’arif') || name.includes('Ma\'arif')) {
    short = 'MNU 45';
  } else if (name.includes('Munggugebang')) {
    short = 'SD NU';
  } else {
    short = name.substring(0, 5);
  }

  const hue = (index * 29) % 360;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <defs>
      <linearGradient id="g${index}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="hsl(${hue}, 85%, 55%)"/>
        <stop offset="100%" stop-color="hsl(${(hue + 40) % 360}, 90%, 35%)"/>
      </linearGradient>
    </defs>
    <polygon points="50,4 92,25 92,72 50,96 8,72 8,25" fill="url(#g${index})" stroke="#ffffff" stroke-width="4"/>
    <polygon points="50,11 85,29 85,69 50,89 15,69 15,29" fill="rgba(15, 23, 42, 0.65)"/>
    <circle cx="50" cy="50" r="28" fill="rgba(255, 255, 255, 0.15)" stroke="rgba(255, 215, 0, 0.6)" stroke-width="2"/>
    <text x="50" y="55" font-family="Arial, sans-serif" font-weight="900" font-size="16" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">${short}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Default Organizer Logos as crisp SVG data URIs
 */
export const DEFAULT_ORGANIZER_LOGOS = {
  // Logo 1: Dinas Pendidikan & Pemkab Gresik Emblema
  logo1: `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
    <defs>
      <linearGradient id="pemkab" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#1e3a8a"/>
        <stop offset="100%" stop-color="#0f172a"/>
      </linearGradient>
    </defs>
    <circle cx="60" cy="60" r="54" fill="url(#pemkab)" stroke="#f59e0b" stroke-width="5"/>
    <circle cx="60" cy="60" r="44" fill="#0284c7" stroke="#ffffff" stroke-width="2"/>
    <path d="M60 26 L69 45 L90 45 L73 57 L79 78 L60 65 L41 78 L47 57 L30 45 L51 45 Z" fill="#fbbf24"/>
    <text x="60" y="98" font-family="Arial, sans-serif" font-size="9" font-weight="bold" fill="#ffffff" text-anchor="middle">PEMKAB GRESIK</text>
    <text x="60" y="107" font-family="Arial, sans-serif" font-size="7" fill="#93c5fd" text-anchor="middle">DISDIK</text>
  </svg>`)}`,
  logo1Label: 'Dinas Pendidikan Kab. Gresik',

  // Logo 2: Official POR SD Kecamatan Benjeng 2026 Torch & Rings
  logo2: `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
    <defs>
      <linearGradient id="torchGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#ef4444"/>
        <stop offset="50%" stop-color="#f59e0b"/>
        <stop offset="100%" stop-color="#fbbf24"/>
      </linearGradient>
    </defs>
    <circle cx="60" cy="60" r="55" fill="#0f172a" stroke="#ef4444" stroke-width="4"/>
    <circle cx="60" cy="60" r="48" fill="#1e293b"/>
    <!-- Torch flames -->
    <path d="M60 20 C68 30 75 35 70 48 C65 55 55 55 50 48 C45 35 52 30 60 20 Z" fill="url(#torchGrad)"/>
    <path d="M60 28 C64 34 68 38 65 46 C62 50 58 50 55 46 C52 38 56 34 60 28 Z" fill="#ffffff" opacity="0.8"/>
    <!-- Torch handle -->
    <polygon points="53,52 67,52 63,80 57,80" fill="#d97706" stroke="#fbbf24" stroke-width="1.5"/>
    <ellipse cx="60" cy="52" rx="10" ry="3" fill="#fbbf24"/>
    <!-- Laurel leaves -->
    <path d="M30 65 C32 80 44 92 60 93 C76 92 88 80 90 65" fill="none" stroke="#eab308" stroke-width="3" stroke-linecap="round"/>
    <text x="60" y="106" font-family="Arial, sans-serif" font-size="10" font-weight="900" fill="#f8fafc" text-anchor="middle">POR SD 2026</text>
  </svg>`)}`,
  logo2Label: 'POR SD Benjeng 2026',

  // Logo 3: KORWIL Pendidikan & KONI Benjeng
  logo3: `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
    <defs>
      <linearGradient id="koniGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#15803d"/>
        <stop offset="100%" stop-color="#0f172a"/>
      </linearGradient>
    </defs>
    <polygon points="60,8 108,35 108,85 60,112 12,85 12,35" fill="url(#koniGrad)" stroke="#22c55e" stroke-width="4"/>
    <!-- 3 Olympic-style interlocking rings -->
    <circle cx="48" cy="52" r="14" fill="none" stroke="#38bdf8" stroke-width="3.5"/>
    <circle cx="72" cy="52" r="14" fill="none" stroke="#ef4444" stroke-width="3.5"/>
    <circle cx="60" cy="65" r="14" fill="none" stroke="#eab308" stroke-width="3.5"/>
    <text x="60" y="98" font-family="Arial, sans-serif" font-size="8.5" font-weight="bold" fill="#ffffff" text-anchor="middle">KEC. BENJENG</text>
  </svg>`)}`,
  logo3Label: 'KORWIL Kec. Benjeng'
};

export const DEFAULT_HEADER_SETTINGS: AppHeaderSettings = {
  mainTitle: 'LIVE MEDAL STANDING',
  subTitle: 'POR (PEKAN OLAHRAGA) SD KECAMATAN BENJENG 2026',
  tagline: 'SPORTIVITAS • SOLIDARITAS • PRESTASI',
  logo1: DEFAULT_ORGANIZER_LOGOS.logo1,
  logo2: DEFAULT_ORGANIZER_LOGOS.logo2,
  logo3: DEFAULT_ORGANIZER_LOGOS.logo3,
  logo1Label: DEFAULT_ORGANIZER_LOGOS.logo1Label,
  logo2Label: DEFAULT_ORGANIZER_LOGOS.logo2Label,
  logo3Label: DEFAULT_ORGANIZER_LOGOS.logo3Label
};

export const DEFAULT_THEME_SETTINGS: AppThemeSettings = {
  themeMode: 'navy',
  bgPattern: 'grid',
  tickerEnabled: true,
  autoScroll: false,
  autoScrollSpeed: 8
};

/**
 * Creates initial contingents with demo starter medal tallies (ready for POR)
 */
export function createInitialContingents(): Contingent[] {
  // Let's seed initial realistic medals for a live scoreboard feel:
  // E.g. top schools have a few medals, others start at 0
  return INITIAL_CONTINGENTS.map((name, index) => {
    let gold = 0;
    let silver = 0;
    let bronze = 0;

    // Seed some initial exciting scores for demo/first launch
    if (index === 0) { // UPT SDN 93
      gold = 4; silver = 2; bronze = 1;
    } else if (index === 1) { // UPT SDN 94
      gold = 3; silver = 4; bronze = 2;
    } else if (index === 2) { // UPT SDN 95
      gold = 3; silver = 1; bronze = 3;
    } else if (index === 25) { // SD Muhammadiyah
      gold = 2; silver = 3; bronze = 2;
    } else if (index === 5) { // UPT SDN 98
      gold = 2; silver = 1; bronze = 0;
    } else if (index === 7) { // UPT SDN 100
      gold = 1; silver = 2; bronze = 4;
    } else if (index === 26) { // SD Ma'arif NU 45
      gold = 1; silver = 1; bronze = 1;
    } else if (index === 10) { // UPT SDN 103
      gold = 1; silver = 0; bronze = 2;
    } else if (index === 15) { // UPT SDN 108
      gold = 0; silver = 3; bronze = 1;
    } else if (index === 20) { // UPT SDN 113
      gold = 0; silver = 1; bronze = 2;
    }

    return {
      id: `cont-${index + 1}`,
      name,
      logoUrl: generateDefaultSchoolLogo(name, index),
      gold,
      silver,
      bronze,
      total: gold + silver + bronze
    };
  });
}

/**
 * Calculates official rankings strictly based on the prompt's rules:
 * Rule 4: SISTEM PERINGKAT OTOMATIS
 * - Peringkat pertama ditentukan oleh jumlah Gold terbanyak.
 * - Silver dan Bronze TIDAK BOLEH digunakan untuk menentukan peringkat resmi (jika jumlah Gold sama, kedua kontingen mendapatkan peringkat yang sama).
 * - Jika Gold sama, urutan tampilan menggunakan Silver sebagai pemecah urutan visual, kemudian Bronze, lalu Nama kontingen.
 * - Total perolehan dihitung otomatis: gold + silver + bronze.
 */
export function calculateRankings(contingents: Contingent[]): Contingent[] {
  // 1. Calculate total for each contingent
  const listWithTotal = contingents.map((item) => ({
    ...item,
    gold: Math.max(0, Number(item.gold) || 0),
    silver: Math.max(0, Number(item.silver) || 0),
    bronze: Math.max(0, Number(item.bronze) || 0),
    total: (Math.max(0, Number(item.gold) || 0)) + 
           (Math.max(0, Number(item.silver) || 0)) + 
           (Math.max(0, Number(item.bronze) || 0))
  }));

  // 2. Sort by:
  //    1) Gold desc
  //    2) Silver desc (visual tie breaker)
  //    3) Bronze desc (visual tie breaker)
  //    4) Name alphabetical asc
  const sorted = [...listWithTotal].sort((a, b) => {
    if (b.gold !== a.gold) {
      return b.gold - a.gold;
    }
    if (b.silver !== a.silver) {
      return b.silver - a.silver;
    }
    if (b.bronze !== a.bronze) {
      return b.bronze - a.bronze;
    }
    return a.name.localeCompare(b.name, 'id');
  });

  // 3. Assign officialRank based strictly on GOLD count:
  // Teams with the same Gold count get the same official rank!
  // If Gold is lower than the previous, their rank reflects their position in the sorted list (competition ranking).
  let currentOfficialRank = 1;
  let previousGold: number | null = null;

  return sorted.map((contingent, index) => {
    if (index === 0) {
      currentOfficialRank = 1;
      previousGold = contingent.gold;
    } else {
      if (contingent.gold === previousGold) {
        // Same gold count: shares the same official rank!
        // currentOfficialRank stays unchanged
      } else {
        // Lower gold count: rank is index + 1 (standard competition ranking)
        currentOfficialRank = index + 1;
        previousGold = contingent.gold;
      }
    }

    return {
      ...contingent,
      officialRank: currentOfficialRank
    };
  });
}

/**
 * Calculates statistics across all contingents
 */
export function calculateStatistics(contingents: Contingent[]) {
  const totalContingents = contingents.length;
  let totalGold = 0;
  let totalSilver = 0;
  let totalBronze = 0;

  for (const c of contingents) {
    totalGold += Math.max(0, Number(c.gold) || 0);
    totalSilver += Math.max(0, Number(c.silver) || 0);
    totalBronze += Math.max(0, Number(c.bronze) || 0);
  }

  const totalAllMedals = totalGold + totalSilver + totalBronze;

  return {
    totalContingents,
    totalGold,
    totalSilver,
    totalBronze,
    totalAllMedals
  };
}
