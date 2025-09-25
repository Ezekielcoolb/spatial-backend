const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({


  services: {
    homeHeadings: {
      title: { type: String },
      subtitle: { type: String },
      servicePageBanner: { type: String },
    },

    serviceList: [
      {
        name: { type: String },
        overview: { type: String },
        banner: { type: String },
      
        description: { type: String },
        serviceFaq: [
          {
            question: { type: String },
            answer: { type: String },
          }
        ],
       
         whyChoose: [
             {
            title: { type: String },
            content: { type: String },
           
          }
         ],
          servicesOffered: [
             {
            title: { type: String },
            content: { type: String },
            
          }
         ],
         
         dateCreated: { type: Date, default: Date.now },
      },
    ],
  },

  
});

module.exports = mongoose.model("Service", serviceSchema);
