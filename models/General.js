const mongoose = require("mongoose");

const generalSchema = new mongoose.Schema({


  general: {
    

    websetting: 
      {
        sitePhone: { type: String },
        siteName: { type: String },
        logoUrl: { type: String },
       siteEmail: { type: String },
       banner: { type: String },
        siteAddress: { type: String },
        siteDescription: { type: String },
        navScroll: [
          {
            title: { type: String },
            icon: { type: String },
          }
        ],

        socialLinks:  [
          {
            title: { type: String },
            link: { type: String },
          }
        ],
       
         
         dateCreated: { type: Date, default: Date.now },
      },
    
  },

  
});

module.exports = mongoose.model("General", generalSchema);
