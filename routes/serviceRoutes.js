// routes/homeRoute.js
const express = require("express");
const Project = require("../models/Service"); // your schema
const sanitizeHtml = require("sanitize-html");
const router = express.Router();

// Utility: get or create the home doc
const getHomeDoc = async () => {
  let project = await Project.findOne();
  if (!project) {
    project = new Project({});
    await project.save();
  }
  return project;
};




// POST Projects (headings + projectList)

router.post("/user/auth/service/service/heading", async (req, res) => {
  try {
    const { title, subtitle, servicePageBanner } = req.body;

    // Get or create the home document
    let project = await Project.findOne();
    if (!project) {
      project = new Project({
        services: { homeHeadings: {}, serviceList: [] },
      });
    }

    // Replace the existing homeHeadings
    project.services.homeHeadings = { title, subtitle, servicePageBanner };

    await project.save();

    res.status(200).json({
      success: true,
      message: "Services headings updated successfully",
      homeHeadings: project.services.homeHeadings,
    });
  } catch (error) {
    console.error("Error updating headings:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating headings",
    });
  }
});



router.post("/user/auth/service/service/lists", async (req, res) => {
  try {
    const {
      name,
      overview,
      
      description,
      serviceFaq,
      whyChoose,
      banner,
    
      servicesOffered,
    } = req.body;

    // Get or create project doc
    let project = await Project.findOne();
    if (!project) {
      project = new Project({
        projects: { homeHeadings: {}, serviceList: [] },
      });
    }

    // Sanitize description
    const cleanDescription = description
      ? sanitizeHtml(description, {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat([
            "img",
            "ul",
            "li",
            "strong",
          ]),
          allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            img: ["src", "alt", "width", "height"],
          },
        })
      : "";

    // Push new project into array
    project.services.serviceList.push({
      name,
      overview,
      
      
      serviceFaq,
      whyChoose,
      banner,
    
      servicesOffered,
      description: cleanDescription,
      
      dateCreated: new Date(),
    });

    await project.save();

    res.status(200).json({
      success: true,
      message: "Service added successfully",
      serviceList: project.services.serviceList,
    });
  } catch (error) {
    console.error("Error adding project:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding project",
    });
  }
});


// Update a Project by ID

router.put("/user/auth/update/project/projects/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      overview,
      
      description,
      serviceFaq,
      whyChoose,
      banner,
    
      servicesOffered,
    } = req.body;

    let project = await Project.findOne();
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const projectListItem = project.services.serviceList.id(id);
    if (!projectListItem) {
      return res.status(404).json({ message: "Project item not found" });
    }

    // Sanitize description
    const cleanDescription = description
      ? sanitizeHtml(description, {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat([
            "img",
            "ul",
            "li",
            "strong",
          ]),
          allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            img: ["src", "alt", "width", "height"],
          },
        })
      : projectListItem.description;

    // Update only provided fields
    if (name !== undefined) projectListItem.name = name;
    if (overview !== undefined) projectListItem.overview = overview;
    if (serviceFaq !== undefined) projectListItem.serviceFaq = serviceFaq;
    if (whyChoose !== undefined) projectListItem.whyChoose = whyChoose;
    if (servicesOffered !== undefined) projectListItem.servicesOffered = servicesOffered;


    if (banner !== undefined) projectListItem.banner = banner;
   
    if (description !== undefined) projectListItem.description = cleanDescription;

    await project.save();

    res.json({
      message: "Service updated successfully",
      project: projectListItem,
    });
  } catch (error) {
    console.error("Error updating service:", error);
    res.status(500).json({ message: "Server error" });
  }
});



// Delete a Project by ID
router.delete("/user/auth/service/delete/services/:id", async (req, res) => {
  try {
    const { id } = req.params; // testimony list _id

    let project = await Project.findOne();
    if (!project) {
      return res.status(404).json({ message: "Servive not found" });
    }

    const projectListItem = project.services.serviceList.id(id);
    if (!projectListItem) {
      return res.status(404).json({ message: "Service not found" });
    }

    // ✅ Use pull instead of remove (Mongoose 6+)
    project.services.serviceList.pull({ _id: id });

    await project.save();

    res.json({
      message: "Service deleted successfully",
      serviceList: project.services.serviceList,
    });
  } catch (error) {
    console.error("Error deleting service:", error);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/user/auth/services/all-services/service", async (req, res) => { 
  try {
    const project = await Project.findOne();

    if (!project ) {
      return res.status(404).json({ message: "No projects found" });
    }

    res.json({
      message: "Services fetched successfully",
      homeHeadings: project.services.homeHeadings || {},
      services: project.services.serviceList,
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ message: "Server error" });
  }
});



router.get("/user/auth/services/specific-service/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findOne();
    if (!project) {
      return res.status(404).json({ message: "Project collection not found" });
    }

    const projectItem = project.services.serviceList.id(id);
    if (!projectItem) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({
      message: "Services fetched successfully",
      project: projectItem,
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ message: "Server error" });
  }
});






module.exports = router;
