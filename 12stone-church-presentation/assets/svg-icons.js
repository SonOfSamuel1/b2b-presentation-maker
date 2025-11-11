// SVG Icon Library for 12Stone Church Presentation
// Professional line-art style icons matching brand aesthetic

const SVGIcons = {
  // Mission & Vision Icons
  prayingHands: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 8L28 20L24 32L28 44L32 56L36 44L40 32L36 20L32 8Z" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M24 32C20 28 16 24 16 20C16 16 18 12 22 12C26 12 28 16 28 20" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M40 32C44 28 48 24 48 20C48 16 46 12 42 12C38 12 36 16 36 20" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="32" cy="20" r="3" fill="currentColor"/>
    </svg>
  `,

  heart: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 52L12 32C8 28 6 22 8 16C10 10 16 8 20 10C24 12 26 16 28 20L32 28L36 20C38 16 40 12 44 10C48 8 54 10 56 16C58 22 56 28 52 32L32 52Z" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M32 28L28 20C26 16 24 14 22 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <path d="M32 28L36 20C38 16 40 14 42 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,

  star: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 8L36 24L52 28L36 32L32 48L28 32L12 28L28 24L32 8Z" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="32" cy="28" r="8" stroke="currentColor" stroke-width="2.5"/>
      <path d="M32 4V12M32 44V52M8 28H16M48 28H56" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
    </svg>
  `,

  // Community Impact Icons
  foodBowl: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 28C12 20 18 14 26 14H38C46 14 52 20 52 28V32C52 40 46 46 38 46H26C18 46 12 40 12 32V28Z" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M12 28H52" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M20 28C20 24 22 20 26 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <path d="M38 18C42 20 44 24 44 28" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <circle cx="22" cy="22" r="2" fill="currentColor"/>
      <circle cx="32" cy="20" r="2" fill="currentColor"/>
      <circle cx="42" cy="22" r="2" fill="currentColor"/>
    </svg>
  `,

  globe: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="24" stroke="currentColor" stroke-width="2.5"/>
      <path d="M32 8C24 8 18 18 18 32C18 46 24 56 32 56" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M32 8C40 8 46 18 46 32C46 46 40 56 32 56" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M8 32H56" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M12 20H52" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <path d="M12 44H52" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,

  shield: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 8L48 16V32C48 42 42 50 32 56C22 50 16 42 16 32V16L32 8Z" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M28 32L30 36L36 28" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="32" cy="24" r="4" stroke="currentColor" stroke-width="2"/>
    </svg>
  `,

  church: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 56V28L32 16L44 28V56H20Z" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M28 56V40H36V56" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M32 4V12M28 8H36" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      <rect x="24" y="32" width="6" height="8" rx="1" stroke="currentColor" stroke-width="2"/>
      <rect x="34" y="32" width="6" height="8" rx="1" stroke="currentColor" stroke-width="2"/>
    </svg>
  `,

  // Growth & Leadership Icons
  growthChart: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 52H56" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M12 48V40M20 48V36M28 48V28M36 48V24M44 48V16M52 48V12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M12 40L20 36L28 28L36 24L44 16L52 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="52" cy="12" r="3" fill="currentColor"/>
    </svg>
  `,

  people: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="20" r="8" stroke="currentColor" stroke-width="2.5"/>
      <path d="M16 52C16 40 22 32 32 32C42 32 48 40 48 52" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="16" cy="24" r="6" stroke="currentColor" stroke-width="2"/>
      <circle cx="48" cy="24" r="6" stroke="currentColor" stroke-width="2"/>
      <path d="M8 52C8 44 10 38 16 36" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <path d="M56 52C56 44 54 38 48 36" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,

  target: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="24" stroke="currentColor" stroke-width="2.5"/>
      <circle cx="32" cy="32" r="16" stroke="currentColor" stroke-width="2.5"/>
      <circle cx="32" cy="32" r="8" stroke="currentColor" stroke-width="2.5"/>
      <circle cx="32" cy="32" r="3" fill="currentColor"/>
      <path d="M32 8V4M32 60V56M8 32H4M60 32H56" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,

  hands: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 32C12 28 14 24 18 24C22 24 24 28 24 32V44C24 48 22 52 18 52C14 52 12 48 12 44V32Z" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M40 32C40 28 42 24 46 24C50 24 52 28 52 32V44C52 48 50 52 46 52C42 52 40 48 40 44V32Z" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M18 32L32 24L46 32" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="32" cy="20" r="4" stroke="currentColor" stroke-width="2.5"/>
    </svg>
  `,

  // QR Code placeholder
  qrCode: `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="8" width="20" height="20" rx="2" stroke="currentColor" stroke-width="2.5"/>
      <rect x="36" y="8" width="20" height="20" rx="2" stroke="currentColor" stroke-width="2.5"/>
      <rect x="8" y="36" width="20" height="20" rx="2" stroke="currentColor" stroke-width="2.5"/>
      <rect x="14" y="14" width="8" height="8" fill="currentColor"/>
      <rect x="42" y="14" width="8" height="8" fill="currentColor"/>
      <rect x="14" y="42" width="8" height="8" fill="currentColor"/>
      <path d="M36 36H40M44 36H48M52 36H56M36 40H40M44 40H48M52 40H56M36 44H40M44 44H48M52 44H56M36 48H40M44 48H48M52 48H56M36 52H40M44 52H48M52 52H56" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `
};

// Helper function to create inline SVG with custom size and color
function createSVGIcon(iconName, size = 64, color = 'currentColor') {
  const icon = SVGIcons[iconName];
  if (!icon) return '';

  return icon
    .replace('viewBox="0 0 64 64"', `viewBox="0 0 64 64" width="${size}" height="${size}"`)
    .replace(/currentColor/g, color);
}

// Export for use in HTML files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SVGIcons, createSVGIcon };
}
