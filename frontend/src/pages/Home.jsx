import React, { useState, useEffect } from 'react';
import API from '../services/api';
import MenuCard from '../components/MenuCard';
import FilterSidebar from '../components/FilterSidebar';

const Home = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    foodType: 'All',
    price: 'All',
    cuisine: 'All',
    category: 'All'
  });

  useEffect(() => {
    fetchMenuItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchMenuItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();

      if (filters.search) params.append('search', filters.search);

      // foodType in DB is 'veg' or 'non-veg'; 'All' means no filter
      if (filters.foodType !== 'All') params.append('foodType', filters.foodType);

      if (filters.cuisine !== 'All') params.append('cuisine', filters.cuisine);
      if (filters.category !== 'All') params.append('category', filters.category);

      if (filters.price !== 'All') {
        if (filters.price === 'Under 100') params.append('maxPrice', '100');
        else if (filters.price === '100-300') { params.append('minPrice', '100'); params.append('maxPrice', '300'); }
        else if (filters.price === '300-500') { params.append('minPrice', '300'); params.append('maxPrice', '500'); }
        else if (filters.price === 'Above 500') params.append('minPrice', '500');
      }

      const queryStr = params.toString() ? `?${params.toString()}` : '';
      const response = await API.get(`/menu${queryStr}`);

      if (response.data.success) {
        setMenuItems(response.data.data);
      } else {
        setError('Unable to load food items.');
      }
    } catch (err) {
      console.error('Error fetching menu items:', err);
      setError('Unable to load food items. Please make sure the backend is running on http://localhost:5000.');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-light, #888)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <p>Loading food items...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#ef4444' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️</div>
          <p>{error}</p>
          <button
            className="btn"
            style={{ marginTop: '1rem' }}
            onClick={fetchMenuItems}
          >
            Retry
          </button>
        </div>
      );
    }

    if (menuItems.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-light, #888)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🍽️</div>
          <p>No items found matching your filters.</p>
          <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Try adjusting your filters or search query.
          </p>
        </div>
      );
    }

    return (
      <div className="menu-grid">
        {menuItems.map(item => (
          <MenuCard key={item._id} item={item} />
        ))}
      </div>
    );
  };

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Discover Great Food</h1>
      <div className="menu-page-layout">
        <FilterSidebar filters={filters} setFilters={setFilters} />
        <div style={{ flex: 1 }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Home;
