// backend/seed.js

// Load environment variables
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const connectDB = require('./config/database'); // Shared DB connection function
const Advisor = require('./models/Advisor');
const Policy = require('./models/Policy');
const HealthInsurancePlan = require('./models/HealthInsurancePlan');
const BikeInsurancePlan = require('./models/BikeInsurancePlan');
const CarInsurancePlan = require('./models/CarInsurancePlan')
const TermInsurancePlan = require('./models/TermInsurnace');


// Ensure Mongo URI is available
const MONGO_URI = process.env.MONGO_URL;
if (!MONGO_URI) {
  console.error('❌ Error: MONGO_URI is not defined in .env file');
  process.exit(1);
}

// Seed Data
const seedInsuranceData = async () => {
  try {
    // Connect to the DB
    await connectDB();

    // Optional: clear existing data before seeding
    await Advisor.deleteMany({});
    await Policy.deleteMany({});
    await HealthInsurancePlan.deleteMany({});
    await BikeInsurancePlan.deleteMany({});
    await CarInsurancePlan.deleteMany({}); // Clear existing car insurance data


    // Advisors to Seed
    const advisors = [
      {
        name: 'Rahul Sharma',
        email: 'rahul.sharma@example.com',
        phone: '9876543210',
        specialization: 'Health Insurance',
        City: 'Mumbai',
        yearsOfExperience: 8,
        profilePhoto: 'https://randomuser.me/api/portraits/men/1.jpg',
      },
      {
        name: 'Priya Patel',
        email: 'priya.patel@example.com',
        phone: '8765432109',
        specialization: 'Life Insurance',
        City: 'Delhi',
        yearsOfExperience: 5,
        profilePhoto: 'https://randomuser.me/api/portraits/women/1.jpg',
      },
      {
        name: 'Amit Singh',
        email: 'amit.singh@example.com',
        phone: '7654321098',
        specialization: 'Car Insurance',
        City: 'Bangalore',
        yearsOfExperience: 7,
        profilePhoto: 'https://randomuser.me/api/portraits/men/2.jpg',
      },
      {
        name: 'Neha Gupta',
        email: 'neha.gupta@example.com',
        phone: '6543210987',
        specialization: 'Bike Insurance',
        City: 'Hyderabad',
        yearsOfExperience: 4,
        profilePhoto: 'https://randomuser.me/api/portraits/women/2.jpg',
      },
      {
        name: 'Vikram Joshi',
        email: 'vikram.joshi@example.com',
        phone: '5432109876',
        specialization: 'Term Insurance',
        City: 'Mumbai',
        yearsOfExperience: 10,
        profilePhoto: 'https://randomuser.me/api/portraits/men/3.jpg',
      },
    ];


    // Health Insurance Plans to Seed
    const healthPlans = [
      {
        insurer: 'Star Health',
        planName: 'Star Comprehensive',
        logo: 'https://www.insurancedekho.com/images/insurer/star-health.png',
        coverAmount: '5 Lakhs',
        cashlessHospitals: 10000,
        claimSettled: '97%',
        features: [
          'Room rent limit: 1% of sum insured',
          'Pre-existing disease cover after 2 years',
          'Restoration of sum insured once exhausted',
        ],
        addons: 3,
        discount: '15% Off',
        monthlyPremium: '₹1,200',
        yearlyPremium: '₹12,000',
      },
      {
        insurer: 'HDFC Ergo',
        planName: 'Health Suraksha',
        logo: 'https://www.insurancedekho.com/images/insurer/hdfc-ergo.png',
        coverAmount: '10 Lakhs',
        cashlessHospitals: 8500,
        claimSettled: '96%',
        features: [
          'No room rent limit',
          'Pre-existing disease cover after 3 years',
          'Maternity cover available',
        ],
        addons: 5,
        discount: '10% Off',
        monthlyPremium: '₹1,800',
        yearlyPremium: '₹18,000',
      },
      {
        insurer: 'ICICI Lombard',
        planName: 'Complete Health',
        logo: 'https://www.insurancedekho.com/images/insurer/icici-lombard.png',
        coverAmount: '7.5 Lakhs',
        cashlessHospitals: 7500,
        claimSettled: '95%',
        features: [
          'Day care procedures covered',
          'Pre-existing disease cover after 4 years',
          'Alternative treatments covered',
        ],
        addons: 4,
        discount: '12% Off',
        monthlyPremium: '₹1,500',
        yearlyPremium: '₹15,000',
      },
      {
        insurer: 'Max Bupa',
        planName: 'Health Companion',
        logo: 'https://www.insurancedekho.com/images/insurer/max-bupa.png',
        coverAmount: '15 Lakhs',
        cashlessHospitals: 6500,
        claimSettled: '94%',
        features: [
          'No claim bonus up to 100%',
          'Pre-existing disease cover after 1 year',
          'Global coverage available',
        ],
        addons: 2,
        discount: '20% Off',
        monthlyPremium: '₹2,500',
        yearlyPremium: '₹25,000',
      },
      {
        insurer: 'Care Health',
        planName: 'Care Freedom',
        logo: 'https://www.insurancedekho.com/images/insurer/care-health.png',
        coverAmount: '20 Lakhs',
        cashlessHospitals: 9500,
        claimSettled: '98%',
        features: [
          'Unlimited automatic recharge',
          'Pre-existing disease cover from day 1',
          'OPD cover available',
        ],
        addons: 6,
        discount: '25% Off',
        monthlyPremium: '₹3,000',
        yearlyPremium: '₹30,000',
      },
    ];

    const bikePlans = [
  {
    insurer: 'HDFC Ergo',
    planName: 'Bike Comprehensive Plus',
    logo: 'https://staticimg.insurancedekho.com/seo/insurer/hdfc-ergo.jpg',
    coverageAmount: 'Up to ₹2 Lakhs',
    cashlessGarages: 8000,
    claimSettled: '100%',
    features: [
      '8000+ Cashless Garages',
      '100% Claims Settled',
      'Unlimited Zero Dep. Claims'
    ],
    keyFeatures: [
      'Maximum Cashless Garages',
      'Over Night Vehicle Repairs',
      '24x7 Roadside Assistance',
      'Quick Claim Settlement'
    ],
    price: '₹2881',
    planType: 'Comprehensive',
    discount: '15% Off'
  },
  {
    insurer: 'United India',
    planName: 'Bike Secure',
    logo: 'https://staticimg.insurancedekho.com/seo/insurer/united-india.png',
    coverageAmount: 'Up to ₹1.5 Lakhs',
    cashlessGarages: 3100,
    claimSettled: '95%',
    features: [
      '3100 Cashless Garages',
      '95% Claims Settled',
      'Unlimited Comprehensive Claims'
    ],
    keyFeatures: [
      'Towing Assistance (For Accidents)',
      'Coverage Outside India',
      'PSU Provider',
      'Quick Claim Settlement'
    ],
    price: '₹2396',
    planType: 'Comprehensive',
    discount: '10% Off'
  },
  {
    insurer: 'ICICI Lombard',
    planName: 'Third Party Protect',
    logo: 'https://staticimg.insurancedekho.com/seo/insurer/icici-lombard.jpg',
    coverageAmount: 'Third Party Liability',
    cashlessGarages: 5000,
    claimSettled: '98%',
    features: [
      '5000+ Cashless Garages',
      '98% Claims Settled',
      'Mandatory Coverage'
    ],
    keyFeatures: [
      'Third Party Liability Cover',
      'Personal Accident Cover',
      'Quick Claim Settlement'
    ],
    price: '₹1200',
    planType: 'Third Party',
    discount: '5% Off'
  },
  {
    insurer: 'Bajaj Allianz',
    planName: 'Own Damage Shield',
    logo: 'https://staticimg.insurancedekho.com/seo/insurer/bajaj-allianz.jpg',
    coverageAmount: 'Up to ₹1.75 Lakhs',
    cashlessGarages: 6500,
    claimSettled: '97%',
    features: [
      '6500+ Cashless Garages',
      '97% Claims Settled',
      'Own Damage Protection'
    ],
    keyFeatures: [
      'Own Damage Coverage',
      'Theft Protection',
      'Natural Calamity Cover'
    ],
    price: '₹2100',
    planType: 'Own Damage',
    discount: '12% Off'
  },
  {
    insurer: 'New India Assurance',
    planName: 'Complete Bike Cover',
    logo: 'https://staticimg.insurancedekho.com/seo/insurer/new-india.jpg',
    coverageAmount: 'Up to ₹2.5 Lakhs',
    cashlessGarages: 7500,
    claimSettled: '99%',
    features: [
      '7500+ Cashless Garages',
      '99% Claims Settled',
      'Comprehensive Protection'
    ],
    keyFeatures: [
      'Zero Depreciation Cover',
      'Engine Protection',
      '24x7 Roadside Assistance'
    ],
    price: '₹3500',
    planType: 'Comprehensive',
    discount: '20% Off'
  }
];

const carPlans = [
      {
        insurer: 'HDFC Ergo',
        planName: 'Comprehensive Car Protect',
        logo: 'https://staticimg.insurancedekho.com/seo/insurer/hdfc-ergo.jpg',
        coverageAmount: 'Up to ₹15 Lakhs',
        cashlessGarages: 8500,
        claimSettled: '98%',
        features: [
          'Zero Depreciation Cover',
          'Engine Protection',
          '24x7 Roadside Assistance'
        ],
        keyFeatures: [
          '8500+ Cashless Garages',
          '98% Claim Settlement Ratio',
          'Quick Claim Processing'
        ],
        price: '₹12,500',
        planType: 'Comprehensive',
        discount: '15% Off'
      },
      {
        insurer: 'ICICI Lombard',
        planName: 'Third Party Liability',
        logo: 'https://staticimg.insurancedekho.com/seo/insurer/icici-lombard.jpg',
        coverageAmount: 'Third Party Cover',
        cashlessGarages: 5000,
        claimSettled: '95%',
        features: [
          'Mandatory Liability Cover',
          'Personal Accident Cover',
          'Property Damage Protection'
        ],
        keyFeatures: [
          'Legal Compliance',
          'Affordable Premium',
          'Wide Garage Network'
        ],
        price: '₹2,100',
        planType: 'Third Party',
        discount: '5% Off'
      },
      {
        insurer: 'Bajaj Allianz',
        planName: 'Zero Depreciation Shield',
        logo: 'https://staticimg.insurancedekho.com/seo/insurer/bajaj-allianz.jpg',
        coverageAmount: 'Up to ₹10 Lakhs',
        cashlessGarages: 7000,
        claimSettled: '97%',
        features: [
          'Zero Depreciation Benefit',
          'Return to Invoice',
          'Key Replacement Cover'
        ],
        keyFeatures: [
          'No Depreciation Deduction',
          '24/7 Claim Support',
          'Quick Turnaround Time'
        ],
        price: '₹9,800',
        planType: 'Comprehensive',
        discount: '10% Off'
      },
      {
        insurer: 'New India Assurance',
        planName: 'Standalone Own Damage',
        logo: 'https://staticimg.insurancedekho.com/seo/insurer/new-india.jpg',
        coverageAmount: 'Up to ₹12 Lakhs',
        cashlessGarages: 6000,
        claimSettled: '96%',
        features: [
          'Own Damage Protection',
          'Theft Coverage',
          'Natural Calamity Cover'
        ],
        keyFeatures: [
          'No Third-Party Liability',
          'Flexible Add-ons',
          'Trusted PSU Insurer'
        ],
        price: '₹7,200',
        planType: 'Own Damage',
        discount: '12% Off'
      },
      {
        insurer: 'Tata AIG',
        planName: 'Premium Car Secure',
        logo: 'https://staticimg.insurancedekho.com/seo/insurer/tata-aig.jpg',
        coverageAmount: 'Up to ₹20 Lakhs',
        cashlessGarages: 9000,
        claimSettled: '99%',
        features: [
          'Engine Protect',
          'Consumables Cover',
          'NCB Protection'
        ],
        keyFeatures: [
          'Luxury Car Special',
          'Fastest Claims',
          'Global Coverage'
        ],
        price: '₹18,500',
        planType: 'Comprehensive',
        discount: '20% Off'
      }
    ];

    const termPlans = [
  {
    insurer: 'Bandhan Life',
    planName: 'iTerm Comfort',
    logo: 'https://ins-common-logos-prod.s3.ap-south-1.amazonaws.com/brokerage/logo/life/bandhan_life_logo.jpg',
    lifeCover: '25 L',
    coverUpto: '50 Years',
    claimSettled: '99.7%',
    features: [
      'Life Cover',
      'Critical Illness Rider available',
      'Accidental Death Benefit'
    ],
    benefits: [
      'Zero cost plan',
      'No Income Proof required',
      'Flexible premium payment options'
    ],
    freeAddons: 1,
    paidAddons: 1,
    monthlyPremium: '₹395',
    yearlyPremium: '₹4,740',
    discount: '10% Off',
    zeroCostPlan: true,
    noIncomeProof: true
  },
  {
    insurer: 'LIC',
    planName: 'New Jeevan Amar',
    logo: 'https://ins-common-logos-prod.s3.amazonaws.com/brokerage/logo/life/lic/FULL%20lic-logo-png-transparent%201.png',
    lifeCover: '25 L',
    coverUpto: '50 Years',
    claimSettled: '98.35%',
    features: [
      'Life Cover',
      'Option to increase cover',
      'Return of premium option available'
    ],
    benefits: [
      'Trusted PSU insurer',
      'High claim settlement ratio',
      'Long term coverage options'
    ],
    freeAddons: 1,
    paidAddons: 1,
    monthlyPremium: '₹541',
    yearlyPremium: '₹6,490',
    discount: '5% Off'
  },
  {
    insurer: 'Bajaj Allianz',
    planName: 'Flexi Term',
    logo: 'https://ins-common-logos-prod.s3.ap-south-1.amazonaws.com/brokerage/logo/life/baxa.jpg',
    lifeCover: '25 L',
    coverUpto: '50 Yrs',
    claimSettled: '99.70%',
    features: [
      'Life Cover',
      'Flexible premium payment terms',
      'Option to increase cover'
    ],
    benefits: [
      'High claim settlement ratio',
      'Option to add riders',
      'Online purchase available'
    ],
    freeAddons: 1,
    paidAddons: 2,
    monthlyPremium: '₹420',
    yearlyPremium: '₹5,040',
    discount: '12% Off'
  },
  {
    insurer: 'HDFC Life',
    planName: 'Click 2 Protect Life',
    logo: 'https://static.insurancedekho.com/pwa/img/banner/hdfc.png',
    lifeCover: '25 L',
    coverUpto: '50 Years',
    claimSettled: '98.5%',
    features: [
      'Life Cover',
      'Increasing cover option',
      'Critical illness rider available'
    ],
    benefits: [
      'Instant policy issuance',
      'No medical tests for some cases',
      'Online purchase process'
    ],
    freeAddons: 2,
    paidAddons: 2,
    monthlyPremium: '₹480',
    yearlyPremium: '₹5,760',
    discount: '15% Off'
  },
  {
    insurer: 'ICICI Pru',
    planName: 'iProtect Smart',
    logo: 'https://static.insurancedekho.com/pwa/img/banner/icici.png',
    lifeCover: '25 L',
    coverUpto: '50 Years',
    claimSettled: '98.9%',
    features: [
      'Life Cover',
      'Option to return premium',
      'Multiple rider options'
    ],
    benefits: [
      'Flexible payment options',
      'High sum assured options',
      'Quick claim settlement'
    ],
    freeAddons: 1,
    paidAddons: 3,
    monthlyPremium: '₹510',
    yearlyPremium: '₹6,120',
    discount: '8% Off'
  }
];



    // Insert data into the database
    await Advisor.insertMany(advisors);
    await HealthInsurancePlan.insertMany(healthPlans);
    await BikeInsurancePlan.insertMany(bikePlans);
     await CarInsurancePlan.insertMany(carPlans);
     await TermInsurancePlan.insertMany(termPlans);

    console.log('✅ Database seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding database:', err);
    process.exit(1);
  }
};

// Run the seed function
seedInsuranceData();
