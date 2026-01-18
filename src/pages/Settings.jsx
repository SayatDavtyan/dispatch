import { useEffect, useState } from "react";
import { getSettings, updateCourierPercent, updatePricingSettings } from "../api";

export default function Settings() {
    const [courierPercent, setCourierPercent] = useState(50);
    const [basePrice, setBasePrice] = useState(100);
    const [pricePerKm, setPricePerKm] = useState(80);
    const [loading, setLoading] = useState(true);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('profit');

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            setLoading(true);
            setError(null);
            const settings = await getSettings();
            setCourierPercent(settings.courierPercent || 50);
            setBasePrice(settings.basePrice || 100);
            setPricePerKm(settings.pricePerKm || 80);
        } catch (e) {
            setError("Не удалось загрузить настройки");
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfit = async () => {
        try {
            setSaved(false);
            setError(null);
            await updateCourierPercent(courierPercent);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (e) {
            setError("Не удалось сохранить настройки");
            console.error(e);
        }
    };

    const handleSavePricing = async () => {
        try {
            setSaved(false);
            setError(null);
            await updatePricingSettings(pricePerKm, basePrice);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (e) {
            setError("Не удалось сохранить настройки");
            console.error(e);
        }
    };

    const handlePercentChange = (e) => {
        const value = Math.max(0, Math.min(100, Number(e.target.value)));
        setCourierPercent(value);
    };

    const handlePriceChange = (e) => {
        const value = Math.max(0, Number(e.target.value));
        setBasePrice(value);
    };

    const handlePricePerKmChange = (e) => {
        const value = Math.max(0, Number(e.target.value));
        setPricePerKm(value);
    };

    if (loading) {
        return <div style={{ padding: 20 }}>Загрузка...</div>;
    }

    return (
        <div style={{ padding: 20, fontFamily: 'sans-serif', maxWidth: 800 }}>
            <h1>Настройки</h1>

            {error && (
                <div style={{
                    background: '#ffebee',
                    color: '#c62828',
                    padding: 10,
                    borderRadius: 4,
                    marginBottom: 20
                }}>
                    {error}
                </div>
            )}

            {saved && (
                <div style={{
                    background: '#e8f5e9',
                    color: '#2e7d32',
                    padding: 10,
                    borderRadius: 4,
                    marginBottom: 20
                }}>
                    ✓ Настройки успешно сохранены
                </div>
            )}

            {/* Вкладки */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 20, borderBottom: '2px solid #ddd' }}>
                <button
                    onClick={() => setActiveTab('profit')}
                    style={{
                        background: activeTab === 'profit' ? '#1976d2' : 'transparent',
                        color: activeTab === 'profit' ? 'white' : '#333',
                        border: 'none',
                        padding: '10px 15px',
                        cursor: 'pointer',
                        fontSize: 14,
                        fontWeight: 'bold',
                        borderRadius: '4px 4px 0 0'
                    }}
                >
                    💰 Процент прибыли
                </button>
                <button
                    onClick={() => setActiveTab('pricing')}
                    style={{
                        background: activeTab === 'pricing' ? '#1976d2' : 'transparent',
                        color: activeTab === 'pricing' ? 'white' : '#333',
                        border: 'none',
                        padding: '10px 15px',
                        cursor: 'pointer',
                        fontSize: 14,
                        fontWeight: 'bold',
                        borderRadius: '4px 4px 0 0'
                    }}
                >
                    📍 Расчет цены по расстоянию
                </button>
            </div>

            {/* Вкладка Процент прибыли */}
            {activeTab === 'profit' && (
                <div style={{
                    border: '1px solid #ddd',
                    padding: 20,
                    borderRadius: 8,
                    background: '#fafafa'
                }}>
                    <h3 style={{ marginTop: 0 }}>Процент прибыли курьера</h3>

                    <p style={{ color: '#666', marginBottom: 20 }}>
                        Укажите, какой процент от стоимости заказа получает курьер при его завершении.
                    </p>

                    <div style={{ marginBottom: 20 }}>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
                            Процент прибыли: <span style={{ color: '#1976d2' }}>{courierPercent}%</span>
                        </label>

                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={courierPercent}
                            onChange={handlePercentChange}
                            style={{ width: '100%', cursor: 'pointer' }}
                        />

                        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={courierPercent}
                                onChange={handlePercentChange}
                                style={{
                                    width: 80,
                                    padding: 8,
                                    border: '1px solid #ddd',
                                    borderRadius: 4
                                }}
                            />
                            <span style={{ paddingTop: 8 }}>%</span>
                        </div>
                    </div>

                    <div style={{
                        background: '#e3f2fd',
                        padding: 12,
                        borderRadius: 4,
                        marginBottom: 20,
                        fontSize: 14
                    }}>
                        <strong>Пример:</strong> Если процент 20%, то при заказе стоимостью 500 ₽,
                        курьер получит 100 ₽.
                    </div>

                    <button
                        onClick={handleSaveProfit}
                        style={{
                            background: '#1976d2',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: 4,
                            cursor: 'pointer',
                            fontSize: 16,
                            fontWeight: 'bold',
                            transition: 'background 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.background = '#1565c0'}
                        onMouseOut={(e) => e.target.style.background = '#1976d2'}
                    >
                        Сохранить процент
                    </button>
                </div>
            )}

            {/* Вкладка Расчет цены */}
            {activeTab === 'pricing' && (
                <div style={{
                    border: '1px solid #ddd',
                    padding: 20,
                    borderRadius: 8,
                    background: '#fafafa'
                }}>
                    <h3 style={{ marginTop: 0 }}>Расчет цены по расстоянию</h3>

                    <p style={{ color: '#666', marginBottom: 20 }}>
                        Укажите базовую цену и наценку за каждый километр.
                    </p>

                    <div style={{ marginBottom: 20 }}>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
                            Базовая цена: {basePrice} ₽
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={basePrice}
                            onChange={handlePriceChange}
                            style={{
                                width: '100%',
                                padding: 10,
                                border: '1px solid #ddd',
                                borderRadius: 4,
                                fontSize: 14
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: 20 }}>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
                            Цена за 1 км: {pricePerKm} ₽
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={pricePerKm}
                            onChange={handlePricePerKmChange}
                            style={{
                                width: '100%',
                                padding: 10,
                                border: '1px solid #ddd',
                                borderRadius: 4,
                                fontSize: 14
                            }}
                        />
                    </div>

                    <div style={{
                        background: '#e3f2fd',
                        padding: 12,
                        borderRadius: 4,
                        marginBottom: 20,
                        fontSize: 14
                    }}>
                        <strong>Примеры расчета:</strong>
                        <ul style={{ margin: '10px 0', paddingLeft: 20 }}>
                            <li>На 0 км (точка A = точка B): {basePrice} ₽</li>
                            <li>На 5 км: {basePrice + (5 * pricePerKm)} ₽</li>
                            <li>На 10 км: {basePrice + (10 * pricePerKm)} ₽</li>
                            <li>На 20 км: {basePrice + (20 * pricePerKm)} ₽</li>
                        </ul>
                        <p style={{ margin: '10px 0 0 0' }}>
                            <strong>Формула:</strong> Итоговая цена = Базовая цена + (Расстояние в км × Цена за км)
                        </p>
                    </div>

                    <button
                        onClick={handleSavePricing}
                        style={{
                            background: '#1976d2',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: 4,
                            cursor: 'pointer',
                            fontSize: 16,
                            fontWeight: 'bold',
                            transition: 'background 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.background = '#1565c0'}
                        onMouseOut={(e) => e.target.style.background = '#1976d2'}
                    >
                        Сохранить расчет цены
                    </button>
                </div>
            )}
        </div>
    );
}
