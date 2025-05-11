const InsuranceCalculator = require('../../Services/insuranceCalculator');
const RTOService = require('../../Services/rtoService');
const CarBrand = require('../../models/CarInsurance/CarBrand');
const CarModel = require('../../models/CarInsurance/CarModel');
const InsuranceCompany = require('../../models/CarInsurance/InsuranceCompany');

exports.getAllCarBrands = async (req, res) => {
  try {
    const brands = await CarBrand.find().sort({ popularity: -1 });
    res.json({
      success: true,
      data: brands,
      message: 'Car brands fetched successfully'
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: 'Server error fetching car brands' 
    });
  }
};

exports.getCarModelsByBrand = async (req, res) => {
  try {
    const brand = await CarBrand.findOne({ name: req.params.brandName });
    if (!brand) {
      return res.status(404).json({ 
        success: false,
        error: 'Brand not found' 
      });
    }
    
    const models = await CarModel.find({ brand: brand._id });
    res.json({
      success: true,
      data: models,
      message: 'Car models fetched successfully'
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: 'Server error fetching car models' 
    });
  }
};

exports.calculateCarQuote = async (req, res) => {
  try {
    const { registrationNumber, brand, model, city, purchaseYear } = req.body;
    
    if (!registrationNumber || !brand || !city || !purchaseYear) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required fields' 
      });
    }

    const carModel = await CarModel.findOne({ 
      brand, 
      name: model 
    }).populate('brand');
    
    if (!carModel) {
      return res.status(404).json({ 
        success: false,
        error: 'Car model not found' 
      });
    }

    const rtoInfo = RTOService.getRTOInfo(registrationNumber);
    const companies = await InsuranceCompany.find();
    
    const quotes = companies.map(company => {
      const idv = InsuranceCalculator.calculateIDV(carModel, purchaseYear);
      
      return {
        company: {
          id: company._id,
          name: company.name,
          logo: company.logo,
          claimSettlementRatio: company.claimSettlementRatio,
          networkGarages: company.networkGarages,
          rating: company.rating
        },
        premiums: {
          comprehensive: InsuranceCalculator.calculateComprehensivePremium(company, idv, city),
          thirdParty: InsuranceCalculator.calculateThirdPartyPremium(company, 1200),
          ownDamage: InsuranceCalculator.calculateOwnDamagePremium(idv, new Date().getFullYear() - purchaseYear)
        },
        idv,
        addOns: []
      };
    });

    res.json({
      success: true,
      data: {
        quotes,
        rtoInfo,
        vehicleDetails: {
          brand: carModel.brand.name,
          model: carModel.name,
          fuelType: carModel.fuelType,
          segment: carModel.segment
        }
      },
      message: 'Quote calculated successfully'
    });
    
  } catch (err) {
    console.error('Quote calculation error:', err);
    res.status(500).json({ 
      success: false,
      error: 'Server error during quote calculation' 
    });
  }
};