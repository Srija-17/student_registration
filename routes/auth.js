import express from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const router = express.Router();

// POST /api/signup (your existing route — keep it)
router.post('/signup',
  [
    body('srn').trim().notEmpty().withMessage('SRN required'),
    body('fullname').trim().notEmpty().withMessage('Full name required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 8 }).withMessage('Password min 8 chars')
  ],
  async (req, res) => {
    console.log('[SIGNUP] incoming body:', req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('[SIGNUP] validation errors:', errors.array());
      return res.status(400).json({ ok: false, errors: errors.array() });
    }

    try {
      const { srn, fullname, email, password, department, year } = req.body;

      const existing = await User.findOne({
        $or: [{ email: email.toLowerCase() }, { srn: srn.toUpperCase() }]
      });
      if (existing) {
        console.log('[SIGNUP] duplicate found:', existing._id);
        return res.status(409).json({ ok: false, message: 'SRN or email already registered' });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const user = new User({
        srn: srn.toUpperCase(),
        fullname,
        email: email.toLowerCase(),
        passwordHash,
        department,
        year
      });

      await user.save();
      console.log('[SIGNUP] user saved:', user._id);

      const tokenPayload = { id: user._id, srn: user.srn, email: user.email };
      const token = jwt.sign(tokenPayload, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      return res.json({ ok: true, user: { id: user._id, srn: user.srn, fullname: user.fullname, email: user.email }});
    } catch (err) {
      console.error('[SIGNUP] unexpected error:', err);
      if (err && err.code === 11000) {
        return res.status(409).json({ ok: false, message: 'Duplicate SRN or email' });
      }
      return res.status(500).json({ ok: false, message: 'Server error' });
    }
  }
);

// POST /api/login (NEW ROUTE)
router.post('/login',
  [
    body('identifier').trim().notEmpty().withMessage('SRN or email required'),
    body('password').notEmpty().withMessage('Password required')
  ],
  async (req, res) => {
    console.log('[LOGIN] incoming body:', req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('[LOGIN] validation errors:', errors.array());
      return res.status(400).json({ ok: false, errors: errors.array() });
    }

    try {
      const { identifier, password, remember } = req.body;

      // Find user by SRN or email
      const user = await User.findOne({
        $or: [
          { email: identifier.toLowerCase() },
          { srn: identifier.toUpperCase() }
        ]
      });

      if (!user) {
        console.log('[LOGIN] user not found:', identifier);
        return res.status(401).json({ ok: false, message: 'Invalid credentials' });
      }

      // Verify password
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        console.log('[LOGIN] password mismatch for user:', user._id);
        return res.status(401).json({ ok: false, message: 'Invalid credentials' });
      }

      console.log('[LOGIN] login successful for user:', user._id);

      // Create JWT
      const tokenPayload = { id: user._id, srn: user.srn, email: user.email };
      const expiresIn = remember ? '30d' : '7d';
      const token = jwt.sign(tokenPayload, process.env.JWT_SECRET || 'dev_secret', { expiresIn });

      // Set cookie
      const maxAge = remember ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge
      });

      return res.json({
        ok: true,
        user: {
          id: user._id,
          srn: user.srn,
          fullname: user.fullname,
          email: user.email,
          department: user.department,
          year: user.year
        }
      });
    } catch (err) {
      console.error('[LOGIN] unexpected error:', err);
      return res.status(500).json({ ok: false, message: 'Server error' });
    }
  }
);

export default router;