const mongoose = require("mongoose");

const homeSchema = new mongoose.Schema({
  slider: [
    {
      banner: { type: String },
      title: { type: String },
      subtitle: { type: String },
      video: { type: String },
    },
  ],
  whoWeAre: {
    banner: { type: String },
    smallBanner: { type: String },
    sideSectionOneHeading: { type: String },
    sideSectionOneContent: { type: String },
    sideSectionTwoHeading: { type: String },
    sideSectionTwoContent: { type: String },
    sideSectionThreeHeading: { type: String },
    visionHeading: { type: String },
    visionContent: { type: String },
    missionHeading: { type: String },
    missionContent: { type: String },
    sideSectionThreeContent: { type: String },
    title: { type: String },
    subtitle: { type: String },
    overview: { type: String },
  },
    counter: {
    title: { type: String },
    projectDone: { type: String },
    yearsOfExperience:  { type: String },
    awardWinning:  { type: String },
    satisfiedCustomers:  { type: String },
    subtitle: { type: String },
  },
  services: {
    heading: {
      title: { type: String },
      subtitle: { type: String },
    },
    list: [
      {
        banner: { type: String },
        title: { type: String },
        overview: { type: String },
        subServices: [
          {
            title: { type: String },
            overview: { type: String },
          },
        ],
      },
    ],
  },
  documentsTwo: {
    headings: {
 title: { type: String },
      subtitle: { type: String },
    },

    lists:[
    {
      title: { type: String },
      banner: { type: String },
      overview: { type: String },
     
    },
  ]
  },
  
  
 

  projects: {
    heading: {
      title: { type: String },
      subtitle: { type: String },
    },
    recentProjects: [
      {
        banner: { type: String },
        title: { type: String },
        overview: { type: String },
        address: { type: String },
        client: { type: String },
        video: { type: String },
        year: { type: String },
      },
    ],
  },
  whyChooseUsNew: {
    heading: { type: String },
    titleOne: { type: String },
    subtitleOne: { type: String },
    titleTwo: { type: String },
    subtitleTwo: { type: String },
    titleThree: { type: String },
    subtitleThree: { type: String },
  },
    enquiries: {
    title: { type: String },
    mainTitle: { type: String },
    downText: { type: String },
    
  },
    testimoneyTwo: {
    headings: {
      title: { type: String },
      mainTitle: { type: String },
    },

    lists:[
    {
      name: { type: String },
      content: { type: String },
     
    },
  ]
  },
  partners: [
    {
      name: { type: String },
      logo: { type: String },
    },
  ],
  faqs: [
    {
      question: { type: String },
      answer: { type: String },
    },
  ],
});

module.exports = mongoose.model("Home", homeSchema);
