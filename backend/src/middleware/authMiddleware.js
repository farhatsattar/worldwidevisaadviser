const jwt = require("jsonwebtoken");
const { db } = require("../config/firebase");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, token missing." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const snap = await db.collection("users").doc(decoded.userId).get();

    if (!snap.exists) {
      return res.status(401).json({ message: "Not authorized, user not found." });
    }

    const data = snap.data();
    req.user = {
      id: snap.id,
      name: data.name,
      email: data.email,
      referralsCount: data.referralsCount ?? 0,
      createdAt: data.createdAt,
    };

    next();
  } catch {
    return res.status(401).json({ message: "Not authorized, invalid token." });
  }
};

module.exports = { protect };
