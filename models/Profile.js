const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create Schema
const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  handel: {
    type: String,
    required: true,
    max: 40
  },
  company: {
    type: String,
    required: true
  },
  website: {
    type: String
  },
  location: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  skills: {
    type: [String],
    required: true
  },
  bio: {
    type: String    
  },
  experience: [
      {
          title: {
              type: String
          },
          company: {
              type: String
          },
          location: {
              type: String
          },
          from: {
              type: Date
          },
          to: {
              type: Date
          },
          current: {
              type: Boolean,
              default: false
          },
          description: {
              type: String
          }
      }
  ],

    education: [
      {
          school: {
              type: String
          },
          degree: {
              type: String
          },
          major: {
              type: String
          },
          from: {
              type: Date
          },
          to: {
              type: Date
          },
          current: {
              type: Boolean,
              default: false
          },
          description: {
              type: String
          }
      }
  ],

  social: [
      {
          youtube: {
              type: String
          },
          facebook: {
              type: String
          },
          instagram: {
              type: String
          },
          linkedin: {
              type: String
          }    
      }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);