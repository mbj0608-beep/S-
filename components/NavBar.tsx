import React from 'react';
import { LayoutGrid, PenTool, School, User } from 'lucide-react';

export type ViewType = 'works' | 'create' | 'study' | 'profile';

interface Props {
  currentView: ViewType;
  onChangeView: (view: ViewType) => void;
}

const NavBar: React.FC<Props> = ({ currentView, onChangeView }) => {
  const navItems: { id: ViewType; icon: React.ReactNode; label: string }[] = [
    { id: 'create', icon: <PenTool size={20} />, label: '创作' },
    { id: 'works', icon: <LayoutGrid size={20} />, label: '作品' },
    { id: 'study', icon: <School size={20} />, label: '进修' },
    { id: 'profile', icon: <User size={20} />, label: '主页' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2 pb-6 z-40">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onChangeView(item.id)}
            className={`flex flex-col items-center gap-1 transition-colors ${
              currentView === item.id ? 'text-emerald-600 font-bold' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {item.icon}
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default NavBar;