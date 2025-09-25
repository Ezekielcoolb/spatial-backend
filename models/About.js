const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema({
  aboutUs: {
    banner: { type: String },
    title: { type: String },
    mainTitle: { type: String },
    subtitle: { type: String },
    overview: { type: String },
  },

  missionVission: {
    title: { type: String },
    subtitle: { type: String },
    mission: { type: String },
    missionContent: { type: String },
    vision: { type: String },
    visionContent: { type: String },
    coreValue: { type: String },
    coreValueContent: { type: String },
  },
  aboutCounter: {
    banner: { type: String },
    customer: { type: String },
    training: { type: String },
    experience: { type: String },
  },

  teams: {
    headings: {
      title: { type: String },
      subtitle: { type: String },
    },

    lists: [
      {
        name: { type: String },
        banner: { type: String },
        role: { type: String },
        phone: { type: String },
        email: { type: String },
        certifications: { type: String },
        overview: { type: String },
      },
    ],
  },

  
});

module.exports = mongoose.model("About", aboutSchema);
