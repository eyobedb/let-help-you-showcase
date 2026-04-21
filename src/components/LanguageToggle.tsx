import { useLanguage } from '../hooks/useLanguage';
import { Button } from './ui/button';
import { Globe } from 'lucide-react';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50"
      onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
    >
      <Globe className="h-4 w-4" />
      {language === 'en' ? 'አማርኛ' : 'English'}
    </Button>
  );
}