/**
 * Vercel Web Analytics
 * Automatically tracks page views and web vitals
 * 
 * The inject() function will:
 * - Initialize the analytics queue
 * - Load the analytics script from Vercel
 * - Auto-detect development vs production mode
 * 
 * For more info: https://vercel.com/docs/analytics/quickstart
 */
import { inject } from './vercel-analytics.mjs';

inject({
  mode: 'auto', // Auto-detect based on environment (development/production)
  debug: false  // Set to true for debug logging
});
