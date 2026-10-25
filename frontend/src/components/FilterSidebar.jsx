import React from 'react';

const FilterSidebar = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="sidebar">
      <div className="filter-group">
        <h3>Search</h3>
        <input 
          type="text" 
          name="search"
          className="search-input"
          placeholder="Search items..."
          value={filters.search}
          onChange={handleChange}
        />
      </div>

      <div className="filter-group">
        <h3>Food Type</h3>
        <label className="filter-label">
          <input type="radio" name="foodType" value="All" checked={filters.foodType === 'All'} onChange={handleChange} /> All
        </label>
        <label className="filter-label">
          <input type="radio" name="foodType" value="veg" checked={filters.foodType === 'veg'} onChange={handleChange} /> Veg
        </label>
        <label className="filter-label">
          <input type="radio" name="foodType" value="non-veg" checked={filters.foodType === 'non-veg'} onChange={handleChange} /> Non-Veg
        </label>
      </div>

      <div className="filter-group">
        <h3>Price Range</h3>
        <label className="filter-label">
          <input type="radio" name="price" value="All" checked={filters.price === 'All'} onChange={handleChange} /> All
        </label>
        <label className="filter-label">
          <input type="radio" name="price" value="Under 100" checked={filters.price === 'Under 100'} onChange={handleChange} /> Under ₹100
        </label>
        <label className="filter-label">
          <input type="radio" name="price" value="100-300" checked={filters.price === '100-300'} onChange={handleChange} /> ₹100 - ₹300
        </label>
        <label className="filter-label">
          <input type="radio" name="price" value="300-500" checked={filters.price === '300-500'} onChange={handleChange} /> ₹300 - ₹500
        </label>
        <label className="filter-label">
          <input type="radio" name="price" value="Above 500" checked={filters.price === 'Above 500'} onChange={handleChange} /> Above ₹500
        </label>
      </div>

      <div className="filter-group">
        <h3>Cuisine</h3>
        {['All', 'Indian', 'Chinese', 'Italian', 'Punjabi', 'South Indian', 'Fast Food'].map(cuisine => (
          <label key={cuisine} className="filter-label">
            <input 
              type="radio" 
              name="cuisine" 
              value={cuisine} 
              checked={filters.cuisine === cuisine} 
              onChange={handleChange} 
            /> {cuisine}
          </label>
        ))}
      </div>
      
      <div className="filter-group">
        <h3>Category</h3>
        {['All', 'Pizza', 'Burger', 'Biryani', 'Dosa', 'Noodles', 'Curry', 'Starter', 'Breads', 'Rice', 'Pasta', 'Breakfast', 'Sides'].map(cat => (
          <label key={cat} className="filter-label">
            <input 
              type="radio" 
              name="category" 
              value={cat} 
              checked={filters.category === cat} 
              onChange={handleChange} 
            /> {cat}
          </label>
        ))}
      </div>
    </div>
  );
};

export default FilterSidebar;
