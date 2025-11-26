const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Project = require('../models/Project');
const Contact = require('../models/Contact');
const SocialLinks = require('../models/SocialLinks');
const About = require('../models/About');
const Resume = require('../models/Resume');
const User = require('../models/User');
const Skill = require('../models/Skill');
const Coffee = require('../models/Coffee');
const Payment = require('../models/Payment');
const CoffeePurchase = require('../models/CoffeePurchase');

// Projects Routes
router.get('/projects', auth, async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/projects', auth, async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/projects/:id', auth, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/projects/:id', auth, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Contact Queries Routes
router.get('/contacts', auth, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/contacts/:id', auth, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json({ message: 'Contact deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Social Links Routes
router.get('/social', auth, async (req, res) => {
  try {
    let socialLinks = await SocialLinks.findOne();
    if (!socialLinks) {
      socialLinks = new SocialLinks();
      await socialLinks.save();
    }
    res.json(socialLinks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/social', auth, async (req, res) => {
  try {
    let socialLinks = await SocialLinks.findOne();
    if (socialLinks) {
      Object.assign(socialLinks, req.body);
      await socialLinks.save();
    } else {
      socialLinks = new SocialLinks(req.body);
      await socialLinks.save();
    }
    res.json(socialLinks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// About Routes
router.get('/about', auth, async (req, res) => {
  try {
    let about = await About.findOne();
    if (!about) {
      about = new About({ name: 'Shubham Kumar', title: 'Full Stack MERN Developer' });
      await about.save();
    }
    res.json(about);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/about', auth, async (req, res) => {
  try {
    let about = await About.findOne();
    if (about) {
      Object.assign(about, req.body);
      await about.save();
    } else {
      about = new About(req.body);
      await about.save();
    }
    res.json(about);
  } catch (error) {
    console.error('Error updating about:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// Resume Routes
router.get('/resume', auth, async (req, res) => {
  try {
    let resume = await Resume.findOne();
    res.json(resume || {});
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/resume', auth, async (req, res) => {
  try {
    let resume = await Resume.findOne();
    if (resume) {
      // Update existing resume
      if (req.body.fileData) {
        // If fileData is provided, it's a base64 PDF upload
        resume.fileData = req.body.fileData;
        resume.fileName = req.body.fileName || 'resume.pdf';
        resume.fileType = req.body.fileType || 'application/pdf';
        resume.fileUrl = ''; // Clear URL if uploading file
      } else if (req.body.fileUrl) {
        // If fileUrl is provided, it's a URL
        resume.fileUrl = req.body.fileUrl;
        resume.fileName = req.body.fileName || resume.fileName;
        resume.fileData = ''; // Clear file data if using URL
      }
      await resume.save();
    } else {
      // Create new resume
      resume = new Resume({
        fileUrl: req.body.fileUrl || '',
        fileName: req.body.fileName || '',
        fileData: req.body.fileData || '',
        fileType: req.body.fileType || 'application/pdf'
      });
      await resume.save();
    }
    res.json(resume);
  } catch (error) {
    console.error('Error updating resume:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// Users Routes
router.get('/users', auth, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/users/:id', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Skills Routes
router.get('/skills', auth, async (req, res) => {
  try {
    const skills = await Skill.find().sort({ createdAt: -1 });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/skills', auth, async (req, res) => {
  try {
    const skill = new Skill(req.body);
    await skill.save();
    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/skills/:id', auth, async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    res.json(skill);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/skills/:id', auth, async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    res.json({ message: 'Skill deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Coffee Routes
router.get('/coffee', auth, async (req, res) => {
  try {
    let coffee = await Coffee.findOne();
    if (!coffee) {
      coffee = new Coffee({
        minCoffee: 1,
        maxCoffee: 10,
        coffeePrice: 50,
        currency: 'INR'
      });
      await coffee.save();
    }
    res.json(coffee);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/coffee', auth, async (req, res) => {
  try {
    let coffee = await Coffee.findOne();
    if (coffee) {
      coffee.minCoffee = req.body.minCoffee || coffee.minCoffee;
      coffee.maxCoffee = req.body.maxCoffee || coffee.maxCoffee;
      coffee.coffeePrice = req.body.coffeePrice || coffee.coffeePrice;
      coffee.currency = req.body.currency || coffee.currency || 'INR';
      await coffee.save();
    } else {
      coffee = new Coffee({
        minCoffee: req.body.minCoffee || 1,
        maxCoffee: req.body.maxCoffee || 10,
        coffeePrice: req.body.coffeePrice || 50,
        currency: req.body.currency || 'INR'
      });
      await coffee.save();
    }
    res.json(coffee);
  } catch (error) {
    console.error('Error updating coffee:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// Payment Routes
router.get('/payment', auth, async (req, res) => {
  try {
    let payment = await Payment.findOne();
    if (!payment) {
      payment = new Payment();
      await payment.save();
    }
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/payment', auth, async (req, res) => {
  try {
    let payment = await Payment.findOne();
    if (payment) {
      payment.upiId = req.body.upiId || payment.upiId;
      payment.bankAccount = req.body.bankAccount || payment.bankAccount;
      payment.qrCode = req.body.qrCode || payment.qrCode;
      await payment.save();
    } else {
      payment = new Payment(req.body);
      await payment.save();
    }
    res.json(payment);
  } catch (error) {
    console.error('Error updating payment:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// Coffee Purchase Routes
router.get('/coffee-purchases', auth, async (req, res) => {
  try {
    const purchases = await CoffeePurchase.find()
      .populate('userId', 'name email')
      .populate('projectId', 'title')
      .sort({ createdAt: -1 });
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/coffee-purchases/:id/approve', auth, async (req, res) => {
  try {
    const purchase = await CoffeePurchase.findById(req.params.id);
    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }
    purchase.status = 'approved';
    purchase.projectLink = req.body.projectLink || purchase.projectLink;
    await purchase.save();
    res.json(purchase);
  } catch (error) {
    console.error('Error approving purchase:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

router.post('/coffee-purchases/:id/reject', auth, async (req, res) => {
  try {
    const purchase = await CoffeePurchase.findById(req.params.id);
    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }
    purchase.status = 'rejected';
    purchase.rejectionReason = req.body.rejectionReason || '';
    await purchase.save();
    res.json(purchase);
  } catch (error) {
    console.error('Error rejecting purchase:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

module.exports = router;

