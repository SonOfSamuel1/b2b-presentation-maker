/**
 * SVG Graphics Generator
 * Creates custom SVG graphics for presentation slides
 * NO EMOJIS - Only custom vector graphics
 */

class SVGGenerator {
  constructor(colorScheme = {}) {
    this.colors = {
      primary: colorScheme.primary || '#2563EB',
      secondary: colorScheme.secondary || '#1E40AF',
      accent: colorScheme.accent || '#F59E0B',
      text: colorScheme.text || '#111827',
      light: colorScheme.light || '#F3F4F6',
      ...colorScheme
    };
  }

  /**
   * Generate SVG based on type and context
   * @param {string} type - Type of graphic (icon, chart, illustration, pattern)
   * @param {Object} data - Data for the graphic
   * @returns {string} SVG markup
   */
  generate(type, data = {}) {
    const generators = {
      icon: this.generateIcon.bind(this),
      chart: this.generateChart.bind(this),
      illustration: this.generateIllustration.bind(this),
      pattern: this.generatePattern.bind(this),
      divider: this.generateDivider.bind(this),
      badge: this.generateBadge.bind(this)
    };

    const generator = generators[type];
    if (!generator) {
      console.warn(`Unknown SVG type: ${type}`);
      return this.generatePlaceholder(data);
    }

    return generator(data);
  }

  // ========== ICONS ==========

  generateIcon(data) {
    const iconTypes = {
      checkmark: this.iconCheckmark.bind(this),
      arrow: this.iconArrow.bind(this),
      star: this.iconStar.bind(this),
      lightbulb: this.iconLightbulb.bind(this),
      target: this.iconTarget.bind(this),
      rocket: this.iconRocket.bind(this),
      chart: this.iconChart.bind(this),
      users: this.iconUsers.bind(this),
      globe: this.iconGlobe.bind(this),
      shield: this.iconShield.bind(this),
      zap: this.iconZap.bind(this),
      trending: this.iconTrending.bind(this)
    };

    const iconType = data.name || 'checkmark';
    const size = data.size || 64;
    const color = data.color || this.colors.primary;

    const iconFunc = iconTypes[iconType] || iconTypes.checkmark;
    return iconFunc(size, color, data);
  }

  iconCheckmark(size, color) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M20 6L9 17L4 12" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
  }

  iconArrow(size, color, data = {}) {
    const direction = data.direction || 'right';
    const rotations = { right: 0, down: 90, left: 180, up: 270 };
    const rotation = rotations[direction] || 0;

    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(${rotation})">
  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
  }

  iconStar(size, color) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
        fill="${color}" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
  }

  iconLightbulb(size, color) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M9 18H15M10 22H14M12 2C8.13 2 5 5.13 5 9C5 11.38 6.19 13.47 8 14.74V17C8 17.55 8.45 18 9 18H15C15.55 18 16 17.55 16 17V14.74C17.81 13.47 19 11.38 19 9C19 5.13 15.87 2 12 2Z"
        stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
  }

  iconTarget(size, color) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="10" stroke="${color}" stroke-width="2"/>
  <circle cx="12" cy="12" r="6" stroke="${color}" stroke-width="2"/>
  <circle cx="12" cy="12" r="2" fill="${color}"/>
</svg>`;
  }

  iconRocket(size, color) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M9 11L12 14L22 4L12 14V21L15 18L18 22L20 21L17 17L21 14L9 11Z"
        fill="${color}" opacity="0.2"/>
  <path d="M9 11L12 14L22 4M12 14V21L15 18L18 22L20 21L17 17L21 14"
        stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
  }

  iconChart(size, color) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="3" y="13" width="4" height="8" fill="${color}" opacity="0.6" rx="1"/>
  <rect x="10" y="8" width="4" height="13" fill="${color}" opacity="0.8" rx="1"/>
  <rect x="17" y="3" width="4" height="18" fill="${color}" rx="1"/>
</svg>`;
  }

  iconUsers(size, color) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="9" cy="7" r="4" stroke="${color}" stroke-width="2"/>
  <path d="M2 21V19C2 16.79 3.79 15 6 15H12C14.21 15 16 16.79 16 19V21"
        stroke="${color}" stroke-width="2" stroke-linecap="round"/>
  <circle cx="17" cy="7" r="3" stroke="${color}" stroke-width="2"/>
  <path d="M22 21V19.5C22 18.12 20.88 17 19.5 17H18"
        stroke="${color}" stroke-width="2" stroke-linecap="round"/>
</svg>`;
  }

  iconGlobe(size, color) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="10" stroke="${color}" stroke-width="2"/>
  <path d="M2 12H22M12 2C14.5 4.5 16 8 16 12C16 16 14.5 19.5 12 22M12 2C9.5 4.5 8 8 8 12C8 16 9.5 19.5 12 22"
        stroke="${color}" stroke-width="2"/>
</svg>`;
  }

  iconShield(size, color) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2L4 6V12C4 16.42 7.58 20.42 12 22C16.42 20.42 20 16.42 20 12V6L12 2Z"
        fill="${color}" opacity="0.1" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M9 12L11 14L15 10" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
  }

  iconZap(size, color) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
        fill="${color}" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
  }

  iconTrending(size, color) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M23 6L13.5 15.5L8.5 10.5L1 18" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M17 6H23V12" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
  }

  // ========== CHARTS ==========

  generateChart(data) {
    const chartTypes = {
      bar: this.chartBar.bind(this),
      line: this.chartLine.bind(this),
      pie: this.chartPie.bind(this),
      donut: this.chartDonut.bind(this)
    };

    const chartType = data.type || 'bar';
    const chartFunc = chartTypes[chartType] || chartTypes.bar;

    return chartFunc(data);
  }

  chartBar(data) {
    const width = data.width || 600;
    const height = data.height || 400;
    const values = data.values || [40, 65, 85, 70, 90];
    const labels = data.labels || values.map((_, i) => `Item ${i + 1}`);
    const maxValue = Math.max(...values);
    const barWidth = width / (values.length * 2);
    const spacing = barWidth / 2;

    const bars = values.map((value, i) => {
      const barHeight = (value / maxValue) * (height - 60);
      const x = i * (barWidth + spacing) + spacing + 40;
      const y = height - barHeight - 40;

      return `
        <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}"
              fill="${this.colors.primary}" opacity="${0.6 + (i * 0.1)}" rx="4"/>
        <text x="${x + barWidth / 2}" y="${height - 20}"
              text-anchor="middle" font-size="12" fill="${this.colors.text}">${labels[i]}</text>
        <text x="${x + barWidth / 2}" y="${y - 8}"
              text-anchor="middle" font-size="14" font-weight="600" fill="${this.colors.primary}">${value}</text>
      `;
    }).join('');

    return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  ${bars}
  <line x1="40" y1="${height - 40}" x2="${width - 20}" y2="${height - 40}"
        stroke="${this.colors.text}" stroke-width="2" opacity="0.2"/>
</svg>`;
  }

  chartLine(data) {
    const width = data.width || 600;
    const height = data.height || 400;
    const values = data.values || [30, 50, 45, 70, 65, 85, 90];
    const maxValue = Math.max(...values);
    const stepX = (width - 80) / (values.length - 1);

    const points = values.map((value, i) => {
      const x = 40 + i * stepX;
      const y = height - 40 - (value / maxValue) * (height - 80);
      return `${x},${y}`;
    }).join(' ');

    const areaPoints = `40,${height - 40} ${points} ${40 + stepX * (values.length - 1)},${height - 40}`;

    return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="lineGradient" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stop-color="${this.colors.primary}" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="${this.colors.primary}" stop-opacity="0.05"/>
    </linearGradient>
  </defs>
  <polygon points="${areaPoints}" fill="url(#lineGradient)"/>
  <polyline points="${points}" fill="none" stroke="${this.colors.primary}"
            stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  ${values.map((value, i) => {
    const x = 40 + i * stepX;
    const y = height - 40 - (value / maxValue) * (height - 80);
    return `<circle cx="${x}" cy="${y}" r="5" fill="${this.colors.primary}"/>`;
  }).join('')}
</svg>`;
  }

  chartDonut(data) {
    const size = data.size || 300;
    const values = data.values || [35, 25, 20, 20];
    const labels = data.labels || ['A', 'B', 'C', 'D'];
    const total = values.reduce((a, b) => a + b, 0);
    const radius = size / 2.5;
    const innerRadius = radius * 0.6;
    const cx = size / 2;
    const cy = size / 2;

    let currentAngle = -90;
    const slices = values.map((value, i) => {
      const angle = (value / total) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;

      const x1 = cx + radius * Math.cos((startAngle * Math.PI) / 180);
      const y1 = cy + radius * Math.sin((startAngle * Math.PI) / 180);
      const x2 = cx + radius * Math.cos((endAngle * Math.PI) / 180);
      const y2 = cy + radius * Math.sin((endAngle * Math.PI) / 180);

      const ix1 = cx + innerRadius * Math.cos((startAngle * Math.PI) / 180);
      const iy1 = cy + innerRadius * Math.sin((startAngle * Math.PI) / 180);
      const ix2 = cx + innerRadius * Math.cos((endAngle * Math.PI) / 180);
      const iy2 = cy + innerRadius * Math.sin((endAngle * Math.PI) / 180);

      const largeArc = angle > 180 ? 1 : 0;

      currentAngle += angle;

      const colors = [this.colors.primary, this.colors.secondary, this.colors.accent, this.colors.light];
      const color = colors[i % colors.length];

      return `<path d="M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
                       L ${ix2} ${iy2} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix1} ${iy1} Z"
                    fill="${color}" opacity="0.9"/>`;
    }).join('');

    return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  ${slices}
  <circle cx="${cx}" cy="${cy}" r="${innerRadius}" fill="white"/>
</svg>`;
  }

  // ========== ILLUSTRATIONS ==========

  generateIllustration(data) {
    // Generate custom illustrations based on theme
    const theme = data.theme || 'tech';

    if (theme === 'tech') {
      return this.illustrationTech(data);
    } else if (theme === 'growth') {
      return this.illustrationGrowth(data);
    } else if (theme === 'team') {
      return this.illustrationTeam(data);
    }

    return this.illustrationAbstract(data);
  }

  illustrationAbstract(data) {
    const width = data.width || 800;
    const height = data.height || 400;

    return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${this.colors.primary};stop-opacity:0.3" />
      <stop offset="100%" style="stop-color:${this.colors.accent};stop-opacity:0.1" />
    </linearGradient>
  </defs>
  <circle cx="${width * 0.3}" cy="${height * 0.4}" r="${width * 0.2}" fill="url(#grad1)"/>
  <circle cx="${width * 0.7}" cy="${height * 0.6}" r="${width * 0.15}" fill="${this.colors.secondary}" opacity="0.2"/>
  <rect x="${width * 0.5}" y="${height * 0.3}" width="${width * 0.3}" height="${width * 0.02}"
        fill="${this.colors.accent}" opacity="0.4" transform="rotate(45 ${width * 0.65} ${height * 0.4})"/>
</svg>`;
  }

  // ========== PATTERNS ==========

  generatePattern(data) {
    const type = data.patternType || 'dots';

    if (type === 'dots') {
      return this.patternDots(data);
    } else if (type === 'grid') {
      return this.patternGrid(data);
    } else if (type === 'waves') {
      return this.patternWaves(data);
    }

    return this.patternDots(data);
  }

  patternDots(data) {
    const width = data.width || 1920;
    const height = data.height || 1080;
    const spacing = data.spacing || 50;
    const dotSize = data.dotSize || 4;
    const color = data.color || this.colors.primary;

    const dots = [];
    for (let x = spacing; x < width; x += spacing) {
      for (let y = spacing; y < height; y += spacing) {
        dots.push(`<circle cx="${x}" cy="${y}" r="${dotSize}" fill="${color}" opacity="0.15"/>`);
      }
    }

    return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  ${dots.join('')}
</svg>`;
  }

  patternGrid(data) {
    const width = data.width || 1920;
    const height = data.height || 1080;
    const spacing = data.spacing || 100;
    const color = data.color || this.colors.text;

    const lines = [];
    for (let x = 0; x < width; x += spacing) {
      lines.push(`<line x1="${x}" y1="0" x2="${x}" y2="${height}" stroke="${color}" stroke-width="1" opacity="0.1"/>`);
    }
    for (let y = 0; y < height; y += spacing) {
      lines.push(`<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="${color}" stroke-width="1" opacity="0.1"/>`);
    }

    return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  ${lines.join('')}
</svg>`;
  }

  patternWaves(data) {
    const width = data.width || 1920;
    const height = data.height || 1080;

    return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <path d="M0,${height * 0.7} Q${width * 0.25},${height * 0.5} ${width * 0.5},${height * 0.7} T${width},${height * 0.7} V${height} H0 Z"
        fill="${this.colors.primary}" opacity="0.05"/>
  <path d="M0,${height * 0.8} Q${width * 0.25},${height * 0.6} ${width * 0.5},${height * 0.8} T${width},${height * 0.8} V${height} H0 Z"
        fill="${this.colors.secondary}" opacity="0.08"/>
</svg>`;
  }

  // ========== DIVIDERS ==========

  generateDivider(data) {
    const width = data.width || 1920;
    const height = data.height || 20;
    const style = data.style || 'line';

    if (style === 'gradient') {
      return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="divGrad" x1="0%" x2="100%">
      <stop offset="0%" stop-color="${this.colors.primary}" stop-opacity="0"/>
      <stop offset="50%" stop-color="${this.colors.primary}" stop-opacity="1"/>
      <stop offset="100%" stop-color="${this.colors.primary}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="3" fill="url(#divGrad)" y="${(height - 3) / 2}"/>
</svg>`;
    }

    return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <line x1="0" y1="${height / 2}" x2="${width}" y2="${height / 2}"
        stroke="${this.colors.primary}" stroke-width="2" opacity="0.3"/>
</svg>`;
  }

  // ========== BADGES ==========

  generateBadge(data) {
    const text = data.text || 'NEW';
    const color = data.color || this.colors.accent;
    const size = data.size || 80;

    return `<svg width="${size}" height="${size * 0.4}" viewBox="0 0 ${size} ${size * 0.4}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size * 0.4}" rx="${size * 0.2}" fill="${color}"/>
  <text x="${size / 2}" y="${size * 0.25}" text-anchor="middle"
        font-size="${size * 0.18}" font-weight="700" fill="white">${text}</text>
</svg>`;
  }

  // ========== PLACEHOLDER ==========

  generatePlaceholder(data) {
    const width = data.width || 200;
    const height = data.height || 200;

    return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="${this.colors.light}"/>
  <text x="${width / 2}" y="${height / 2}" text-anchor="middle"
        font-size="16" fill="${this.colors.text}" opacity="0.5">SVG Graphic</text>
</svg>`;
  }
}

module.exports = SVGGenerator;
