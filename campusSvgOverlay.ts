import { MAP_DIMENSIONS } from './campusData';

/**
 * Generates an SVG string representing the static campus architectural masterplan.
 * Used with L.imageOverlay or as an SVG data URL for 100% offline L.CRS.Simple rendering.
 */
export function generateCampusMasterplanSvg(): string {
  const { width, height } = MAP_DIMENSIONS;

  // Grid lines
  let gridLines = '';
  for (let x = 0; x <= width; x += 50) {
    const isMajor = x % 200 === 0;
    gridLines += `<line x1="${x}" y1="0" x2="${x}" y2="${height}" stroke="${
      isMajor ? 'rgba(51, 65, 85, 0.45)' : 'rgba(30, 41, 59, 0.35)'
    }" stroke-width="${isMajor ? 1.5 : 0.8}" />`;
    if (isMajor && x > 0 && x < width) {
      gridLines += `<text x="${x + 4}" y="${height - 10}" fill="rgba(100, 116, 139, 0.4)" font-size="10" font-family="monospace">X:${x}</text>`;
    }
  }

  for (let y = 0; y <= height; y += 50) {
    const isMajor = y % 200 === 0;
    // Note: in SVG, y=0 is at top, while in our L.CRS.Simple [y, x], y=0 is at bottom
    // We render standard SVG canvas matching bounds 0,0 to width,height
    gridLines += `<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="${
      isMajor ? 'rgba(51, 65, 85, 0.45)' : 'rgba(30, 41, 59, 0.35)'
    }" stroke-width="${isMajor ? 1.5 : 0.8}" />`;
    if (isMajor && y > 0 && y < height) {
      gridLines += `<text x="10" y="${y - 4}" fill="rgba(100, 116, 139, 0.4)" font-size="10" font-family="monospace">Y:${height - y}</text>`;
    }
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
      <defs>
        <pattern id="campus-grid" width="25" height="25" patternUnits="userSpaceOnUse">
          <path d="M 25 0 L 0 0 0 25" fill="none" stroke="rgba(255, 255, 255, 0.025)" stroke-width="0.7"/>
        </pattern>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0a0f1d" />
          <stop offset="50%" stop-color="#0f172a" />
          <stop offset="100%" stop-color="#070a13" />
        </linearGradient>
        <radialGradient id="lawnGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="rgba(16, 185, 129, 0.08)" />
          <stop offset="100%" stop-color="rgba(16, 185, 129, 0.02)" />
        </radialGradient>
        <radialGradient id="quadGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="rgba(59, 130, 246, 0.08)" />
          <stop offset="100%" stop-color="rgba(59, 130, 246, 0.01)" />
        </radialGradient>
      </defs>

      <!-- Background Base -->
      <rect x="0" y="0" width="${width}" height="${height}" fill="url(#bgGrad)" />
      <rect x="0" y="0" width="${width}" height="${height}" fill="url(#campus-grid)" />

      <!-- Campus Outer Perimeter Boundary -->
      <rect x="30" y="30" width="${width - 60}" height="${height - 60}" rx="16" fill="none" stroke="#1e293b" stroke-width="2" stroke-dasharray="6,4" />
      <text x="50" y="55" fill="#475569" font-size="11" font-weight="700" letter-spacing="2">CAMPUS PERIMETER BOUNDARY — SMART TRANSIT ZONE</text>

      <!-- Green Lawns and Parks -->
      <!-- Central Quad Park -->
      <rect x="380" y="320" width="240" height="160" rx="20" fill="url(#quadGrad)" stroke="rgba(59, 130, 246, 0.15)" stroke-width="1" />
      <text x="500" y="405" text-anchor="middle" fill="rgba(148, 163, 184, 0.35)" font-size="12" font-weight="600" letter-spacing="1.5">CENTRAL INNOVATION QUAD</text>

      <!-- North Green Woods -->
      <rect x="120" y="80" width="300" height="120" rx="16" fill="url(#lawnGrad)" stroke="rgba(16, 185, 129, 0.12)" stroke-width="1" />
      <text x="270" y="145" text-anchor="middle" fill="rgba(16, 185, 129, 0.3)" font-size="11" font-weight="600">NORTH ECOLOGY LAWN</text>

      <!-- East Lake & Botanical Garden -->
      <path d="M 620 100 C 720 80, 850 140, 820 240 C 800 320, 680 300, 620 220 Z" fill="rgba(6, 182, 212, 0.05)" stroke="rgba(6, 182, 212, 0.15)" stroke-width="1" />
      <text x="710" y="190" text-anchor="middle" fill="rgba(6, 182, 212, 0.3)" font-size="11" font-weight="600">BOTANICAL LAKE</text>

      <!-- Sports Stadium & Track (East side) -->
      <rect x="620" y="440" width="180" height="140" rx="70" fill="rgba(245, 158, 11, 0.04)" stroke="rgba(245, 158, 11, 0.15)" stroke-width="1.5" />
      <rect x="650" y="470" width="120" height="80" rx="40" fill="none" stroke="rgba(245, 158, 11, 0.2)" stroke-width="1" stroke-dasharray="4,3" />
      <text x="710" y="515" text-anchor="middle" fill="rgba(245, 158, 11, 0.4)" font-size="11" font-weight="600">OLYMPIC TRACK & ARENA</text>

      <!-- Grid lines -->
      ${gridLines}

      <!-- Coordinate Watermark -->
      <text x="${width - 160}" y="${height - 20}" fill="#334155" font-size="10" font-family="monospace">PS10 L.CRS.Simple [800x1000]</text>
    </svg>
  `;
}

/**
 * Returns a base64 data URI of the SVG campus masterplan
 */
export function getCampusMasterplanDataUri(): string {
  const svg = generateCampusMasterplanSvg();
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

