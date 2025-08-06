const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static("public"));

// In-memory store with sample users
let users = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    referralCode: "ABC123",
    points: 0,
    referrals: 0,
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    referralCode: "DEF456",
    points: 10,
    referrals: 1,
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    referralCode: "GHI789",
    points: 20,
    referrals: 2,
  },
];

let nextId = 4;

// Function to generate unique referral code
function generateReferralCode() {
  let code;
  do {
    code = Math.random().toString(36).substring(2, 8).toUpperCase();
  } while (users.some((user) => user.referralCode === code));
  return code;
}

// Function to validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// API Routes

// GET /api/users - Return all users
app.get("/api/users", (req, res) => {
  try {
    res.json({
      success: true,
      data: users,
      count: users.length,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// POST /api/register - Register new user
app.post("/api/register", (req, res) => {
  try {
    const { name, email, referralCode } = req.body;

    // Validation
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Name is required and must be a non-empty string",
      });
    }

    if (!email || typeof email !== "string" || email.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Email is required and must be a non-empty string",
      });
    }

    if (!isValidEmail(email.trim())) {
      return res.status(400).json({
        success: false,
        error: "Please provide a valid email address",
      });
    }

    // Check if email already exists
    const existingUser = users.find(
      (user) => user.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Email already registered",
      });
    }

    // Handle referral code if provided
    let referrer = null;
    if (referralCode && referralCode.trim().length > 0) {
      referrer = users.find(
        (user) => user.referralCode === referralCode.trim().toUpperCase()
      );

      if (!referrer) {
        return res.status(400).json({
          success: false,
          error: "Invalid referral code",
        });
      }
    }

    // Create new user
    const newUser = {
      id: nextId++,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      referralCode: generateReferralCode(),
      points: 0,
      referrals: 0,
    };

    users.push(newUser);

    // Award points to referrer if valid referral code was used
    if (referrer) {
      referrer.points += 10;
      referrer.referrals += 1;
    }

    res.status(201).json({
      success: true,
      message: referrer
        ? `Registration successful! ${referrer.name} earned 10 points.`
        : "Registration successful!",
      data: {
        user: newUser,
        referrer: referrer
          ? {
              name: referrer.name,
              pointsAwarded: 10,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// GET /api/users/:referralCode - Get user by referral code
app.get("/api/users/:referralCode", (req, res) => {
  try {
    const { referralCode } = req.params;

    if (!referralCode || referralCode.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Referral code is required",
      });
    }

    const user = users.find(
      (user) => user.referralCode === referralCode.trim().toUpperCase()
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found with this referral code",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user by referral code:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// Serve the HTML page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: "Something went wrong!",
  });
});

// Handle 404 for API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "API endpoint not found",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Zynta Referral System running on http://localhost:${PORT}`);
  console.log(`📊 Server started with ${users.length} sample users`);
});
