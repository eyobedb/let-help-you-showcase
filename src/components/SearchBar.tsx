import { Search } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const { t } = useLanguage();

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-emerald-500" />
      </div>
      <input
        type="text"
        className="block w-full pl-12 pr-4 py-4 bg-white border-2 border-emerald-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-emerald-900 placeholder:text-emerald-700/40 font-medium shadow-sm"
        placeholder={t.hero.searchPlaceholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="absolute inset-y-2 right-2 flex items-center">
        <div className="bg-amber-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm">
          Addis Ababa
        </div>
      </div>
    </div>
  );
}