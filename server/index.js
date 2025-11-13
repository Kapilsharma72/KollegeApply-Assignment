import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const SKIP_EXTERNALS = String(process.env.SKIP_EXTERNALS || 'false').toLowerCase() === 'true';
// For local dev, allow all origins. You can tighten using CORS_ORIGIN in prod.
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
app.use(cors({ origin: true, credentials: false }));
app.use(express.json());
app.use(morgan('dev'));

// Attempt Mongo connection only if enabled and MONGO_URL provided
const mongoUrl = process.env.MONGO_URL;
let mongoReady = false;
if (!SKIP_EXTERNALS) {
  if (mongoUrl) {
    mongoose
      .connect(mongoUrl)
      .then(() => {
        mongoReady = true;
        console.log('MongoDB connected');
      })
      .catch((err) => console.error('MongoDB connection error:', err.message));
  } else {
    console.warn('MONGO_URL not set. Leads will not be persisted to DB.');
  }
} else {
  console.warn('SKIP_EXTERNALS=true: Skipping MongoDB connection and Pipedream forwarding.');
}

// Mongoose Lead model (simple)
const leadSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    state: { type: String, required: true },
    course: { type: String, required: true },
    intakeYear: { type: String, required: true },
    consent: { type: Boolean, required: true },
    universitySlug: { type: String, required: true }
  },
  { timestamps: true }
);
const Lead = mongoose.models.Lead || mongoose.model('Lead', leadSchema);

// In-memory content to keep demo simple
const universities = [
  {
    slug: 'greenfield-university',
    name: 'Greenfield University',
    location: 'Bengaluru, India',
    tagline: 'Innovate. Impact. Inspire.',
    highlights: ['NAAC A accreditation', '100+ recruiters', 'Modern labs', 'Scholarships available'],
    heroImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1400&auto=format&fit=crop',
    brochureUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  },
  {
    slug: 'riverside-institute',
    name: 'Riverside Institute of Technology',
    location: 'Pune, India',
    tagline: 'Engineering the future, today.',
    highlights: ['AI & ML center', 'Top 10 in region', 'Incubation support', 'Hostel & sports complex'],
    heroImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1400&auto=format&fit=crop',
    brochureUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  },
  {
    slug: 'hillside-college',
    name: 'Hillside College',
    location: 'Dehradun, India',
    tagline: 'Learning in the lap of nature.',
    highlights: ['Scenic campus', 'Industry mentors', 'Modern library', 'Clubs & sports'],
    heroImage: 'https://images.unsplash.com/photo-1500886834362-7bdc4f39a0af?q=80&w=1400&auto=format&fit=crop',
    brochureUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  },
  {
    slug: 'sunrise-business-school',
    name: 'Sunrise Business School',
    location: 'Gurugram, India',
    tagline: 'Leadership for a changing world.',
    highlights: ['Corporate tie-ups', 'Case-based learning', 'International immersion', 'Startup lab'],
    heroImage: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1400&auto=format&fit=crop',
    brochureUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  },
  {
    slug: 'coastal-arts-university',
    name: 'Coastal Arts University',
    location: 'Chennai, India',
    tagline: 'Create. Perform. Inspire.',
    highlights: ['Performing arts hub', 'Studios & theaters', 'Renowned faculty', 'Cultural festivals'],
    heroImage: 'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=1400&auto=format&fit=crop',
    brochureUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  },
  {
    slug: 'metro-city-university',
    name: 'Metro City University',
    location: 'Mumbai, India',
    tagline: 'Urban campus, global outlook.',
    highlights: ['Downtown campus', 'Industry immersion', 'Career services', 'Modern labs'],
    heroImage: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1400&auto=format&fit=crop',
    brochureUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  },
  {
    slug: 'valley-institute-sciences',
    name: 'Valley Institute of Sciences',
    location: 'Hyderabad, India',
    tagline: 'Where science meets innovation.',
    highlights: ['Research focus', 'Hackathons', 'Strong alumni', 'Green campus'],
    heroImage: 'https://images.unsplash.com/photo-1484821582734-6c6c9f99a672?q=80&w=1400&auto=format&fit=crop',
    brochureUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  }
];

const fees = {
  'greenfield-university': {
    university: 'Greenfield University',
    currency: 'INR',
    courses: [
      { name: 'B.Tech CSE', duration: '4 Years', feeRange: { min: 120000, max: 180000 }, hostelPerYear: 90000 },
      { name: 'MBA', duration: '2 Years', feeRange: { min: 200000, max: 300000 }, hostelPerYear: 110000 },
      { name: 'BBA', duration: '3 Years', feeRange: { min: 80000, max: 120000 }, hostelPerYear: 85000 }
    ]
  },
  'riverside-institute': {
    university: 'Riverside Institute of Technology',
    currency: 'INR',
    courses: [
      { name: 'B.Tech ECE', duration: '4 Years', feeRange: { min: 100000, max: 160000 }, hostelPerYear: 80000 },
      { name: 'M.Tech AI', duration: '2 Years', feeRange: { min: 180000, max: 250000 }, hostelPerYear: 100000 },
      { name: 'MCA', duration: '2 Years', feeRange: { min: 120000, max: 150000 }, hostelPerYear: 90000 }
    ]
  },
  'hillside-college': {
    university: 'Hillside College',
    currency: 'INR',
    courses: [
      { name: 'B.Sc Computer Science', duration: '3 Years', feeRange: { min: 70000, max: 100000 }, hostelPerYear: 65000 },
      { name: 'B.Com', duration: '3 Years', feeRange: { min: 60000, max: 90000 }, hostelPerYear: 60000 },
      { name: 'MBA', duration: '2 Years', feeRange: { min: 180000, max: 240000 }, hostelPerYear: 90000 }
    ]
  },
  'sunrise-business-school': {
    university: 'Sunrise Business School',
    currency: 'INR',
    courses: [
      { name: 'BBA', duration: '3 Years', feeRange: { min: 120000, max: 160000 }, hostelPerYear: 100000 },
      { name: 'MBA (Finance)', duration: '2 Years', feeRange: { min: 250000, max: 320000 }, hostelPerYear: 120000 },
      { name: 'PGDM', duration: '2 Years', feeRange: { min: 230000, max: 300000 }, hostelPerYear: 115000 }
    ]
  },
  'coastal-arts-university': {
    university: 'Coastal Arts University',
    currency: 'INR',
    courses: [
      { name: 'BFA Visual Arts', duration: '4 Years', feeRange: { min: 90000, max: 130000 }, hostelPerYear: 75000 },
      { name: 'BA Music Production', duration: '3 Years', feeRange: { min: 85000, max: 120000 }, hostelPerYear: 72000 },
      { name: 'MA Performing Arts', duration: '2 Years', feeRange: { min: 140000, max: 200000 }, hostelPerYear: 95000 }
    ]
  },
  'metro-city-university': {
    university: 'Metro City University',
    currency: 'INR',
    courses: [
      { name: 'B.Tech IT', duration: '4 Years', feeRange: { min: 140000, max: 190000 }, hostelPerYear: 110000 },
      { name: 'BMS', duration: '3 Years', feeRange: { min: 90000, max: 130000 }, hostelPerYear: 95000 },
      { name: 'MBA (Marketing)', duration: '2 Years', feeRange: { min: 260000, max: 340000 }, hostelPerYear: 130000 }
    ]
  },
  'valley-institute-sciences': {
    university: 'Valley Institute of Sciences',
    currency: 'INR',
    courses: [
      { name: 'B.Sc Data Science', duration: '3 Years', feeRange: { min: 100000, max: 150000 }, hostelPerYear: 90000 },
      { name: 'M.Sc Biotechnology', duration: '2 Years', feeRange: { min: 150000, max: 210000 }, hostelPerYear: 100000 },
      { name: 'PhD (Computing)', duration: '3-5 Years', feeRange: { min: 75000, max: 120000 }, hostelPerYear: 95000 }
    ]
  }
};

app.get('/api/universities', (req, res) => {
  res.json(universities);
});

app.get('/api/fees/:slug', (req, res) => {
  const data = fees[req.params.slug];
  if (!data) return res.status(404).json({ message: 'University not found' });
  res.json(data);
});

// Health check
app.get('/ping', (_req, res) => res.json({ ok: true, time: new Date().toISOString() }));

// Helper: basic validators
function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function isPhone10(v) { return /^\d{10}$/.test(v); }

app.post('/api/leads', async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      state,
      course,
      intakeYear,
      consent,
      universitySlug
    } = req.body || {};

    if (!fullName || !email || !phone || !state || !course || !intakeYear || typeof consent !== 'boolean' || !universitySlug) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (!isEmail(email)) return res.status(400).json({ message: 'Invalid email' });
    if (!isPhone10(phone)) return res.status(400).json({ message: 'Phone must be 10 digits (India)' });
    if (!consent) return res.status(400).json({ message: 'Consent is required' });

    // Save to DB if connected and not skipping externals
    let saved = null;
    if (!SKIP_EXTERNALS && mongoReady) {
      saved = await Lead.create({ fullName, email, phone, state, course, intakeYear, consent, universitySlug });
    }

    // Forward to Pipedream if configured and not skipping externals
    const pipeUrl = process.env.PIPEDREAM_URL;
    let pipedreamStatus = null;
    if (!SKIP_EXTERNALS && pipeUrl) {
      const payload = {
        source: 'kollegeapply-intern',
        timestamp: new Date().toISOString(),
        lead: { fullName, email, phone, state, course, intakeYear, consent, universitySlug }
      };
      try {
        const resp = await axios.post(pipeUrl, payload, { timeout: 8000 });
        pipedreamStatus = resp.status;
      } catch (e) {
        console.warn('Pipedream forward failed:', e.message);
      }
    }

    return res.json({
      ok: true,
      saved: Boolean(saved),
      pipedreamForwarded: Boolean(pipedreamStatus && pipedreamStatus < 400)
    });
  } catch (err) {
    console.error('Lead error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/', (_req, res) => {
  res.json({ status: 'ok', message: 'KollegeApply server running', routes: ['/api/universities', '/api/fees/:slug', '/api/leads'] });
});

app.listen(PORT, '0.0.0.0', () => console.log(`Server listening on ${PORT}`));

// Global error handler (must be last)
// Ensures errors don't reset connections without a response
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  if (res.headersSent) return; // avoid header sent error
  res.status(500).json({ message: 'Server error', error: err?.message || 'unknown' });
});
