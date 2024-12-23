const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  smallDescription: {
    type: String,
    required: true,
  },
  detailedDescription: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    // required: true, // Store the path to the uploaded image
  },
  icon: {
    type: String,
    // required: true, // Store the path to the uploaded icon
  },
}, { timestamps: true });

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;
