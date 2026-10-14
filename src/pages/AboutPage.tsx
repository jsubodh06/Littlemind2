import React from 'react';
import { SproutDoodle, LeafDoodle, SquiggleUnderline } from '../components/common/DoodleAccents';
import { ShieldCheck, Heart, Award, Sparkles } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#7BA88B] bg-[#EBF4EE] px-3.5 py-1.5 rounded-full mb-3">
          <SproutDoodle className="w-4 h-4 text-[#588469]" />
          <span>Our Story & Philosophy</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#3B2F2F] tracking-tight">
          Crafting Childhood As Nature Intended
        </h1>
        <div className="flex justify-center text-[#E2725B] mt-2">
          <SquiggleUnderline className="w-28 h-3" />
        </div>
        <p className="text-sm text-[#6E5A5A] mt-4 leading-relaxed">
          Founded by AMI-certified Montessori teachers and architectural furniture designers, Little Sprout replaces loud flashing electronics with calming natural wood.
        </p>
      </div>

      {/* Image Banner */}
      <div className="rounded-[32px] overflow-hidden shadow-xl border border-[#F4EADB] aspect-[16/8] relative">
        <img
          src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1600&q=80"
          alt="Little Sprout Woodshop craftsmanship"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-8 text-white">
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold">The Bengaluru Woodcraft Studio</h3>
            <p className="text-xs text-white/80">Every curve hand-sanded with 400-grit velvet finish</p>
          </div>
        </div>
      </div>

      {/* 3 Core Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-3xl p-7 border border-[#F4EADB] shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#EBF4EE] text-[#588469] flex items-center justify-center font-bold">
            <LeafDoodle className="w-6 h-6 text-[#588469]" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#3B2F2F]">Sustainably Sourced Wood</h3>
          <p className="text-xs text-[#6E5A5A] leading-relaxed">
            We exclusively choose FSC-certified European Birch and steam-treated German Beechwood. Never compressed MDF or formaldehyde glues.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-7 border border-[#F4EADB] shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FDEEEB] text-[#E2725B] flex items-center justify-center font-bold">
            <Heart className="w-6 h-6 text-[#E2725B]" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#3B2F2F]">Edible Oil Finishes</h3>
          <p className="text-xs text-[#6E5A5A] leading-relaxed">
            Babies explore the world through their mouths. Our materials are polished exclusively with cold-pressed coconut oil and natural beeswax.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-7 border border-[#F4EADB] shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FEF8E7] text-sunshine-dark flex items-center justify-center font-bold">
            <Award className="w-6 h-6 text-sunshine-dark" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#3B2F2F]">Built for Heirloom Play</h3>
          <p className="text-xs text-[#6E5A5A] leading-relaxed">
            Tested up to 60-150 kg dynamic loads. Designed to survive years of active toddler climbing and be passed to younger siblings.
          </p>
        </div>
      </div>
    </div>
  );
};
