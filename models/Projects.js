const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({


  projects: {
    homeHeadings: {
      title: { type: String },
      subtitle: { type: String },
      projectPageBanner: { type: String },
    },

    projectList: [
      {
        name: { type: String },
        overview: { type: String },
        projectStatus: { type: String },
        projectType: { type: String },
        ProjectSize: { type: String },
        client: { type: String },
        address: { type: String },
        category: { type: String },
        description: { type: String },
        
        specialFeatures: { type: String },
        projectFeatures: [
          {
            title: { type: String },
            content: { type: String },
          }
        ],
         banner: { type: String },
         bannerList: [{ type: String }],
          video: { type: String },
         dateCreated: { type: Date, default: Date.now },
      },
    ],
  },

  
});

module.exports = mongoose.model("Project", projectSchema);
