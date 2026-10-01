# CookieLens 

**Real-time Cookie Chain Ecosystem Health Dashboard & Transaction Decoder**

CookieLens is an open-source analytics platform that brings transparency to Cookie Chain. Monitor ecosystem health in real-time, decode complex on-chain transactions, explore programs, and track your portfolio—all in one intuitive dashboard.

## Features

### Core Features
- ** Health Score (0-100)** — Transparent, weighted metric showing ecosystem vitality based on transaction volume, active wallets, program diversity, and success rates
- ** Real-time Analytics** — Live transaction feed, volume trends, wallet activity, and ecosystem metrics updated every 5 seconds
- ** Transaction Decoder** — Break down on-chain program instructions and contract calls into human-readable format
- ** Program Explorer** — Discover, analyze, and sort all programs building on Cookie Chain by activity, users, and success rate
- ** Portfolio Tracking** — Connect wallet with Nightly, view holdings, transaction history, and personal statistics
- ** Advanced Charts** — Interactive Recharts visualizations for volume trends, active wallets, and success rates (24h/7d/30d)
- ** Dark Mode** — Premium dark theme optimized for trader aesthetics
- ** Mobile Responsive** — Fully responsive design for desktop, tablet, and mobile (375px+)

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/cookieviz.git
cd cookieviz

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Add your API endpoints
# NEXT_PUBLIC_COOKIESCAN_API=https://api.cookiescan.io
# NEXT_PUBLIC_COOKIE_RPC=https://rpc.cookiescan.io
```

### Run Locally

```bash
# Development server
npm run dev

# Open http://localhost:3000 in your browser
```

### Build for Production

```bash
# Build the app
npm run build

# Start production server
npm run start
```

## Tech Stack

**Frontend:**
- React 18 — UI framework
- Next.js 14 — Full-stack framework with API routes
- TypeScript — Type safety
- Tailwind CSS — Styling with Poppins font
- Recharts — Data visualization

**Blockchain:**
- @nightly-labs/wallet — Wallet connection (Nightly support)
- @solana/web3.js — Solana/SVM utilities
- axios — HTTP client for API calls

**Data & State:**
- SWR — Data fetching + caching with auto-refresh
- React Context — Wallet state management

**Dev Tools:**
- ESLint — Code linting
- Prettier — Code formatting
- Vercel — Hosting & deployment

## Project Structure

```
cookielens/
├── public/               # Static assets, favicon
├── src/
│   ├── app/
│   │   ├── layout.tsx    # Root layout with Poppins font
│   │   ├── page.tsx      # Landing dashboard
│   │   ├── globals.css   # Global styles + color tokens
│   │   └── api/          # API routes (optional serverless functions)
│   │
│   ├── components/
│   │   ├── Header.tsx           # Navigation + wallet connect
│   │   ├── HealthScore/
│   │   │   ├── Gauge.tsx        # Circular health gauge (0-100)
│   │   │   ├── Breakdown.tsx    # Score breakdown card
│   │   │   └── HealthScore.tsx  # Main component
│   │   ├── MetricsCards/
│   │   │   └── MetricCard.tsx   # Individual metric card
│   │   ├── TxFeed/
│   │   │   ├── TxTable.tsx      # Transaction table
│   │   │   ├── TxRow.tsx        # Single tx row
│   │   │   └── TxDecoder.tsx    # Decode instruction
│   │   ├── Charts/
│   │   │   ├── VolumeChart.tsx  # Area chart
│   │   │   ├── WalletsChart.tsx # Line chart
│   │   │   └── SuccessChart.tsx # Trend chart
│   │   ├── ProgramExplorer/
│   │   │   ├── ProgramList.tsx  # Program directory
│   │   │   ├── ProgramCard.tsx  # Individual program
│   │   │   └── ProgramDetail.tsx
│   │   ├── Wallet/
│   │   │   ├── WalletModal.tsx      # Nightly connection modal
│   │   │   ├── WalletProfile.tsx    # Connected user profile
│   │   │   └── MyActivity.tsx       # Portfolio view
│   │   └── shared/
│   │       ├── LoadingState.tsx     # Skeleton loaders
│   │       ├── ErrorState.tsx       # Error boundaries
│   │       ├── EmptyState.tsx       # Empty data states
│   │       └── Toast.tsx            # Toast notifications
│   │
│   ├── hooks/
│   │   ├── useWallet.ts    # Wallet connection & state
│   │   ├── useTxData.ts    # Fetch & decode transactions
│   │   ├── useHealthScore.ts
│   │   ├── useProgramData.ts
│   │   └── useAPI.ts       # Generic API fetch hook
│   │
│   ├── services/
│   │   ├── api.ts          # CookieScan API client
│   │   ├── decoder.ts      # Transaction decoder logic
│   │   ├── healthScore.ts  # Score calculation
│   │   └── rpc.ts          # Cookie Chain RPC calls
│   │
│   ├── types/
│   │   ├── index.ts        # Global types
│   │   ├── transaction.ts
│   │   ├── program.ts
│   │   └── wallet.ts
│   │
│   ├── utils/
│   │   ├── format.ts       # Format numbers, dates, addresses
│   │   ├── colors.ts       # Color utilities
│   │   └── constants.ts    # App constants
│   │
│   └── context/
│       ├── WalletContext.tsx    # Wallet state provider
│       └── ThemeContext.tsx     # Dark/light mode
│
├── .env.example            # Environment variables template
├── .eslintrc.json         # ESLint config
├── .prettierrc             # Prettier config
├── tailwind.config.ts      # Tailwind + Poppins setup
├── tsconfig.json          # TypeScript config
├── next.config.js         # Next.js config
├── package.json           # Dependencies & scripts
└── README.md             # This file
```

## 🔌 API Integration

### CookieScan API

Fetch transaction, program, and token data:

```typescript
// Example: Fetch latest transactions
const getTxs = async () => {
  const response = await axios.get(
    'https://api.cookiescan.io/transactions?limit=50'
  );
  return response.data;
};
```

**Endpoints Used:**
- `/transactions` — Get on-chain transactions
- `/programs` — List all programs
- `/tokens` — Token metadata
- `/wallets` — Wallet details
- `/analytics` — Historical data

### Cookie Chain RPC

Query on-chain data directly:

```typescript
const connection = new Connection(
  'https://rpc.cookiescan.io',
  'confirmed'
);

// Get account info, program data, etc.
const account = await connection.getAccountInfo(publicKey);
```

### Nightly Wallet SDK

Connect user wallets:

```typescript
import { useNightlyWallet } from '@nightly-labs/wallet';

const { connect, disconnect, publicKey, balance } = useNightlyWallet();

// User clicks "Connect Wallet"
await connect();
```

## How It Works

### Health Score Calculation

The health score is a weighted composite of 4 ecosystem metrics:

```
Score = (
  (TX_Volume / Baseline) * 0.30 +
  (Active_Wallets / Baseline) * 0.25 +
  (Unique_Programs / Max) * 0.25 +
  (Success_Rate / 100) * 0.20
) * 100

// Capped at 0-100
Score = Math.min(Math.max(Score, 0), 100)
```

**Factors:**
1. **TX Volume (30%)** — Daily transaction count vs 7d average
2. **Active Wallets (25%)** — Unique wallets active in 24h
3. **Program Diversity (25%)** — Number of unique programs with activity
4. **Success Rate (20%)** — % of successful vs failed transactions

Updated hourly. Trend calculated vs previous day.

### Transaction Decoder

Decodes SVM program instructions into readable format:

```typescript
// Raw instruction:
{
  programId: "11111111111111111111111111111111",
  keys: [...],
  data: "..."
}

// Decoded:
{
  program: "System Program",
  instruction: "CreateAccount",
  params: {
    lamports: 2039280,
    space: 0,
    owner: "..."
  }
}
```

## Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set up environment variables in Vercel dashboard
# NEXT_PUBLIC_COOKIESCAN_API=...
# NEXT_PUBLIC_COOKIE_RPC=...
```

### Self-Hosted

```bash
# Build
npm run build

# Run server
npm run start

# Or use PM2 for process management
pm2 start "npm run start" --name cookieviz
```

## Contributing

We welcome contributions! Here's how:

1. **Fork** the repository
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit changes** (`git commit -m 'Add amazing feature'`)
4. **Push to branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Contribution Guidelines
- Follow TypeScript best practices
- Use Prettier for formatting (`npm run format`)
- Run ESLint before pushing (`npm run lint`)
- Write clear commit messages
- Add tests for new features
- Update documentation

## Bug Reports

Found a bug? Open an issue with:
- Description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/videos (if applicable)
- Environment (browser, OS, network)

## 📝 License

This project is open source under the **MIT License**. See [LICENSE](LICENSE) for details.
