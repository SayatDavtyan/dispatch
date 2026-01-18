import { useState } from 'react';
import Orders from './pages/Orders';
import Settings from './pages/Settings';

function App() {
  const [currentPage, setCurrentPage] = useState('orders');

  return (
    <div>
      <nav style={{
        background: '#1976d2',
        color: 'white',
        padding: '10px 20px',
        display: 'flex',
        gap: '20px'
      }}>
        <button
          onClick={() => setCurrentPage('orders')}
          style={{
            background: currentPage === 'orders' ? '#1565c0' : 'transparent',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            cursor: 'pointer',
            fontSize: 16,
            fontWeight: 'bold',
            borderRadius: 4,
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => e.target.style.background = currentPage === 'orders' ? '#1565c0' : '#1565c040'}
          onMouseOut={(e) => e.target.style.background = currentPage === 'orders' ? '#1565c0' : 'transparent'}
        >
          Заказы и курьеры
        </button>
        <button
          onClick={() => setCurrentPage('settings')}
          style={{
            background: currentPage === 'settings' ? '#1565c0' : 'transparent',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            cursor: 'pointer',
            fontSize: 16,
            fontWeight: 'bold',
            borderRadius: 4,
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => e.target.style.background = currentPage === 'settings' ? '#1565c0' : '#1565c040'}
          onMouseOut={(e) => e.target.style.background = currentPage === 'settings' ? '#1565c0' : 'transparent'}
        >
          ⚙️ Настройки
        </button>
      </nav>

      {currentPage === 'orders' && <Orders />}
      {currentPage === 'settings' && <Settings />}
    </div>
  );
}

export default App;
