import { useLanguage } from '../hooks/useLanguage';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { CreditCard, Wallet, CheckCircle2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (bookingData?: any) => void;
  professionalId?: string;
  employerId?: string;
}

export function PaymentModal({ isOpen, onClose, onSuccess, professionalId, employerId }: PaymentModalProps) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    
    // Simulate payment network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      if (supabase && professionalId && employerId) {
        // Record the transaction in the bookings table
        const { error: bookingError } = await supabase
          .from('bookings')
          .insert({
            employer_id: employerId,
            professional_id: professionalId,
            amount: 50,
            payment_method: 'telebirr',
            created_at: new Date().toISOString()
          });

        if (bookingError) {
          console.error('Error recording booking:', bookingError);
        }

        // Also record in unlocked_contacts for UI feedback
        const { error: unlockError } = await supabase
          .from('unlocked_contacts')
          .insert({
            employer_id: employerId,
            professional_id: professionalId,
            created_at: new Date().toISOString()
          });

        if (unlockError) {
          console.error('Error unlocking contact:', unlockError);
        }
      }

      toast.success(t.modal.success, {
        icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(t.common.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] border-emerald-100 rounded-[2rem] p-0 overflow-hidden">
        <DialogHeader className="bg-emerald-900 text-white p-8">
          <DialogTitle className="text-3xl font-black">{t.modal.title}</DialogTitle>
          <DialogDescription className="text-emerald-100/70 text-base font-medium">
            {t.modal.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-8 space-y-6">
          <div className="rounded-[1.5rem] border-2 border-amber-200 bg-amber-50/50 p-6">
            <p className="text-sm text-emerald-900 font-bold text-center mb-6">
              {t.modal.instructions}
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-emerald-100 bg-white hover:border-amber-400 cursor-pointer transition-all shadow-sm">
                <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
                  <Wallet className="h-6 w-6 text-emerald-600" />
                </div>
                <span className="text-sm font-bold text-emerald-900">Telebirr</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-emerald-100 bg-white hover:border-amber-400 cursor-pointer transition-all shadow-sm">
                <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
                  <CreditCard className="h-6 w-6 text-red-600" />
                </div>
                <span className="text-sm font-bold text-emerald-900">M-Pesa</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between px-6 py-5 bg-emerald-900 text-white rounded-2xl shadow-xl shadow-emerald-100">
            <span className="font-bold">Total Amount:</span>
            <span className="text-2xl font-black text-amber-400">50 ETB</span>
          </div>
        </div>

        <DialogFooter className="p-8 pt-0 flex flex-col gap-3 sm:flex-row">
          <Button variant="ghost" onClick={onClose} disabled={loading} className="rounded-xl font-bold">
            {t.modal.cancel}
          </Button>
          <Button 
            className="bg-amber-500 hover:bg-amber-600 text-emerald-900 h-14 px-8 rounded-xl font-black flex-1 shadow-lg shadow-amber-100 transition-all transform active:scale-95" 
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-6 w-6 animate-spin mr-2" /> : <CheckCircle2 className="h-6 w-6 mr-2" />}
            {loading ? 'Processing...' : t.modal.payNow}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}