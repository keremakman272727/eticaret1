import React, { useContext, useEffect, useState } from 'react';
import { SidebarContext } from '../contexts/SidebarContext';
import { BsBag } from 'react-icons/bs';
import { CartContext } from '../contexts/CartContext';
import { Link } from 'react-router-dom';
import Logo from '../img/logo.svg';
import { ProductContext } from '../contexts/ProductContext';

const Header = () => {
  const [isActive, setIsActive] = useState(false);
  const { isOpen, setIsOpen } = useContext(SidebarContext);
  const { itemAmount } = useContext(CartContext);
  const { setSelectedCategory, setProducts } = useContext(ProductContext);
  const [categories, setCategories] = useState([]);

  // Event listener
  useEffect(() => {
    window.addEventListener('scroll', () => {
      window.scrollY > 60 ? setIsActive(true) : setIsActive(false);
    });
  }, []);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://api.storerestapi.com/products/running-sneaker');
      const data = await response.json();
      const uniqueCategories = [...new Set(data.map(item => item.category.name))];
      setCategories(['All', ...uniqueCategories]);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleCategoryChange = async (event) => {
    const selectedCategory = event.target.value;
    setSelectedCategory(selectedCategory);

    // Fetch products based on selected category
    try {
      let apiUrl = 'https://api.storerestapi.com/products/running-sneaker';
      if (selectedCategory !== 'All') {
        apiUrl += `?category=${selectedCategory}`;
      }
      const response = await fetch(apiUrl);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  return (
    <header className={`${isActive ? 'bg-white py-4 shadow-md' : 'bg-none py-6'} fixed w-full z-10 transition-all`}>
      <div className='container mx-auto flex items-center justify-between h-full'>
        {/* Logo */}
        <Link to={'/'}>
          <img className='w-[40px]' src={Logo} alt='' />
        </Link>
        {/* Category Filter */}
        <select
          id='category'
          className='border border-gray-300 px-2 py-1 rounded'
          onChange={handleCategoryChange}
        >
          {categories.map((category, index) => (
            <option value={category} key={index}>
              {category}
            </option>
          ))}
        </select>
        {/* Cart */}
        <div onClick={() => setIsOpen(!isOpen)} className='cursor-pointer flex relative'>
          <BsBag className='text-2xl' />
          <div className='bg-red-500 absolute right-2 bottom-2 text-[12px] w-[18px] h-[18px] text-white rounded-full justify-center items-center'>
            {itemAmount}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;