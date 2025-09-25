// routes/homeRoute.js
const express = require("express");
const About = require("../models/About"); // your schema
const sanitizeHtml = require("sanitize-html");
const router = express.Router();

// Utility: get or create the home doc
const getHomeDoc = async () => {
  let about = await About.findOne();
  if (!about) {
    about = new About({});
    await about.save();
  }
  return about;
};

// ✅ Slider


// ✅ WhoWeAre
router.post("/user/auth/about/aboutus", async (req, res) => {
  try {
    const { banner, title, subtitle, mainTitle, overview } = req.body;

    const about = await getHomeDoc();

    // Sanitize overview (HTML allowed)
    const cleanOverview = overview
      ? sanitizeHtml(overview, {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "ul", "li", "strong"]),
          allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            img: ["src", "alt", "width", "height"],
          },
        })
      : "";

    about.aboutUs = {
      banner: banner || "",
      title: title || "",
      mainTitle: mainTitle || "",
      subtitle: subtitle || "",
      overview: cleanOverview,
    };

    await about.save();

    res.json({ message: "About us updated successfully", data: about.aboutUs });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});



// POST testimoney (headings + lists)

router.post("/user/auth/about/teams/heading", async (req, res) => {
  try {
    const { title, subtitle } = req.body;

    // Get or create the home document
    let about = await About.findOne();
    if (!about) {
      about = new About({
        teams: { headings: {}, lists: [] },
      });
    }

    // Replace the existing headings
    about.teams.headings = { title, subtitle };

    await about.save();

    res.status(200).json({
      success: true,
      message: "Teams Headings updated successfully",
      headings: about.teams.headings,
    });
  } catch (error) {
    console.error("Error updating headings:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating headings",
    });
  }
});



router.post("/user/auth/about/teams/lists", async (req, res) => {
  try {
    const { name, overview, banner, role, phone, email, certifications } = req.body;

    // Get or create the home doc
    let about = await About.findOne();
    if (!about) {
      about = new About({
        teams: { headings: {}, lists: [] },
      });
    }

    // Push new document into the array
    about.teams.lists.push({ name, overview, banner, role, phone, email, certifications });

    await about.save();

    res.status(200).json({
      success: true,
      message: "Document added successfully",
      lists: about.teams.lists,
    });
  } catch (error) {
    console.error("Error adding document:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding document",
    });
  }
});


// Update a testimony by ID
router.put("/user/auth/update/about/teams/:id", async (req, res) => {
  try {
    const { id } = req.params; // testimony list _id
    const { name, overview, banner, role, phone, email, certifications } = req.body;

    let about = await About.findOne();
    if (!about) {
      return res.status(404).json({ message: "About not found" });
    }

    const teamItems = about.teams.lists.id(id);
    if (!teamItems) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Update only provided fields
    if (name !== undefined) teamItems.name = name;
    if (overview !== undefined) teamItems.overview = overview;
      if (banner !== undefined) teamItems.banner = banner;
        if (role !== undefined) teamItems.role = role;
          if (phone !== undefined) teamItems.phone = phone;
            if (email !== undefined) teamItems.email = email;
            if (certifications !== undefined) teamItems.certifications = certifications;

    await about.save();

    res.json({
      message: "Teams member updated successfully",
      teams: teamItems,
    });
  } catch (error) {
    console.error("Error updating team:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a testimony by ID
router.delete("/user/auth/about/delete/team/:id", async (req, res) => {
  try {
    const { id } = req.params; // testimony list _id

    let about = await About.findOne();
    if (!about) {
      return res.status(404).json({ message: "About not found" });
    }

    const teamItem = about.teams.lists.id(id);
    if (!teamItem) {
      return res.status(404).json({ message: "Team not found" });
    }

    // ✅ Use pull instead of remove (Mongoose 6+)
    about.teams.lists.pull({ _id: id });

    await about.save();

    res.json({
      message: "Team member deleted successfully",
      lists: about.teams.lists,
    });
  } catch (error) {
    console.error("Error deleting team:", error);
    res.status(500).json({ message: "Server error" });
  }
});






// ✅ Counter
router.post("/user/auth/about/counter", async (req, res) => {
  try {
    const {  banner, customer, training, experience } = req.body;
    const about = await getHomeDoc();

    about.aboutCounter = {  banner, customer, training, experience };
    await about.save();

    res.json({ message: "About Counter updated", data: about.aboutCounter });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Mission and Vision
router.post("/user/auth/about/mission/vission", async (req, res) => {
  try {
    const {  title, subtitle, mission, missionContent, vision, visionContent, coreValue, coreValueContent } = req.body;
    const about = await getHomeDoc();

    about.missionVission = {  
        title,
         subtitle, 
         mission, 
         missionContent, 
         vision, 
         visionContent, 
         coreValue, 
         coreValueContent };
    await about.save();

    res.json({ message: "About mission and vision updated", data: about.missionVission });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Fetch all About data
router.get("/user/auth/about/fetch-all-data", async (req, res) => {
  try {
    const aboutData = await About.findOne(); // if you expect only one doc
    // const aboutData = await About.find(); // if you expect multiple docs

    if (!aboutData) {
      return res.status(404).json({ message: "No About data found" });
    }

    res.status(200).json(aboutData);
  } catch (error) {
    console.error("Error fetching About data:", error);
    res.status(500).json({ message: "Server error", error });
  }
});




module.exports = router;
