const mongoose = require("mongoose");
const { User, PendingUser } = require("../models");
const { signToken } = require("../utils/auth");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");
const isEmail = (q = "") => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(q);

module.exports = {
  async createUser(req, res) {
    // Backwards-compatible: route to verification flow
    return module.exports.requestSignup(req, res);
  },

  async requestSignup(req, res) {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      console.log("Email, password, and username are required");
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    if (!isEmail(normalizedEmail)) {
      console.log("Invalid email");
    }

    if (typeof password !== "string" || password.length < 8) {
      console.log("Password must be at least 8 characters");
    }

    const existingUser = await User.findOne({ email: normalizedEmail })
      .select("_id")
      .lean();
    if (existingUser) {
      console.log("Email already registered");
    }
    const rawToken = crypto.randomBytes(32).toString("hex");
    const verificationCode = generateCode();
    const hashedToken = hashToken(rawToken);
    const hashedCode = hashToken(verificationCode);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    const passwordHash = await bcrypt.hash(password, 10);

    await PendingUser.findOneAndUpdate(
      { email: normalizedEmail },
      {
        email: normalizedEmail,
        passwordHash,
        tokenHash: hashedToken,
        tokenExpiresAt: expiresAt,
        codeHash: hashedCode,
        codeExpiresAt: expiresAt,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    return res.status(201).json({ ok: true });
  },

  async login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
      console.log("Email and password are required");
    }
    const normalizedEmail = String(email).trim().toLowerCase();
    try {
      const user = await User.findOne({
        email: normalizedEmail,
      }).select("+passwordHash");

      if (!user) {
        console.log("Invalid credentials");
      }

      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) {
        console.log("Invalid credentials");
      }

      const token = signToken({
        email: user.email,
        id: user._id,
        username: user.username,
      });

      const publicUser = user.toObject();
      delete publicUser.password;
      delete publicUser.passwordHash;
      delete publicUser.__v;

      return res.json({ user: publicUser, token });
    } catch (err) {
      console.log(err);
    }
  },
};
