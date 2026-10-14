import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Mail, Phone, MapPin, Send, CheckCircle, MessageSquare } from 'lucide-react';
import { SproutDoodle, SquiggleUnderline } from '../components/common/DoodleAccents';

export const ContactPage: React.FC = () => {
  const { settings } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="text-center max-w-xl mx-auto mb-14">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#7BA88B] bg-[#EBF4EE] px-3.5 py-1.5 rounded-full mb-3">
          <SproutDoodle className="w-4 h-4 text-[#588469]" />
          <span>We're Here For You</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#3B2F2F]">
          Get In Touch With Little Sprout
        </h1>
        <div className="flex justify-center text-[#E2725B] mt-1">
          <SquiggleUnderline className="w-24 h-3" />
        </div>
        <p className="text-xs sm:text-sm text-[#6E5A5A] mt-2">
          Questions about milestones, wood finishes, or bulk kindergarten orders? We reply within 24 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Info Column */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-8 border border-[#F4EADB] shadow-sm space-y-6">
          <h3 className="font-serif text-xl font-bold text-[#3B2F2F]">Direct Contacts</h3>

          <div className="space-y-4 text-xs text-[#6E5A5A]">
            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-[#7BA88B] mt-0.5" />
              <div>
                <strong className="text-[#3B2F2F] block">Phone & WhatsApp</strong>
                <span>{settings.contactPhone}</span>
                <p className="text-[10px] text-[#948282]">Mon-Sat: 9:30 AM to 6:30 PM IST</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-[#7BA88B] mt-0.5" />
              <div>
                <strong className="text-[#3B2F2F] block">Customer Care Email</strong>
                <span>{settings.contactEmail}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#7BA88B] mt-0.5" />
              <div>
                <strong className="text-[#3B2F2F] block">Studio & Fulfillment Warehouse</strong>
                <span>Little Sprout Playcrafts Pvt Ltd</span>
                <p className="text-[11px] text-[#948282]">
                  Plot 18, Phase 2, Peenya Industrial Area, Bengaluru, Karnataka 560058
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#F4EADB]">
            <a
              href="https://wa.me/919845012345"
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <MessageSquare className="w-4 h-4" /> Chat on WhatsApp
            </a>
          </div>
        </div>

        {/* Contact Form Column */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-[#F4EADB] shadow-sm">
          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <CheckCircle className="w-12 h-12 text-[#7BA88B] mx-auto" />
              <h3 className="font-serif text-xl font-bold text-[#3B2F2F]">Message Received!</h3>
              <p className="text-xs text-[#6E5A5A] max-w-sm mx-auto">
                Thank you for reaching out. A Montessori play specialist will get in touch with you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="font-serif text-xl font-bold text-[#3B2F2F] mb-4">Send Us a Message</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#3B2F2F] block mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maya Patel"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FFF8EF] rounded-xl border border-[#F4EADB] focus:outline-none focus:border-[#7BA88B]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#3B2F2F] block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. maya@gmail.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FFF8EF] rounded-xl border border-[#F4EADB] focus:outline-none focus:border-[#7BA88B]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#3B2F2F] block mb-1">How can we help? *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Ask about dimensions, age suitability, or shipping queries..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FFF8EF] rounded-xl border border-[#F4EADB] focus:outline-none focus:border-[#7BA88B]"
                />
              </div>

              <button
                type="submit"
                className="px-8 py-3 bg-[#E2725B] hover:bg-[#C45540] text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all"
              >
                <Send className="w-3.5 h-3.5" /> Send Inquiry
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
