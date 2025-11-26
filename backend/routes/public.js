const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const SocialLinks = require('../models/SocialLinks');
const About = require('../models/About');
const Resume = require('../models/Resume');
const Coffee = require('../models/Coffee');
const Payment = require('../models/Payment');
const CoffeePurchase = require('../models/CoffeePurchase');
const auth = require('../middleware/auth');

// Public Projects Routes
router.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/projects/featured', async (req, res) => {
  try {
    const projects = await Project.find({ featured: true }).sort({ createdAt: -1 }).limit(3);
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Public Skills Routes
router.get('/skills', async (req, res) => {
  try {
    const skills = await Skill.find().sort({ createdAt: -1 });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Public Social Links Routes
router.get('/social', async (req, res) => {
  try {
    const socialLinks = await SocialLinks.findOne();
    res.json(socialLinks || {});
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Public About Routes
router.get('/about', async (req, res) => {
  try {
    const about = await About.findOne();
    res.json(about || {});
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Public Resume Routes
router.get('/resume', async (req, res) => {
  try {
    const resume = await Resume.findOne();
    res.json(resume || {});
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Public Coffee Routes
router.get('/coffee', async (req, res) => {
  try {
    let coffee = await Coffee.findOne();
    if (!coffee) {
      // Create default coffee settings if none exist
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

// Public Payment Routes
router.get('/payment', async (req, res) => {
  try {
    const payment = await Payment.findOne();
    res.json(payment || {});
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Coffee Purchase Route (requires authentication)
router.post('/coffee-purchase', auth, async (req, res) => {
  try {
    const { projectId, numberOfCoffees, paymentProof, paymentType, utr } = req.body;
    const userId = req.user.userId;

    // Get project details
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Get coffee price
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

    const totalAmount = numberOfCoffees * coffee.coffeePrice;

    // Create purchase
    const purchase = new CoffeePurchase({
      userId,
      projectId,
      projectTitle: project.title,
      numberOfCoffees,
      totalAmount,
      paymentProof: paymentProof || '',
      paymentType: paymentType || 'upi',
      utr: utr || '',
      status: 'pending'
    });
    await purchase.save();

    res.status(201).json(purchase);
  } catch (error) {
    console.error('Error creating coffee purchase:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// Get user's coffee purchases (requires authentication)
router.get('/my-coffee-purchases', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const purchases = await CoffeePurchase.find({ userId })
      .populate('projectId', 'title')
      .sort({ createdAt: -1 });
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

