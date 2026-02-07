<div align="center">
<img width="1200" height="475" alt="ClaimSure AI Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# ClaimSure AI - Intelligent Claims Processing

<p align="center">
  <strong>An AI-driven claims triage and fraud risk scoring system for insurance companies</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-blue" alt="React 19.2" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-blue" alt="TypeScript 5.8" />
  <img src="https://img.shields.io/badge/Vite-6.2-purple" alt="Vite 6.2" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="MIT License" />
</p>

---

## 🎯 Overview

ClaimSure is a production-ready MVP demonstrating how AI improves early-stage claims triage, reduces manual review workload, and accelerates legitimate claim handling. Built for insurance executives, claims officers, and technical stakeholders.

### Key Features

✅ **AI-Powered Analysis** - Sophisticated fraud detection using NLP, temporal patterns, and contextual analysis  
✅ **Completeness Assessment** - Automated evaluation of claim documentation and information quality  
✅ **Intelligent Routing** - Three-tier triage system (Fast-Track, Standard Review, Investigation)  
✅ **Explainable AI** - Transparent risk factors and scoring rationale  
✅ **Real-Time Processing** - Instant claim assessment and dashboard updates  
✅ **Production-Ready Code** - Modular architecture, TypeScript, comprehensive validation  

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18+ recommended)
- **npm** or **yarn**

### Installation

```bash
# Navigate to project directory
cd claimsureAI

# Install dependencies
npm install
```

### Running the Application

```bash
# Start development server
npm run dev
```

Visit **http://localhost:5173** in your browser.

### Building for Production

```bash
# Create optimized production build
npm run build

# Preview production build
npm run preview
```

---

## 📁 Project Structure

```
claimsureAI/
├── src/
│   ├── components/          # React components
│   │   ├── ClaimForm.tsx           # Claim submission form with validation
│   │   ├── OfficerDashboard.tsx    # Claims review dashboard
│   │   ├── ScoreGauge.tsx          # Score visualization component
│   │   └── Icons.tsx               # Icon components
│   ├── services/            # Business logic
│   │   └── aiService.ts            # AI fraud detection & analysis engine
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   ├── config/              # Configuration constants
│   │   └── constants.ts            # Business rules, thresholds, keywords
│   ├── utils/               # Utility functions
│   │   ├── validators.ts           # Form and data validation
│   │   └── helpers.ts              # Helper functions
│   ├── data/                # Mock data
│   │   └── mockClaims.ts           # Diverse claim scenarios
│   ├── styles/              # CSS styles
│   │   └── index.css
│   └── App.tsx              # Main application component
├── index.html               # HTML entry point
├── index.tsx                # React entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🧠 AI Analysis Engine

ClaimSure's AI service simulates sophisticated fraud detection through:

### 1. **NLP & Narrative Analysis**
- Description completeness checks
- Cash/high-value asset detection
- Vague language pattern matching
- Urgency and emotional language indicators
- Claim type consistency validation

### 2. **Document Intelligence**
- Document count and type validation
- Generic filename detection (potential stock images)
- Claim-type specific requirement checks

### 3. **Temporal Pattern Analysis**
- Delayed reporting detection (30/60/90+ day thresholds)
- High-risk time indicators
- Same-day high-value claim flagging

### 4. **Location-Based Risk Assessment**
- Vague location detection
- High-risk location keywords
- Location completeness validation

### 5. **Historical Pattern Simulation**
- Repeat claimant flags
- New policy risk indicators
- Claim frequency patterns

### Scoring System

- **Completeness Score** (0-100): Quality and thoroughness of claim documentation
- **Fraud Risk Score** (0-99): Likelihood of fraudulent activity
  - 0-39: Low Risk → **Fast-Track**
  - 40-69: Medium Risk → **Standard Review**
  - 70+: High Risk → **Investigation**

---

## 🎮 Demo Scenarios

### Test Case 1: Legitimate Low-Risk Claim (Fast-Track)
**What to submit:**
- Claim Type: Gadget
- Description: "I accidentally dropped my iPhone 14 Pro Max while hiking at Yosemite National Park. The screen is shattered and the device won't turn on. Incident occurred around 2 PM."
- Location: "Yosemite National Park, Mist Trail, California"
- Date: Recent (within 7 days)
- Documents: Upload 2-3 files

**Expected Result:** Completeness 90+, Risk Score <20, Routed to **Fast-Track**

---

### Test Case 2: Medium-Risk Claim (Standard Review)
**What to submit:**
- Claim Type: Travel
- Description: "My luggage was lost. I don't know exactly where. It had my laptop."
- Location: "Airport"
- Date: 30-60 days ago
- Documents: Upload 1 file

**Expected Result:** Completeness 50-70, Risk Score 40-60, Routed to **Standard Review**

---

### Test Case 3: High-Risk Fraudulent Pattern (Investigation)
**What to submit:**
- Claim Type: Auto
- Description: "My car was stolen downtown at night around 2am. Had cash in it. I need money immediately."
- Location: "Downtown near bars"
- Date: 60+ days ago
- Documents: Upload 0 files

**Expected Result:** Completeness <40, Risk Score 70+, Routed to **Investigation**

**Fraud Flags Triggered:**
- Cash-related claim
- Vague details
- High-risk hours
- Urgency pressure
- Missing evidence
- Delayed reporting
- Vague location

---

## 🛠️ Technology Stack

| Technology | Purpose |
|-----------|---------|
| **React 19** | UI framework |
| **TypeScript 5.8** | Type safety and code quality |
| **Vite 6.2** | Fast build tool and dev server |
| **Tailwind CSS** | Utility-first styling |
| **Recharts** | Data visualization (charts) |
| **Lucide React** | Icon system |

---

## 🎨 UI/UX Highlights

- ✨ **Real-time validation** with inline error messages
- 📊 **Interactive dashboards** with filtering and sorting
- 🎯 **Visual risk indicators** with color-coded badges
- 📱 **Responsive design** for all screen sizes
- ♿ **Accessibility features** with keyboard navigation
- 🎭 **Smooth animations** and micro-interactions
- 📄 **File upload** with drag-drop, preview, and validation

---

## 🔒 Validation & Error Handling

### Form Validation
- **Date validation**: No future dates, max 365 days past
- **Description validation**: Minimum 50 characters, max 2000
- **File validation**: Max 10MB per file, 10 files total
- **Location validation**: Minimum 3 characters
- **Real-time feedback**: Character counters, quality indicators

### File Upload
- **Supported formats**: JPG, PNG, GIF, WebP, PDF
- **Size limits**: 10MB per file
- **Count limits**: Maximum 10 files
- **Error handling**: Clear error messages with recovery options

---

## 📊 Code Quality

- ✅ **Strict TypeScript:** No `any` types, comprehensive interfaces
- ✅ **Modular architecture:** Separation of concerns (components, services, utils)
- ✅ **Centralized configuration:** All business rules in `constants.ts`
- ✅ **Reusable utilities:** Validation and helper functions
- ✅ **Comprehensive comments:** JSDoc documentation throughout
- ✅ **Error boundaries:** Graceful error handling
- ✅ **Production-ready:** Optimized build, performance-focused

---

## 🚧 Future Enhancements

### Phase 2 Features
- [ ] Backend API integration with Python/FastAPI
- [ ] Real ML models for NLP and image analysis
- [ ] User authentication and role-based access
- [ ] Claim history and analytics dashboard
- [ ] PDF report generation
- [ ] Email notifications
- [ ] Advanced filtering and search
- [ ] Claim status updates and workflows

### Phase 3 Features
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Integration with existing insurance systems
- [ ] Audit logs and compliance reports
- [ ] Advanced data visualization
- [ ] Batch claim processing

---

## 📝 License

This project is licensed under the MIT License.

---

## 👥 Contact & Support

For questions, feedback, or demo requests:
- 📧 Email: support@claimsure.ai
- 🌐 Website: https://claimsure.ai
- 📚 Documentation: https://docs.claimsure.ai

---

## 🙏 Acknowledgments

Built with ❤️ for the insurance industry to demonstrate the transformative power of AI in claims processing.

**Note:** This is an MVP demonstration using simulated AI logic. Production deployment would require real ML models, backend infrastructure, and integration with existing insurance systems.
