import React, { useState } from 'react';

const StartupProfileForm = () => {
  
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    fundingLimit: '',
    equity: '',
    industry: '',
    stage: '',
  });

  
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.fundingLimit) newErrors.fundingLimit = 'Funding limit is required';
    if (!formData.equity) newErrors.equity = 'Equity % is required';
    if (!formData.industry) newErrors.industry = 'Industry is required';
    if (!formData.stage) newErrors.stage = 'Stage is required';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log('Form submitted successfully', formData);
    }
  };

  return (
    <div>
      
      <h1>Create New Startup Profile</h1>

      
      <button type="button">Logout</button>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Category</label>
          <input name="category" value={formData.category} onChange={handleChange} />
          {errors.category && <p>{errors.category}</p>}
        </div>

        <div>
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} />
          {errors.description && <p>{errors.description}</p>}
        </div>

        <div>
          <label>Funding Limit</label>
          <input name="fundingLimit" value={formData.fundingLimit} onChange={handleChange} />
          {errors.fundingLimit && <p>{errors.fundingLimit}</p>}
        </div>

        <div>
          <label>Equity %</label>
          <input name="equity" value={formData.equity} onChange={handleChange} />
          {errors.equity && <p>{errors.equity}</p>}
        </div>

        <div>
          <label>Industry</label>
          <input name="industry" value={formData.industry} onChange={handleChange} />
          {errors.industry && <p>{errors.industry}</p>}
        </div>

        <div>
          <label>Stage</label>
          <input name="stage" value={formData.stage} onChange={handleChange} />
          {errors.stage && <p>{errors.stage}</p>}
        </div>

        
        <button type="submit">Add Profile</button>
      </form>
    </div>
  );
};

export default StartupProfileForm;