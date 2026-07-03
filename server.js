const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// --- البنك المركزي ---
app.get("/api/bank", (req, res) => {
  res.json({ status: "البنك المركزي شغال", coin: "DAD", name: "الدينار العربي" });
});

// --- البرلمان ---
app.get("/api/parliament", (req, res) => {
  res.json({
    name: "البرلمان الرقمي",
    info: "يصدر التشريعات وينظم السياسات العامة للجمهورية."
  });
});

// --- الوزارات ---
app.get("/api/ministries/:name", (req, res) => {
  const services = {
    economy: "وزارة الاقتصاد الذكية تدير التجارة الرقمية والأسواق المشتركة.",
    education: "وزارة التعليم توفر المنصات التعليمية الرقمية والتدريب الافتراضي.",
    health: "وزارة الصحة الذكية توفر حجز المواعيد ومتابعة العلاج."
  };
  const name = req.params.name;
  res.json({ ministry: name, info: services[name] || "خدمة غير موجودة" });
});

// --- القناة الرقمية ---
app.get("/api/channel", (req, res) => {
  res.json({ channel: "قناة الجمهورية الرقمية", status: "بث تجريبي", message: "مرحبا بكم في الجمهورية العربية المتحدة" });
});

// --- الصفحة الرئيسية ---
app.get("/", (req, res) => res.json({ ok: true, project: "arab-united-republic" }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log("Server running on port " + PORT));
