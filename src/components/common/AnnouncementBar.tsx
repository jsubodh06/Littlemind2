import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowRight, Sparkles } from 'lucide-react';

interface AnnouncementBarProps {
  onNavigate?: (path: string) => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ onNavigate }) => {
  const { settings } = useStore();

  if (!settings.announcementBarActive || !settings.announcementBarText) {
    return null;
  }

  const handleClick = () => {
    if (onNavigate && settings.announcementBarLink) {
      onNavigate(settings.announcementBarLink);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`bg-[#588469] text-[#FFF8EF] py-2 px-4 text-xs md:text-sm font-medium tracking-wide flex items-center justify-center gap-2 transition-colors cursor-pointer select-none hover:bg-[#436650]`}
    >
      <Sparkles className="w-3.5 h-3.5 text-sunshine animate-pulse shrink-0" />
      <span className="text-center truncate">{settings.announcementBarText}</span>
      <ArrowRight className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
    </div>
  );
};
