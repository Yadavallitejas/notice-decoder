import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Read real .env if it exists
try {
  const envFile = readFileSync(resolve(__dirname, '../../.env'), 'utf-8');
  envFile.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) process.env[key.trim()] = value.trim();
  });
} catch (e) {
  // Ignore if no .env
}

// Override or set keys as requested for testing
process.env.VITE_GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY || "your_gemini_key";
process.env.VITE_GROK_API_KEY = process.env.VITE_GROK_API_KEY || "your_grok_key";

// Now import the service after setting up process.env
import { analyzeDocument } from './geminiService.js';

const sampleText = `GHMC Notice: Your property at Plot 42, Kondapur has outstanding property 
tax of Rs. 12,450 for FY 2024-25. Pay within 30 days to avoid 10% penalty 
and legal proceedings.`;

async function runTest() {
  console.log("Testing analyzeDocument with sample notice...");
  try {
    const result = await analyzeDocument(sampleText);
    console.log("\nSuccess! Raw JSON Response:");
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("\nTest Failed:", error.message);
  }
}

runTest();
