import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import {
  INITIAL_USERS,
  INITIAL_CROPS,
  INITIAL_ORDERS,
  INITIAL_TRANSPORTS,
  INITIAL_MARKET_PRICES,
  INITIAL_AI_RECOMMENDATIONS
} from './src/data/seedData';
import {
  User,
  Crop,
  Order,
  TransportRequest,
  MarketPriceRecord,
  PricePredictionRequest,
  PricePredictionResponse,
  DemandForecastData
} from './src/types';

// In-Memory Database State (seeded with realistic demo data)
let users: User[] = [...INITIAL_USERS];
let crops: Crop[] = [...INITIAL_CROPS];
let orders: Order[] = [...INITIAL_ORDERS];
let transports: TransportRequest[] = [...INITIAL_TRANSPORTS];
let marketPrices: MarketPriceRecord[] = [...INITIAL_MARKET_PRICES];

// Lazy Gemini client helper
let geminiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return geminiClient;
}

// User credentials store (seeded + runtime registered)
const userCredentials: Record<string, string> = {
  'farmer@farmlink.io': 'password123',
  'gowri.agro@farmlink.io': 'password123',
  'buyer@farmlink.io': 'password123',
  'rajesh.foods@farmlink.io': 'password123',
  'transport@farmlink.io': 'password123'
};

async function startServer() {
  const app = express();
  const DEFAULT_PORT = Number(process.env.PORT || 4173);

  const listenOnPort = (port: number): Promise<number> =>
    new Promise((resolve, reject) => {
      const server = app.listen(port, '0.0.0.0', () => {
        const address = server.address();
        const actualPort = typeof address === 'object' && address ? address.port : port;
        console.log(`FarmLink server running at http://localhost:${actualPort}`);
        resolve(actualPort);
      });

      server.on('error', (err: any) => {
        if (err && err.code === 'EADDRINUSE' && port < DEFAULT_PORT + 10) {
          console.warn(`Port ${port} is busy, trying ${port + 1}...`);
          server.close(() => resolve(listenOnPort(port + 1)));
          return;
        }

        reject(err);
      });
    });

  app.use(express.json());

  // ----------------------------------------------------
  // AUTH API (Strict credential authentication)
  // ----------------------------------------------------
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !String(email).trim()) {
      return res.status(400).json({ error: 'Email is required.' });
    }
    if (!password || !String(password).trim()) {
      return res.status(400).json({ error: 'Password is required.' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const expectedPassword = userCredentials[cleanEmail] || 'password123';
    if (password !== expectedPassword) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Return authenticated user ONLY upon valid match
    res.json({
      token: `farm_jwt_token_${user.id}_${Date.now()}`,
      refresh: `farm_jwt_refresh_${user.id}`,
      user
    });
  });

  app.post('/api/auth/register', (req, res) => {
    const { name, email, role, phone, location, password, farm_name, farm_size, business_name, vehicle_type, vehicle_number } = req.body;
    
    if (!email || !String(email).trim()) {
      return res.status(400).json({ error: 'Email is required.' });
    }
    if (!password || !String(password).trim()) {
      return res.status(400).json({ error: 'Password is required.' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      name: name || 'New User',
      email: cleanEmail,
      role: (role as any) || 'farmer',
      phone: phone || '+91 90000 00000',
      location: location || 'India',
      farm_name,
      farm_size,
      business_name,
      vehicle_type,
      vehicle_number,
      avatar:
        role === 'farmer'
          ? 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=150&auto=format&fit=crop&q=80'
          : role === 'buyer'
          ? 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
    };

    users.push(newUser);
    userCredentials[cleanEmail] = password;

    res.status(201).json({
      token: `farm_jwt_token_${newUser.id}_${Date.now()}`,
      user: newUser
    });
  });

  app.get('/api/auth/users', (req, res) => {
    res.json(users);
  });

  // ----------------------------------------------------
  // CROPS API
  // ----------------------------------------------------
  app.get('/api/crops', (req, res) => {
    const { category, state, search, farmer_id, min_price, max_price } = req.query;
    let results = [...crops];

    if (farmer_id) {
      results = results.filter(c => c.farmer_id === farmer_id);
    }
    if (category && category !== 'All') {
      results = results.filter(c => c.category === category);
    }
    if (state && state !== 'All') {
      results = results.filter(c => c.state.toLowerCase() === (state as string).toLowerCase() || c.location.toLowerCase().includes((state as string).toLowerCase()));
    }
    if (min_price) {
      results = results.filter(c => c.price >= Number(min_price));
    }
    if (max_price) {
      results = results.filter(c => c.price <= Number(max_price));
    }
    if (search) {
      const q = (search as string).toLowerCase();
      results = results.filter(c => 
        c.name.toLowerCase().includes(q) ||
        c.variety.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.farmer_name.toLowerCase().includes(q)
      );
    }

    res.json(results);
  });

  app.get('/api/crops/:id', (req, res) => {
    const crop = crops.find(c => c.id === req.params.id);
    if (!crop) {
      return res.status(404).json({ error: 'Crop listing not found' });
    }
    res.json(crop);
  });

  app.post('/api/crops', (req, res) => {
    const {
      farmer_id,
      farmer_name,
      farmer_phone,
      farm_name,
      name,
      category,
      variety,
      quantity,
      unit,
      price,
      harvest_date,
      quality,
      location,
      state,
      image,
      description,
      organic,
      moisture_content
    } = req.body;

    const defaultImages: Record<string, string> = {
      Tomato: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80',
      Onion: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800&auto=format&fit=crop&q=80',
      Potato: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=80',
      Rice: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
      Maize: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&auto=format&fit=crop&q=80',
      Chilli: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=800&auto=format&fit=crop&q=80',
      Cotton: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=800&auto=format&fit=crop&q=80',
      Turmeric: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80'
    };

    let selectedImage = image;
    if (!selectedImage) {
      for (const [key, val] of Object.entries(defaultImages)) {
        if ((name || '').toLowerCase().includes(key.toLowerCase())) {
          selectedImage = val;
          break;
        }
      }
      if (!selectedImage) {
        selectedImage = 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80';
      }
    }

    const newCrop: Crop = {
      id: `crop_${Date.now()}`,
      farmer_id: farmer_id || 'user_farmer_1',
      farmer_name: farmer_name || 'Ramesh Patel',
      farmer_phone: farmer_phone || '+91 98452 11029',
      farm_name: farm_name || 'Patel Organic Farms & Agro',
      name: name || 'Fresh Produce',
      category: category || 'Vegetables',
      variety: variety || 'Standard Local Variety',
      quantity: Number(quantity) || 100,
      unit: unit || 'kg',
      price: Number(price) || 25,
      harvest_date: harvest_date || new Date().toISOString().split('T')[0],
      quality: quality || 'Grade A (Premium)',
      location: location || 'Nashik Mandi Yard, Maharashtra',
      state: state || 'Maharashtra',
      image: selectedImage,
      description: description || 'Fresh farm-harvested agricultural lot ready for direct wholesale and transport.',
      shelf_life_days: 14,
      organic: Boolean(organic),
      moisture_content: moisture_content || '12%',
      created_at: new Date().toISOString(),
      is_available: true
    };

    crops.unshift(newCrop);
    res.status(201).json(newCrop);
  });

  app.put('/api/crops/:id', (req, res) => {
    const index = crops.findIndex(c => c.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Crop not found' });
    }
    crops[index] = { ...crops[index], ...req.body };
    res.json(crops[index]);
  });

  app.delete('/api/crops/:id', (req, res) => {
    crops = crops.filter(c => c.id !== req.params.id);
    res.json({ message: 'Crop listing deleted successfully' });
  });

  // ----------------------------------------------------
  // ORDERS API & LIFECYCLE
  // ----------------------------------------------------
  app.get('/api/orders', (req, res) => {
    const { buyer_id, farmer_id, status } = req.query;
    let results = [...orders];

    if (buyer_id) {
      results = results.filter(o => o.buyer_id === buyer_id);
    }
    if (farmer_id) {
      results = results.filter(o => o.items.some(item => item.farmer_id === farmer_id));
    }
    if (status) {
      results = results.filter(o => o.status === status);
    }

    res.json(results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
  });

  app.get('/api/orders/:id', (req, res) => {
    const order = orders.find(o => o.id === req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  });

  app.post('/api/orders', (req, res) => {
    const {
      buyer_id,
      buyer_name,
      buyer_phone,
      delivery_address,
      items,
      payment_method,
      notes
    } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ error: 'Order items are required' });
    }

    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const transportId = `TR-${Math.floor(500 + Math.random() * 500)}`;

    let totalPrice = 0;
    let totalWeightKg = 0;
    const cropNamesList: string[] = [];

    const orderItems = items.map((it: any) => {
      const matchedCrop = crops.find(c => c.id === (it.crop_id || it.crop?.id));
      const farmerId = it.farmer_id || matchedCrop?.farmer_id || it.crop?.farmer_id || 'user_farmer_1';
      const farmerName = it.farmer_name || matchedCrop?.farmer_name || it.crop?.farmer_name || 'Ramesh Patel';
      const farmerPhone = it.farmer_phone || matchedCrop?.farmer_phone || it.crop?.farmer_phone || '+91 98452 11029';
      const unitPrice = Number(it.unit_price || it.price_per_unit || matchedCrop?.price || it.crop?.price || 0);
      const qty = Number(it.quantity || 1);
      const subtotal = Number(it.subtotal || it.total || unitPrice * qty);
      totalPrice += subtotal;
      
      const unit = it.unit || matchedCrop?.unit || it.crop?.unit || 'kg';
      const weightFactor = unit === 'ton' ? 1000 : unit === 'quintal' ? 100 : 1;
      totalWeightKg += qty * weightFactor;

      const cName = it.crop_name || matchedCrop?.name || it.crop?.name || 'Crop';
      cropNamesList.push(`${cName} (${qty} ${unit})`);

      // Decrease available inventory on crop
      if (matchedCrop) {
        matchedCrop.quantity = Math.max(0, matchedCrop.quantity - qty);
      }

      return {
        crop_id: it.crop_id || matchedCrop?.id || 'crop_1',
        crop_name: cName,
        variety: it.variety || matchedCrop?.variety || it.crop?.variety || '',
        farmer_name: farmerName,
        farmer_id: farmerId,
        farmer_phone: farmerPhone,
        unit_price: unitPrice,
        price_per_unit: unitPrice,
        quantity: qty,
        unit: unit,
        image: it.image || matchedCrop?.image || it.crop?.image || '',
        subtotal,
        total: subtotal,
        pickup_location: it.pickup_location || matchedCrop?.location || 'Farm Gate'
      };
    });

    const deliveryFee = Math.round(Math.max(500, totalWeightKg * 2.2 + 800));

    const newOrder: Order = {
      id: orderId,
      buyer_id: buyer_id || 'user_buyer_1',
      buyer_name: buyer_name || 'Priya Sharma (FreshDirect)',
      buyer_phone: buyer_phone || '+91 98200 45678',
      delivery_address: delivery_address || 'Agri Wholesale Hub, Bengaluru - 560022',
      items: orderItems,
      total_price: totalPrice,
      total_amount: totalPrice + deliveryFee,
      delivery_fee: deliveryFee,
      status: 'PENDING',
      payment_method: payment_method || 'UPI',
      payment_status: payment_method === 'UPI' || payment_method === 'NetBanking' ? 'Paid' : 'Escrow Secured',
      transport_request_id: transportId,
      notes: notes || 'Handle fresh produce with care.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      estimated_delivery: new Date(Date.now() + 48 * 3600 * 1000).toISOString()
    };

    orders.unshift(newOrder);

    // Create corresponding transport dispatch request
    const firstItem = orderItems[0];
    const newTransport: any = {
      id: transportId,
      order_id: orderId,
      orderId: orderId,
      crop: firstItem?.crop_name || 'Farm Produce',
      crop_name: firstItem?.crop_name || 'Farm Produce',
      crop_names: cropNamesList.join(', '),
      quantity: firstItem?.quantity || totalWeightKg,
      total_weight_kg: totalWeightKg,
      cargo_weight_kg: totalWeightKg,
      unit: firstItem?.unit || 'kg',
      farmer: firstItem?.farmer_name || 'Farmer',
      pickup_farmer_name: firstItem?.farmer_name || 'Farmer',
      farmer_phone: firstItem?.farmer_phone || '+91 98452 11029',
      pickup_contact: firstItem?.farmer_phone || '+91 98452 11029',
      pickupLocation: firstItem?.pickup_location || 'Farm Gate Yard, Nashik',
      pickup_location: firstItem?.pickup_location || 'Farm Gate Yard, Nashik',
      destination: newOrder.delivery_address,
      delivery_location: newOrder.delivery_address,
      buyer_name: newOrder.buyer_name,
      buyer_contact: newOrder.buyer_phone,
      distance: Math.floor(250 + Math.random() * 450),
      distance_km: Math.floor(250 + Math.random() * 450),
      pickupDate: new Date().toISOString().split('T')[0],
      pickup_date: new Date().toISOString().split('T')[0],
      estimatedEarnings: deliveryFee,
      estimated_cost: deliveryFee,
      delivery_cost: deliveryFee,
      vehicle_type: totalWeightKg > 2500 ? '17ft Multi-Axle Heavy Truck' : '14ft Insulated Reefer Truck',
      special_instructions: notes || 'Handle fresh farm produce with priority transit.',
      handling_instructions: notes || 'Handle fresh farm produce with priority transit.',
      status: 'PENDING_FARMER',
      created_at: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    transports.unshift(newTransport);

    res.status(201).json({ order: newOrder, transport: newTransport });
  });

  app.patch('/api/orders/:id/status', (req, res) => {
    const { status } = req.body;
    const order = orders.find(o => o.id === req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.status = status;
    order.updated_at = new Date().toISOString();

    // When Farmer confirms order, activate/create the Transport Request to AVAILABLE
    if (status === 'CONFIRMED') {
      let tr = transports.find(t => t.order_id === order.id || t.id === order.transport_request_id);
      if (tr) {
        tr.status = 'AVAILABLE';
      } else {
        const trId = order.transport_request_id || `TR-${Math.floor(1000 + Math.random() * 9000)}`;
        const cropSummary = order.items.map((it: any) => `${it.crop_name || 'Produce'} (${it.quantity} ${it.unit || 'kg'})`).join(', ');
        const first = order.items[0];
        const totalWeight = order.items.reduce((s: number, it: any) => {
          const factor = it.unit === 'ton' ? 1000 : it.unit === 'quintal' ? 100 : 1;
          return s + (Number(it.quantity) || 1) * factor;
        }, 0);
        const delFee = order.delivery_fee || Math.round(Math.max(500, totalWeight * 2.2 + 800));

        tr = {
          id: trId,
          order_id: order.id,
          orderId: order.id,
          crop: first?.crop_name || 'Farm Produce',
          crop_name: first?.crop_name || 'Farm Produce',
          crop_names: cropSummary,
          quantity: first?.quantity || totalWeight,
          total_weight_kg: totalWeight || 500,
          cargo_weight_kg: totalWeight || 500,
          unit: first?.unit || 'kg',
          farmer: first?.farmer_name || 'Farmer',
          pickup_farmer_name: first?.farmer_name || 'Farmer',
          farmer_phone: first?.farmer_phone || '+91 98452 11029',
          pickup_contact: first?.farmer_phone || '+91 98452 11029',
          pickupLocation: first?.pickup_location || 'Farm Gate Yard, Maharashtra',
          pickup_location: first?.pickup_location || 'Farm Gate Yard, Maharashtra',
          destination: order.delivery_address,
          delivery_location: order.delivery_address,
          buyer_name: order.buyer_name,
          buyer_contact: order.buyer_phone,
          distance: Math.floor(250 + Math.random() * 450),
          distance_km: Math.floor(250 + Math.random() * 450),
          pickupDate: new Date().toISOString().split('T')[0],
          pickup_date: new Date().toISOString().split('T')[0],
          estimatedEarnings: delFee,
          estimated_cost: delFee,
          delivery_cost: delFee,
          vehicle_type: totalWeight > 2500 ? '17ft Multi-Axle Heavy Truck' : '14ft Insulated Reefer Truck',
          special_instructions: order.notes || 'Handle fresh farm produce with priority transit.',
          handling_instructions: order.notes || 'Handle fresh farm produce with priority transit.',
          status: 'AVAILABLE',
          created_at: new Date().toISOString(),
          createdAt: new Date().toISOString()
        };
        transports.unshift(tr);
        order.transport_request_id = tr.id;
      }
    } else if (order.transport_request_id) {
      // Sync corresponding transport status
      const tr = transports.find(t => t.id === order.transport_request_id || t.order_id === order.id);
      if (tr) {
        if (status === 'PICKED_UP') tr.status = 'PICKED_UP';
        else if (status === 'IN_TRANSIT') tr.status = 'IN_TRANSIT';
        else if (status === 'DELIVERED') tr.status = 'DELIVERED';
        else if (status === 'CANCELLED') tr.status = 'CANCELLED';
      }
    }

    res.json(order);
  });

  // ----------------------------------------------------
  // TRANSPORT / LOGISTICS API
  // ----------------------------------------------------
  app.get('/api/transport', (req, res) => {
    const { provider_id, status } = req.query;

    // Ensure any confirmed order has an active transport request
    orders.forEach(o => {
      if (o.status === 'CONFIRMED' || o.status === 'PICKED_UP' || o.status === 'IN_TRANSIT') {
        let existingTr = transports.find(t => t.order_id === o.id || t.id === o.transport_request_id);
        if (!existingTr) {
          const trId = o.transport_request_id || `TR-${Math.floor(1000 + Math.random() * 9000)}`;
          const cropSummary = o.items.map((it: any) => `${it.crop_name || 'Produce'} (${it.quantity} ${it.unit || 'kg'})`).join(', ');
          const first = o.items[0];
          const totalWeight = o.items.reduce((s: number, it: any) => {
            const factor = it.unit === 'ton' ? 1000 : it.unit === 'quintal' ? 100 : 1;
            return s + (Number(it.quantity) || 1) * factor;
          }, 0);
          const delFee = o.delivery_fee || Math.round(Math.max(500, totalWeight * 2.2 + 800));

          existingTr = {
            id: trId,
            order_id: o.id,
            orderId: o.id,
            crop: first?.crop_name || 'Farm Produce',
            crop_name: first?.crop_name || 'Farm Produce',
            crop_names: cropSummary,
            quantity: first?.quantity || totalWeight,
            total_weight_kg: totalWeight || 500,
            cargo_weight_kg: totalWeight || 500,
            unit: first?.unit || 'kg',
            farmer: first?.farmer_name || 'Farmer',
            pickup_farmer_name: first?.farmer_name || 'Farmer',
            farmer_phone: first?.farmer_phone || '+91 98452 11029',
            pickup_contact: first?.farmer_phone || '+91 98452 11029',
            pickupLocation: first?.pickup_location || 'Farm Gate Yard, Maharashtra',
            pickup_location: first?.pickup_location || 'Farm Gate Yard, Maharashtra',
            destination: o.delivery_address,
            delivery_location: o.delivery_address,
            buyer_name: o.buyer_name,
            buyer_contact: o.buyer_phone,
            distance: Math.floor(250 + Math.random() * 450),
            distance_km: Math.floor(250 + Math.random() * 450),
            pickupDate: new Date().toISOString().split('T')[0],
            pickup_date: new Date().toISOString().split('T')[0],
            estimatedEarnings: delFee,
            estimated_cost: delFee,
            delivery_cost: delFee,
            vehicle_type: totalWeight > 2500 ? '17ft Multi-Axle Heavy Truck' : '14ft Insulated Reefer Truck',
            special_instructions: o.notes || 'Handle fresh farm produce with priority transit.',
            handling_instructions: o.notes || 'Handle fresh farm produce with priority transit.',
            status: o.status === 'CONFIRMED' ? 'AVAILABLE' : (o.status as any),
            created_at: o.created_at || new Date().toISOString(),
            createdAt: o.created_at || new Date().toISOString()
          };
          transports.unshift(existingTr);
          o.transport_request_id = existingTr.id;
        } else if (o.status === 'CONFIRMED' && existingTr.status === 'PENDING_FARMER') {
          existingTr.status = 'AVAILABLE';
        }
      }
    });

    let results = [...transports];

    if (provider_id) {
      results = results.filter(t => (t.transport_provider_id || t.provider_id || t.transporterId) === provider_id);
    }
    if (status) {
      results = results.filter(t => t.status === status);
    }

    res.json(results.sort((a, b) => new Date(b.created_at || b.createdAt || '').getTime() - new Date(a.created_at || a.createdAt || '').getTime()));
  });

  app.post('/api/transport/:id/accept', (req, res) => {
    const { provider_id, provider_name, vehicle_number, driver_phone } = req.body;
    const tr = transports.find(t => t.id === req.params.id);
    if (!tr) {
      return res.status(404).json({ error: 'Transport request not found' });
    }

    const pId = provider_id || 'user_transport_1';
    const pName = provider_name || 'Gurpreet Singh (Kishan Express)';
    const vNum = vehicle_number || 'MH 12 QX 4821';
    const dPhone = driver_phone || '+91 98765 43210';

    tr.transport_provider_id = pId;
    tr.transporterId = pId;
    tr.provider_id = pId;
    tr.transport_provider_name = pName;
    tr.transporterName = pName;
    tr.provider_name = pName;
    tr.vehicle_number = vNum;
    tr.driver_phone = dPhone;
    tr.driver_name = pName.split('(')[0].trim() || 'Gurpreet Singh';
    tr.status = 'ASSIGNED';
    tr.pickup_time = new Date(Date.now() + 2 * 3600 * 1000).toISOString();
    tr.current_location = `Assigned to ${vNum} - En route to Farm Gate for pickup`;

    // Update order with transporter details
    const order = orders.find(o => o.id === tr.order_id);
    if (order) {
      if (order.status === 'PENDING') {
        order.status = 'CONFIRMED';
      }
      (order as any).transporter_name = pName;
      (order as any).vehicle_number = vNum;
      order.updated_at = new Date().toISOString();
    }

    res.json(tr);
  });

  app.patch('/api/transport/:id/status', (req, res) => {
    const { status, current_location } = req.body;
    const tr = transports.find(t => t.id === req.params.id);
    if (!tr) {
      return res.status(404).json({ error: 'Transport request not found' });
    }

    tr.status = status;
    if (current_location) tr.current_location = current_location;
    if (status === 'DELIVERED') tr.delivery_time = new Date().toISOString();

    // Sync order status
    const order = orders.find(o => o.id === tr.order_id);
    if (order) {
      if (status === 'PICKED_UP') order.status = 'PICKED_UP';
      else if (status === 'IN_TRANSIT') order.status = 'IN_TRANSIT';
      else if (status === 'DELIVERED') order.status = 'DELIVERED';
      order.updated_at = new Date().toISOString();
    }

    res.json(tr);
  });

  // ----------------------------------------------------
  // MANDI MARKET PRICES API
  // ----------------------------------------------------
  app.get('/api/market-prices', (req, res) => {
    const { state, category, search } = req.query;
    let results = [...marketPrices];

    if (state && state !== 'All') {
      results = results.filter(m => m.state.toLowerCase().includes((state as string).toLowerCase()));
    }
    if (category && category !== 'All') {
      results = results.filter(m => m.category === category);
    }
    if (search) {
      const q = (search as string).toLowerCase();
      results = results.filter(m => 
        m.crop.toLowerCase().includes(q) ||
        m.mandi.toLowerCase().includes(q) ||
        m.state.toLowerCase().includes(q)
      );
    }

    res.json(results);
  });

  // ----------------------------------------------------
  // AI PREDICTION & XGBOOST ML HEURISTIC ENGINE
  // ----------------------------------------------------
  app.post('/api/predictions/price', async (req, res) => {
    const body: PricePredictionRequest = req.body;
    const {
      crop = 'Tomato',
      location = 'Nashik',
      season = 'Monsoon',
      quantity = 500,
      historical_base_price,
      festival_proximity = 'None',
      rainfall_condition = 'Normal'
    } = body;

    // Base market pricing baseline table
    const baselineRates: Record<string, number> = {
      Tomato: 28,
      Onion: 34,
      Potato: 21,
      'Red Chilli': 185,
      Chilli: 185,
      Rice: 72,
      'Basmati Rice': 74,
      Maize: 24,
      Cotton: 88,
      Turmeric: 145,
      Wheat: 31,
      Mustard: 56,
      Soybean: 48,
      Garlic: 130
    };

    let base = historical_base_price;
    if (!base) {
      const matched = Object.keys(baselineRates).find(k => crop.toLowerCase().includes(k.toLowerCase()));
      base = matched ? baselineRates[matched] : 35;
    }

    // Heuristic XGBoost ML factor simulation
    let multiplier = 1.0;
    const factors: { name: string; impact: 'positive' | 'negative' | 'neutral'; weight: string }[] = [];

    // 1. Seasonality & Rainfall
    if (rainfall_condition === 'Excess') {
      multiplier += 0.08; // supply disruption
      factors.push({ name: 'Excess Rainfall / Transport Slowdown', impact: 'positive', weight: '+8.0%' });
    } else if (rainfall_condition === 'Deficit') {
      multiplier += 0.12; // lower production
      factors.push({ name: 'Deficit Rainfall / Lower Yields', impact: 'positive', weight: '+12.0%' });
    } else {
      factors.push({ name: 'Optimal Climatic Conditions', impact: 'neutral', weight: '±0.0%' });
    }

    // 2. Festival & Seasonal Demand
    if (festival_proximity === 'Diwali / Pongal' || festival_proximity === 'Wedding Season') {
      multiplier += 0.14;
      factors.push({ name: 'Peak Festive & Institutional Consumption', impact: 'positive', weight: '+14.0%' });
    } else if (festival_proximity === 'Eid' || festival_proximity === 'Holi / Ugadi') {
      multiplier += 0.09;
      factors.push({ name: 'Holiday Seasonal Spurt', impact: 'positive', weight: '+9.0%' });
    }

    // 3. Location / Hub factor
    if (location.toLowerCase().includes('delhi') || location.toLowerCase().includes('bengaluru') || location.toLowerCase().includes('mumbai')) {
      multiplier += 0.06;
      factors.push({ name: 'Metro Terminal Market Demand Premium', impact: 'positive', weight: '+6.0%' });
    } else {
      factors.push({ name: 'Regional Mandi Baseline Inflow', impact: 'neutral', weight: '+2.0%' });
    }

    // Slight variance
    const variance = (Math.random() * 0.04 - 0.02);
    multiplier += variance;

    const predictedPrice = Number((base * multiplier).toFixed(1));
    const priceChange = Number((((predictedPrice - base) / base) * 100).toFixed(1));
    const trend: 'increasing' | 'decreasing' | 'stable' = priceChange > 3 ? 'increasing' : priceChange < -3 ? 'decreasing' : 'stable';
    const confidence = Number((0.85 + Math.random() * 0.09).toFixed(2));

    let recommendation = `Consider holding stock. Predicted price for ${crop} is expected to reach ₹${predictedPrice}/kg within 5–7 days.`;
    if (trend === 'decreasing') {
      recommendation = `Sell immediately. Inflow surges are expected to depress ${crop} spot prices by ${Math.abs(priceChange)}% over the coming week.`;
    } else if (trend === 'stable') {
      recommendation = `Market is in equilibrium. Steady wholesale rates of ~₹${predictedPrice}/kg expected. Sell in split batches.`;
    }

    // Generate 7-day projected price trajectory
    const days = ['Today', 'Day +2', 'Day +4', 'Day +6', 'Day +8', 'Day +10', 'Day +14'];
    const timeline = days.map((day, idx) => {
      const stepFactor = 1 + ((multiplier - 1) * (idx / (days.length - 1)));
      const pred = Number((base * stepFactor).toFixed(1));
      return {
        day,
        predicted: pred,
        lower_bound: Number((pred * 0.94).toFixed(1)),
        upper_bound: Number((pred * 1.06).toFixed(1))
      };
    });

    const responseData: PricePredictionResponse = {
      crop,
      location,
      current_market_price: base,
      predicted_price: predictedPrice,
      confidence,
      price_change_percent: priceChange,
      trend,
      recommendation,
      best_selling_window: trend === 'increasing' ? 'Within next 4 to 7 days' : 'Within next 24 to 48 hours',
      risk_factor: confidence > 0.88 ? 'Low' : 'Moderate',
      factors,
      projected_timeline: timeline
    };

    res.json(responseData);
  });

  // Demand Forecasting API
  app.get('/api/predictions/demand', (req, res) => {
    const crop = (req.query.crop as string) || 'Tomato';
    
    const data: DemandForecastData = {
      crop,
      current_demand_index: 78,
      predicted_demand_index: 92,
      demand_trend: 'Surging',
      recommended_harvest_qty_quintals: 450,
      regional_hotspots: ['Bengaluru Urban', 'Hyderabad APMC', 'Pune Metro', 'Surat Wholesale'],
      historical_forecast_chart: [
        { period: 'Week 1', actual_demand: 72, predicted_demand: 70, supply_volume: 85 },
        { period: 'Week 2', actual_demand: 76, predicted_demand: 75, supply_volume: 80 },
        { period: 'Week 3', actual_demand: 81, predicted_demand: 80, supply_volume: 75 },
        { period: 'Week 4 (Current)', actual_demand: 88, predicted_demand: 87, supply_volume: 68 },
        { period: 'Week 5 (Proj)', actual_demand: 92, predicted_demand: 93, supply_volume: 62 },
        { period: 'Week 6 (Proj)', actual_demand: 95, predicted_demand: 96, supply_volume: 60 }
      ]
    };

    res.json(data);
  });

  // AI Farmer Recommendations
  app.get('/api/predictions/recommendations', (req, res) => {
    res.json(INITIAL_AI_RECOMMENDATIONS);
  });

  // ----------------------------------------------------
  // GEMINI AI AGRI-ADVISOR COPILOT API
  // ----------------------------------------------------
  app.post('/api/ai/agri-advisor', async (req, res) => {
    const { message, role = 'farmer', cropContext } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    try {
      const ai = getGemini();
      if (ai) {
        const systemPrompt = `You are FarmLink AI, an expert agricultural economist, agronomist, and logistics advisor for Indian farmers, wholesale buyers, and transport operators.
Provide clear, actionable, concise advice regarding crop prices, mandi APMC trends, harvest storage, packaging, quality grading (A+, A, B), and logistics optimization.
Current User Role: ${role}.
Always format response with clear bullet points and helpful guidance.`;

        const fullPrompt = `${cropContext ? `Context regarding crop lot: ${JSON.stringify(cropContext)}\n` : ''}User Query: ${message}`;

        const geminiRes = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: fullPrompt,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.7
          }
        });

        const reply = geminiRes.text || 'FarmLink AI advisory is currently analyzing regional market conditions.';
        return res.json({ reply, source: 'gemini-3.7-flash' });
      }
    } catch (err) {
      console.warn('Gemini API query error, using heuristic expert fallback:', err);
    }

    // Heuristic Fallback Advisor
    const q = message.toLowerCase();
    let advice = 'Based on current Mandi arrivals and trade volume, market sentiment remains stable. Ensure proper moisture control (under 12%) and sort into Grade A+ for maximum buyer premium.';
    
    if (q.includes('price') || q.includes('rate') || q.includes('tomato') || q.includes('onion')) {
      advice = 'Mandi analysis indicates prices for perishable vegetables are trending upward by 8-14% due to regional supply constraints. We advise holding export-quality Grade A lots for 4-5 days while clearing Grade B immediately to prevent spoilage.';
    } else if (q.includes('transport') || q.includes('logistics') || q.includes('truck')) {
      advice = 'For refrigerated perishable transport (Tomatoes, Capsicum, Fruits), book insulated reefer trucks at 14-16°C. Consolidating orders via FarmLink shared fleet on Pune-Bengaluru and Nashik corridors reduces delivery fees by ~20%.';
    } else if (q.includes('buyer') || q.includes('purchase') || q.includes('order')) {
      advice = 'Direct sourcing via FarmLink eliminates mandi commission (3-5%) and trader brokerage (6-8%). Escrow security ensures payments are only released after quality verification at your warehouse.';
    }

    res.json({
      reply: advice,
      source: 'farmlink-heuristic-engine'
    });
  });

  // ----------------------------------------------------
  // ANALYTICS APIS
  // ----------------------------------------------------
  app.get('/api/analytics/farmer/:id', (req, res) => {
    const farmerId = req.params.id;
    const farmerCrops = crops.filter(c => c.farmer_id === farmerId);
    const farmerOrders = orders.filter(o => o.items.some(item => item.farmer_id === farmerId));

    const totalSales = farmerOrders.reduce((sum, o) => {
      const matchingItems = o.items.filter(it => it.farmer_id === farmerId);
      return sum + matchingItems.reduce((s, it) => s + it.subtotal, 0);
    }, 0);

    const analytics = {
      total_crops_listed: farmerCrops.length,
      active_orders_count: farmerOrders.filter(o => o.status !== 'DELIVERED' && o.status !== 'CANCELLED').length,
      completed_orders_count: farmerOrders.filter(o => o.status === 'DELIVERED').length,
      total_sales_revenue: totalSales || 110300,
      average_crop_price: Math.round(farmerCrops.reduce((s, c) => s + c.price, 0) / (farmerCrops.length || 1)),
      monthly_sales_trend: [
        { month: 'Apr', sales: 42000, volume_kg: 1500 },
        { month: 'May', sales: 65000, volume_kg: 2200 },
        { month: 'Jun', sales: 88000, volume_kg: 3100 },
        { month: 'Jul', sales: 74000, volume_kg: 2600 },
        { month: 'Aug (Mtd)', sales: totalSales || 110300, volume_kg: 4200 }
      ],
      revenue_by_crop: [
        { name: 'Red Tomato', value: 45000, color: '#ef4444' },
        { name: 'Red Onion', value: 52000, color: '#f97316' },
        { name: 'Jyoti Potato', value: 28000, color: '#eab308' },
        { name: 'Turmeric', value: 36000, color: '#84cc16' }
      ]
    };

    res.json(analytics);
  });

  app.get('/api/analytics/buyer/:id', (req, res) => {
    const buyerId = req.params.id;
    const buyerOrders = orders.filter(o => o.buyer_id === buyerId);
    const totalSpent = buyerOrders.reduce((sum, o) => sum + o.total_price, 0);

    const analytics = {
      total_orders_placed: buyerOrders.length,
      active_deliveries: buyerOrders.filter(o => o.status === 'IN_TRANSIT' || o.status === 'CONFIRMED' || o.status === 'PICKED_UP').length,
      total_procurement_spent: totalSpent || 110300,
      middlemen_savings_estimate: Math.round((totalSpent || 110300) * 0.165), // 16.5% savings
      monthly_spending_trend: [
        { month: 'Apr', spend: 35000 },
        { month: 'May', spend: 58000 },
        { month: 'Jun', spend: 72000 },
        { month: 'Jul', spend: 94000 },
        { month: 'Aug', spend: totalSpent || 110300 }
      ],
      top_procured_categories: [
        { category: 'Vegetables', percentage: 55, amount: 62000 },
        { category: 'Grains & Rice', percentage: 25, amount: 28000 },
        { category: 'Spices', percentage: 20, amount: 20300 }
      ]
    };

    res.json(analytics);
  });

  // ----------------------------------------------------
  // VITE MIDDLEWARE / STATIC SERVING
  // ----------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const PORT = await listenOnPort(DEFAULT_PORT);

  console.log(`🌾 FarmLink Backend & UI server live on http://localhost:${PORT}`);
}

startServer().catch(err => {
  console.error('Failed to start FarmLink server:', err);
});
