// generalRoutes.js
const express = require("express");
const router = express.Router();
const General = require("../models/General"); // adjust path if needed

// ✅ Utility: Get or create the General document
const getGeneralDoc = async () => {
  let general = await General.findOne();
  if (!general) {
    general = new General({});
    await general.save();
  }
  return general;
};

// ✅ POST API - Create or Update General Settings
router.post("/post-general-setting", async (req, res) => {
  try {
    const {
      sitePhone,
      siteName,
      logoUrl,
      banner,
      siteEmail,
      siteAddress,
      siteDescription,
      navScroll,
      socialLinks,
    } = req.body;

    let general = await getGeneralDoc();

    // Update values
    general.general.websetting = {
      sitePhone,
      siteName,
      logoUrl,
      banner,
      siteEmail,
      siteAddress,
      siteDescription,
      navScroll,
      socialLinks,
      dateCreated: new Date(),
    };

    await general.save();
    res.status(200).json({ message: "General settings saved successfully", general });
  } catch (error) {
    res.status(500).json({ error: "Failed to save general settings", details: error.message });
  }
});

// ✅ GET API - Fetch General Settings
router.get("/general-setting", async (req, res) => {
  try {
    const general = await getGeneralDoc();
    res.status(200).json(general.general.websetting);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch general settings", details: error.message });
  }
});

module.exports = router;
