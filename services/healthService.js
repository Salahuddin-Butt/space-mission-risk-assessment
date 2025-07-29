const healthIssuesDatabase = {
  // Critical Health Issues - Mission Blocking
  critical: {
    'heart-disease': {
      name: 'Heart Disease',
      description: 'Cardiovascular conditions including coronary artery disease, heart failure, arrhythmias',
      riskLevel: 'CRITICAL',
      missionBlocking: true,
      riskScore: 0.95,
      treatmentRequired: 'Must be fully treated and cleared by cardiologist',
      symptoms: ['chest pain', 'shortness of breath', 'irregular heartbeat', 'fatigue'],
      category: 'cardiovascular'
    },
    'cancer-active': {
      name: 'Active Cancer',
      description: 'Currently undergoing cancer treatment or active cancer diagnosis',
      riskLevel: 'CRITICAL',
      missionBlocking: true,
      riskScore: 0.90,
      treatmentRequired: 'Must be in complete remission for at least 2 years',
      symptoms: ['unexplained weight loss', 'fatigue', 'pain', 'lumps'],
      category: 'oncology'
    },
    'severe-respiratory': {
      name: 'Severe Respiratory Disease',
      description: 'Severe asthma, COPD, or other chronic respiratory conditions',
      riskLevel: 'CRITICAL',
      missionBlocking: true,
      riskScore: 0.85,
      treatmentRequired: 'Must be well-controlled with medication',
      symptoms: ['severe shortness of breath', 'wheezing', 'chronic cough'],
      category: 'respiratory'
    },
    'diabetes-uncontrolled': {
      name: 'Uncontrolled Diabetes',
      description: 'Poorly controlled diabetes with frequent complications',
      riskLevel: 'CRITICAL',
      missionBlocking: true,
      riskScore: 0.80,
      treatmentRequired: 'Must have stable blood glucose levels for 6+ months',
      symptoms: ['frequent urination', 'excessive thirst', 'fatigue', 'blurred vision'],
      category: 'endocrine'
    },
    'severe-mental-health': {
      name: 'Severe Mental Health Conditions',
      description: 'Severe depression, bipolar disorder, schizophrenia, or other serious mental health conditions',
      riskLevel: 'CRITICAL',
      missionBlocking: true,
      riskScore: 0.75,
      treatmentRequired: 'Must be stable on medication for 1+ year',
      symptoms: ['severe mood swings', 'hallucinations', 'suicidal thoughts'],
      category: 'psychiatric'
    }
  },

  // High Risk Issues - Requires Medical Clearance
  high: {
    'hypertension': {
      name: 'Hypertension',
      description: 'High blood pressure requiring medication',
      riskLevel: 'HIGH',
      missionBlocking: false,
      riskScore: 0.65,
      treatmentRequired: 'Must be well-controlled with medication',
      symptoms: ['headaches', 'dizziness', 'chest pain'],
      category: 'cardiovascular'
    },
    'diabetes-controlled': {
      name: 'Controlled Diabetes',
      description: 'Well-controlled diabetes with stable blood glucose',
      riskLevel: 'HIGH',
      missionBlocking: false,
      riskScore: 0.60,
      treatmentRequired: 'Regular monitoring and medication compliance',
      symptoms: ['increased thirst', 'frequent urination'],
      category: 'endocrine'
    },
    'asthma-mild': {
      name: 'Mild Asthma',
      description: 'Well-controlled asthma with infrequent symptoms',
      riskLevel: 'HIGH',
      missionBlocking: false,
      riskScore: 0.55,
      treatmentRequired: 'Inhaler available and symptoms under control',
      symptoms: ['occasional wheezing', 'mild shortness of breath'],
      category: 'respiratory'
    },
    'epilepsy-controlled': {
      name: 'Controlled Epilepsy',
      description: 'Epilepsy that is well-controlled with medication',
      riskLevel: 'HIGH',
      missionBlocking: false,
      riskScore: 0.70,
      treatmentRequired: 'Seizure-free for 2+ years on medication',
      symptoms: ['seizures', 'loss of consciousness'],
      category: 'neurological'
    },
    'depression-mild': {
      name: 'Mild Depression',
      description: 'Mild to moderate depression under treatment',
      riskLevel: 'HIGH',
      missionBlocking: false,
      riskScore: 0.50,
      treatmentRequired: 'Stable on medication and therapy',
      symptoms: ['sadness', 'fatigue', 'sleep changes'],
      category: 'psychiatric'
    }
  },

  // Moderate Risk Issues - Requires Monitoring
  moderate: {
    'allergies-severe': {
      name: 'Severe Allergies',
      description: 'Severe food or environmental allergies',
      riskLevel: 'MODERATE',
      missionBlocking: false,
      riskScore: 0.40,
      treatmentRequired: 'EpiPen available and allergy management plan',
      symptoms: ['severe allergic reactions', 'anaphylaxis risk'],
      category: 'immunological'
    },
    'migraines': {
      name: 'Migraines',
      description: 'Frequent or severe migraine headaches',
      riskLevel: 'MODERATE',
      missionBlocking: false,
      riskScore: 0.35,
      treatmentRequired: 'Medication available and trigger avoidance',
      symptoms: ['severe headaches', 'nausea', 'light sensitivity'],
      category: 'neurological'
    },
    'back-pain-chronic': {
      name: 'Chronic Back Pain',
      description: 'Chronic back pain requiring regular treatment',
      riskLevel: 'MODERATE',
      missionBlocking: false,
      riskScore: 0.30,
      treatmentRequired: 'Physical therapy and pain management',
      symptoms: ['chronic pain', 'limited mobility'],
      category: 'musculoskeletal'
    },
    'sleep-apnea': {
      name: 'Sleep Apnea',
      description: 'Sleep apnea requiring CPAP or other treatment',
      riskLevel: 'MODERATE',
      missionBlocking: false,
      riskScore: 0.45,
      treatmentRequired: 'CPAP machine available',
      symptoms: ['loud snoring', 'daytime fatigue', 'breathing pauses'],
      category: 'respiratory'
    },
    'anxiety-mild': {
      name: 'Mild Anxiety',
      description: 'Mild anxiety or panic attacks',
      riskLevel: 'MODERATE',
      missionBlocking: false,
      riskScore: 0.25,
      treatmentRequired: 'Therapy and/or medication as needed',
      symptoms: ['worry', 'panic attacks', 'restlessness'],
      category: 'psychiatric'
    }
  },

  // Low Risk Issues - Minor Impact
  low: {
    'cough': {
      name: 'Cough',
      description: 'Minor cough or cold symptoms',
      riskLevel: 'LOW',
      missionBlocking: false,
      riskScore: 0.15,
      treatmentRequired: 'Over-the-counter medication',
      symptoms: ['coughing', 'sore throat', 'mild congestion'],
      category: 'respiratory'
    },
    'headache-occasional': {
      name: 'Occasional Headaches',
      description: 'Infrequent tension headaches',
      riskLevel: 'LOW',
      missionBlocking: false,
      riskScore: 0.10,
      treatmentRequired: 'Over-the-counter pain relievers',
      symptoms: ['mild headaches', 'tension'],
      category: 'neurological'
    },
    'allergies-mild': {
      name: 'Mild Allergies',
      description: 'Seasonal or mild environmental allergies',
      riskLevel: 'LOW',
      missionBlocking: false,
      riskScore: 0.12,
      treatmentRequired: 'Antihistamines as needed',
      symptoms: ['sneezing', 'runny nose', 'itchy eyes'],
      category: 'immunological'
    },
    'insomnia-mild': {
      name: 'Mild Insomnia',
      description: 'Occasional difficulty sleeping',
      riskLevel: 'LOW',
      missionBlocking: false,
      riskScore: 0.08,
      treatmentRequired: 'Sleep hygiene practices',
      symptoms: ['difficulty falling asleep', 'waking up frequently'],
      category: 'sleep'
    },
    'mild-anxiety': {
      name: 'Very Mild Anxiety',
      description: 'Occasional nervousness or stress',
      riskLevel: 'LOW',
      missionBlocking: false,
      riskScore: 0.05,
      treatmentRequired: 'Stress management techniques',
      symptoms: ['occasional worry', 'mild stress'],
      category: 'psychiatric'
    }
  }
};

// Health assessment service
class HealthService {
  constructor() {
    this.healthIssues = healthIssuesDatabase;
  }

  // Get all health issues organized by risk level
  getAllHealthIssues() {
    return this.healthIssues;
  }

  // Get health issues by risk level
  getHealthIssuesByRiskLevel(riskLevel) {
    return this.healthIssues[riskLevel] || {};
  }

  // Search health issues by keyword
  searchHealthIssues(keyword) {
    const results = [];
    const searchTerm = keyword.toLowerCase();

    Object.keys(this.healthIssues).forEach(riskLevel => {
      Object.keys(this.healthIssues[riskLevel]).forEach(issueKey => {
        const issue = this.healthIssues[riskLevel][issueKey];
        if (
          issue.name.toLowerCase().includes(searchTerm) ||
          issue.description.toLowerCase().includes(searchTerm) ||
          issue.symptoms.some(symptom => symptom.toLowerCase().includes(searchTerm)) ||
          issue.category.toLowerCase().includes(searchTerm)
        ) {
          results.push({
            key: issueKey,
            riskLevel,
            ...issue
          });
        }
      });
    });

    return results;
  }

  // Assess passenger health based on their health issues
  assessPassengerHealth(passengerHealthIssues) {
    if (!passengerHealthIssues || passengerHealthIssues.length === 0) {
      return {
        overallRisk: 0.05,
        riskLevel: 'LOW',
        missionEligible: true,
        recommendations: ['No health issues detected. Passenger is eligible for mission.'],
        criticalIssues: [],
        highRiskIssues: [],
        moderateRiskIssues: [],
        lowRiskIssues: []
      };
    }

    let totalRiskScore = 0;
    let criticalIssues = [];
    let highRiskIssues = [];
    let moderateRiskIssues = [];
    let lowRiskIssues = [];
    let recommendations = [];

    passengerHealthIssues.forEach(issueKey => {
      let found = false;
      
      // Search through all risk levels
      Object.keys(this.healthIssues).forEach(riskLevel => {
        if (this.healthIssues[riskLevel][issueKey]) {
          const issue = this.healthIssues[riskLevel][issueKey];
          found = true;
          
          totalRiskScore += issue.riskScore;
          
          switch (riskLevel) {
            case 'critical':
              criticalIssues.push(issue);
              break;
            case 'high':
              highRiskIssues.push(issue);
              break;
            case 'moderate':
              moderateRiskIssues.push(issue);
              break;
            case 'low':
              lowRiskIssues.push(issue);
              break;
          }
        }
      });
      
      if (!found) {
        // If issue not found in database, treat as moderate risk
        totalRiskScore += 0.35;
        moderateRiskIssues.push({
          name: issueKey,
          description: 'Health issue not in database',
          riskLevel: 'MODERATE',
          riskScore: 0.35
        });
      }
    });

    // Calculate average risk score
    const averageRiskScore = totalRiskScore / passengerHealthIssues.length;
    
    // Determine overall risk level
    let overallRiskLevel = 'LOW';
    if (averageRiskScore >= 0.7) overallRiskLevel = 'CRITICAL';
    else if (averageRiskScore >= 0.5) overallRiskLevel = 'HIGH';
    else if (averageRiskScore >= 0.3) overallRiskLevel = 'MODERATE';

    // Check mission eligibility
    const missionEligible = criticalIssues.length === 0;

    // Generate recommendations
    if (criticalIssues.length > 0) {
      recommendations.push('CRITICAL: Passenger is NOT eligible for mission due to critical health issues.');
      criticalIssues.forEach(issue => {
        recommendations.push(`- ${issue.name}: ${issue.treatmentRequired}`);
      });
    }

    if (highRiskIssues.length > 0) {
      recommendations.push('HIGH RISK: Medical clearance required before mission.');
      highRiskIssues.forEach(issue => {
        recommendations.push(`- ${issue.name}: ${issue.treatmentRequired}`);
      });
    }

    if (moderateRiskIssues.length > 0) {
      recommendations.push('MODERATE RISK: Monitor during mission.');
      moderateRiskIssues.forEach(issue => {
        recommendations.push(`- ${issue.name}: ${issue.treatmentRequired}`);
      });
    }

    if (lowRiskIssues.length > 0) {
      recommendations.push('LOW RISK: Standard monitoring.');
      lowRiskIssues.forEach(issue => {
        recommendations.push(`- ${issue.name}: ${issue.treatmentRequired}`);
      });
    }

    return {
      overallRisk: averageRiskScore,
      riskLevel: overallRiskLevel,
      missionEligible,
      recommendations,
      criticalIssues,
      highRiskIssues,
      moderateRiskIssues,
      lowRiskIssues
    };
  }

  // Get health issues for form selection
  getHealthIssuesForForm() {
    const formIssues = [];
    
    Object.keys(this.healthIssues).forEach(riskLevel => {
      Object.keys(this.healthIssues[riskLevel]).forEach(issueKey => {
        const issue = this.healthIssues[riskLevel][issueKey];
        formIssues.push({
          key: issueKey,
          name: issue.name,
          description: issue.description,
          riskLevel: issue.riskLevel,
          category: issue.category
        });
      });
    });

    return formIssues.sort((a, b) => {
      const riskOrder = { 'CRITICAL': 0, 'HIGH': 1, 'MODERATE': 2, 'LOW': 3 };
      return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
    });
  }
}

module.exports = new HealthService(); 