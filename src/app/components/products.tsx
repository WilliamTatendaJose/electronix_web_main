/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState, useEffect } from 'react';
import { ShoppingCart, X, Plus, Minus, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import circuitboard from "../components/assets/circuitboard.jpg"


interface CartItem {
  mainImage: string;
  id: number;
  name: string;
  condition: string;
  originalPrice: number;
  refurbishedPrice: number;
  sustainabilityImpact: string;
  quantity: number;
}

const RefurbishedElectronics = () => {
  const [success, setSuccess] = useState(false);
  const [successSell, setSuccessSell] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSellForm, setShowSellForm] = useState<boolean>(false);
  const [showCart, setShowCart] = useState(false);

  const [showCheckout, setShowCheckout] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [imageFile, setImageFile] = useState(null)
  const [checkoutData, setCheckoutData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    paymentMethod: 'card',
  });
 
  const [formData, setFormData] = useState({
    deviceType: '',
    model: '',
    condition: '',
    pickupRequired: false,
    address: '',
    description: ''
  });

  const [featuredProducts, setFeaturedProducts] = useState<CartItem[]>([]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setFeaturedProducts(data);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      }
    };

    fetchFeaturedProducts();
  }, []);


  const addToCart = (product: {
      mainImage: string; id: number; name: string; condition: string; originalPrice: number; refurbishedPrice: number; sustainabilityImpact: string; 
}) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1, mainImage: product.mainImage }]);
    }
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCart(cart.map(item => 
      item.id === productId 
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.refurbishedPrice * item.quantity), 0);
  };
  // Helper function to convert a file to base64
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        setImageFile(imageFile);
    }
}


  const handleCheckout = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // Prepare order data
    const orderData = {
      items: cart,
      total: getTotalPrice(),
      customer: checkoutData,
      orderDate: new Date().toISOString()
    };

    try {
      // Send order data to your API endpoint
      const response = await fetch('/api/place-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        // Clear cart and show success message
        setSuccessSell(true);
        setError(null);
        setCart([]);
        setShowCheckout(false);
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
    }
    finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
  e.preventDefault();

  try {
    // Collect form data
    const formDataToSend = {
      deviceType: formData.deviceType,
      model: formData.model,
      condition: formData.condition,
      pickupRequired: formData.pickupRequired,
      address: formData.address,
      description: formData.description,
      image: imageFile, // Image file to be sent to the API
    };

    // Create FormData for image upload if applicable
    if ((formData as any).image) {
      const formData = new FormData();
      formData.append('image', (formData as any).image);
      formData.append('data', JSON.stringify(formDataToSend));

      // Call the API to handle the form submission
      const response = await fetch('/api/sell-device', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Clear cart and show success message
         setSuccess(true);
        setError(null);
        setCart([]);
       
      } else {
        
        const errorMessage = await response.text();
        setError(errorMessage);
      }
    }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
    finally {
      setLoading(false);
    }
};

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Cart Icon */}
      <header className="fixed top-0 right-0 z-50 p-4">
        <button 
          onClick={() => setShowCart(true)}
          className="bg-black text-white p-3 rounded-full relative hover:bg-gray-800 transition duration-300"
        >
          <ShoppingCart size={32
            
          } />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
              {cart.reduce((total, item) => total + item.quantity, 0)}
            </span>
          )}
          cart
        </button>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen">
        <Image src={circuitboard} alt="Electronics repair" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
          <h1 className="text-5xl font-bold mb-4">Sustainable Electronics</h1>
          <p className="text-xl mb-8">Give technology a second life. Save the planet.</p>
          <div className="space-x-4">
            <button 
              onClick={() => setShowSellForm(true)}
              className="bg-white text-black px-8 py-3 rounded-lg hover:bg-gray-200 transition duration-300"
            >
              Sell Your Device
            </button>
            <button 
            onClick={() => {
                const products = document.getElementById('products');
                products?.scrollIntoView({ behavior: 'smooth' });}}

            className="border border-white px-8 py-3 rounded-lg hover:bg-white hover:text-black transition duration-300">
              Shop Refurbished
            </button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {/* Featured Products with Empty State */}
      <section id="products" className="py-16 px-4 bg-black">
        <h2 className="text-4xl font-bold text-center mb-12">Featured Devices</h2>
        
        {featuredProducts.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-gray-900 rounded-lg p-12 flex flex-col items-center">
              <AlertCircle size={48} className="text-gray-200 mb-4" />
              <h3 className="text-2xl font-bold mb-2">No Devices Available</h3>
              <p className="text-gray-200 mb-6">
                Weare currently restocking our inventory with high-quality refurbished devices.
                Check back soon or sell your device to us!
              </p>
              <button 
                onClick={() => setShowSellForm(true)}
                className="bg-white text-black px-8 py-3 rounded-lg hover:bg-gray-400 transition duration-300"
              >
                Sell Your Device
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-gray-900 p-6 rounded-lg">
                <div className="aspect-w-16 aspect-h-9 mb-4">
                  <Image
                    src={product.mainImage}
                    alt={product.name}
                    className="rounded-lg object-cover"
                    width={400}
                    height={400}
                  />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-gray-200">{product.name}</h3>
                <p className="text-gray-400 mb-2">Condition: {product.condition}</p>
                <p className="text-lg mb-1">
                  <span className="line-through text-gray-400">${product.originalPrice}</span>
                  <span className="text-2xl font-bold ml-2">${product.refurbishedPrice}</span>
                </p>
                <p className="text-green-600 mb-4">{product.sustainabilityImpact}</p>
                <button 
                  onClick={() => addToCart(product)}
                  className="w-full bg-white text-black py-2 rounded-lg hover:bg-gray-400 transition duration-300"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-5 z-50 overflow-y-auto">
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-gray-900 p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl text-gray-200 font-bold">Your Cart</h2>
              <button 
                onClick={() => setShowCart(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={24} />
              </button>
            </div>

            {cart.length === 0 ? (
              <p className="text-gray-200 text-center py-8">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-4 mb-8">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-black">{item.name}</h3>
                        <p className="text-gray-800">${item.refurbishedPrice}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-gray-900 hover:bg-gray-200 rounded"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8  text-gray-900 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-gray-900 hover:bg-gray-200 rounded"
                          aria-label="Increase quantity"
                        >
                          <Plus size={16} />
                        </button>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 text-gray-900 hover:bg-gray-200 rounded ml-2"
                          aria-label="Remove from cart"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between mb-4">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold">${getTotalPrice()}</span>
                  </div>
                  <button 
                    onClick={() => {
                      setShowCart(false);
                      setShowCheckout(true);
                    }}
                    className="w-full bg-white text-black py-3 rounded-lg hover:bg-gray-400 transition duration-300"
                  >
                    Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-gray-900 rounded-lg max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Checkout</h2>
              <button 
                onClick={() => setShowCheckout(false)}
                className="p-2 hover:bg-gray-400 rounded-full"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCheckout} className="space-y-6">
                {/* Display cart items */}
                <div>
                    <h3 className="text-xl font-bold mb-4">Order Summary</h3>
                    {cart.map((item) => (
                    <div key={item.id} className="flex justify-between p-4 bg-gray-50 rounded-lg mb-2">
                        <div>
                        <p className="font-medium text-black">{item.name}</p>
                        <p className="text-gray-800">Price: ${item.refurbishedPrice}</p>
                        <p className="text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-bold text-black">${(item.refurbishedPrice * item.quantity).toFixed(2)}</p>
                    </div>
                    ))}
                    <div className="flex justify-between mt-4 border-t pt-4">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold">${getTotalPrice()}</span>
                    </div>
                </div>
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium mb-2">Full Name</label>
                <input 
                  id="fullName"
                  type="text"
                  required
                  className="w-full p-3 border rounded-lg"
                  value={checkoutData.name}
                  onChange={(e) => setCheckoutData({...checkoutData, name: e.target.value})}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                <input 
                  id="email"
                  type="email"
                  required
                  className="w-full p-3 border rounded-lg"
                  value={checkoutData.email}
                  onChange={(e) => setCheckoutData({...checkoutData, email: e.target.value})}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">Phone</label>
                <input 
                  id="phone"
                  type="tel"
                  required
                  className="w-full p-3 border rounded-lg"
                  value={checkoutData.phone}
                  onChange={(e) => setCheckoutData({...checkoutData, phone: e.target.value})}
                />
              </div>

              <div>
                <label htmlFor="shippingAddress" className="block text-sm font-medium mb-2">Shipping Address</label>
                <textarea 
                  id="shippingAddress"
                  required
                  className="w-full p-3 border rounded-lg"
                  rows={3}
                  value={checkoutData.address}
                  onChange={(e) => setCheckoutData({...checkoutData, address: e.target.value})}
                />
              </div>

              <div>
                <label htmlFor="paymentMethod" className="block text-sm font-medium mb-2">Payment Method</label>
                <select 
                  id="paymentMethod"
                  className="w-full text-black p-3 border rounded-lg"
                  value={checkoutData.paymentMethod}
                  onChange={(e) => setCheckoutData({...checkoutData, paymentMethod: e.target.value})}
                >
                  <option value="card">Card</option>
                  <option value="paypal">Cash</option>
                </select>
              </div>

              <div className="border-t pt-4">
                
                <button 
                  type="submit"
                  className="w-full bg-white text-black py-3 rounded-lg hover:bg-gray-400 transition duration-300"
                >
                    {loading ? 'Placing Order...' : ' Place Order'}
                  
                </button>
                {successSell && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mt-6">
              Order Placed Successfully!
            </div>
          )}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-6">
              An error occured please try again later
            </div>
          )}
              </div>
            </form>
          </div>
        </div>
      )}

      
      {/* Sell Form Modal */}
      {showSellForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-gray-900 rounded-lg max-w-2xl w-full p-8">
            <h2 className="text-3xl font-bold mb-6">Sell Your Device</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="deviceType" className="block text-sm font-medium mb-2">Device Type</label>
                <select 
                  id="deviceType"
                  className="w-full text-black p-3 border rounded-lg"
                  value={formData.deviceType}
                  onChange={(e) => setFormData({...formData, deviceType: e.target.value})}
                >
                  <option value="">Select Device Type</option>
                  <option value="smartphone">Smartphone</option>
                  <option value="laptop">Laptop</option>
                  <option value="tablet">Tablet</option>
                  <option value="console">Console</option>
                  <option value="desktop">Desktop</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Model</label>
                <input 
                  type="text"
                  className="w-full text-black p-3 border rounded-lg"
                  placeholder="e.g., iPhone 12 Pro"
                  value={formData.model}
                  onChange={(e) => setFormData({...formData, model: e.target.value})}
                />
              </div>

              <div>
                <label htmlFor="condition" className="block text-sm font-medium mb-2">Condition</label>
                <select 
                  id="condition"
                  className="w-full text-black p-3 border rounded-lg"
                  value={formData.condition}
                  onChange={(e) => setFormData({...formData, condition: e.target.value})}
                >
                  <option value="">Select Condition</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor - Recycle</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox"
                  id="pickup"
                  checked={formData.pickupRequired}
                  onChange={(e) => setFormData({...formData, pickupRequired: e.target.checked})}
                  className="w-4 h-4"
                />
                <label htmlFor="pickup">Request Device Pickup</label>
              </div>

              {formData.pickupRequired && (
                <div>
                  <label htmlFor="pickupAddress" className="block text-sm font-medium mb-2">Pickup Address</label>
                  <textarea 
                    id="pickupAddress"
                    placeholder="Enter pickup address..."
                    className="w-full text-black p-3 border rounded-lg"
                    rows={3}
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Device Description</label>
                <textarea 
                  className="w-full text-black p-3 border rounded-lg"
                  rows={4}
                  placeholder="Please describe any issues or notable features..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div>
                <label htmlFor="deviceImage" className="block text-sm font-medium mb-2">Attach Image of Device</label>
                <input 
                    type="file"
                    id="deviceImage"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full text-gray-200 p-3 border rounded-lg"
                />
                </div>

              <div className="flex space-x-4">
                <button 
                  type="submit"
                  className="flex-1 bg-white  text-black py-3 rounded-lg hover:bg-gray-400 transition duration-300"
                >
                 {loading ? 'Placing Sell Request...' : ' Sell Device'}
                  
                </button>
                 <button 
                  type="button"
                  onClick={() => setShowSellForm(false)}
                  className="flex-1 border border-white py-3 rounded-lg hover:bg-gray-400 transition duration-300"
                >
                  Cancel
                </button>
              
               
              </div>
                {success && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mt-6">
              Request Sent Successfully
            </div>
          )}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-6">
              An error occured please try again later
            </div>
          )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RefurbishedElectronics;
