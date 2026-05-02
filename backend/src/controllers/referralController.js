const { db, admin } = require("../config/firebase");

const serializeReferral = (docSnap) => {
  const d = docSnap.data();
  return {
    id: docSnap.id,
    userId: d.userId,
    status: d.status,
    createdAt: d.createdAt?.toDate?.()?.toISOString() ?? null,
  };
};

const createReferral = async (req, res) => {
  const { status: rawStatus = "unverified" } = req.body;
  const status =
    rawStatus === "verified" || rawStatus === "unverified"
      ? rawStatus
      : null;

  if (!status) {
    return res.status(400).json({
      message: "Status must be either verified or unverified.",
    });
  }

  const referralRef = db.collection("referrals").doc();

  await db.runTransaction(async (tx) => {
    const userRef = db.collection("users").doc(req.user.id);
    const userSnap = await tx.get(userRef);

    if (!userSnap.exists) {
      throw new Error("User not found.");
    }

    tx.set(referralRef, {
      userId: req.user.id,
      status,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    tx.update(userRef, {
      referralsCount: admin.firestore.FieldValue.increment(1),
    });
  });

  const saved = await referralRef.get();

  return res.status(201).json(serializeReferral(saved));
};

const getReferrals = async (req, res) => {
  const snap = await db
    .collection("referrals")
    .where("userId", "==", req.user.id)
    .get();

  const items = snap.docs.map(serializeReferral);
  items.sort((a, b) => {
    const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return tb - ta;
  });

  return res.status(200).json(items);
};

const getReferralStats = async (req, res) => {
  const snap = await db
    .collection("referrals")
    .where("userId", "==", req.user.id)
    .get();

  let verified = 0;
  let unverified = 0;

  snap.forEach((docSnap) => {
    const s = docSnap.data().status;
    if (s === "verified") verified += 1;
    else unverified += 1;
  });

  const total = verified + unverified;

  return res.status(200).json({
    total,
    verified,
    unverified,
  });
};

module.exports = {
  createReferral,
  getReferrals,
  getReferralStats,
};
