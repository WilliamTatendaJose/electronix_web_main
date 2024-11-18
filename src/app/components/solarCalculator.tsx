/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useState } from 'react';

import { Sun, DollarSign, Settings, Battery, Power} from 'lucide-react';
const commonLoads = [
  { name: 'Air Conditioner (1.5 ton)', kwhPerMonth: 360 },
  { name: 'Refrigerator', kwhPerMonth: 150 },
   { name: 'Borehole Pump(1Hp)', kwhPerMonth: 250 },
  { name: 'LED TV (55")', kwhPerMonth: 30 },
  { name: 'Washing Machine', kwhPerMonth: 25 },
  { name: 'Desktop Computer', kwhPerMonth: 45 },
  { name: 'Ceiling Fan', kwhPerMonth: 15 },
  { name: 'Microwave Oven', kwhPerMonth: 20 },
  { name: 'Water Heater', kwhPerMonth: 150 }
];
type PricingTier = 'low' | 'medium' | 'high';

const pricingTiers = {
  low: { costPerWatt: 0.6, label: 'Budget', description: 'Basic components, standard warranty' },
  medium: { costPerWatt: 0.8, label: 'Premium', description: 'Mid-range components, extended warranty' },
  high: { costPerWatt: 1.2, label: 'Elite', description: 'Top-tier components, comprehensive warranty' }
};

// Function to get standard system size
const getStandardSize = (calculatedSize: number) => {
  if (calculatedSize <= 1) return 1;
  if (calculatedSize <= 2) return 2;
  if (calculatedSize <= 3) return 3;
  if (calculatedSize <= 5) return 5;
  if (calculatedSize <= 6.2) return 6.2;
  if (calculatedSize <= 8) return 8;
  if (calculatedSize <= 10) return 10;
  
  // For sizes above 10kW, find the nearest multiple of standard sizes
  const baseSize = calculatedSize > 10 ? 
    (calculatedSize <= 20 ? 10 : 
     calculatedSize <= 31 ? 6.2 : 
     calculatedSize <= 40 ? 8 : 10) : 10;
  
  return Math.ceil(calculatedSize / baseSize) * baseSize;
};

// Function to get battery voltage based on system size
const getBatteryVoltage = (systemSize: number) => {
  if (systemSize <= 1.5) return 12;
  if (systemSize <= 3) return 24;
  return 48;
};

const SolarCalculator = () => {
  const [calculationType, setCalculationType] = useState('manual');
  const [monthlyUsage, setMonthlyUsage] = useState('');
  const [selectedLoads, setSelectedLoads] = useState({});
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [selectedTier, setSelectedTier] = useState<PricingTier>('medium');
  const [systemType, setSystemType] = useState('grid');
   const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const calculateLoadTotal = () => {
    return Object.entries(selectedLoads).reduce((total, [load, quantity]) => {
      const loadItem = commonLoads.find(item => item.name === load);
      return total + ((loadItem?.kwhPerMonth ?? 0) * (quantity as number));
    }, 0);
  };

  const calculateRawSystemSize = () => {
    const usage = calculationType === 'manual' ? Number(monthlyUsage) : calculateLoadTotal();
    if (!usage) return null;

    const dailyUsage = usage / 30;
    const sunHours = 4.5;
    const gridLosses = 1.3; // 30% losses for grid-tied
    const offGridLosses = 1.5; // 50% losses for off-grid (including battery losses)
    
    const rawSize = (dailyUsage / sunHours) * (systemType === 'grid' ? gridLosses : offGridLosses);
    return getStandardSize(rawSize);
  };

  const calculateSystemDetails = () => {
    const systemSize = calculateRawSystemSize();
    if (!systemSize) return null;

    const batteryVoltage = getBatteryVoltage(systemSize);
    const dailyUsage = (calculationType === 'manual' ? Number(monthlyUsage) : calculateLoadTotal()) / 30;
    const daysOfAutonomy = 2; // 2 days of backup
    const depthOfDischarge = 0.9; // Using 50% of battery capacity
    
    // Calculate battery capacity in Ah
    const batteryCapacity = systemType === 'offgrid'
      ? (dailyUsage * 800 * daysOfAutonomy) / (batteryVoltage * depthOfDischarge):((dailyUsage * 200 * daysOfAutonomy) / (batteryVoltage * depthOfDischarge));

    

    return {
      systemSize,
      batteryVoltage,
      batteryCapacity: Math.ceil(batteryCapacity),
      cost: calculateCost(systemSize, batteryCapacity, batteryVoltage)
    };
  };

  const calculateCost = (systemSize: number, batteryCapacity: number, batteryVoltage: number) => {
    if (!systemSize) return null;
    let totalCost = systemSize * 1000 * pricingTiers[selectedTier].costPerWatt;
    
    // Add battery cost for off-grid systems
    if (systemType === 'offgrid') {
      const batteryCostPerAh = {
        12: 3, // $3 per Ah for 12V
        24: 2.5, // $2.50 per Ah for 24V
        48: 2 // $2 per Ah for 48V
      }[batteryVoltage] ?? 0;
      
      totalCost += batteryCapacity * batteryCostPerAh;
  

    }
    
     
    
    return Math.round(totalCost);
  };

  const systemDetails = calculateSystemDetails();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/send-quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userDetails: formData,
          systemDetails: {
            systemSize: systemDetails?.systemSize,
            batteryCapacity: systemDetails?.batteryCapacity,
            batteryVoltage: systemDetails?.batteryVoltage,
            cost: systemDetails?.cost,
            systemType,
            selectedTier
          }
        }),
      });

      if (response.ok) {
         setSuccess(true);
        setError(null);
    
        setShowQuoteForm(false);
        setFormData({ name: '', email: '', phone: '' });
      } else {
        const errorMessage = await response.text();
        setError(errorMessage);
      }
   } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black max-w-7xl mx-auto p-6">
       <div className="mb-8  text-center">
        <h2 className="text-2xl mt-10 font-bold mb-3">Why Choose Solar Energy?</h2>
        <p className="text-gray-200 max-w-3xl mx-auto">
          Harness the power of the sun to reduce your carbon footprint and save on energy costs. 
          Solar energy provides clean, renewable power while increasing your property value and 
          offering energy independence. Calculate your solar needs below and take the first step 
          towards a sustainable future.
        </p>
      </div>

     <div className="flex flex-col lg:flex-row gap-8">
        {/* Video Section - Full width on mobile, half on desktop */}
        <div className="lg:w-1/2 h-[400px] relative rounded-lg overflow-hidden bg-gray-100">
          <video autoPlay loop muted className="absolute inset-0 w-full h-full object-cover">
            <source src="/solar.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Calculator Section */}
        <div className="lg:w-1/2 bg-gray-900 rounded-lg shadow-lg p-6">
          <h1 className="text-3xl text-white font-bold mb-6 text-center">Solar System Calculator</h1>
          
          {/* System Type Selection */}
          <div className="flex gap-4 mb-6">
            <button
              className={`flex-1 p-3 rounded-lg flex items-center justify-center gap-2 ${
                systemType === 'grid' ? 'bg-green-500 text-white' : 'bg-gray-300'
              }`}
              onClick={() => setSystemType('grid')}
            >
              <Power size={20} />
              Grid-Supported
            </button>
            <button
              className={`flex-1 p-3 rounded-lg flex items-center justify-center gap-2 ${
                systemType === 'offgrid' ? 'bg-green-500 text-white' : 'bg-gray-300'
              }`}
              onClick={() => setSystemType('offgrid')}
            >
              <Battery size={20} />
              Off-Grid
            </button>
          </div>

          {/* Input Type Selection */}
          <div className="flex gap-4 mb-6">
            <button
              className={`flex-1 p-3 rounded-lg flex items-center justify-center gap-2 ${
                calculationType === 'manual' ? 'bg-green-500 text-white' : 'bg-gray-300'
              }`}
              onClick={() => setCalculationType('manual')}
            >
              <Sun size={20} />
              Manual Input
            </button>
            <button
              className={`flex-1 p-3 rounded-lg flex items-center justify-center gap-2 ${
                calculationType === 'loads' ? 'bg-green-500 text-white' : 'bg-gray-300'
              }`}
              onClick={() => setCalculationType('loads')}
            >
              <Settings size={20} />
              Select Loads
            </button>
          </div>

          {calculationType === 'manual' && (
            <div className="mb-6">
              <label className="block mb-2 text-lg text-gray-200">Monthly Electricity Usage (kWh)</label>
              <input
                type="number"
                value={monthlyUsage}
                onChange={(e) => setMonthlyUsage(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black text-black"
                placeholder="Enter your monthly usage in kWh"
              />
            </div>
          )}

          {calculationType === 'loads' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 max-h-64 overflow-y-auto">
              {commonLoads.map((load) => (
                <div key={load.name} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span>{load.name}</span>
                    <span className="text-sm text-gray-300">{load.kwhPerMonth} kWh/month</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={selectedLoads[load.name as keyof typeof selectedLoads] || ''}
                    onChange={(e) => setSelectedLoads({
                      ...selectedLoads,
                      [load.name]: Number(e.target.value)
                    })}
                    className="w-full p-2 border rounded text-black"
                    placeholder="Quantity"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Pricing Tier Selection */}
          {systemDetails && (
            <div className="mb-6">
              <label className="block mb-2 text-lg">Select System Quality</label>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(pricingTiers).map(([tier, { label, description }]) => (
                  <button
                    key={tier}
                    onClick={() => setSelectedTier(tier as PricingTier)}
                    className={`p-3 rounded-lg text-center ${
                      selectedTier === tier ? 'bg-green-500 text-white' : 'bg-gray-300'
                    }`}
                  >
                    <div className="font-bold">{label}</div>
                    <div className="text-xs mt-1">{description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results Section */}
          {systemDetails && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Sun size={24} className="text-yellow-500" />
                  </div>
                  <div className="text-3xl text-black font-bold mb-1">{systemDetails.systemSize} kW</div>
                  <div className="text-gray-600">System Size</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <DollarSign size={24} className="text-green-500" />
                  </div>
                  <div className="text-3xl text-black font-bold mb-1">${systemDetails.cost}</div>
                  <div className="text-gray-600">Estimated Cost</div>
                </div>
                
                  <div className="text-center col-span-2">
                    <div className="flex items-center justify-center mb-2">
                      <Battery size={24} className="text-blue-500" />
                    </div>
                    <div className="text-3xl text-black font-bold mb-1">{systemDetails.batteryCapacity} Ah</div>
                    <div className="text-gray-600">{systemDetails.batteryVoltage} V</div>
                  </div>
               
              </div>
            </div>
          )}

          {/* Quote Form */}
          {systemDetails && !showQuoteForm ? (
            <button
              onClick={() => setShowQuoteForm(true)}
              className="w-full p-4 bg-white text-black rounded-lg hover:bg-gray-300 transition-colors"
            >
              Get a Quote
            </button>
          ) : showQuoteForm && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  placeholder="Your email"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  placeholder="Your phone number"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full p-4 bg-white text-black rounded-lg hover:bg-gray-300 transition-colors"
                disabled={loading}
              >
                {loading ? 'Sending...' : ' Submit Quote Request'}
               
              </button>
              {success && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mt-6">
              Message sent successfully!
            </div>
          )}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-6">
              An error occured please try again later
            </div>
          )}
            </form>
            
            
          )}
        </div>
      </div>
    </div>
  );
};

export default SolarCalculator;

function setSuccess(arg0: boolean) {
  throw new Error('Function not implemented.');
}
function setError(arg0: null) {
  throw new Error('Function not implemented.');
}

