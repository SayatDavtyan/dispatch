import { useEffect, useState, useMemo } from "react";
import { getAllOrders, getAllCouriers, assignCourierToOrder, updateOrderStatus } from "../api";

const statusOptions = ["new", "accepted", "picked", "in-transit", "delivered", "cancelled"];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [couriers, setCouriers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    refresh();
  }, []);

  const refresh = async () => {
    try {
      setError(null);
      const ordersData = await getAllOrders();
      const couriersData = await getAllCouriers();
      setOrders(ordersData);
      setCouriers(couriersData);
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
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>Диспетчерская панель</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={refresh}>Обновить</button>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '20px', marginTop: '20px' }}>
        <div>
          <h2>Заказы</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
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
                      style={{ width: '100%' }}
                    >
                      {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td style={styles.td}>
                    <select
                      value={order.courierId || ""}
                      onChange={(e) => handleAssign(order.id, e.target.value)}
                      style={{ width: '100%' }}
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
        <div>
          <h2>Курьеры</h2>
            {courierStats.map((c) => (
              <div key={c.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px', background: c.isOnline ? '#e9f7ef' : '#fbe9e7' }}>
                <b>{c.name}</b>
                <p>Статус: {c.isOnline ? <span style={{color: 'green'}}>Онлайн</span> : <span style={{color: 'red'}}>Оффлайн</span>}</p>
                <p>Заказов в работе: {c.orderCount}</p>
                <p>Общий доход: {c.totalEarnings.toFixed(2)}</p>
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
