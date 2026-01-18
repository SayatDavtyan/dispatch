 const API_URL = 'http://localhost:5000/admin';

export const getAllOrders = async () => {
  try {
    const res = await fetch(`${API_URL}/orders`);
    return res.json();
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return [];
  }
};

export const getAllCouriers = async () => {
  try {
    const res = await fetch(`${API_URL}/couriers`);
    return res.json();
  } catch (error) {
    console.error("Failed to fetch couriers:", error);
    return [];
  }
};

export const assignCourierToOrder = async (orderId, courierId) => {
  const res = await fetch(`${API_URL}/orders/${orderId}/assign`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ courierId: courierId ? Number(courierId) : null })
  });
  return res.json();
};

export const updateOrderStatus = async (orderId, status) => {
  const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  return res.json();
};