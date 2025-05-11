const rtoData = {
    'DL': { state: 'Delhi', taxRate: 0.08 },
    'MH': { state: 'Maharashtra', taxRate: 0.09 },
    'KA': { state: 'Karnataka', taxRate: 0.1 },
    'TN': { state: 'Tamil Nadu', taxRate: 0.085 },
    // Add more RTOs as needed
  };
  
  class RTOService {
    static getRTOInfo(registrationNumber) {
      const rtoCode = registrationNumber.substring(0, 2).toUpperCase();
      return rtoData[rtoCode] || { state: 'Unknown', taxRate: 0.1 };
    }
  }
  
  module.exports = RTOService;