'use strict';

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const express = require('express');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

if (!process.env.DATABASE_URL) {
  console.error('Missing DATABASE_URL in .env');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/waitlist', async function (req, res) {
  try {
    var body = req.body || {};
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
});

var publicRoot = path.join(__dirname, '..');
app.use(function (req, res, next) {
  var p = (req.path || '').split('?')[0];
  if (
    /^\/(node_modules|server|scripts)(\/|$)/i.test(p) ||
    /^\/\.git(\/|$)/i.test(p) ||
    /^\/package(-lock)?\.json$/i.test(p) ||
    /^\/\.env/i.test(p)
  ) {
    return res.status(404).end();
  }
  next();
});
app.use(express.static(publicRoot));

app.listen(PORT, function () {
  console.log('Open http://localhost:' + PORT + ' (static site root + POST /api/waitlist)');
});
