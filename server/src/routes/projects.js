const express = require('express');
const Project = require('../models/Project');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

// POST route for adding a project
router.post('/', upload.fields([{ name: 'image' }, { name: 'icon' }]), async (req, res) => {
  try {
    const { title, smallDescription, detailedDescription } = req.body;

    // Get the file paths if the files were uploaded, else default to null
    const image = req.files['image'] ? req.files['image'][0].path : null;
    const icon = req.files['icon'] ? req.files['icon'][0].path : null;

    // Create a new project with optional image and icon fields
    const newProject = new Project({
      title,
      smallDescription,
      detailedDescription,
      image,  // can be null if not uploaded
      icon,   // can be null if not uploaded
    });

    await newProject.save();

    res.status(201).json(newProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});


// GET route to fetch all projects
router.post('/get', async (req, res) => {
  try {
    console.log("projects")
      const projects = await Project.find();
      // Fetch all projects
      res.status(200).json(projects);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  });

  // GET route to fetch a single project by ID
router.get('/:id', async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);  // Fetch the project by ID
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      res.status(200).json(project);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch project' });
    }
  });
// PATCH route to update a project by ID
router.patch('/:id', async (req, res) => {
    const { title, smallDescription, detailedDescription, image, icon } = req.body;
  
    try {
      // Find project by ID and update the fields
      const project = await Project.findByIdAndUpdate(
        req.params.id, // Find project by ID
        { title, smallDescription, detailedDescription, image, icon }, // Update fields
        { new: true } // Return the updated document
      );
  
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
  
      res.status(200).json(project); // Return the updated project
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update project' });
    }
  });
    

  // DELETE route to remove a project by ID
router.delete('/:id', async (req, res) => {
    try {
      // Find and delete the project by ID
      const project = await Project.findByIdAndDelete(req.params.id);
  
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
  
      res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete project' });
    }
  });
  
  
module.exports = router;
