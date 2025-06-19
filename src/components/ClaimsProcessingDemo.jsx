import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Shield, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  MessageSquare, 
  Upload,
  BarChart3,
  Search,
  RefreshCw,
  Eye,
  Download,
  Brain,
  Zap,
  TrendingUp,
  Users,
  DollarSign,
  Activity
} from 'lucide-react';

// Mock implementation of ClaimsProcessingSystem for demo
class MockClaimsSystem {
  constructor() {
    this.processedClaims = new Map();
  }

  async processClaimComplete(documentText, options = {}) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
    
    const processingId = `claim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Mock extracted data based on document content
    const extractedData = {
      claimNumber: "CLM-2025-" + Math.floor(Math.random() * 10000),
      policyNumber: "POL-" + Math.floor(Math.random() * 100000),
      claimantName: "John Doe",
      dateOfIncident: "2025-06-15",
      dateOfClaim: "2025-06-18",
      claimType: documentText.toLowerCase().includes('auto') ? 'auto' : 
                 documentText.toLowerCase().includes('health') ? 'health' : 'property',
      damageDescription: documentText.substring(0, 200) + "...",
      estimatedAmount: Math.floor(Math.random() * 50000) + 1000,
      confidence: Math.random() > 0.3 ? 'high' : 'medium'
    };

    const fraudAssessment = {
      riskLevel: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
      riskScore: Math.floor(Math.random() * 100),
      fraudIndicators: Math.random() > 0.5 ? [
        { indicator: "Claim amount above average", weight: "medium", explanation: "Amount is 30% higher than typical for this incident type" }
      ] : [],
      overallAssessment: "Based on the analysis of provided documentation and incident details, this claim shows standard risk patterns.",
      confidence: "high"
    };

    const categorization = {
      category: {
        primary: extractedData.claimType + '_claims',
        complexity: Math.random() > 0.6 ? 'complex' : 'standard'
      },
      priority: {
        level: fraudAssessment.riskLevel === 'high' ? 'urgent' : 'normal',
        score: Math.floor(Math.random() * 10) + 1
      },
      routing: {
        department: extractedData.claimType + '_claims',
        assignmentType: fraudAssessment.riskLevel === 'high' ? 'specialist' : 'junior_adjuster',
        estimatedHandlingTime: '1-2 days'
      }
    };

    const summary = {
      executiveSummary: `${extractedData.claimType.charAt(0).toUpperCase() + extractedData.claimType.slice(1)} claim for $${extractedData.estimatedAmount.toLocaleString()} submitted by ${extractedData.claimantName}.`,
      keyDetails: {
        claimant: extractedData.claimantName,
        incident: extractedData.damageDescription.substring(0, 100) + "...",
        damages: `$${extractedData.estimatedAmount.toLocaleString()}`,
        riskFactors: fraudAssessment.riskLevel + " risk level"
      },
      processingStatus: "Ready for " + categorization.routing.assignmentType,
      timeline: categorization.routing.estimatedHandlingTime
    };

    const result = {
      processingId,
      timestamp: new Date().toISOString(),
      processingTimeMs: 3500,
      status: 'completed',
      originalDocument: documentText,
      extractedData,
      fraudAssessment,
      categorization,
      summary,
      recommendedActions: [
        {
          type: 'routing',
          priority: categorization.priority.level,
          action: `Route to ${categorization.routing.department}`,
          details: [`Assign to: ${categorization.routing.assignmentType}`]
        }
      ]
    };

    this.processedClaims.set(processingId, result);
    return { success: true, result };
  }

  getAllClaims() {
    return Array.from(this.processedClaims.values());
  }

  getClaim(id) {
    return this.processedClaims.get(id);
  }

  generateAnalytics() {
    const claims = this.getAllClaims();
    return {
      totalClaims: claims.length,
      averageProcessingTime: 3200,
      riskDistribution: claims.reduce((acc, claim) => {
        acc[claim.fraudAssessment.riskLevel] = (acc[claim.fraudAssessment.riskLevel] || 0) + 1;
        return acc;
      }, {}),
      claimTypeDistribution: claims.reduce((acc, claim) => {
        acc[claim.extractedData.claimType] = (acc[claim.extractedData.claimType] || 0) + 1;
        return acc;
      }, {}),
      successfullyProcessed: claims.filter(c => c.status === 'completed').length
    };
  }
}

const mockSystem = new MockClaimsSystem();

const ClaimsProcessingDemo = () => {
  const [activeTab, setActiveTab] = useState('process');
  const [documentText, setDocumentText] = useState('');
  const [processing, setProcessing] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [allClaims, setAllClaims] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const sampleDocuments = {
    auto: `AUTOMOBILE ACCIDENT CLAIM REPORT

Claim Number: CLM-2025-001234
Policy Number: AUTO-789456123
Date of Loss: June 15, 2025
Date Reported: June 18, 2025

INSURED INFORMATION:
Name: John Michael Doe
Address: 123 Main Street, Lagos, Nigeria
Phone: +234 801 234 5678
Policy Effective: January 1, 2025

VEHICLE INFORMATION:
Year: 2022
Make: Toyota
Model: Camry
License Plate: LAG-456-XY
VIN: 4T1BE46K87U123456

ACCIDENT DETAILS:
Date of Accident: June 15, 2025
Time: 2:30 PM
Location: Intersection of Victoria Island Road and Adeola Odeku Street, Lagos

DESCRIPTION OF ACCIDENT:
While proceeding through the intersection on a green light, the insured vehicle was struck on the passenger side by another vehicle that ran the red light. The impact caused significant damage to the passenger door, rear quarter panel, and wheel assembly. No injuries were reported at the scene.

ESTIMATED DAMAGE: ₦2,800,000 ($3,500 USD)

WITNESSES:
1. Mary Johnson - Phone: +234 802 345 6789
2. David Okafor - Phone: +234 803 456 7890

POLICE REPORT: Filed - Report #LPD-2025-0615-442

The other driver admitted fault at the scene and provided insurance information. Photos of the damage and accident scene have been taken and will be submitted separately.`,

    health: `MEDICAL CLAIM FORM

Claim Number: MED-2025-005678
Policy Number: HEALTH-456789012
Member ID: 123456789

PATIENT INFORMATION:
Name: Sarah Elizabeth Williams
Date of Birth: March 12, 1985
Address: 45 Adeniran Ogunsanya Street, Surulere, Lagos
Phone: +234 804 567 8901

PROVIDER INFORMATION:
Hospital: Lagos University Teaching Hospital (LUTH)
Address: Idi-Araba, Surulere, Lagos
Doctor: Dr. Adebayo Ogundimu
Specialty: Emergency Medicine

TREATMENT DETAILS:
Date of Service: June 16, 2025
Emergency Room Visit
Chief Complaint: Severe abdominal pain

DIAGNOSIS:
Acute appendicitis requiring emergency appendectomy

PROCEDURES PERFORMED:
1. Emergency appendectomy (laparoscopic)
2. General anesthesia
3. Post-operative monitoring (24 hours)

MEDICATIONS PRESCRIBED:
1. Antibiotics (7-day course)
2. Pain management medication
3. Anti-inflammatory drugs

TOTAL CHARGES: ₦850,000 ($1,062.50 USD)
- Emergency room fee: ₦150,000
- Surgeon fee: ₦300,000
- Anesthesia: ₦100,000
- Hospital stay: ₦200,000
- Medications: ₦100,000

This was a genuine medical emergency requiring immediate surgical intervention. All procedures were medically necessary and performed according to standard protocols.`,

    property: `PROPERTY DAMAGE CLAIM REPORT

Claim Number: PROP-2025-009876
Policy Number: HOME-123789456
Date of Loss: June 14, 2025

PROPERTY OWNER:
Name: Robert and Jennifer Thompson
Property Address: 12 Glover Road, Ikoyi, Lagos
Phone: +234 805 678 9012

INCIDENT TYPE: Storm Damage

DESCRIPTION OF DAMAGE:
On June 14, 2025, during a severe thunderstorm with high winds, a large tree in the neighbor's yard fell onto our property, causing the following damage:

1. ROOF DAMAGE:
   - Major damage to the northeast section of the roof
   - Multiple broken tiles and torn underlayment
   - Damaged gutters and downspouts
   - Water intrusion into the master bedroom and hallway

2. STRUCTURAL DAMAGE:
   - Cracked ceiling in master bedroom
   - Water damage to hardwood floors
   - Damaged electrical fixtures in affected rooms

3. PERSONAL PROPERTY:
   - Damaged furniture in master bedroom
   - Ruined electronics due to water damage
   - Destroyed personal belongings

IMMEDIATE ACTIONS TAKEN:
- Contacted emergency services
- Arranged for temporary roof covering
- Documented all damage with photographs
- Obtained estimates from contractors

ESTIMATED TOTAL DAMAGE: ₦4,200,000 ($5,250 USD)
- Roof repairs: ₦2,500,000
- Interior repairs: ₦1,200,000
- Personal property: ₦500,000

Weather conditions were extreme and unprecedented for the season. Multiple properties in the area experienced similar storm damage.`
  };

  const processClaim = async () => {
    if (!documentText.trim()) {
      alert('Please enter document text or use a sample document');
      return;
    }

    setProcessing(true);
    setCurrentResult(null);

    try {
      const result = await mockSystem.processClaimComplete(documentText, {
        generateCustomerResponse: true,
        customerFriendly: true
      });

      setCurrentResult(result.result);
      refreshData();
    } catch (error) {
      console.error('Processing failed:', error);
      alert('Processing failed: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const refreshData = () => {
    const claims = mockSystem.getAllClaims();
    setAllClaims(claims);
    setAnalytics(mockSystem.generateAnalytics());
  };

  const loadSampleDocument = (type) => {
    setDocumentText(sampleDocuments[type]);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getRiskBadgeColor = (riskLevel) => {
    switch (riskLevel) {
      case 'low': return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300';
      case 'medium': return 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300';
      case 'high': return 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300';
      case 'critical': return 'bg-gradient-to-r from-red-200 to-red-300 text-red-900 border border-red-400';
      default: return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300';
    }
  };

  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300';
      case 'high': return 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border border-orange-300';
      case 'normal': return 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300';
      case 'low': return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300';
      default: return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300';
    }
  };

  useEffect(() => {
    refreshData();
    setIsLoaded(true);
  }, []);

  const renderProcessingTab = () => (
    <div className="space-y-8">
      {/* Processing Section */}
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8 transform transition-all duration-500 hover:shadow-2xl hover:scale-[1.02]">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            AI Document Processing
          </h2>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Claim Document Text
            </label>
            <textarea
              value={documentText}
              onChange={(e) => setDocumentText(e.target.value)}
              className="w-full h-64 p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 resize-none backdrop-blur-sm bg-white/50"
              placeholder="Paste your claim document text here or load a sample document..."
            />
          </div>

          <div className="flex gap-3 flex-wrap">
            {[
              { type: 'auto', label: 'Auto Claim', color: 'from-blue-500 to-blue-600', icon: '🚗' },
              { type: 'health', label: 'Health Claim', color: 'from-green-500 to-green-600', icon: '🏥' },
              { type: 'property', label: 'Property Claim', color: 'from-purple-500 to-purple-600', icon: '🏠' }
            ].map(({ type, label, color, icon }) => (
              <button
                key={type}
                onClick={() => loadSampleDocument(type)}
                className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${color} text-white rounded-lg text-sm font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200`}
              >
                <span>{icon}</span>
                {label}
              </button>
            ))}
          </div>

          <button
            onClick={processClaim}
            disabled={processing || !documentText.trim()}
            className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed flex items-center justify-center gap-3 font-semibold text-lg shadow-xl transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl group"
          >
            {processing ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <Zap className="w-5 h-5 animate-pulse" />
                </div>
                Processing with AI...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                Process Claim with NeuroClaim
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Section */}
      {currentResult && (
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8 transform transition-all duration-500 animate-in slide-in-from-bottom">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              AI Analysis Results
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Extracted Information */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-xl border border-blue-200/50">
              <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Extracted Information
              </h3>
              <div className="space-y-3 text-sm">
                {[
                  { label: 'Claim Number', value: currentResult.extractedData.claimNumber },
                  { label: 'Claimant', value: currentResult.extractedData.claimantName },
                  { label: 'Type', value: currentResult.extractedData.claimType },
                  { label: 'Amount', value: formatCurrency(currentResult.extractedData.estimatedAmount) }
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center">
                    <span className="font-medium text-blue-700">{label}:</span>
                    <span className="text-blue-900 font-semibold">{value}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center">
                  <span className="font-medium text-blue-700">Confidence:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    currentResult.extractedData.confidence === 'high' 
                      ? 'bg-green-200 text-green-800' 
                      : 'bg-yellow-200 text-yellow-800'
                  }`}>
                    {currentResult.extractedData.confidence}
                  </span>
                </div>
              </div>
            </div>

            {/* Fraud Assessment */}
            <div className="bg-gradient-to-br from-red-50 to-orange-100 p-6 rounded-xl border border-red-200/50">
              <h3 className="font-bold text-red-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Fraud Assessment
              </h3>
              <div className="space-y-3 text-sm">
                {[
                  { 
                    label: 'Risk Level', 
                    value: (
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiskBadgeColor(currentResult.fraudAssessment.riskLevel)}`}>
                        {currentResult.fraudAssessment.riskLevel}
                      </span>
                    ) 
                  },
                  { label: 'Risk Score', value: `${currentResult.fraudAssessment.riskScore}/100` },
                  { label: 'Indicators', value: `${currentResult.fraudAssessment.fraudIndicators.length} found` },
                  { label: 'Confidence', value: currentResult.fraudAssessment.confidence }
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center">
                    <span className="font-medium text-red-700">{label}:</span>
                    <span className="text-red-900 font-semibold">{typeof value === 'string' ? value : value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Categorization */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-100 p-6 rounded-xl border border-purple-200/50">
              <h3 className="font-bold text-purple-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Smart Categorization
              </h3>
              <div className="space-y-3 text-sm">
                {[
                  { label: 'Department', value: currentResult.categorization.routing.department },
                  { 
                    label: 'Priority', 
                    value: (
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityBadgeColor(currentResult.categorization.priority.level)}`}>
                        {currentResult.categorization.priority.level}
                      </span>
                    ) 
                  },
                  { label: 'Assignment', value: currentResult.categorization.routing.assignmentType },
                  { label: 'Timeline', value: currentResult.categorization.routing.estimatedHandlingTime }
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center">
                    <span className="font-medium text-purple-700">{label}:</span>
                    <span className="text-purple-900 font-semibold">{typeof value === 'string' ? value : value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-xl border border-green-200/50">
              <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Executive Summary
              </h3>
              <p className="text-sm text-green-800 leading-relaxed">
                {currentResult.summary.executiveSummary}
              </p>
            </div>
          </div>

          {/* Recommended Actions */}
          <div className="mt-8">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Recommended Actions
            </h3>
            <div className="space-y-3">
              {currentResult.recommendedActions.map((action, index) => (
                <div key={index} className={`p-4 rounded-xl border-l-4 ${
                  action.priority === 'critical' ? 'border-red-500 bg-gradient-to-r from-red-50 to-red-100' :
                  action.priority === 'high' ? 'border-orange-500 bg-gradient-to-r from-orange-50 to-orange-100' :
                  'border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100'
                } transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg`}>
                  <p className="font-semibold text-gray-900">{action.action}</p>
                  <p className="text-sm text-gray-600 mt-1">{action.details.join(', ')}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderClaimsTab = () => (
    <div className="space-y-8">
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Claims Dashboard ({allClaims.length})
            </h2>
          </div>
          <button
            onClick={refreshData}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 flex items-center gap-2 font-medium shadow-lg transform transition-all duration-200 hover:scale-105"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  {['Claim ID', 'Claimant', 'Type', 'Amount', 'Risk Level', 'Priority', 'Status', 'Actions'].map((header) => (
                    <th key={header} className="text-left p-4 font-semibold text-gray-700 border-b border-gray-200">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allClaims.map((claim, index) => (
                  <tr key={claim.processingId} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200">
                    <td className="p-4 font-mono text-xs bg-gray-50 rounded-lg mx-2 my-1">
                      {claim.processingId.slice(-8)}
                    </td>
                    <td className="p-4 font-medium">{claim.extractedData.claimantName}</td>
                    <td className="p-4">
                      <span className="capitalize px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {claim.extractedData.claimType}
                      </span>
                    </td>
                    <td className="p-4 font-semibold">{formatCurrency(claim.extractedData.estimatedAmount)}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiskBadgeColor(claim.fraudAssessment.riskLevel)}`}>
                        {claim.fraudAssessment.riskLevel}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityBadgeColor(claim.categorization.priority.level)}`}>
                        {claim.categorization.priority.level}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-200 text-green-800 border border-green-300">
                        {claim.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => setSelectedClaim(claim)}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium hover:bg-blue-50 px-3 py-1 rounded-lg transition-all duration-200"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {allClaims.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">No claims processed yet</p>
            <p className="text-gray-400 text-sm">Use the Process tab to submit your first claim</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-8">
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Analytics Dashboard
          </h2>
        </div>

        {analytics && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { 
                  title: 'Total Claims', 
                  value: analytics.totalClaims, 
                  icon: FileText, 
                  color: 'from-blue-500 to-blue-600',
                  bgColor: 'from-blue-50 to-blue-100'
                },
                { 
                  title: 'Processed Successfully', 
                  value: analytics.successfullyProcessed, 
                  icon: CheckCircle, 
                  color: 'from-green-500 to-green-600',
                  bgColor: 'from-green-50 to-green-100'
                },
                { 
                  title: 'Avg Processing Time', 
                  value: `${(analytics.averageProcessingTime / 1000).toFixed(1)}s`, 
                  icon: Clock, 
                  color: 'from-yellow-500 to-yellow-600',
                  bgColor: 'from-yellow-50 to-yellow-100'
                },
                { 
                  title: 'High Risk Claims', 
                  value: analytics.riskDistribution.high || 0, 
                  icon: AlertCircle, 
                  color: 'from-red-500 to-red-600',
                  bgColor: 'from-red-50 to-red-100'
                }
              ].map(({ title, value, icon: Icon, color, bgColor }) => (
                <div key={title} className={`bg-gradient-to-br ${bgColor} p-6 rounded-xl border border-white/20 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-3 bg-gradient-to-r ${color} rounded-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-700 text-sm mb-1">{title}</h3>
                  <p className="text-3xl font-bold text-gray-900">{value}</p>
                </div>
              ))}
            </div>

            {/* Distribution Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Risk Distribution */}
              <div className="bg-gradient-to-br from-red-50 to-orange-100 p-6 rounded-xl border border-red-200/50">
                <h3 className="font-bold text-red-900 mb-6 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Risk Distribution
                </h3>
                <div className="space-y-4">
                  {Object.entries(analytics.riskDistribution).map(([risk, count]) => {
                    const percentage = analytics.totalClaims > 0 ? (count / analytics.totalClaims * 100).toFixed(1) : 0;
                    return (
                      <div key={risk} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiskBadgeColor(risk)}`}>
                            {risk}
                          </span>
                          <span className="font-bold text-red-900">{count} ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-red-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              risk === 'low' ? 'bg-green-500' :
                              risk === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Claim Types */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-100 p-6 rounded-xl border border-purple-200/50">
                <h3 className="font-bold text-purple-900 mb-6 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Claim Types
                </h3>
                <div className="space-y-4">
                  {Object.entries(analytics.claimTypeDistribution).map(([type, count]) => {
                    const percentage = analytics.totalClaims > 0 ? (count / analytics.totalClaims * 100).toFixed(1) : 0;
                    return (
                      <div key={type} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="capitalize font-medium text-purple-800 px-3 py-1 bg-purple-200 rounded-full text-sm">
                            {type}
                          </span>
                          <span className="font-bold text-purple-900">{count} ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-purple-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Hero Header */}
        <div className={`bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 mb-8 transform transition-all duration-1000 ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl shadow-lg">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                NeuroClaim
              </h1>
              <p className="text-gray-600 text-lg">
                AI-powered intelligent claims processing with advanced fraud detection
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span>Lightning Fast Processing</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span>Advanced Fraud Detection</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-500" />
              <span>Neural Network Analysis</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 mb-8 overflow-hidden">
          <nav className="flex">
            {[
              { id: 'process', label: 'Process Claims', icon: Upload, color: 'blue' },
              { id: 'claims', label: 'Claims Dashboard', icon: FileText, color: 'indigo' },
              { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'emerald' }
            ].map(({ id, label, icon: Icon, color }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-3 px-8 py-6 font-semibold transition-all duration-300 flex-1 ${
                  activeTab === id
                    ? `text-${color}-600 bg-gradient-to-r from-${color}-50 to-${color}-100 border-b-4 border-${color}-500 shadow-lg`
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className={`transform transition-all duration-500 ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          {activeTab === 'process' && renderProcessingTab()}
          {activeTab === 'claims' && renderClaimsTab()}
          {activeTab === 'analytics' && renderAnalyticsTab()}
        </div>

        {/* Claim Detail Modal */}
        {selectedClaim && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20 transform animate-in zoom-in-95 duration-300">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    Claim Details
                  </h2>
                  <button
                    onClick={() => setSelectedClaim(null)}
                    className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
                  >
                    <div className="w-6 h-6 flex items-center justify-center font-bold">✕</div>
                  </button>
                </div>

                <div className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-xl border border-blue-200/50">
                      <h3 className="font-bold text-blue-900 mb-4">Basic Information</h3>
                      <div className="space-y-3 text-sm">
                        {[
                          { label: 'ID', value: selectedClaim.processingId },
                          { label: 'Claimant', value: selectedClaim.extractedData.claimantName },
                          { label: 'Type', value: selectedClaim.extractedData.claimType },
                          { label: 'Amount', value: formatCurrency(selectedClaim.extractedData.estimatedAmount) },
                          { label: 'Processed', value: new Date(selectedClaim.timestamp).toLocaleString() }
                        ].map(({ label, value }) => (
                          <div key={label} className="flex justify-between items-center">
                            <span className="font-medium text-blue-700">{label}:</span>
                            <span className="text-blue-900 font-semibold">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-red-50 to-orange-100 p-6 rounded-xl border border-red-200/50">
                      <h3 className="font-bold text-red-900 mb-4">Assessment Results</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-red-700">Risk Level:</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiskBadgeColor(selectedClaim.fraudAssessment.riskLevel)}`}>
                            {selectedClaim.fraudAssessment.riskLevel}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-red-700">Priority:</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityBadgeColor(selectedClaim.categorization.priority.level)}`}>
                            {selectedClaim.categorization.priority.level}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-red-700">Department:</span>
                          <span className="text-red-900 font-semibold">{selectedClaim.categorization.routing.department}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-red-700">Assignment:</span>
                          <span className="text-red-900 font-semibold">{selectedClaim.categorization.routing.assignmentType}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-xl border border-green-200/50">
                    <h3 className="font-bold text-green-900 mb-4">Summary</h3>
                    <p className="text-sm text-green-800 leading-relaxed">{selectedClaim.summary.executiveSummary}</p>
                  </div>

                  <div className="bg-gradient-to-br from-gray-50 to-slate-100 p-6 rounded-xl border border-gray-200/50">
                    <h3 className="font-bold text-gray-900 mb-4">Original Document</h3>
                    <div className="max-h-48 overflow-y-auto bg-white/50 p-4 rounded-lg border">
                      <pre className="text-xs whitespace-pre-wrap text-gray-700">{selectedClaim.originalDocument}</pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-in {
          animation-fill-mode: both;
        }
        .slide-in-from-bottom {
          animation: slideInFromBottom 0.5s ease-out;
        }
        .zoom-in-95 {
          animation: zoomIn95 0.3s ease-out;
        }
        .fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes slideInFromBottom {
          from {
            opacity: 0;
            transform: translateY(100px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes zoomIn95 {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default ClaimsProcessingDemo;