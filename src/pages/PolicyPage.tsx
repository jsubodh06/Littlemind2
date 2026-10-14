import React, { useState } from 'react';
import { ShieldCheck, RotateCcw, FileText } from 'lucide-react';
import { SquiggleUnderline } from '../components/common/DoodleAccents';

interface PolicyPageProps {
  initialType?: string;
}

export const PolicyPage: React.FC<PolicyPageProps> = ({ initialType = 'refund' }) => {
  const [tab, setTab] = useState<'refund' | 'privacy' | 'terms'>(
    (initialType as any) || 'refund'
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="text-center mb-10">
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#3B2F2F]">
          Policies & Customer Peace of Mind
        </h1>
        <div className="flex justify-center text-[#E2725B] mt-1">
          <SquiggleUnderline className="w-24 h-3" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center border-b border-[#F4EADB] mb-10 gap-4 sm:gap-8">
        <button
          onClick={() => setTab('refund')}
          className={`pb-3 font-serif text-sm sm:text-base font-bold flex items-center gap-2 transition-all relative ${
            tab === 'refund' ? 'text-[#E2725B]' : 'text-[#948282] hover:text-[#3B2F2F]'
          }`}
        >
          <RotateCcw className="w-4 h-4" /> 15-Day Return & Refund
          {tab === 'refund' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#E2725B]" />}
        </button>

        <button
          onClick={() => setTab('privacy')}
          className={`pb-3 font-serif text-sm sm:text-base font-bold flex items-center gap-2 transition-all relative ${
            tab === 'privacy' ? 'text-[#E2725B]' : 'text-[#948282] hover:text-[#3B2F2F]'
          }`}
        >
          <ShieldCheck className="w-4 h-4" /> Privacy Policy
          {tab === 'privacy' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#E2725B]" />}
        </button>

        <button
          onClick={() => setTab('terms')}
          className={`pb-3 font-serif text-sm sm:text-base font-bold flex items-center gap-2 transition-all relative ${
            tab === 'terms' ? 'text-[#E2725B]' : 'text-[#948282] hover:text-[#3B2F2F]'
          }`}
        >
          <FileText className="w-4 h-4" /> Terms of Service
          {tab === 'terms' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#E2725B]" />}
        </button>
      </div>

      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#F4EADB] shadow-sm text-xs sm:text-sm text-[#6E5A5A] leading-relaxed space-y-6">
        {tab === 'refund' && (
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#3B2F2F]">
              15-Day Unconditional Replacement & Refund Policy
            </h3>
            <p>
              We stand behind the quality of every piece of wood that leaves our studio. If an item arrives damaged during transit, or if you notice any manufacturing defect, we provide a free door-step pickup and instant replacement or full refund within 15 calendar days of delivery.
            </p>
            <h4 className="font-serif font-bold text-base text-[#3B2F2F] pt-2">Return Conditions</h4>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Item must be in its original packaging with all wooden components and hardware.</li>
              <li>Proof of purchase (order number or invoice copy).</li>
              <li>Pickup will be scheduled with our insured logistics partner at zero cost to you.</li>
            </ul>
            <h4 className="font-serif font-bold text-base text-[#3B2F2F] pt-2">1-Year Wood Joint Guarantee</h4>
            <p>
              All active play furniture (Pikler Triangles, Arch Rockers, and Learning Towers) includes a 1-year structural guarantee on joints and rungs.
            </p>
          </div>
        )}

        {tab === 'privacy' && (
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#3B2F2F]">
              Privacy & Family Data Protection
            </h3>
            <p>
              Little Sprout takes family and child privacy with absolute gravity. We never sell, rent, or lease your personal contact information to any third-party marketing broker.
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Information We Collect:</strong> Name, delivery address, email, phone number, and order history strictly for logistics fulfillment and WhatsApp dispatch notifications.</li>
              <li><strong>Payment Security:</strong> We do not store card numbers or banking passwords. Payments are securely processed via Razorpay's PCI-DSS Level 1 certified gateways.</li>
              <li><strong>Account Deletion:</strong> You may request complete erasure of your profile and data by emailing care@littlesproutplay.com.</li>
            </ul>
          </div>
        )}

        {tab === 'terms' && (
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#3B2F2F]">
              Terms of Service & Usage
            </h3>
            <p>
              By accessing and purchasing from Little Sprout, you agree to these terms:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Parental Supervision:</strong> While all Little Sprout climbing gyms and toys are tested to rigorous safety standards, active gross motor play always requires reasonable adult supervision.</li>
              <li><strong>Wood Character:</strong> Real wood possesses natural grain variances, subtle mineral lines, and warm coloration. These natural traits are signatures of authentic timber and are not defects.</li>
              <li><strong>Delivery Timelines:</strong> Standard orders dispatch within 24-48 business hours. Deliveries may experience occasional transit delays during regional monsoon conditions or public holidays.</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
