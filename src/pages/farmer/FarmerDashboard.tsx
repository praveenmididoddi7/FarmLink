import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  PlusCircle,
  TrendingUp,
  Package,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  MapPin,
  Truck,
  Layers,
  ChevronRight,
  Activity,
  ShieldCheck,
  Check,
  X as XIcon,
  Eye
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cropService } from '../../services/cropService';
import { orderService } from '../../services/orderService';
import { marketService } from '../../services/marketService';
import { predictionService } from '../../services/predictionService';
import { Crop, Order, MarketPriceRecord, AIRecommendation, OrderStatus } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';

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
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const farmerId = user?.id || 'usr_farmer_1';
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

  // Calculations for Farmer KPIs
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
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Welcome & Quick Actions Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass p-6 sm:p-8 rounded-3xl border border-white/80 shadow-md">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full mb-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Farmer Portal • {user?.location || 'Nashik Mandi Zone, Maharashtra'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-emerald-950 font-['Outfit',sans-serif]">
              Farmer Command Center
            </h1>
            <p className="text-xs sm:text-sm text-emerald-700/80 mt-0.5 font-medium">
              Welcome back, {user?.name || 'Ramesh Patel'}. Real-time APMC price curves and wholesale dispatches are active.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/farmer/add-crop"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-2xl font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List New Crop</span>
            </Link>

            <Link
              to="/farmer/predictions"
              className="glass hover:bg-white/80 border border-emerald-300/60 text-emerald-900 px-4 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>AI Price Predictor</span>
            </Link>
          </div>
        </header>

        {/* 4 Frosted KPI Metric Cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="glass p-5 rounded-3xl border border-white/80 shadow-xs space-y-1.5 hover:bg-white/70 transition-all">
            <p className="text-emerald-700 text-[11px] font-extrabold uppercase tracking-wider">Total Crops Listed</p>
            <h3 className="text-2xl sm:text-3xl font-black text-emerald-950 font-['Outfit',sans-serif]">
              {totalCropsListed} <span className="text-sm font-bold text-emerald-700">Lots</span>
            </h3>
            <div className="flex items-center text-xs font-bold text-emerald-600">
              <span>{crops.reduce((s, c) => s + c.quantity, 0).toLocaleString()} kg in farm inventory</span>
            </div>
          </div>

          <div className="glass p-5 rounded-3xl border border-white/80 shadow-xs space-y-1.5 hover:bg-white/70 transition-all">
            <p className="text-emerald-700 text-[11px] font-extrabold uppercase tracking-wider">Active Wholesale Orders</p>
            <h3 className="text-2xl sm:text-3xl font-black text-emerald-950 font-['Outfit',sans-serif]">
              {activeOrdersCount}
            </h3>
            <p className="text-emerald-700/80 text-xs font-medium">
              {orders.filter(o => o.status === 'PENDING').length} awaiting confirmation
            </p>
          </div>

          <div className="glass p-5 rounded-3xl border border-white/80 shadow-xs space-y-1.5 hover:bg-white/70 transition-all">
            <p className="text-emerald-700 text-[11px] font-extrabold uppercase tracking-wider">Total Sales Revenue</p>
            <h3 className="text-2xl sm:text-3xl font-black text-emerald-950 font-['Outfit',sans-serif]">
              ₹{(totalSalesRevenue || 142800).toLocaleString()}
            </h3>
            <div className="flex items-center text-xs font-bold text-emerald-600">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              <span>Escrow Secured</span>
            </div>
          </div>

          <div className="glass p-5 rounded-3xl border border-white/80 shadow-xs space-y-1.5 hover:bg-white/70 transition-all">
            <p className="text-emerald-700 text-[11px] font-extrabold uppercase tracking-wider">Average Crop Price</p>
            <h3 className="text-2xl sm:text-3xl font-black text-emerald-950 font-['Outfit',sans-serif]">
              ₹{avgCropPrice} <span className="text-sm font-bold text-emerald-700">/ kg</span>
            </h3>
            <div className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Direct-to-buyer rate</span>
            </div>
          </div>
        </section>

        {/* AI Recommendation Alert Card */}
        {recommendations.length > 0 && (
          <div className="glass p-6 rounded-3xl border border-emerald-300/80 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-50/60 to-emerald-100/40">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/20">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded-md">
                    AI Market Advisory
                  </span>
                  <span className="text-xs text-emerald-800 font-bold">{recommendations[0]?.title || 'Price Surge Warning'}</span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-950 mt-1 font-medium leading-relaxed">
                  {recommendations[0]?.description ||
                    'Tomato prices in Nashik APMC are expected to increase by 14% over the next 4 days. Consider staggering harvest lots.'}
                </p>
              </div>
            </div>

            <Link
              to="/farmer/predictions"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-2xl font-bold text-xs shrink-0 flex items-center gap-1.5 shadow-xs transition-all self-start md:self-auto"
            >
              <span>Predict My Crop Price</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Main Grid: Orders on Left, Live Mandi Prices on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recent Orders Section */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-emerald-950 font-['Outfit',sans-serif]">
                  Recent Wholesale Purchase Orders
                </h2>
                <p className="text-xs text-emerald-700/80 font-medium">Incoming orders from verified supermarket and institutional buyers</p>
              </div>
              <Link to="/farmer/orders" className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1">
                <span>View All ({orders.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="glass rounded-3xl p-8 text-center text-xs text-emerald-800">
                Loading wholesale orders...
              </div>
            ) : orders.length === 0 ? (
              <div className="glass rounded-3xl p-10 text-center border border-white/80 text-emerald-800 text-xs font-medium space-y-3">
                <Package className="w-8 h-8 text-emerald-600/50 mx-auto" />
                <p>No orders received yet. List high-demand crops to start receiving direct buyer bids.</p>
                <Link to="/farmer/add-crop" className="inline-block bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl text-xs">
                  List Crop Now
                </Link>
              </div>
            ) : (
              <div className="glass rounded-3xl border border-white/80 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-emerald-100/80 bg-emerald-50/50 text-emerald-900 font-extrabold uppercase text-[10px] tracking-wider">
                        <th className="py-3 px-4">Order ID</th>
                        <th className="py-3 px-4">Buyer</th>
                        <th className="py-3 px-4">Crops & Qty</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-100/60 font-medium text-emerald-950">
                      {orders.slice(0, 5).map(order => (
                        <tr key={order.id} className="hover:bg-white/60 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-emerald-900">
                            #{order.id.slice(-5)}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-emerald-950">{order.buyer_name}</div>
                            <div className="text-[10px] text-emerald-700/70">{order.buyer_phone}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-emerald-950">
                              {order.items.map(i => `${i.crop_name} (${i.quantity} ${i.unit})`).join(', ')}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-black font-['Outfit',sans-serif] text-emerald-950 text-sm">
                            ₹{(order.total_amount || order.total_price || 0).toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4">
                            <StatusBadge status={order.status} />
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                            {order.status === 'PENDING' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateOrderStatus(order.id, 'CONFIRMED')}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-xl text-[11px] font-bold shadow-xs inline-flex items-center gap-1 cursor-pointer"
                                  title="Accept Order"
                                >
                                  <Check className="w-3 h-3" /> Accept
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateOrderStatus(order.id, 'CANCELLED')}
                                  className="glass text-rose-600 hover:bg-rose-50 px-2 py-1 rounded-xl text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                                  title="Reject Order"
                                >
                                  <XIcon className="w-3 h-3" />
                                </button>
                              </>
                            )}
                            <button
                              type="button"
                              onClick={() => setSelectedOrder(order)}
                              className="glass border border-white/80 text-emerald-900 hover:bg-white px-2.5 py-1 rounded-xl text-[11px] font-bold cursor-pointer"
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

          {/* Live Market Mandi Prices Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-emerald-950 font-['Outfit',sans-serif]">
                  Live Mandi Benchmark
                </h2>
                <p className="text-xs text-emerald-700/80 font-medium">Regional APMC rates today</p>
              </div>
              <Link to="/market-prices" className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1">
                <span>All Mandis</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="glass rounded-3xl border border-white/80 p-4 shadow-xs space-y-3">
              {marketPrices.map((item, idx) => {
                const isPositive = (item.change_percent || 0) >= 0;
                return (
                  <div
                    key={item.id || idx}
                    className="glass p-3 rounded-2xl border border-white/80 flex items-center justify-between hover:bg-white/70 transition-all"
                  >
                    <div>
                      <div className="font-extrabold text-xs text-emerald-950">{item.crop}</div>
                      <div className="text-[10px] text-emerald-700/70 font-medium">
                        {item.mandi} • {item.state}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-xs text-emerald-950 font-['Outfit',sans-serif]">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="glass max-w-lg w-full rounded-3xl border border-white/90 p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-100/80">
              <div>
                <h3 className="font-black text-base text-emerald-950">Wholesale Order Details</h3>
                <p className="text-xs text-emerald-700/80">Order ID: {selectedOrder.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="glass p-2 rounded-xl text-emerald-950 hover:bg-white"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="glass p-3.5 rounded-2xl border border-white/80 space-y-1">
                <div className="text-emerald-700 font-bold">Buyer Information</div>
                <div className="font-extrabold text-emerald-950 text-sm">{selectedOrder.buyer_name}</div>
                <div className="text-emerald-800">Phone: {selectedOrder.buyer_phone}</div>
                <div className="text-emerald-800">Delivery Address: {selectedOrder.delivery_address}</div>
              </div>

              <div>
                <div className="font-bold text-emerald-950 mb-1.5">Purchased Lots</div>
                <div className="space-y-1.5">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="glass p-2.5 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="font-bold text-emerald-950">{item.crop_name}</span>
                        <span className="text-emerald-700/80 block text-[11px]">
                          ₹{item.price_per_unit || item.unit_price}/{item.unit}
                        </span>
                      </div>
                      <div className="font-black text-emerald-950">
                        {item.quantity} {item.unit}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-emerald-100/80 font-bold">
                <span>Total Amount:</span>
                <span className="text-base font-black text-emerald-950">
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
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs"
                  >
                    Accept Order
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'CANCELLED')}
                    className="glass text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-xl text-xs font-bold"
                  >
                    Reject
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="glass border border-white/80 px-4 py-2 rounded-xl text-xs font-bold text-emerald-950"
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
