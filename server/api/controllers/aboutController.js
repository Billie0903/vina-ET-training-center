const About = require('../models/aboutModel')

// Get all about content (public)
const getAboutContent = async (req, res) => {
   try {
      const aboutContent = await About.find({ published: true })
         .populate('lastUpdatedBy', 'name')
         .sort({ section: 1 })
         .exec()
      
      // Transform data into a more usable format
      const contentMap = {}
      aboutContent.forEach(item => {
         contentMap[item.section] = {
            title: item.title,
            content: item.content,
            data: item.data,
            lastUpdated: item.updatedAt,
            lastUpdatedBy: item.lastUpdatedBy
         }
      })
      
      res.json(contentMap)
   } catch (error) {
      res.status(500).json({ message: 'Error fetching about content', error: error.message })
   }
}

// Get specific about section (public)
const getAboutSection = async (req, res) => {
   try {
      const { section } = req.params
      
      const aboutSection = await About.findOne({ section, published: true })
         .populate('lastUpdatedBy', 'name')
         .exec()
      
      if (!aboutSection) {
         return res.status(404).json({ message: 'About section not found' })
      }
      
      res.json({
         section: aboutSection.section,
         title: aboutSection.title,
         content: aboutSection.content,
         data: aboutSection.data,
         lastUpdated: aboutSection.updatedAt,
         lastUpdatedBy: aboutSection.lastUpdatedBy
      })
   } catch (error) {
      res.status(500).json({ message: 'Error fetching about section', error: error.message })
   }
}

// Admin: Get all about content (including unpublished)
const adminGetAboutContent = async (req, res) => {
   try {
      const aboutContent = await About.find()
         .populate('lastUpdatedBy', 'name')
         .sort({ section: 1 })
         .exec()
      
      res.json(aboutContent)
   } catch (error) {
      res.status(500).json({ message: 'Error fetching about content', error: error.message })
   }
}

// Admin: Create or update about section
const upsertAboutSection = async (req, res) => {
   try {
      const { section, title, content, data, published } = req.body
      
      const aboutData = {
         section,
         title,
         content,
         data: data || {},
         published: published !== undefined ? published : true,
         lastUpdatedBy: req.userId
      }
      
      const aboutSection = await About.findOneAndUpdate(
         { section },
         aboutData,
         { 
            new: true, 
            upsert: true, 
            runValidators: true 
         }
      ).populate('lastUpdatedBy', 'name')
      
      res.json({
         message: 'About section saved successfully',
         section: aboutSection
      })
   } catch (error) {
      res.status(500).json({ message: 'Error saving about section', error: error.message })
   }
}

// Admin: Update about section
const updateAboutSection = async (req, res) => {
   try {
      const { id } = req.params
      const { title, content, data, published } = req.body
      
      const updateData = {
         title,
         content,
         data: data || {},
         published: published !== undefined ? published : true,
         lastUpdatedBy: req.userId
      }
      
      const aboutSection = await About.findByIdAndUpdate(
         id,
         updateData,
         { new: true, runValidators: true }
      ).populate('lastUpdatedBy', 'name')
      
      if (!aboutSection) {
         return res.status(404).json({ message: 'About section not found' })
      }
      
      res.json({
         message: 'About section updated successfully',
         section: aboutSection
      })
   } catch (error) {
      res.status(500).json({ message: 'Error updating about section', error: error.message })
   }
}

// Admin: Delete about section
const deleteAboutSection = async (req, res) => {
   try {
      const { id } = req.params
      
      const aboutSection = await About.findByIdAndDelete(id)
      
      if (!aboutSection) {
         return res.status(404).json({ message: 'About section not found' })
      }
      
      res.json({ message: 'About section deleted successfully' })
   } catch (error) {
      res.status(500).json({ message: 'Error deleting about section', error: error.message })
   }
}

// Admin: Get single about section for editing
const adminGetAboutSection = async (req, res) => {
   try {
      const { id } = req.params
      const aboutSection = await About.findById(id).populate('lastUpdatedBy', 'name')
      
      if (!aboutSection) {
         return res.status(404).json({ message: 'About section not found' })
      }
      
      res.json(aboutSection)
   } catch (error) {
      res.status(500).json({ message: 'Error fetching about section', error: error.message })
   }
}

// Admin: Bulk update about sections
const bulkUpdateAboutSections = async (req, res) => {
   try {
      const { sections } = req.body
      
      if (!Array.isArray(sections)) {
         return res.status(400).json({ message: 'Sections must be an array' })
      }
      
      const updatePromises = sections.map(sectionData => {
         const { section, title, content, data, published } = sectionData
         
         return About.findOneAndUpdate(
            { section },
            {
               title,
               content,
               data: data || {},
               published: published !== undefined ? published : true,
               lastUpdatedBy: req.userId
            },
            { 
               new: true, 
               upsert: true, 
               runValidators: true 
            }
         )
      })
      
      const updatedSections = await Promise.all(updatePromises)
      
      res.json({
         message: 'About sections updated successfully',
         sections: updatedSections
      })
   } catch (error) {
      res.status(500).json({ message: 'Error updating about sections', error: error.message })
   }
}

module.exports = {
   getAboutContent,
   getAboutSection,
   adminGetAboutContent,
   upsertAboutSection,
   updateAboutSection,
   deleteAboutSection,
   adminGetAboutSection,
   bulkUpdateAboutSections
}
