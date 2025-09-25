// routes/homeRoute.js
const express = require("express");
const Project = require("../models/Projects"); // your schema
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

router.post("/user/auth/project/projects/heading", async (req, res) => {
  try {
    const { title, subtitle, projectPageBanner } = req.body;

    // Get or create the home document
    let project = await Project.findOne();
    if (!project) {
      project = new Project({
        projects: { homeHeadings: {}, projectList: [] },
      });
    }

    // Replace the existing homeHeadings
    project.projects.homeHeadings = { title, subtitle, projectPageBanner };

    await project.save();

    res.status(200).json({
      success: true,
      message: "Projects headings updated successfully",
      homeHeadings: project.projects.homeHeadings,
    });
  } catch (error) {
    console.error("Error updating headings:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating headings",
    });
  }
});



router.post("/user/auth/project/projects/lists", async (req, res) => {
  try {
    const {
      name,
      overview,
      projectStatus,
      projectType,
      ProjectSize,
      client,
      address,
      category,
      description,
      specialFeatures,
      projectFeatures,
      banner,
      bannerList,
      video,
    } = req.body;

    // Get or create project doc
    let project = await Project.findOne();
    if (!project) {
      project = new Project({
        projects: { homeHeadings: {}, projectList: [] },
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
    project.projects.projectList.push({
      name,
      overview,
      projectStatus,
      projectType,
      ProjectSize,
      client,
      address,
      category,
      description: cleanDescription,
      specialFeatures,
      projectFeatures,
      banner,
      bannerList,
      video,
      dateCreated: new Date(),
    });

    await project.save();

    res.status(200).json({
      success: true,
      message: "Project added successfully",
      projectList: project.projects.projectList,
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
      projectStatus,
      projectType,
      ProjectSize,
      client,
      address,
      category,
      description,
      specialFeatures,
      projectFeatures,
      banner,
      bannerList,
      video,
    } = req.body;

    let project = await Project.findOne();
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const projectListItem = project.projects.projectList.id(id);
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
    if (projectStatus !== undefined) projectListItem.projectStatus = projectStatus;
    if (projectType !== undefined) projectListItem.projectType = projectType;
    if (ProjectSize !== undefined) projectListItem.ProjectSize = ProjectSize;
    if (client !== undefined) projectListItem.client = client;
    if (address !== undefined) projectListItem.address = address;
    if (category !== undefined) projectListItem.category = category;
    if (specialFeatures !== undefined) projectListItem.specialFeatures = specialFeatures;
    if (projectFeatures !== undefined) projectListItem.projectFeatures = projectFeatures;
    if (banner !== undefined) projectListItem.banner = banner;
    if (bannerList !== undefined) projectListItem.bannerList = bannerList;
    if (video !== undefined) projectListItem.video = video;
    if (description !== undefined) projectListItem.description = cleanDescription;

    await project.save();

    res.json({
      message: "Project updated successfully",
      project: projectListItem,
    });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ message: "Server error" });
  }
});



// Delete a Project by ID
router.delete("/user/auth/project/delete/projects/:id", async (req, res) => {
  try {
    const { id } = req.params; // testimony list _id

    let project = await Project.findOne();
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const projectListItem = project.projects.projectList.id(id);
    if (!projectListItem) {
      return res.status(404).json({ message: "Project not found" });
    }

    // ✅ Use pull instead of remove (Mongoose 6+)
    project.projects.projectList.pull({ _id: id });

    await project.save();

    res.json({
      message: "Project deleted successfully",
      projectList: project.projects.projectList,
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/user/auth/projects/all-project", async (req, res) => { 
  try {
    const project = await Project.findOne();

    if (!project || !project.projects.projectList.length) {
      return res.status(404).json({ message: "No projects found" });
    }

    res.json({
      message: "Projects fetched successfully",
      homeHeadings: project.projects.homeHeadings || {},
      projects: project.projects.projectList,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Server error" });
  }
});



router.get("/user/auth/projects/single-project/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findOne();
    if (!project) {
      return res.status(404).json({ message: "Project collection not found" });
    }

    const projectItem = project.projects.projectList.id(id);
    if (!projectItem) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({
      message: "Project fetched successfully",
      project: projectItem,
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ message: "Server error" });
  }
});






module.exports = router;
