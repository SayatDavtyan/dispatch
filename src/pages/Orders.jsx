import { useEffect, useState, useMemo } from "react";
import { getAllOrders, getAllCouriers, assignCourierToOrder, updateOrderStatus, getSettings } from "../api";

const statusOptions = ["new", "accepted", "picked", "in-transit", "delivered", "cancelled"];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [couriers, setCouriers] = useState([]);
  const [settings, setSettings] = useState({ courierPercent: 50 });
  const [error, setError] = useState(null);

  useEffect(() => {
    refresh();
  }, []);

  const refresh = async () => {
    try {
      setError(null);
      const ordersData = await getAllOrders();
      const couriersData = await getAllCouriers();
      const settingsData = await getSettings();
      setOrders(ordersData);
      setCouriers(couriersData);
      setSettings(settingsData);
    } catch (e) {
      setError("Не удалось загрузить данные. Бэкенд запущен?");
      console.error(e);
    }
  };

  const handleAssign = async (orderId, courierId) => {
    await assignCourierToOrder(orderId, courierId);
    refresh();
  };

  const handleStatus = async (orderId, status) => {
    await updateOrderStatus(orderId, status);
    refresh();
  };

  const courierStats = useMemo(() => {
    return couriers.map(courier => {
      const assignedOrders = orders.filter(o => o.courierId === courier.id);
      const totalEarnings = assignedOrders.reduce((sum, order) => sum + (order.courierIncome || 0), 0);
      return {
        ...courier,
        orderCount: assignedOrders.length,
        totalEarnings: totalEarnings,
      };
    });
  }, [orders, couriers]);


  return (
    <div style={{ padding: '20px 10px', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '15px', fontSize: 'clamp(20px, 5vw, 32px)' }}>Диспетчерская панель</h1>

      <div style={{
        background: '#e3f2fd',
        border: '1px solid #90caf9',
        padding: 12,
        borderRadius: 4,
        marginBottom: 20,
        fontSize: 'clamp(12px, 3vw, 14px)'
      }}>
        <strong>📊 Текущий процент прибыли курьера: {settings.courierPercent}%</strong>
        <p style={{ margin: '5px 0 0 0', color: '#555' }}>
          Базовая цена: {settings.basePrice}₽ | Цена за км: {settings.pricePerKm}₽
        </p>
        <p style={{ margin: '5px 0 0 0', color: '#555' }}>
          (Измените эти параметры в разделе <strong>⚙️ Настройки</strong>)
        </p>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={refresh} style={{ padding: '8px 16px', fontSize: 'clamp(12px, 3vw, 14px)', cursor: 'pointer' }}>Обновить</button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
        <div>
          <h2 style={{ fontSize: 'clamp(18px, 4vw, 24px)' }}>Заказы</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px', fontSize: 'clamp(12px, 2.5vw, 14px)' }}>
              <thead>
                <tr style={{ background: '#f0f0f0' }}>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Маршрут</th>
                  <th style={styles.th}>Статус</th>
                  <th style={styles.th}>Курьер</th>
                  <th style={styles.th}>Цена</th>
                  <th style={styles.th}>Доход курьера</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td style={styles.td}>{order.id}</td>
                    <td style={styles.td}>{order.from} → {order.to}</td>
                    <td style={styles.td}>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatus(order.id, e.target.value)}
                        style={{ width: '100%', padding: '4px', fontSize: 'inherit' }}
                      >
                        {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td style={styles.td}>
                      <select
                        value={order.courierId || ""}
                        onChange={(e) => handleAssign(order.id, e.target.value)}
                        style={{ width: '100%', padding: '4px', fontSize: 'inherit' }}
                      >
                        <option value="">Не назначен</option>
                        {couriers.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td style={styles.td}>{order.price}</td>
                    <td style={styles.td}>{order.courierIncome || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h2 style={{ fontSize: 'clamp(18px, 4vw, 24px)' }}>Курьеры</h2>
          {courierStats.map((c) => (
            <div key={c.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px', background: c.isOnline ? '#e9f7ef' : '#fbe9e7', borderRadius: '4px', fontSize: 'clamp(12px, 3vw, 14px)' }}>
              <b>{c.name}</b>
              <p style={{ margin: '5px 0' }}>Статус: {c.isOnline ? <span style={{ color: 'green' }}>Онлайн</span> : <span style={{ color: 'red' }}>Оффлайн</span>}</p>
              <p style={{ margin: '5px 0' }}>Заказов в работе: {c.orderCount}</p>
              <p style={{ margin: '5px 0' }}>Общий доход: {c.totalEarnings.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  th: {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left',
  },
  td: {
    border: '1px solid #ddd',
    padding: '8px',
  }
};

