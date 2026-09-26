#!/usr/bin/env node

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { TypeSafeClient, choice, noul } from '@typesafe-ai/sdk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

// Helper to safely load .env.local without external dotenv dependency
function loadEnvLocal() {
  const envLocalPath = resolve(projectRoot, '.env.local');
  if (existsSync(envLocalPath)) {
    const content = readFileSync(envLocalPath, 'utf8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIndex = trimmed.indexOf('=');
      if (eqIndex > 0) {
        const key = trimmed.slice(0, eqIndex).trim();
        let value = trimmed.slice(eqIndex + 1).trim();
        // Remove surrounding quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  }
}

loadEnvLocal();

const apiKey = process.env.JEV_AI_API_KEY;
const isDecisionRequested = process.argv.includes('--decision');

console.log('====================================================');
console.log('         Jev AI Integration Verification            ');
console.log('====================================================\n');

// 1. Check API Key
if (!apiKey) {
  console.error('❌ JEV_AI_API_KEY is not set in the environment.');
  console.log('\nWhere to configure:');
  console.log('  • Local development: Add JEV_AI_API_KEY=your_key to .env.local');
  console.log('  • Deployment: Set JEV_AI_API_KEY in your hosting secrets (e.g. Vercel / Cloudflare / Docker).');
  console.log('  ⚠️  Never commit the key, and never expose it to client-side code.\n');
  process.exit(1);
}

console.log('✅ Server-side JEV_AI_API_KEY detected (redacted for security).');

// 2. Initialize TypeSafe SDK pointing explicitly to Jev AI endpoint
const JEV_BASE_URL = 'https://jev-ai.pro/api';
console.log(`📡 SDK Base URL set explicitly to: ${JEV_BASE_URL}`);

const client = new TypeSafeClient({
  apiKey,
  baseURL: JEV_BASE_URL,
  retry: { maxRetries: 0 }, // Disable retries per Jev docs to prevent duplicate billing
});

async function run() {
  try {
    // 3. Check GET /v1/models without inference
    console.log('\n--- Step 1: Model Discovery (No Inference / Free) ---');
    console.log(`Checking GET ${JEV_BASE_URL}/v1/models...`);

    const models = await client.models.list();
    console.log(`✅ Success! Resolved ${models.length} model(s) from Jev AI endpoint:`);
    models.forEach((m) => {
      console.log(`   - ${m.name}: ${m.description || 'No description'}`);
    });

    const hasJevLatest = models.some((m) => m.name === 'jev-latest');
    if (hasJevLatest) {
      console.log('✅ "jev-latest" is available and confirmed for use.');
    }

    // 4. Decision request
    if (!isDecisionRequested) {
      console.log('\n--- Step 2: Small Decision Call (Inference) ---');
      console.log('To run a live test decision call against your balance, rerun with --decision:');
      console.log('  node scripts/verify-jev.mjs --decision\n');
      return;
    }

    console.log('\n--- Step 2: Executing Small Decision Call (Uses Balance) ---');
    console.log(`Calling POST ${JEV_BASE_URL}/v1/systemone using model "jev-latest"...`);

    const sampleInquiry =
      'Client wants to acquire a 1000 sq ft commercial retail office in Islamabad CBD. Ready to close within 14 days.';

    const decisionResponse = await client.systemOne({
      model: 'jev-latest',
      state: { inquiry: sampleInquiry },
      questions: {
        category: choice('What is the commercial intent of this inquiry?', {
          commercial_purchase: 'Client wants to buy/acquire commercial real estate',
          commercial_rent: 'Client wants to lease or rent commercial real estate',
          residential: 'Client wants residential property',
          other: 'General inquiry or other'
        }),
        high_urgency: noul('Is this an urgent or high-priority lead looking to close soon?'),
      },
    });

    console.log('✅ Decision received successfully!\n');
    console.log(`Resolved Model: ${decisionResponse.model}`);
    console.log('Answers:');
    console.log(`  - Category: ${decisionResponse.answers.category.choice} (Confidence: ${decisionResponse.answers.category.confidence ?? 'N/A'})`);
    console.log(`  - High Urgency Probability (Noul): ${decisionResponse.answers.high_urgency.noul}`);
    console.log('\nToken Usage:');
    console.log(`  - Input tokens: ${decisionResponse.usage.input_tokens}`);
    console.log(`  - Output tokens: ${decisionResponse.usage.output_tokens}`);
    console.log('\nVerification complete. Jev AI is fully configured and operational.');
  } catch (error) {
    console.error('\n❌ Jev AI Request Error:');
    console.error(error.message || error);
    if (error.status) {
      console.error(`HTTP Status: ${error.status}`);
    }
    process.exit(1);
  }
}

run();
