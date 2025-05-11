class InsuranceCalculator {
    static calculateIDV(vehicleModel, purchaseYear) {
      const currentYear = new Date().getFullYear();
      const age = currentYear - purchaseYear;
      let depreciationRate = 0;
      
      // Depreciation rates as per IRDAI guidelines
      if (age === 0) depreciationRate = 0;
      else if (age === 1) depreciationRate = 0.15;
      else if (age === 2) depreciationRate = 0.20;
      else if (age === 3) depreciationRate = 0.30;
      else if (age === 4) depreciationRate = 0.40;
      else depreciationRate = 0.50;
      
      const baseValue = this.getBaseValue(vehicleModel);
      return Math.round(baseValue * (1 - depreciationRate) * vehicleModel.idvMultiplier);
    }
  
    static getBaseValue(vehicleModel) {
      // In real app, this would come from vehicle model data
      const segmentBase = {
        'Hatchback': 500000,
        'Sedan': 800000,
        'SUV': 1000000,
        'MUV': 900000,
        'Luxury': 2000000
      };
      return segmentBase[vehicleModel.segment] || 600000;
    }
  
    static calculateComprehensivePremium(company, idv, city, ncb = 0) {
      // Base rate + IDV percentage + city risk factor - NCB discount
      const baseRate = 2000;
      const idvPercentage = idv * 0.02;
      const cityRiskFactor = this.getCityRiskFactor(city);
      const discount = company.comprehensiveDiscount + ncb;
      
      return Math.round((baseRate + idvPercentage) * cityRiskFactor * (1 - discount/100));
    }
  
    static getCityRiskFactor(city) {
      const highRiskCities = ['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad'];
      return highRiskCities.includes(city) ? 1.2 : 1;
    }
  
    static calculateThirdPartyPremium(company, engineCC) {
      if (engineCC < 1000) return company.thirdPartyPremium.below1000;
      if (engineCC < 1500) return company.thirdPartyPremium.below1500;
      return company.thirdPartyPremium.above1500;
    }
  
    static calculateOwnDamagePremium(idv, age) {
      // Simplified calculation based on IDV and vehicle age
      return Math.round(idv * 0.03 * (1 - (age * 0.05)));
    }
  }
  
  module.exports = InsuranceCalculator;