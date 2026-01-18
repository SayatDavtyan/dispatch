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

export const getSettings = async () => {
  try {
    const res = await fetch(`${API_URL}/settings`);
    return res.json();
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return { courierPercent: 50, pricePerKm: 80, basePrice: 100 };
  }
};

export const updateCourierPercent = async (courierPercent) => {
  try {
    const res = await fetch(`${API_URL}/settings`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courierPercent: Number(courierPercent) })
    });
    return res.json();
  } catch (error) {
    console.error("Failed to update settings:", error);
    return null;
  }
};

export const updatePricingSettings = async (pricePerKm, basePrice) => {
  try {
    const res = await fetch(`${API_URL}/settings`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pricePerKm: Number(pricePerKm),
        basePrice: Number(basePrice)
      })
    });
    return res.json();
  } catch (error) {
    console.error("Failed to update pricing settings:", error);
    return null;
  }
};