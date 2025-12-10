import React from 'react';

const OrderFilterTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'all', label: 'Tất cả' },
    { id: 'pending', label: 'Chờ xử lý' },
    { id: 'processing', label: 'Đang tiến hành' },
    { id: 'completed', label: 'Hoàn thành' },
    { id: 'cancelled', label: 'Đã hủy' }
  ];

  return (
    <ul className="nav nav-tabs mb-4">
      {tabs.map(tab => (
        <li key={tab.id} className="nav-item">
          <button 
            className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default OrderFilterTabs;
