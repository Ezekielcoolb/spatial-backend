// routes/homeRoute.js
const express = require("express");
const Home = require("../models/Home"); // your schema
const router = express.Router();

// Utility: get or create the home doc
const getHomeDoc = async () => {
  let home = await Home.findOne();
  if (!home) {
    home = new Home({});
    await home.save();
  }
  return home;
};

// ✅ Slider
router.post("/user/auth/slider", async (req, res) => {
  try {
    const sliders = req.body.sliders || []; // array of sliders
    const home = await getHomeDoc();

    sliders.forEach(slider => {
      home.slider.push(slider);
    });

    await home.save();
    res.json({ message: "Sliders updatedsuccessfully", data: home.slider });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ WhoWeAre
router.post("/user/auth/who-we-are", async (req, res) => {
  try {
    const { banner, 
      title, 
      subtitle, 
      overview, 
      smallBanner,
      sideSectionOneHeading,
      sideSectionOneContent,
      sideSectionTwoHeading,
      sideSectionTwoContent,
      sideSectionThreeHeading,
      sideSectionThreeContent,
      visionHeading,
      visionContent,
      missionHeading,
      missionContent
     } = req.body;

    const home = await getHomeDoc();

    // Save as a single object, not an array
    home.whoWeAre = {
      banner,
      title,
      subtitle,
      overview,
      smallBanner,
      sideSectionOneHeading,
      sideSectionOneContent,
      sideSectionTwoHeading,
      sideSectionTwoContent,
      sideSectionThreeHeading,
      sideSectionThreeContent,
       visionHeading,
      visionContent,
      missionHeading,
      missionContent
    };

    await home.save();

    res.json({ message: "Who We Are updated successfully", data: home.whoWeAre });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// POST Documents (headings + lists)
router.post("/user/auth/documents-two/headings", async (req, res) => {
  try {
    const { title, subtitle } = req.body;

    // Get or create the home document
    let home = await Home.findOne();
    if (!home) {
      home = new Home({
        documentsTwo: { headings: {}, lists: [] },
      });
    }

    // Replace the existing headings
    home.documentsTwo.headings = { title, subtitle };

    await home.save();

    res.status(200).json({
      success: true,
      message: "Headings updated successfully",
      headings: home.documentsTwo.headings,
    });
  } catch (error) {
    console.error("Error updating headings:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating headings",
    });
  }
});

// PUT: update a specific list item in documentsTwo
router.put("/user/auth/update/documentsTwo/:id", async (req, res) => {
  try {
    const { id } = req.params; // list item _id
    const { title, banner, overview } = req.body;

    let home = await Home.findOne();
    if (!home) {
      return res.status(404).json({ message: "Home not found" });
    }

    // Find the specific list item
    const listItem = home.documentsTwo.lists.id(id);
    if (!listItem) {
      return res.status(404).json({ message: "List item not found" });
    }

    // Update fields if provided
    if (title !== undefined) listItem.title = title;
    if (banner !== undefined) listItem.banner = banner;
    if (overview !== undefined) listItem.overview = overview;

    await home.save();

    res.json({
      message: "List item updated successfully",
      listItem,
      lists: home.documentsTwo.lists,
    });
  } catch (error) {
    console.error("Error updating list item:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE: remove a specific list item in documentsTwo
router.delete("/user/auth/delete/documentsTwo/:id", async (req, res) => {
  try {
    const { id } = req.params; // list item _id

    let home = await Home.findOne();
    if (!home) {
      return res.status(404).json({ message: "Home not found" });
    }

    // Check if the item exists
    const listItem = home.documentsTwo.lists.id(id);
    if (!listItem) {
      return res.status(404).json({ message: "List item not found" });
    }

    // ✅ Use pull instead of remove
    home.documentsTwo.lists.pull({ _id: id });

    await home.save();

    res.json({
      message: "List item deleted successfully",
      lists: home.documentsTwo.lists,
    });
  } catch (error) {
    console.error("Error deleting list item:", error);
    res.status(500).json({ message: "Server error" });
  }
});





// POST to add a new document into documentsTwo.lists
router.post("/user/auth/documents-two/lists", async (req, res) => {
  try {
    const { title, banner, overview } = req.body;

    // Get or create the home doc
    let home = await Home.findOne();
    if (!home) {
      home = new Home({
        documentsTwo: { headings: {}, lists: [] },
      });
    }

    // Push new document into the array
    home.documentsTwo.lists.push({ title, banner, overview });

    await home.save();

    res.status(200).json({
      success: true,
      message: "Document added successfully",
      lists: home.documentsTwo.lists,
    });
  } catch (error) {
    console.error("Error adding document:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding document",
    });
  }
});


// POST testimoney (headings + lists)

router.post("/user/auth/testimony-two/headings", async (req, res) => {
  try {
    const { title, mainTitle } = req.body;

    // Get or create the home document
    let home = await Home.findOne();
    if (!home) {
      home = new Home({
        testimoneyTwo: { headings: {}, lists: [] },
      });
    }

    // Replace the existing headings
    home.testimoneyTwo.headings = { title, mainTitle };

    await home.save();

    res.status(200).json({
      success: true,
      message: "Testimoney Headings updated successfully",
      headings: home.testimoneyTwo.headings,
    });
  } catch (error) {
    console.error("Error updating headings:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating headings",
    });
  }
});



router.post("/user/auth/testimony-two/lists", async (req, res) => {
  try {
    const { name, content } = req.body;

    // Get or create the home doc
    let home = await Home.findOne();
    if (!home) {
      home = new Home({
        testimoneyTwo: { headings: {}, lists: [] },
      });
    }

    // Push new document into the array
    home.testimoneyTwo.lists.push({ name, content });

    await home.save();

    res.status(200).json({
      success: true,
      message: "Document added successfully",
      lists: home.testimoneyTwo.lists,
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
router.put("/user/auth/update/testimonyTwo/:id", async (req, res) => {
  try {
    const { id } = req.params; // testimony list _id
    const { name, content } = req.body;

    let home = await Home.findOne();
    if (!home) {
      return res.status(404).json({ message: "Home not found" });
    }

    const testimonyItem = home.testimoneyTwo.lists.id(id);
    if (!testimonyItem) {
      return res.status(404).json({ message: "Testimony not found" });
    }

    // Update only provided fields
    if (name !== undefined) testimonyItem.name = name;
    if (content !== undefined) testimonyItem.content = content;

    await home.save();

    res.json({
      message: "Testimony updated successfully",
      testimony: testimonyItem,
    });
  } catch (error) {
    console.error("Error updating testimony:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a testimony by ID
router.delete("/user/auth/delete/testimonyTwo/:id", async (req, res) => {
  try {
    const { id } = req.params; // testimony list _id

    let home = await Home.findOne();
    if (!home) {
      return res.status(404).json({ message: "Home not found" });
    }

    const testimonyItem = home.testimoneyTwo.lists.id(id);
    if (!testimonyItem) {
      return res.status(404).json({ message: "Testimony not found" });
    }

    // ✅ Use pull instead of remove (Mongoose 6+)
    home.testimoneyTwo.lists.pull({ _id: id });

    await home.save();

    res.json({
      message: "Testimony deleted successfully",
      lists: home.testimoneyTwo.lists,
    });
  } catch (error) {
    console.error("Error deleting testimony:", error);
    res.status(500).json({ message: "Server error" });
  }
});






// ✅ WhyChooseUs
router.post("/user/auth/home-counter", async (req, res) => {
  try {
    const {  title, projectDone, yearsOfExperience, awardWinning, satisfiedCustomers, subtitle } = req.body;
    const home = await getHomeDoc();

    home.counter = {  title,
    projectDone,
    yearsOfExperience,
    awardWinning,
    satisfiedCustomers,
    subtitle };
    await home.save();

    res.json({ message: "Home Counter updated", data: home.whyChooseUs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});







// ✅ WhyChooseUs
router.post("/user/auth/why-choose-us", async (req, res) => {
  try {
    const {heading,  titleOne, subtitleOne, titleTwo, subtitleTwo, titleThree, subtitleThree, } = req.body;
    const home = await getHomeDoc();

    home.whyChooseUsNew = {  
      heading,
      titleOne,
    subtitleOne,
    titleTwo,
    subtitleTwo,
    titleThree,
    subtitleThree, };
    await home.save();

    res.json({ message: "Why Choose Us updated", data: home.whyChooseUsNew });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ WhyChooseUs
router.post("/user/auth/enquiries", async (req, res) => {
  try {
    const {title,  mainTitle, downText, } = req.body;
    const home = await getHomeDoc();

    home.enquiries = {  
      title,
      mainTitle,
    downText,
     };
    await home.save();

    res.json({ message: "Why Choose Us updated", data: home.enquiries  });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/user/auth/all-home", async (req, res) => {
  try {
    const home = await getHomeDoc();
    res.status(200).json(home);
  } catch (error) {
    console.error("Error fetching home:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ Update slider by id
router.put("/user/auth/update/slider/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { banner, title, subtitle, video } = req.body;

    const home = await getHomeDoc();

    // Find the specific slider
    const sliderItem = home.slider.id(id);
    if (!sliderItem) {
      return res.status(404).json({ message: "Slider not found" });
    }

    // Update fields if provided
    if (banner !== undefined) sliderItem.banner = banner;
    if (title !== undefined) sliderItem.title = title;
    if (subtitle !== undefined) sliderItem.subtitle = subtitle;
    if (video !== undefined) sliderItem.video = video;

    await home.save();
    res.status(200).json({ message: "Slider updated successfully", slider: sliderItem });
  } catch (error) {
    console.error("Error updating slider:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE a slider by ID
router.delete("/user/auth/delete/slider/:id", async (req, res) => {
  try {
    const { id } = req.params;

    let home = await Home.findOne();
    if (!home) {
      return res.status(404).json({ message: "Home not found" });
    }

    // Filter out the slider to delete
    home.slider = home.slider.filter((slide) => slide._id.toString() !== id);

    await home.save();

    res.json({ message: "Slider deleted successfully", slider: home.slider });
  } catch (error) {
    console.error("Error deleting slider:", error);
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;
