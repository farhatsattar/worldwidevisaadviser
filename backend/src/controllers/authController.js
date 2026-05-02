const bcrypt = require("bcryptjs");
const { db, admin } = require("../config/firebase");
const generateToken = require("../utils/generateToken");
const { isValidEmail, isValidPassword } = require("../utils/validators");

const registerUser = async (req, res) => {
  const { name = "", email = "", password = "" } = req.body;

  if (!String(name).trim() || !String(email).trim() || !String(password).trim()) {
    return res.status(400).json({
      message: "Name, email, and password are required.",
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  if (!isValidPassword(password)) {
    return res.status(400).json({
      message: "Password must be at least 6 characters long.",
    });
  }

  const normEmail = email.toLowerCase().trim();

  const existing = await db
    .collection("users")
    .where("email", "==", normEmail)
    .limit(1)
    .get();

  if (!existing.empty) {
    return res.status(409).json({ message: "User already exists." });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const ref = await db.collection("users").add({
    name: String(name).trim(),
    email: normEmail,
    password: hashedPassword,
    referralsCount: 0,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  const created = await ref.get();

  return res.status(201).json({
    token: generateToken(ref.id),
    user: {
      id: ref.id,
      name: created.data().name,
      email: created.data().email,
      referralsCount: created.data().referralsCount ?? 0,
      createdAt: created.data().createdAt?.toDate?.()?.toISOString() ?? null,
    },
  });
};

const loginUser = async (req, res) => {
  const { email = "", password = "" } = req.body;

  if (!String(email).trim() || !String(password).trim()) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  const normEmail = email.toLowerCase().trim();

  const qs = await db
    .collection("users")
    .where("email", "==", normEmail)
    .limit(1)
    .get();

  if (qs.empty) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  const doc = qs.docs[0];
  const userData = doc.data();
  const isMatch = await bcrypt.compare(password, userData.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  return res.status(200).json({
    token: generateToken(doc.id),
    user: {
      id: doc.id,
      name: userData.name,
      email: userData.email,
      referralsCount: userData.referralsCount ?? 0,
      createdAt: userData.createdAt?.toDate?.()?.toISOString() ?? null,
    },
  });
};

module.exports = {
  registerUser,
  loginUser,
};
