import React from 'react';

export const SproutDoodle: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M24 42V26" />
    <path d="M24 26C24 16 36 12 38 12C38 22 28 26 24 26Z" fill="currentColor" fillOpacity="0.15" />
    <path d="M24 30C24 22 14 18 10 20C10 30 20 30 24 30Z" fill="currentColor" fillOpacity="0.15" />
    <circle cx="24" cy="43" r="2" fill="currentColor" />
  </svg>
);

export const StarDoodle: React.FC<{ className?: string }> = ({ className = 'w-5 h-5 text-sunshine' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L14.2 8.6L21 9.2L15.8 13.8L17.4 20.6L12 16.8L6.6 20.6L8.2 13.8L3 9.2L9.8 8.6L12 2Z" />
  </svg>
);

export const SunRaysDoodle: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className}>
    <circle cx="24" cy="24" r="8" fill="currentColor" fillOpacity="0.2" />
    <path d="M24 6V10M24 38V42M6 24H10M38 24H42M11.3 11.3L14.1 14.1M33.9 33.9L36.7 36.7M11.3 36.7L14.1 33.9M33.9 14.1L36.7 11.3" />
  </svg>
);

export const SquiggleUnderline: React.FC<{ className?: string }> = ({ className = 'w-32 h-3' }) => (
  <svg viewBox="0 0 120 12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className={className}>
    <path d="M3 8C20 2 30 11 48 6C66 1 78 10 95 6C105 3 112 7 117 8" />
  </svg>
);

export const LeafDoodle: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 26C10 20 12 14 26 6C26 20 20 22 6 26Z" fill="currentColor" fillOpacity="0.15" />
    <path d="M6 26L18 14" />
  </svg>
);

export const RainbowDoodle: React.FC<{ className?: string }> = ({ className = 'w-16 h-10' }) => (
  <svg viewBox="0 0 64 36" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className={className}>
    <path d="M6 32C6 16.5 17.6 4 32 4C46.4 4 58 16.5 58 32" stroke="#E2725B" />
    <path d="M14 32C14 21 22 12 32 12C42 12 50 21 50 32" stroke="#F6C453" />
    <path d="M22 32C22 25.5 26.5 20 32 20C37.5 20 42 25.5 42 32" stroke="#7BA88B" />
  </svg>
);
