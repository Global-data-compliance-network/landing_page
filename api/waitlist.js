'use strict';

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 1,
  idleTimeoutMillis: 20000,
  connectionTimeoutMillis: 10000,
});

function getBody(req) {
  var b = req.body;
  if (b == null) return {};
  if (typeof b === 'object' && !Buffer.isBuffer(b)) return b;
  if (typeof b === 'string') {
    try {
      return JSON.parse(b);
    } catch (e) {
      return {};
    }
  }
  return {};
}

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.DATABASE_URL) {
    console.error('Missing DATABASE_URL');
    return res.status(500).json({ error: 'Server misconfiguration' });
  }

  try {
    var body = getBody(req);
    var company_name = String(body.company_name != null ? body.company_name : body.company || '').trim();
    var role = String(body.role || '').trim();
    var active_suppliers = String(
      body.active_suppliers != null ? body.active_suppliers : body.suppliers || ''
    ).trim();
    var certifications_held = String(
      body.certifications_held != null ? body.certifications_held : body.certifications || ''
    ).trim();
    var biggest_pain = String(body.biggest_pain != null ? body.biggest_pain : body.pain || '').trim();

    if (!company_name || !role || !active_suppliers || !certifications_held || !biggest_pain) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await pool.query(
      `INSERT INTO public.beta_waitlist (company_name, role, active_suppliers, certifications_held, biggest_pain)
       VALUES ($1, $2, $3, $4, $5)`,
      [company_name, role, active_suppliers, certifications_held, biggest_pain]
    );

    return res.status(201).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not save application' });
  }
};
