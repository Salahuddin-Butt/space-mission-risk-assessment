const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');

// Get all risks
router.get('/', (req, res) => {
  try {
    res.json(global.risks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching risks', error: error.message });
  }
});

// Get risk by ID
router.get('/:id', (req, res) => {
  try {
    const risk = global.risks.find(r => r.id === req.params.id);
    if (!risk) {
      return res.status(404).json({ message: 'Risk not found' });
    }
    res.json(risk);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching risk', error: error.message });
  }
});

// Create new risk factor
router.post('/', (req, res) => {
  try {
    const { 
      name, 
      category, 
      severity, 
      probability, 
      impact, 
      mitigation,
      description 
    } = req.body;
    
    if (!name || !category || severity === undefined || probability === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newRisk = {
      id: Date.now().toString(),
      name,
      category,
      severity: parseInt(severity),
      probability: parseInt(probability),
      impact: parseInt(impact) || 0,
      mitigation: mitigation || '',
      description: description || '',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    global.risks.push(newRisk);
    
    // Emit real-time update
    req.app.get('io').emit('risk-created', newRisk);
    
    res.status(201).json(newRisk);
  } catch (error) {
    res.status(500).json({ message: 'Error creating risk', error: error.message });
  }
});

// Update risk
router.put('/:id', (req, res) => {
  try {
    const riskIndex = global.risks.findIndex(r => r.id === req.params.id);
    if (riskIndex === -1) {
      return res.status(404).json({ message: 'Risk not found' });
    }

    const { 
      name, 
      category, 
      severity, 
      probability, 
      impact, 
      mitigation,
      description,
      status 
    } = req.body;
    
    global.risks[riskIndex] = {
      ...global.risks[riskIndex],
      ...(name && { name }),
      ...(category && { category }),
      ...(severity !== undefined && { severity: parseInt(severity) }),
      ...(probability !== undefined && { probability: parseInt(probability) }),
      ...(impact !== undefined && { impact: parseInt(impact) }),
      ...(mitigation && { mitigation }),
      ...(description && { description }),
      ...(status && { status }),
      updatedAt: new Date().toISOString()
    };

    const updatedRisk = global.risks[riskIndex];
    
    // Emit real-time update
    req.app.get('io').emit('risk-updated', updatedRisk);
    
    res.json(updatedRisk);
  } catch (error) {
    res.status(500).json({ message: 'Error updating risk', error: error.message });
  }
});

// Delete risk
router.delete('/:id', (req, res) => {
  try {
    const riskIndex = global.risks.findIndex(r => r.id === req.params.id);
    if (riskIndex === -1) {
      return res.status(404).json({ message: 'Risk not found' });
    }

    const deletedRisk = global.risks.splice(riskIndex, 1)[0];
    
    // Emit real-time update
    req.app.get('io').emit('risk-deleted', { id: req.params.id });
    
    res.json({ message: 'Risk deleted successfully', risk: deletedRisk });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting risk', error: error.message });
  }
});

// Get risk analysis
router.get('/analysis/summary', (req, res) => {
  try {
    const activeRisks = global.risks.filter(r => r.status === 'ACTIVE');
    
    const analysis = {
      totalRisks: activeRisks.length,
      highSeverity: activeRisks.filter(r => r.severity >= 8).length,
      mediumSeverity: activeRisks.filter(r => r.severity >= 4 && r.severity < 8).length,
      lowSeverity: activeRisks.filter(r => r.severity < 4).length,
      averageSeverity: activeRisks.reduce((sum, r) => sum + r.severity, 0) / activeRisks.length,
      averageProbability: activeRisks.reduce((sum, r) => sum + r.probability, 0) / activeRisks.length,
      categories: [...new Set(activeRisks.map(r => r.category))],
      topRisks: activeRisks
        .sort((a, b) => (b.severity * b.probability) - (a.severity * a.probability))
        .slice(0, 5)
    };
    
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: 'Error analyzing risks', error: error.message });
  }
});

// Get risks by category
router.get('/category/:category', (req, res) => {
  try {
    const categoryRisks = global.risks.filter(r => 
      r.category.toLowerCase() === req.params.category.toLowerCase()
    );
    res.json(categoryRisks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching risks by category', error: error.message });
  }
});

module.exports = router; 