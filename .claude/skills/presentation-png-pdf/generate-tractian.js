#!/usr/bin/env node

const path = require('path');
const fs = require('fs').promises;
const HTMLGenerator = require('./scripts/html-generator');
const ScreenshotGenerator = require('./scripts/screenshot-generator');
const PDFCompiler = require('./scripts/pdf-compiler');

// Style guide path
const STYLE_GUIDE_PATH = '/Users/terrancebrandon/Desktop/TB Presentation Styles/llamaindex/llamaindex-style-guide.md';
const OUTPUT_DIR = '/Users/terrancebrandon/Desktop/AI Presentations';
const PRESENTATION_NAME = 'TRACTIAN-Competitive-Intelligence';

// Presentation content structure
const slides = [
  {
    type: 'title',
    title: 'TRACTIAN',
    subtitle: 'Comprehensive Competitive Intelligence Report',
    footer: 'November 10, 2025'
  },
  {
    type: 'section',
    title: 'Executive Summary',
    content: [
      'Rapidly growing industrial AI company - "Industrial Copilot"',
      'Recent $120M Series C at $720M valuation (Dec 2024)',
      '$32.2M revenue with 500+ enterprise clients globally',
      'Only manufacturing company on Forbes AI 50 list (2024)',
      '118% net revenue retention, 1.5% monthly churn'
    ]
  },
  {
    type: 'two-column',
    title: 'Company Overview',
    left: {
      heading: 'Key Highlights',
      items: [
        'Founded 2019 in Brazil, HQ in Atlanta',
        '446 employees (56% YoY growth)',
        '$196M total funding across 5 rounds',
        '100,000+ sensors in 1,000+ factories',
        '5% of global industrial output monitored'
      ]
    },
    right: {
      heading: 'Market Position',
      items: [
        'Forbes AI 50 (only manufacturing)',
        'Blue-chip customers: John Deere, P&G, Caterpillar',
        'Multi-regional: USA, Brazil, Mexico',
        '6-12x customer ROI delivered',
        'First mover in AI-Assisted Maintenance'
      ]
    }
  },
  {
    type: 'section',
    title: 'Financial Performance',
    content: [
      'Revenue Growth: $200K (2020) → $32.2M (2024)',
      'Series C: $120M led by Sapphire Ventures',
      '3.5x valuation increase in 18 months',
      'Exceptional unit economics drive adoption',
      'Average savings: $6,000 per machine annually'
    ]
  },
  {
    type: 'metrics',
    title: 'Key Metrics',
    metrics: [
      { label: 'Net Revenue Retention', value: '118%' },
      { label: 'Monthly Churn', value: '1.5%' },
      { label: 'Customer ROI', value: '6-12x' },
      { label: 'Employees', value: '446' },
      { label: 'Total Funding', value: '$196M' },
      { label: 'Valuation', value: '$720M' }
    ]
  },
  {
    type: 'section',
    title: 'Market Opportunity',
    content: [
      'Predictive Maintenance Market: $10.6B (2024) → $47.8B (2029)',
      'CAGR: 29-35% annual growth',
      'Industrial IoT Market: $82.2B (2023) → $172.2B (2028)',
      'TRACTIAN market share: ~0.27% (massive upside)',
      'Multi-regional presence in North & Latin America'
    ]
  },
  {
    type: 'two-column',
    title: 'Product Portfolio',
    left: {
      heading: 'Hardware',
      items: [
        'Smart Trac Ultra sensors',
        '5-year battery life',
        'Wireless (no Wi-Fi needed)',
        '100,000+ deployed globally',
        '14-day deployment time'
      ]
    },
    right: {
      heading: 'Software',
      items: [
        'AI-powered CMMS platform',
        'OEE monitoring system',
        'Predictive & prescriptive analytics',
        'Oracle Cloud + NVIDIA H200 GPUs',
        '12 patents filed in 2024'
      ]
    }
  },
  {
    type: 'section',
    title: 'Competitive Advantages',
    content: [
      'Only full-stack solution (hardware + AI + CMMS)',
      'Rapid deployment: 14 days vs months for competitors',
      'Low infrastructure requirements (no Wi-Fi)',
      'Patented fault detection technology (USPTO)',
      'Land-and-expand model drives 118% NRR'
    ]
  },
  {
    type: 'competitors',
    title: 'Competitive Landscape',
    competitors: [
      { name: 'Augury', position: 'Direct competitor - machine health', weakness: 'Less integrated approach' },
      { name: 'Senseye/AspenTech', position: 'Enterprise-scale PdM', weakness: 'Slower innovation, higher cost' },
      { name: 'Samsara', position: 'Public company - IoT platform', weakness: 'Generalist, not specialized' },
      { name: 'Legacy Giants', position: 'Siemens, GE, Schneider', weakness: 'Complex integration, slow' }
    ]
  },
  {
    type: 'section',
    title: 'Customer Success',
    content: [
      '500+ industrial clients globally',
      'John Deere, P&G, Caterpillar, Goodyear, Carrier',
      '30% initial deployment → 100% expansion typical',
      'Virtually no customer uninstalls sensors',
      '4.8/5 rating on Capterra (84 reviews)'
    ]
  },
  {
    type: 'swot-grid',
    title: 'SWOT Analysis',
    swot: {
      strengths: [
        'Unique full-stack integration',
        'Patented AI technology',
        'Best-in-class retention (118% NRR)',
        'Forbes AI 50 recognition'
      ],
      weaknesses: [
        'Young company (5 years)',
        'Small team (446 vs thousands)',
        'Hardware durability issues',
        'Not yet profitable'
      ],
      opportunities: [
        'Market growing 29-35% CAGR',
        'Geographic expansion (EU, APAC)',
        'Product expansion (energy mgmt)',
        'Channel partner development'
      ],
      threats: [
        'Well-funded competitors',
        'Legacy giants response',
        'Economic downturn risk',
        'Technology commoditization'
      ]
    }
  },
  {
    type: 'section',
    title: 'Strategic Outlook',
    content: [
      'Well-capitalized for 2-3 year runway',
      'IPO potential 2027-2028 if growth continues',
      'Geographic expansion priority (Europe, Asia)',
      'Product roadmap: Energy management, quality control',
      'M&A opportunities for consolidation'
    ]
  },
  {
    type: 'conclusion',
    title: 'Investment Thesis',
    rating: 'BUY',
    summary: 'TRACTIAN is positioned to become the category leader in AI-powered predictive maintenance, with potential for 10x+ return through IPO or strategic acquisition.',
    keyPoints: [
      'Exceptional product-market fit (118% NRR, 6-12x ROI)',
      'Differentiated technology (only full-stack solution)',
      'Favorable market dynamics (29-35% CAGR to $47.8B)',
      'Top-tier investor backing (Sapphire, General Catalyst)',
      'Clear path to category leadership'
    ]
  },
  {
    type: 'end',
    title: 'Thank You',
    subtitle: 'Questions & Discussion',
    footer: 'TRACTIAN Competitive Intelligence Report | November 2025'
  }
];

async function main() {
  console.log('🚀 Starting TRACTIAN presentation generation...\n');

  // Read style guide
  console.log('📖 Reading LlamaIndex style guide...');
  const styleGuideContent = await fs.readFile(STYLE_GUIDE_PATH, 'utf-8');

  // Create output directory
  const timestamp = new Date().toISOString().split('T')[0];
  const projectDir = path.join(OUTPUT_DIR, `${PRESENTATION_NAME}-${timestamp}`);
  const slidesDir = path.join(projectDir, 'slides');
  const htmlDir = path.join(projectDir, 'html');

  await fs.mkdir(projectDir, { recursive: true });
  await fs.mkdir(slidesDir, { recursive: true });
  await fs.mkdir(htmlDir, { recursive: true });

  console.log(`📁 Created output directory: ${projectDir}\n`);

  // Generate HTML slides
  console.log('🎨 Generating HTML slides...');
  const htmlGenerator = new HTMLGenerator(styleGuideContent);
  const htmlFiles = [];

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    const slideNumber = i + 1;
    const htmlPath = path.join(htmlDir, `slide-${String(slideNumber).padStart(2, '0')}.html`);

    await htmlGenerator.generateSlide(slide, slideNumber, slides.length, htmlPath);
    htmlFiles.push(htmlPath);
    console.log(`  ✓ Generated slide ${slideNumber}/${slides.length}: ${slide.title || slide.type}`);
  }

  console.log(`\n📸 Capturing screenshots...`);
  const screenshotGen = new ScreenshotGenerator();
  const pngFiles = [];

  for (let i = 0; i < htmlFiles.length; i++) {
    const htmlFile = htmlFiles[i];
    const slideNumber = i + 1;
    const pngPath = path.join(slidesDir, `${PRESENTATION_NAME}-slide-${String(slideNumber).padStart(2, '0')}.png`);

    await screenshotGen.capture(htmlFile, pngPath);
    pngFiles.push(pngPath);
    console.log(`  ✓ Captured slide ${slideNumber}/${slides.length}`);
  }

  await screenshotGen.close();

  console.log(`\n📄 Compiling PDF...`);
  const pdfCompiler = new PDFCompiler();
  const pdfPath = path.join(projectDir, `${PRESENTATION_NAME}.pdf`);
  await pdfCompiler.compile(pngFiles, pdfPath);

  console.log(`\n✅ Presentation complete!`);
  console.log(`\n📦 Output:`);
  console.log(`   PDF: ${pdfPath}`);
  console.log(`   Slides: ${slidesDir}`);
  console.log(`   HTML: ${htmlDir}`);
}

main().catch(console.error);
