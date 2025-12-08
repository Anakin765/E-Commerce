const db = require("../db");
const nodemailer = require("nodemailer");

// Mailtrap transporter
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.sendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const result = await db.query("SELECT id FROM users WHERE email=$1", [email]);
    if (!result.rows.length) return res.status(404).json({ error: "User not found" });

    const user_id = result.rows[0].id;
    const otp_code = generateOTP();
    const expires_at = new Date(Date.now() + 5 * 60 * 1000);

    await db.query(
      "INSERT INTO otps (user_id, otp_code, expires_at) VALUES ($1,$2,$3)",
      [user_id, otp_code, expires_at]
    );

    await transporter.sendMail({
      from: '"My App" <no-reply@example.com>',
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp_code}. It expires in 5 minutes.`,
    });

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.verifyOTP = async (req, res) => {
  const { email, otp_code } = req.body;

  try {
    const userResult = await db.query("SELECT id FROM users WHERE email=$1", [email]);
    if (!userResult.rows.length) return res.status(404).json({ error: "User not found" });

    const user_id = userResult.rows[0].id;

    const otpResult = await db.query(
      "SELECT * FROM otps WHERE user_id=$1 AND otp_code=$2 AND used=false AND expires_at > NOW()",
      [user_id, otp_code]
    );

    if (!otpResult.rows.length) return res.status(400).json({ error: "Invalid or expired OTP" });

    await db.query("UPDATE otps SET used=true WHERE id=$1", [otpResult.rows[0].id]);
    res.json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
