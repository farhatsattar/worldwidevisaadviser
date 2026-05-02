const { db } = require("../config/firebase");

const getDashboard = async (req, res) => {
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

  const totalReferrals = verified + unverified;

  return res.status(200).json({
    totalReferrals,
    verified,
    unverified,
    progress: `${totalReferrals}/200`,
  });
};

module.exports = { getDashboard };
