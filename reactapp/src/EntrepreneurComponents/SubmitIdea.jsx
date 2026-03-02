import React, { useState } from 'react';

const SubmitIdea = () => {
  const [formData, setFormData] = useState({
    marketPotential: '',
    launchYear: '',
    fundingRequired: '',
    address: '',
    pitchDeck: null,
  });

  const [errors, setErrors] = useState({});

  const handleLogout = () => {
    console.log("Logout clicked");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.marketPotential) newErrors.marketPotential = 'Market Potential is required';
    if (!formData.launchYear) newErrors.launchYear = 'Launch Year is required';
    if (!formData.fundingRequired) newErrors.fundingRequired = 'Funding Required is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.pitchDeck) newErrors.pitchDeck = 'Pitch Deck File is required';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Form submitted successfully", formData);
    }
  };

  return (
    <div className="submit-idea-container">
      <nav>
        <button onClick={handleLogout}>Logout</button>
      </nav>

      <h1>Submit Your Startup Idea</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Market Potential</label>
          <input 
            type="text" 
            onChange={(e) => setFormData({...formData, marketPotential: e.target.value})} 
          />
          {errors.marketPotential && <p style={{color: 'red'}}>{errors.marketPotential}</p>}
        </div>

        <div>
          <label>Launch Year</label>
          <input 
            type="text" 
            onChange={(e) => setFormData({...formData, launchYear: e.target.value})} 
          />
          {errors.launchYear && <p style={{color: 'red'}}>{errors.launchYear}</p>}
        </div>

        <div>
          <label>Funding Required</label>
          <input 
            type="text" 
            onChange={(e) => setFormData({...formData, fundingRequired: e.target.value})} 
          />
          {errors.fundingRequired && <p style={{color: 'red'}}>{errors.fundingRequired}</p>}
        </div>

        <div>
          <label>Address</label>
          <textarea 
            onChange={(e) => setFormData({...formData, address: e.target.value})} 
          ></textarea>
          {errors.address && <p style={{color: 'red'}}>{errors.address}</p>}
        </div>

        <div>
          <label>Pitch Deck File</label>
          <input 
            type="file" 
            onChange={(e) => setFormData({...formData, pitchDeck: e.target.files[0]})} 
          />
          {errors.pitchDeck && <p style={{color: 'red'}}>{errors.pitchDeck}</p>}
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SubmitIdea;