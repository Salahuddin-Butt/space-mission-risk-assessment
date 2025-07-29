const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');

// Get all assessments
router.get('/', (req, res) => {
  try {
    res.json(global.assessments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assessments', error: error.message });
  }
});

// Get assessment by ID
router.get('/:id', (req, res) => {
  try {
    const assessment = global.assessments.find(a => a.id === req.params.id);
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }
    res.json(assessment);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assessment', error: error.message });
  }
});

// Create new assessment
router.post('/', (req, res) => {
  try {
    const { 
      missionId, 
      passengerIds, 
      assessmentType,
      notes 
    } = req.body;
    
    if (!missionId || !passengerIds || !Array.isArray(passengerIds)) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const mission = global.missions.find(m => m.id === missionId);
    if (!mission) {
      return res.status(404).json({ message: 'Mission not found' });
    }

    const passengers = global.passengers.filter(p => passengerIds.includes(p.id));
    const assessments = aiService.batchAssessRisk(passengers, mission);
    const insights = aiService.getAIInsights(assessments, mission);

    const newAssessment = {
      id: Date.now().toString(),
      missionId,
      passengerIds,
      assessmentType: assessmentType || 'AI_AUTOMATED',
      assessments,
      insights,
      notes: notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    global.assessments.push(newAssessment);
    
    // Emit real-time update
    if (global.io) {
      global.io.emit('assessment-created', newAssessment);
    }
    
    res.status(201).json(newAssessment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating assessment', error: error.message });
  }
});

// Update assessment
router.put('/:id', (req, res) => {
  try {
    const assessmentIndex = global.assessments.findIndex(a => a.id === req.params.id);
    if (assessmentIndex === -1) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    const { notes, assessmentType } = req.body;
    
    global.assessments[assessmentIndex] = {
      ...global.assessments[assessmentIndex],
      ...(notes && { notes }),
      ...(assessmentType && { assessmentType }),
      updatedAt: new Date().toISOString()
    };

    const updatedAssessment = global.assessments[assessmentIndex];
    
    // Emit real-time update
    if (global.io) {
      global.io.emit('assessment-updated', updatedAssessment);
    }
    
    res.json(updatedAssessment);
  } catch (error) {
    res.status(500).json({ message: 'Error updating assessment', error: error.message });
  }
});

// Delete assessment
router.delete('/:id', (req, res) => {
  try {
    const assessmentIndex = global.assessments.findIndex(a => a.id === req.params.id);
    if (assessmentIndex === -1) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    const deletedAssessment = global.assessments.splice(assessmentIndex, 1)[0];
    
    // Emit real-time update
    req.app.get('io').emit('assessment-deleted', { id: req.params.id });
    
    res.json({ message: 'Assessment deleted successfully', assessment: deletedAssessment });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting assessment', error: error.message });
  }
});

// Get assessments by mission
router.get('/mission/:missionId', (req, res) => {
  try {
    const missionAssessments = global.assessments.filter(a => a.missionId === req.params.missionId);
    res.json(missionAssessments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching mission assessments', error: error.message });
  }
});

// Get assessment statistics
router.get('/statistics/overview', (req, res) => {
  try {
    const allAssessments = global.assessments.flatMap(a => a.assessments);
    
    const statistics = {
      totalAssessments: global.assessments.length,
      totalPassengerAssessments: allAssessments.length,
      averageRiskScore: allAssessments.reduce((sum, a) => sum + a.riskScore, 0) / allAssessments.length,
      riskDistribution: {
        low: allAssessments.filter(a => a.riskLevel === 'LOW').length,
        medium: allAssessments.filter(a => a.riskLevel === 'MEDIUM').length,
        high: allAssessments.filter(a => a.riskLevel === 'HIGH').length
      },
      averageConfidence: allAssessments.reduce((sum, a) => sum + a.confidence, 0) / allAssessments.length,
      recentAssessments: global.assessments
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
    };
    
    res.json(statistics);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assessment statistics', error: error.message });
  }
});

// Retrain AI model with new data
router.post('/ai/retrain', async (req, res) => {
  try {
    console.log('Retraining AI model...');
    const result = await aiService.retrainModel(global.missions, global.passengers, global.risks);
    res.json({ 
      message: 'AI model retrained successfully', 
      result 
    });
  } catch (error) {
    console.error('Error retraining AI model:', error);
    res.status(500).json({ message: 'Error retraining AI model', error: error.message });
  }
});

// Retrain genetic algorithm
router.post('/ai/retrain-genetic', async (req, res) => {
  try {
    console.log('Retraining genetic algorithm...');
    // Reinitialize the genetic algorithm
    aiService.initializeModels();
    res.json({ 
      message: 'Genetic algorithm retrained successfully'
    });
  } catch (error) {
    console.error('Error retraining genetic algorithm:', error);
    res.status(500).json({ message: 'Error retraining genetic algorithm', error: error.message });
  }
});

// Get AI model status
router.get('/ai/status', (req, res) => {
  try {
    const status = aiService.getModelStatus();
    res.json({
      isTrained: status.neuralNetworkReady,
      trainingDataSize: global.assessments.length,
      modelArchitecture: 'Neural Network + Genetic Algorithm',
      lastTrainingTime: status.lastTrainingTime,
      isTraining: status.isTraining
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching AI status', error: error.message });
  }
});

module.exports = router; 