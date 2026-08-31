import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  PlusCircle,
  TrendingUp,
  Package,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  X as XIcon,
  Eye,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cropService } from '../../services/cropService';
import { orderService } from '../../services/orderService';
import { marketService } from '../../services/marketService';
import { predictionService } from '../../services/predictionService';
import { Crop, Order, MarketPriceRecord, AIRecommendation, OrderStatus } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PricePredictionChart } from '../../components/farmer/PricePredictionChart';

export const FarmerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [marketPrices, setMarketPrices] = useState<MarketPriceRecord[]>([]);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadDashboardData();
    const handleUpdate = () => loadDashboardData();
    window.addEventListener('farmlink_orders_updated', handleUpdate);
    window.addEventListener('farmlink_crops_updated', handleUpdate);
    return () => {
      window.removeEventListener('farmlink_orders_updated', handleUpdate);
      window.removeEventListener('farmlink_crops_updated', handleUpdate);
    };
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const farmerId = user?.id || 'user_farmer_1';
      const [cropsData, ordersData, pricesData, recsData] = await Promise.all([
        cropService.getAll({ farmer_id: farmerId }),
        orderService.getAll({ farmer_id: farmerId }),
        marketService.getAll(),
        predictionService.getRecommendations()
      ]);

      setCrops(cropsData);
      setOrders(ordersData);
      setMarketPrices(pricesData.slice(0, 5));
      setRecommendations(recsData);
    } catch (err) {
      console.error('Failed to load farmer dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await orderService.updateStatus(orderId, newStatus);
      await loadDashboardData();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const totalCropsListed = crops.length;
  const activeOrdersCount = orders.filter(
    o => o.status === 'PENDING' || o.status === 'CONFIRMED' || o.status === 'PICKED_UP' || o.status === 'IN_TRANSIT'
  ).length;

  const totalSalesRevenue = orders
    .filter(o => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + (o.total_amount || o.total_price || 0), 0);

  const avgCropPrice =
    crops.length > 0
      ? Math.round((crops.reduce((sum, c) => sum + c.price, 0) / crops.length) * 10) / 10
      : 28;

  return (
    <div className="min-h-screen bg-slate-50/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* 1. Header (Title, Short description, 1-2 primary actions) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-emerald-800 bg-emerald-50 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Farmer Portal • {user?.location || 'Nashik Mandi Zone'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit',sans-serif]">
              Farmer Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Welcome back, {user?.name || 'Ramesh Patel'}. Track active crop lots, incoming wholesale purchase orders, and Mandi price curves.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/farmer/add-crop"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List Crop</span>
            </Link>

            <Link
              to="/farmer/predictions"
              className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Predict Price</span>
            </Link>
          </div>
        </div>

        {/* 2. Important Statistics (4 Clean Metric Cards) */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">Total Crops Listed</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit',sans-serif]">
              {totalCropsListed} <span className="text-xs font-semibold text-slate-500">Lots</span>
            </h3>
            <p className="text-xs text-slate-500">
              {crops.reduce((s, c) => s + c.quantity, 0).toLocaleString()} kg in farm inventory
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">Active Wholesale Orders</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit',sans-serif]">
              {activeOrdersCount}
            </h3>
            <p className="text-xs text-slate-500">
              {orders.filter(o => o.status === 'PENDING').length} awaiting your confirmation
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">Total Sales Revenue</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit',sans-serif]">
              ₹{(totalSalesRevenue || 142800).toLocaleString()}
            </h3>
            <div className="flex items-center text-xs font-semibold text-emerald-600">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              <span>Escrow Secured</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">Average Crop Price</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit',sans-serif]">
              ₹{avgCropPrice} <span className="text-xs font-semibold text-slate-500">/ kg</span>
            </h3>
            <p className="text-xs text-emerald-600 font-semibold">Direct-to-buyer realized rate</p>
          </div>
        </section>

        {/* 3. AI Price Prediction Graph & Market Advisory */}
        <section className="space-y-4">
          <PricePredictionChart
            cropName="Tomato (Hybrid Red)"
            locationName={user?.location || 'Nashik APMC Mandi'}
          />

          {recommendations.length > 0 && (
            <div className="bg-emerald-50/70 border border-emerald-200/80 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded">
                      AI Advisory
                    </span>
                    <span className="text-xs font-bold text-slate-900">{recommendations[0]?.title || 'Price Surge Warning'}</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {recommendations[0]?.description ||
                      'Tomato prices in Nashik APMC are projected to increase by 14% over the next 4 days. Consider staggering your harvest lots.'}
                  </p>
                </div>
              </div>

              <Link
                to="/farmer/predictions"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-semibold text-xs shrink-0 flex items-center gap-1.5 transition-all self-start md:self-auto cursor-pointer"
              >
                <span>Run Custom Prediction</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </section>

        {/* 4. Recent Activity: Wholesale Orders & Mandi Benchmark */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recent Orders Section */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Recent Wholesale Purchase Orders
                </h2>
                <p className="text-xs text-slate-500">Incoming purchase requests from verified supermarket and institutional buyers</p>
              </div>
              <Link to="/farmer/orders" className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1">
                <span>View All ({orders.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="bg-white rounded-2xl p-8 text-center text-xs text-slate-500 border border-slate-200">
                Loading orders...
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500 text-xs space-y-3">
                <Package className="w-8 h-8 text-slate-400 mx-auto" />
                <p>No orders received yet. List crops to begin receiving direct buyer bids.</p>
                <Link to="/farmer/add-crop" className="inline-block bg-emerald-600 text-white font-semibold px-4 py-2 rounded-xl text-xs">
                  List Crop Now
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                        <th className="py-3 px-4">Order ID</th>
                        <th className="py-3 px-4">Buyer</th>
                        <th className="py-3 px-4">Crops & Qty</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-900">
                      {orders.slice(0, 5).map(order => (
                        <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                            #{order.id.slice(-5)}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900">{order.buyer_name}</div>
                            <div className="text-[10px] text-slate-500">{order.buyer_phone}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-medium text-slate-900">
                              {order.items.map(i => `${i.crop_name} (${i.quantity} ${i.unit})`).join(', ')}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-900">
                            ₹{(order.total_amount || order.total_price || 0).toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4">
                            <StatusBadge status={order.status} size="sm" />
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                            {order.status === 'PENDING' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateOrderStatus(order.id, 'CONFIRMED')}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                                  title="Accept Order"
                                >
                                  <Check className="w-3 h-3" /> Accept
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateOrderStatus(order.id, 'CANCELLED')}
                                  className="text-rose-600 hover:bg-rose-50 px-2 py-1 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer border border-rose-200"
                                  title="Reject Order"
                                >
                                  <XIcon className="w-3 h-3" />
                                </button>
                              </>
                            )}
                            <button
                              type="button"
                              onClick={() => setSelectedOrder(order)}
                              className="border border-slate-200 text-slate-700 hover:bg-slate-50 px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer"
                            >
                              <Eye className="w-3 h-3 inline mr-1" /> View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Mandi Price Benchmark Section */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Mandi Benchmark
                </h2>
                <p className="text-xs text-slate-500">Today's APMC modal rates</p>
              </div>
              <Link to="/market-prices" className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1">
                <span>All Mandis</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-2.5">
              {marketPrices.map((item, idx) => {
                const isPositive = (item.change_percent || 0) >= 0;
                return (
                  <div
                    key={item.id || idx}
                    className="p-3 rounded-xl border border-slate-100 flex items-center justify-between hover:bg-slate-50 transition-all"
                  >
                    <div>
                      <div className="font-bold text-xs text-slate-900">{item.crop}</div>
                      <div className="text-[10px] text-slate-500">
                        {item.mandi} • {item.state}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-xs text-slate-900">
                        ₹{item.modal_price} / kg
                      </div>
                      <div
                        className={`text-[10px] font-bold flex items-center justify-end gap-0.5 ${
                          isPositive ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        <TrendingUp className={`w-3 h-3 ${!isPositive ? 'rotate-180 text-rose-500' : ''}`} />
                        <span>
                          {isPositive ? '+' : ''}
                          {item.change_percent || 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white max-w-lg w-full rounded-2xl border border-slate-200 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">Wholesale Purchase Order</h3>
                <p className="text-xs text-slate-500">Order ID: #{selectedOrder.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                <div className="text-slate-500 font-bold">Buyer Details</div>
                <div className="font-bold text-slate-900 text-sm">{selectedOrder.buyer_name}</div>
                <div className="text-slate-600">Phone: {selectedOrder.buyer_phone}</div>
                <div className="text-slate-600">Delivery Address: {selectedOrder.delivery_address}</div>
              </div>

              <div>
                <div className="font-bold text-slate-900 mb-1.5">Purchased Lots</div>
                <div className="space-y-1.5">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-50 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900">{item.crop_name}</span>
                        <span className="text-slate-500 block text-[11px]">
                          ₹{item.price_per_unit || item.unit_price}/{item.unit}
                        </span>
                      </div>
                      <div className="font-bold text-slate-900">
                        {item.quantity} {item.unit}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-100 font-bold">
                <span className="text-slate-700">Total Order Value:</span>
                <span className="text-base font-black text-slate-900">
                  ₹{(selectedOrder.total_amount || selectedOrder.total_price || 0).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              {selectedOrder.status === 'PENDING' && (
                <>
                  <button
                    type="button"
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'CONFIRMED')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs"
                  >
                    Accept Order
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'CANCELLED')}
                    className="text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-xl text-xs font-semibold border border-rose-200"
                  >
                    Reject
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="border border-slate-200 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
