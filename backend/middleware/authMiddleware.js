const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const verifyFirebaseToken = async (req, res, next) => {
  try {
    const email = req.headers["x-user-email"];

    if (!email) {
      return res.status(401).json({ error: "No email provided" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // ✅ THIS IS THE MAIN FIX
    req.user = {
      id: user.id,
      email: user.email,
    };

    console.log("✅ DEV User Attached:", req.user);

    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err.message);
    res.status(500).json({ error: "Auth failed" });
  }
};

module.exports = verifyFirebaseToken;
