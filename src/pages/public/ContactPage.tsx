import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, Clock } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: 'Farmer Support', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider">
            Mandi & Regional Support
          </span>
          <h1 className="text-3xl font-black text-emerald-950 font-['Outfit',sans-serif]">
            Get in Touch with FarmLink
          </h1>
          <p className="text-emerald-700/80 text-sm font-medium">
            Have questions about mandi price predictions, buyer escrow, or fleet onboarding? Our team is here to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Contact Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="glass p-6 sm:p-7 rounded-3xl border border-white/80 shadow-md space-y-4 text-xs text-emerald-900 font-medium">
              <h3 className="font-black text-emerald-950 text-base">Regional Support Hubs</h3>
              
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-950 block font-bold">Maharashtra Agri-Tech Centre:</strong>
                  Plot 14, APMC Market Yard Complex, Lasalgaon / Nashik - 422306
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-950 block font-bold">South India Distribution Hub:</strong>
                  Yeshwanthpur APMC Wholesale Yard, Outer Ring Rd, Bengaluru - 560022
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-emerald-100/60">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <strong className="text-emerald-950 block font-bold">Farmer Helpline (Toll-Free):</strong>
                  1800-419-FARM (1800 419 3276)
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <strong className="text-emerald-950 block font-bold">Support Email:</strong>
                  support@farmlink.io
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <strong className="text-emerald-950 block font-bold">Mandi Trading Desk Hours:</strong>
                  Mon – Sat: 5:00 AM – 9:00 PM IST
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-7">
            <div className="glass p-6 sm:p-8 rounded-3xl border border-white/80 shadow-md">
              {submitted ? (
                <div className="text-center py-10 space-y-3">
                  <div className="w-12 h-12 bg-emerald-500/20 text-emerald-700 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black text-emerald-950">Message Received</h3>
                  <p className="text-xs text-emerald-700/80 max-w-md mx-auto font-medium">
                    Thank you! An APMC coordinator or technical advisor from FarmLink will contact you within 2 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 text-xs font-bold text-emerald-700 hover:text-emerald-900 underline cursor-pointer"
                  >
                    Send another query
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="font-black text-emerald-950 text-base mb-2">Send us a Message</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-emerald-950 mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. Ramesh Patel"
                        className="w-full bg-white/70 border border-emerald-200/80 rounded-2xl px-3.5 py-2.5 text-xs text-emerald-950 font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none shadow-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-emerald-950 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full bg-white/70 border border-emerald-200/80 rounded-2xl px-3.5 py-2.5 text-xs text-emerald-950 font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none shadow-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-emerald-950 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      placeholder="ramesh@example.com"
                      className="w-full bg-white/70 border border-emerald-200/80 rounded-2xl px-3.5 py-2.5 text-xs text-emerald-950 font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-emerald-950 mb-1">Inquiry Topic</label>
                    <select
                      value={form.subject}
                      onChange={e => setForm({ ...form, subject: e.target.value })}
                      className="w-full bg-white/70 border border-emerald-200/80 rounded-2xl px-3.5 py-2.5 text-xs text-emerald-950 font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none shadow-xs"
                    >
                      <option>Farmer Crop Listing & AI Pricing</option>
                      <option>Wholesale Buyer Bulk Procurement</option>
                      <option>Fleet / Truck Carrier Registration</option>
                      <option>FPO (Farmer Producer Organization) Partnership</option>
                      <option>Other Support Query</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-emerald-950 mb-1">Details / Message</label>
                    <textarea
                      rows={4}
                      required
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      placeholder="Please specify crop quantity, location, or question..."
                      className="w-full bg-white/70 border border-emerald-200/80 rounded-2xl px-3.5 py-2.5 text-xs text-emerald-950 font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none shadow-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Inquiry</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
