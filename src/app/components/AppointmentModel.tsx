"use client"
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AppointmentModalProps {
  trigger: React.ReactNode;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({ trigger }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess]= useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    service: '',
    serviceType: '',
    description: '',
    serviceLocation: '',
    date: '',
    time: '',
  });

  const services = [
    { id: 'electronics', name: 'Electronics Repair' },
    { id: 'solar', name: 'Solar Installation' },
    { id: 'maintenance', name: 'System Maintenance' },
     { id: 'software', name: 'Sofware Development' },
     { id: 'design', name: 'Custom System Development' },
  ];

  const serviceTypes = {
    electronics: ['Phone Repair', 'Computer Repair', 'TV or Monitor Repair','Smart Board Repair', 'Gaming Cnsole repair', 'Other Electronics Repair'],
    solar: ['New Installation', 'System Upgrade', 'Maintenance','Troubleshooting'],
    maintenance: ['Regular Service', 'System Inspection', 'Emergency Repair'],
    software: ['Web Development', 'Mobile Application Development', 'Other'],
    design : ['PCB Design','Custom System Design','Other'],
  };

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess(false);
    setLoading(true);
    setError(null);
    try{
        const response= await fetch('/api/schedule',{
            method: 'POST',
            headers:{
                'Content-Type':'application/json'

            },
            body:JSON.stringify( formData)

        });
         if (response.ok) {
         setSuccess(true);
        setError(null);
        setIsOpen(false);
        resetForm();

      } else {
        const errorMessage = await response.text();
        setError(errorMessage);
      }
    }
    catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
   
  };

  const resetForm = () => {
    setStep(1);
    setFormData({
        name:'',
        email:'',
        address :'',
        phone:'',
        service: '',
      serviceType: '',
      description: '',
      serviceLocation: '',
      date: '',
      time: '',
    });
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 ">
            {/* Service and Type Selection */}
            <Select
              onValueChange={(value) => {
                updateFormData('service', value);
                updateFormData('serviceType', '');
              }}
              value={formData.service}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {formData.service && (
              <Select
                onValueChange={(value) => updateFormData('serviceType', value)}
                value={formData.serviceType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Service Type" />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes[formData.service as keyof typeof serviceTypes].map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
        <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                className="w-full p-2 border rounded-lg bg-white/5 min-h-[100px]"
                placeholder="Please describe your issue or requirements"
                onChange={(e) => updateFormData('description', e.target.value)}
                value={formData.description}
              />
            </div>

          </div>
          
        );
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                className="w-full p-2 rounded-lg bg-white/5"
                onChange={(e) => updateFormData('name', e.target.value)}
                value={formData.name}
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                className="w-full p-2 rounded-lg bg-white/5"
                onChange={(e) => updateFormData('email', e.target.value)}
                value={formData.email}
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input
                type="tel"
                className="w-full p-2 rounded-lg bg-white/5"
                onChange={(e) => updateFormData('phone', e.target.value)}
                value={formData.phone}
                placeholder="Enter your phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Address</label>
              <input
                type="text"
                className="w-full p-2 rounded-lg bg-white/5"
                onChange={(e) => updateFormData('address', e.target.value)}
                value={formData.address}
                placeholder="Enter your address"
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Service Location
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className={`p-4 rounded-lg border ${
                    formData.serviceLocation === 'office'
                      ? 'bg-blue-950 text-white'
                      : 'bg-white/5'
                  }`}
                  onClick={() => updateFormData('serviceLocation', 'office')}
                >
                  Visit Our Office
                </button>
                <button
                  type="button"
                  className={`p-4 rounded-lg border ${
                    formData.serviceLocation === 'doorstep'
                      ? 'bg-blue-950 text-white'
                      : 'bg-white/5'
                  }`}
                  onClick={() => updateFormData('serviceLocation', 'doorstep')}
                >
                  Door to Door Service
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Select Date
              </label>
              <input
                type="date"
                className="w-full p-2 rounded-lg bg-white/5"
                onChange={(e) => updateFormData('date', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                placeholder="Select Date"
                value={formData.date}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Select Time
              </label>
              <Select 
                onValueChange={(value) => updateFormData('time', value)}
                value={formData.time}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose time slot" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Appointment Summary</h3>
            <div className="space-y-4">
              <p><span className="font-medium">Service:</span> {services.find(s => s.id === formData.service)?.name}</p>
              <p><span className="font-medium">Type:</span> {formData.serviceType}</p>
              <p><span className="font-medium">Description:</span> {formData.description}</p>
              <p><span className="font-medium">Location:</span> {formData.serviceLocation === 'office' ? 'Office Visit' : 'Door to Door Service'}</p>
              <p><span className="font-medium">Date:</span> {formData.date}</p>
              <p><span className="font-medium">Time:</span> {formData.time}</p>
              <p><span className="font-medium">Name:</span> {formData.name}</p>
              <p><span className="font-medium">Email:</span> {formData.email}</p>
              <p><span className="font-medium">Phone:</span> {formData.phone}</p>
              <p><span className="font-medium">Address:</span> {formData.address}</p>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <Card>
          <CardHeader>
            <CardTitle>Schedule Appointment</CardTitle>
            <CardDescription>Book your service</CardDescription>
          </CardHeader>
          <CardContent>
           <form onSubmit={handleSubmit} className="space-y-8 px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8 flex-wrap">
                      {[1, 2, 3,4].map((stepNumber) => (
                        <div
                          key={stepNumber}
                          className="flex items-center mb-2"
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              step >= stepNumber ? 'bg-blue-950 text-white' : 'bg-gray-200'
                            }`}
                          >
                            {stepNumber}
                          </div>
                          {stepNumber < 5 && (
                            <div
                              className={`w-24 h-1 ${
                                step > stepNumber ? 'bg-blue-950' : 'bg-gray-200'
                              }`}
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    {renderStep()}

                    <div className="flex flex-col sm:flex-row justify-between mt-8">
                      {step > 1 && (
                        <button
                          type="button"
                          onClick={() => setStep(step - 1)}
                          className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors mb-2 sm:mb-0"
                        >
                          Previous
                        </button>
                      )}
                      {step < 4? (
                        <button
                          type="button"
                          onClick={() => setStep(step + 1)}
                          className="px-6 py-2 rounded-lg bg-blue-950 text-white hover:bg-blue-900 transition-colors ml-auto"
                        >
                          Continue
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className="px-6 py-2 rounded-lg bg-blue-950 text-white hover:bg-blue-900 transition-colors ml-auto"
                          disabled={loading}
                        >
                            {loading ? 'Scheduling...' : ' Schedule Appointment'}
                        </button>
                      )}
                    </div>
                    {success && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mt-6">
              Scheduling request sent successfully!
            </div>
          )}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-6">
              An error occured please try again later
            </div>
          )}
                  </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentModal;