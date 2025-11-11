#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

const OUTPUT_DIR = '/Users/terrancebrandon/Desktop/Code Projects (Official)/App- B2B- Presentation Maker/tractian-presentation';
const LOGO_PATH = '/Users/terrancebrandon/Desktop/TB Presentation Styles/llamaindex/images/logos/logo-medium-145x24.svg';

// Base template for all slides
const createSlideHTML = (slideNumber, totalSlides, content, theme = 'light') => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1920, initial-scale=1.0">
  <title>TRACTIAN Slide ${slideNumber}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: ${theme === 'dark' ? '#000000' : '#FFFFFF'};
      color: ${theme === 'dark' ? '#FFFFFF' : '#000000'};
      width: 1920px;
      height: 1080px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .slide {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 80px 120px;
      position: relative;
    }

    .slide-footer {
      position: absolute;
      bottom: 40px;
      left: 120px;
      right: 120px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: "SF Mono", Monaco, monospace;
      font-size: 14px;
      color: ${theme === 'dark' ? '#7F7F7F' : '#7F7F7F'};
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    h1 {
      font-size: clamp(48px, 5vw, 72px);
      font-weight: 500;
      line-height: 1.1;
      letter-spacing: -0.03em;
      margin-bottom: 24px;
    }

    h2 {
      font-size: clamp(36px, 4vw, 56px);
      font-weight: 500;
      line-height: 1.1;
      letter-spacing: -0.03em;
      margin-bottom: 40px;
    }

    h3 {
      font-size: 28px;
      font-weight: 500;
      line-height: 1.2;
      margin-bottom: 20px;
    }

    .subtitle {
      font-size: 24px;
      color: ${theme === 'dark' ? '#7F7F7F' : '#7F7F7F'};
      line-height: 1.5;
      max-width: 800px;
    }

    .content-list {
      list-style: none;
      font-size: 22px;
      line-height: 1.8;
    }

    .content-list li {
      margin-bottom: 16px;
      padding-left: 40px;
      position: relative;
    }

    .content-list li:before {
      content: "■";
      position: absolute;
      left: 0;
      color: ${theme === 'dark' ? '#FFFFFF' : '#000000'};
    }

    .two-column {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 80px;
      margin-top: 40px;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 40px;
      margin-top: 60px;
    }

    .metric-card {
      background: ${theme === 'dark' ? '#1F1F1F' : '#F5F5F5'};
      padding: 40px;
      border-radius: 12px;
      text-align: center;
    }

    .metric-value {
      font-size: 56px;
      font-weight: 500;
      margin-bottom: 12px;
    }

    .metric-label {
      font-size: 16px;
      font-family: "SF Mono", Monaco, monospace;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: ${theme === 'dark' ? '#7F7F7F' : '#7F7F7F'};
    }

    .swot-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-top: 40px;
    }

    .swot-card {
      background: ${theme === 'dark' ? '#1F1F1F' : '#F5F5F5'};
      padding: 32px;
      border-radius: 12px;
    }

    .swot-card h4 {
      font-size: 20px;
      font-family: "SF Mono", Monaco, monospace;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-bottom: 20px;
    }

    .swot-card ul {
      list-style: none;
      font-size: 16px;
      line-height: 1.8;
    }

    .swot-card li {
      margin-bottom: 8px;
      padding-left: 20px;
      position: relative;
    }

    .swot-card li:before {
      content: "•";
      position: absolute;
      left: 0;
    }

    .center-content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      flex: 1;
    }

    .rating-badge {
      display: inline-block;
      background: #000000;
      color: #FFFFFF;
      padding: 16px 48px;
      font-size: 36px;
      font-weight: 500;
      font-family: "SF Mono", Monaco, monospace;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin: 40px 0;
    }

    .competitors-list {
      margin-top: 40px;
    }

    .competitor-item {
      background: ${theme === 'dark' ? '#1F1F1F' : '#F5F5F5'};
      padding: 24px 32px;
      margin-bottom: 16px;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .competitor-name {
      font-size: 20px;
      font-weight: 500;
    }

    .competitor-weakness {
      font-size: 16px;
      color: #7F7F7F;
      max-width: 400px;
    }
  </style>
</head>
<body>
  <div class="slide">
    ${content}
  </div>
  <div class="slide-footer">
    <span>TRACTIAN Competitive Intelligence</span>
    <span>${slideNumber} / ${totalSlides}</span>
  </div>
</body>
</html>`;

// Slide content definitions
const slides = [
  // Slide 1: Title
  {
    number: 1,
    content: `
      <div class="center-content">
        <h1>TRACTIAN</h1>
        <p class="subtitle">Comprehensive Competitive Intelligence Report</p>
        <div class="slide-footer" style="position: static; margin-top: 60px;">
          <span>November 10, 2025</span>
        </div>
      </div>
    `
  },

  // Slide 2: Executive Summary
  {
    number: 2,
    content: `
      <h2>Executive Summary</h2>
      <ul class="content-list">
        <li>Rapidly growing industrial AI company - "Industrial Copilot"</li>
        <li>Recent $120M Series C at $720M valuation (Dec 2024)</li>
        <li>$32.2M revenue with 500+ enterprise clients globally</li>
        <li>Only manufacturing company on Forbes AI 50 list (2024)</li>
        <li>118% net revenue retention, 1.5% monthly churn</li>
      </ul>
    `
  },

  // Slide 3: Company Overview
  {
    number: 3,
    theme: 'dark',
    content: `
      <h2>Company Overview</h2>
      <div class="two-column">
        <div>
          <h3>Key Highlights</h3>
          <ul class="content-list" style="font-size: 18px;">
            <li>Founded 2019 in Brazil, HQ in Atlanta</li>
            <li>446 employees (56% YoY growth)</li>
            <li>$196M total funding across 5 rounds</li>
            <li>100,000+ sensors in 1,000+ factories</li>
            <li>5% of global industrial output monitored</li>
          </ul>
        </div>
        <div>
          <h3>Market Position</h3>
          <ul class="content-list" style="font-size: 18px;">
            <li>Forbes AI 50 (only manufacturing)</li>
            <li>Blue-chip: John Deere, P&G, Caterpillar</li>
            <li>Multi-regional: USA, Brazil, Mexico</li>
            <li>6-12x customer ROI delivered</li>
            <li>First mover in AI-Assisted Maintenance</li>
          </ul>
        </div>
      </div>
    `
  },

  // Slide 4: Financial Performance
  {
    number: 4,
    content: `
      <h2>Financial Performance</h2>
      <ul class="content-list">
        <li>Revenue Growth: $200K (2020) → $32.2M (2024)</li>
        <li>Series C: $120M led by Sapphire Ventures</li>
        <li>3.5x valuation increase in 18 months</li>
        <li>Exceptional unit economics drive adoption</li>
        <li>Average savings: $6,000 per machine annually</li>
      </ul>
    `
  },

  // Slide 5: Key Metrics
  {
    number: 5,
    theme: 'dark',
    content: `
      <h2>Key Metrics</h2>
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-value">118%</div>
          <div class="metric-label">Net Revenue Retention</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">1.5%</div>
          <div class="metric-label">Monthly Churn</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">6-12x</div>
          <div class="metric-label">Customer ROI</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">446</div>
          <div class="metric-label">Employees</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">$196M</div>
          <div class="metric-label">Total Funding</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">$720M</div>
          <div class="metric-label">Valuation</div>
        </div>
      </div>
    `
  },

  // Slide 6: Market Opportunity
  {
    number: 6,
    content: `
      <h2>Market Opportunity</h2>
      <ul class="content-list">
        <li>Predictive Maintenance Market: $10.6B (2024) → $47.8B (2029)</li>
        <li>CAGR: 29-35% annual growth trajectory</li>
        <li>Industrial IoT Market: $82.2B (2023) → $172.2B (2028)</li>
        <li>TRACTIAN market share: ~0.27% (massive upside potential)</li>
        <li>Multi-regional presence in North & Latin America</li>
      </ul>
    `
  },

  // Slide 7: Product Portfolio
  {
    number: 7,
    theme: 'dark',
    content: `
      <h2>Product Portfolio</h2>
      <div class="two-column">
        <div>
          <h3>Hardware</h3>
          <ul class="content-list" style="font-size: 18px;">
            <li>Smart Trac Ultra sensors</li>
            <li>5-year battery life</li>
            <li>Wireless (no Wi-Fi needed)</li>
            <li>100,000+ deployed globally</li>
            <li>14-day deployment time</li>
          </ul>
        </div>
        <div>
          <h3>Software</h3>
          <ul class="content-list" style="font-size: 18px;">
            <li>AI-powered CMMS platform</li>
            <li>OEE monitoring system</li>
            <li>Predictive & prescriptive analytics</li>
            <li>Oracle Cloud + NVIDIA H200 GPUs</li>
            <li>12 patents filed in 2024</li>
          </ul>
        </div>
      </div>
    `
  },

  // Slide 8: Competitive Advantages
  {
    number: 8,
    content: `
      <h2>Competitive Advantages</h2>
      <ul class="content-list">
        <li>Only full-stack solution (hardware + AI + CMMS)</li>
        <li>Rapid deployment: 14 days vs months for competitors</li>
        <li>Low infrastructure requirements (no Wi-Fi)</li>
        <li>Patented fault detection technology (USPTO)</li>
        <li>Land-and-expand model drives 118% NRR</li>
      </ul>
    `
  },

  // Slide 9: Competitive Landscape
  {
    number: 9,
    theme: 'dark',
    content: `
      <h2>Competitive Landscape</h2>
      <div class="competitors-list">
        <div class="competitor-item">
          <div>
            <div class="competitor-name">Augury</div>
            <div style="font-size: 16px; color: #7F7F7F; margin-top: 4px;">Direct competitor - machine health</div>
          </div>
          <div class="competitor-weakness">Less integrated approach</div>
        </div>
        <div class="competitor-item">
          <div>
            <div class="competitor-name">Senseye / AspenTech</div>
            <div style="font-size: 16px; color: #7F7F7F; margin-top: 4px;">Enterprise-scale PdM</div>
          </div>
          <div class="competitor-weakness">Slower innovation, higher cost</div>
        </div>
        <div class="competitor-item">
          <div>
            <div class="competitor-name">Samsara</div>
            <div style="font-size: 16px; color: #7F7F7F; margin-top: 4px;">Public company - IoT platform</div>
          </div>
          <div class="competitor-weakness">Generalist, not specialized</div>
        </div>
        <div class="competitor-item">
          <div>
            <div class="competitor-name">Legacy Giants</div>
            <div style="font-size: 16px; color: #7F7F7F; margin-top: 4px;">Siemens, GE, Schneider</div>
          </div>
          <div class="competitor-weakness">Complex integration, slow</div>
        </div>
      </div>
    `
  },

  // Slide 10: Customer Success
  {
    number: 10,
    content: `
      <h2>Customer Success</h2>
      <ul class="content-list">
        <li>500+ industrial clients globally</li>
        <li>John Deere, P&G, Caterpillar, Goodyear, Carrier, Johnson Controls</li>
        <li>30% initial deployment → 100% expansion typical</li>
        <li>Virtually no customer uninstalls sensors once installed</li>
        <li>4.8/5 rating on Capterra (84 reviews)</li>
      </ul>
    `
  },

  // Slide 11: SWOT Analysis
  {
    number: 11,
    theme: 'dark',
    content: `
      <h2>SWOT Analysis</h2>
      <div class="swot-grid">
        <div class="swot-card">
          <h4>Strengths</h4>
          <ul>
            <li>Unique full-stack integration</li>
            <li>Patented AI technology</li>
            <li>Best-in-class retention (118% NRR)</li>
            <li>Forbes AI 50 recognition</li>
          </ul>
        </div>
        <div class="swot-card">
          <h4>Weaknesses</h4>
          <ul>
            <li>Young company (5 years)</li>
            <li>Small team (446 vs thousands)</li>
            <li>Hardware durability issues</li>
            <li>Not yet profitable</li>
          </ul>
        </div>
        <div class="swot-card">
          <h4>Opportunities</h4>
          <ul>
            <li>Market growing 29-35% CAGR</li>
            <li>Geographic expansion (EU, APAC)</li>
            <li>Product expansion (energy mgmt)</li>
            <li>Channel partner development</li>
          </ul>
        </div>
        <div class="swot-card">
          <h4>Threats</h4>
          <ul>
            <li>Well-funded competitors</li>
            <li>Legacy giants response</li>
            <li>Economic downturn risk</li>
            <li>Technology commoditization</li>
          </ul>
        </div>
      </div>
    `
  },

  // Slide 12: Strategic Outlook
  {
    number: 12,
    content: `
      <h2>Strategic Outlook</h2>
      <ul class="content-list">
        <li>Well-capitalized for 2-3 year runway</li>
        <li>IPO potential 2027-2028 if growth continues</li>
        <li>Geographic expansion priority (Europe, Asia-Pacific)</li>
        <li>Product roadmap: Energy management, quality control, digital twin</li>
        <li>M&A opportunities for market consolidation</li>
      </ul>
    `
  },

  // Slide 13: Investment Thesis
  {
    number: 13,
    theme: 'dark',
    content: `
      <h2>Investment Thesis</h2>
      <div class="center-content" style="align-items: flex-start; text-align: left;">
        <div class="rating-badge">BUY</div>
        <p class="subtitle" style="max-width: 1200px; margin-bottom: 40px;">
          TRACTIAN is positioned to become the category leader in AI-powered predictive maintenance,
          with potential for 10x+ return through IPO or strategic acquisition.
        </p>
        <ul class="content-list" style="font-size: 20px;">
          <li>Exceptional product-market fit (118% NRR, 6-12x ROI)</li>
          <li>Differentiated technology (only full-stack solution)</li>
          <li>Favorable market dynamics (29-35% CAGR to $47.8B)</li>
          <li>Top-tier investor backing (Sapphire, General Catalyst)</li>
          <li>Clear path to category leadership</li>
        </ul>
      </div>
    `
  },

  // Slide 14: Thank You
  {
    number: 14,
    content: `
      <div class="center-content">
        <h1>Thank You</h1>
        <p class="subtitle">Questions & Discussion</p>
        <div class="slide-footer" style="position: static; margin-top: 60px;">
          <span>TRACTIAN Competitive Intelligence Report | November 2025</span>
        </div>
      </div>
    `
  }
];

async function main() {
  console.log('🎨 Creating TRACTIAN presentation HTML slides...\n');

  // Create output directory
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const totalSlides = slides.length;

  // Generate each slide
  for (const slide of slides) {
    const filename = `slide-${String(slide.number).padStart(2, '0')}.html`;
    const filepath = path.join(OUTPUT_DIR, filename);

    const html = createSlideHTML(
      slide.number,
      totalSlides,
      slide.content,
      slide.theme || 'light'
    );

    await fs.writeFile(filepath, html, 'utf-8');
    console.log(`  ✓ Created ${filename}`);
  }

  console.log(`\n✅ All ${totalSlides} slides created in: ${OUTPUT_DIR}`);
}

main().catch(console.error);
