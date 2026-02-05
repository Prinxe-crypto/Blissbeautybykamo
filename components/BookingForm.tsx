import React, { useState, useMemo, useEffect } from 'react';
import { BookingData } from '../types';

interface BookingFormProps {
  customServices: any;
  bankDetails: {
    accountNumber: string;
    bankName: string;
    proofNumber: string;
  };
}

const BookingForm: React.FC<BookingFormProps> = ({ customServices, bankDetails }) => {
  const allServices = useMemo(() => {
    return Object.values(customServices).flat() as { name: string, price: string }[];
  }, [customServices]);
  
  const [formData, setFormData] = useState<BookingData>({
    serviceId: allServices[0]?.name || '',
    date: '',
    time: '',
    name: '',
    notes: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Price for selected service
  const selectedServicePrice = useMemo(() => {
    return allServices.find(s => s.name === formData.serviceId)?.price || 'R0';
  }, [formData.serviceId, allServices]);

  useEffect(() => {
    if (isSubmitted) {
      const el = document.getElementById('booking-success');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.focus();
      }
    }
  }, [isSubmitted]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const bookingDate = new Date(formData.date);
    
    if (!formData.date) {
      newErrors.date = 'Please select a date';
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (bookingDate < today) {
        newErrors.date = 'Date must be in the future';
      }
      if (bookingDate.getUTCDay() === 0) {
        newErrors.date = 'We are closed on Sundays';
      }
    }

    if (!formData.time) {
      newErrors.time = 'Please select a time';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setShowConfirmation(true);
    }
  };

  const handleFinalSubmit = () => {
    setIsSubmitting(true);
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 35;
      if (p >= 100) {
        clearInterval(interval);
        setSubmitProgress(100);
        setTimeout(() => {
          setIsSubmitting(false);
          setShowConfirmation(false);
          setIsSubmitted(true);
        }, 300);
      } else {
        setSubmitProgress(p);
      }
    }, 200);
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setFormData({
      serviceId: allServices[0]?.name || '',
      date: '',
      time: '',
      name: '',
      notes: ''
    });
    // Scroll back to the booking section
    setTimeout(() => {
      const bookingSection = document.getElementById('booking');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleSendProof = () => {
    const message = encodeURIComponent(`Hi Kamo, it’s ${formData.name}
I’ve just sent the payment.

Booking details:
Service: ${formData.serviceId}
Date: ${formData.date}
Time: ${formData.time}

Please confirm once received. Thank you`);
    
    window.open(`https://wa.me/${bankDetails.proofNumber.replace(/\s/g, '')}?text=${message}`, '_blank');
  };

  if (isSubmitted) {
    return (
      <section id="booking-success" tabIndex={-1} className="py-32 outline-none" style={{ backgroundColor: 'var(--theme-bg-surface)' }}>
        <div className="max-w-2xl mx-auto px-6 text-center animate-in fade-in zoom-in duration-700">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl" style={{ backgroundColor: 'var(--theme-primary)', color: 'white' }}>
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 serif italic" style={{ color: 'var(--theme-text-main)' }}>Request Sent Successfully</h2>
          
          <div className="mb-10 text-lg text-stone-500 italic leading-relaxed space-y-4">
            <p>Thank you, <strong>{formData.name}</strong> for booking with <strong>BlissBeautyByKamo</strong>! Your session for <strong>{formData.serviceId}</strong> is reserved pending your R50 deposit.</p>
            <p className="text-sm font-bold not-italic" style={{ color: 'var(--theme-primary)' }}>Please note: Your booking will be fully confirmed only once Kamo herself approves it on WhatsApp.</p>
            <p>We look forward to giving you an amazing nail experience.</p>
          </div>
          
          <div className="p-10 rounded-[2.5rem] border-2 border-dashed mb-6" style={{ borderColor: 'var(--theme-border)', backgroundColor: 'var(--theme-bg-main)' }}>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 opacity-50">Deposit Confirmation</p>
            <p className="text-sm mb-8 italic">Please pay the R50 non-refundable booking fee and share your proof of payment.</p>
            
            <div className="max-w-xs mx-auto text-center mb-10">
              <div className="border-t border-stone-200/60 py-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">Bank</p>
                <p className="text-lg font-black uppercase tracking-[0.1em]">{bankDetails.bankName}</p>
              </div>
              
              <div className="border-t border-stone-200/60 py-4">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">Account Number</p>
                <p className="text-2xl font-black tracking-tighter">{bankDetails.accountNumber}</p>
              </div>
              
              <div className="border-t border-stone-200/60 py-4">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">WhatsApp Verification Number</p>
                <p className="text-xl font-black tracking-tighter">{bankDetails.proofNumber}</p>
              </div>
              <div className="border-t border-stone-200/60"></div>
            </div>

            <button 
              onClick={handleSendProof} 
              className="px-10 py-5 rounded-full font-black text-[11px] uppercase tracking-widest text-white shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-4 mx-auto w-full sm:w-auto" 
              style={{ backgroundColor: '#25D366' }}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              Send Proof of Payment
            </button>
          </div>
          
          <button 
            onClick={resetForm}
            className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 hover:opacity-100 transition-opacity border-b border-transparent hover:border-stone-300 pb-1"
          >
            Go Back | Done
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="py-24 scroll-mt-24" style={{ backgroundColor: 'var(--theme-bg-surface)' }}>
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.4em] mb-4 block" style={{ color: 'var(--theme-primary)' }}>Reservation Portal</span>
          <h2 className="text-5xl md:text-7xl font-bold serif italic" style={{ color: 'var(--theme-text-main)' }}>Secure Your Slot</h2>
        </div>

        <form onSubmit={handlePreSubmit} className="grid md:grid-cols-2 gap-8 bg-white p-10 md:p-16 rounded-[4rem] border shadow-xl" style={{ borderColor: 'var(--theme-border)' }}>
          <div className="md:col-span-2">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-3 opacity-50">Select Masterpiece Service</label>
            <select 
              value={formData.serviceId} 
              onChange={(e) => setFormData({...formData, serviceId: e.target.value})}
              className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-[var(--theme-accent)] transition-all font-medium appearance-none"
            >
              {allServices.map(s => <option key={s.name} value={s.name}>{s.name} ({s.price})</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-3 opacity-50">Preferred Date</label>
            <input 
              type="date" 
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className={`w-full bg-stone-50 border ${errors.date ? 'border-red-500' : 'border-stone-100'} rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-[var(--theme-accent)] transition-all`}
            />
            {errors.date && <p className="text-[10px] text-red-500 mt-2 font-bold uppercase">{errors.date}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-3 opacity-50">Preferred Time</label>
            <input 
              type="time" 
              value={formData.time}
              onChange={(e) => setFormData({...formData, time: e.target.value})}
              className={`w-full bg-stone-50 border ${errors.time ? 'border-red-500' : 'border-stone-100'} rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-[var(--theme-accent)] transition-all`}
            />
            {errors.time && <p className="text-[10px] text-red-500 mt-2 font-bold uppercase">{errors.time}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-3 opacity-50">Your Full Name</label>
            <input 
              type="text" 
              placeholder="Bongi Nkosi"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className={`w-full bg-stone-50 border ${errors.name ? 'border-red-500' : 'border-stone-100'} rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-[var(--theme-accent)] transition-all`}
            />
            {errors.name && <p className="text-[10px] text-red-500 mt-2 font-bold uppercase">{errors.name}</p>}
          </div>

          <div className="md:col-span-2 pt-6">
            <button type="submit" className="w-full py-6 rounded-3xl text-white font-black uppercase tracking-[0.3em] text-xs shadow-2xl hover:brightness-110 transition-all active:scale-95" style={{ backgroundColor: 'var(--theme-primary)' }}>
              Request Appointment
            </button>
            <p className="text-center text-[9px] mt-6 opacity-40 font-bold uppercase tracking-widest">A R50 booking fee applies to all sessions</p>
          </div>
        </form>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-stone-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-[3rem] p-10 md:p-12 shadow-2xl animate-in zoom-in duration-300">
            <h3 className="text-3xl font-bold mb-8 serif italic">Confirm Selection</h3>
            <div className="space-y-6 mb-10">
              <div className="flex justify-between border-b border-stone-100 pb-4">
                <span className="text-xs uppercase font-bold opacity-40">Service</span>
                <span className="font-bold text-stone-800 italic">{formData.serviceId}</span>
              </div>
              <div className="flex justify-between border-b border-stone-100 pb-4">
                <span className="text-xs uppercase font-bold opacity-40">Schedule</span>
                <span className="font-bold text-stone-800">{formData.date} at {formData.time}</span>
              </div>
              <div className="flex justify-between border-b border-stone-100 pb-4">
                <span className="text-xs uppercase font-bold opacity-40">Estimated Price</span>
                <span className="font-black" style={{ color: 'var(--theme-primary)' }}>{selectedServicePrice}</span>
              </div>
            </div>
            
            {isSubmitting ? (
              <div className="space-y-4">
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div className="h-full transition-all duration-300" style={{ width: `${submitProgress}%`, backgroundColor: 'var(--theme-primary)' }}></div>
                </div>
                <p className="text-center text-[10px] uppercase font-black tracking-widest opacity-40 animate-pulse">Processing Masterpiece Request...</p>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => setShowConfirmation(false)} className="flex-1 py-5 rounded-2xl border font-bold text-xs uppercase tracking-widest text-stone-400 hover:bg-stone-50 transition-colors">Cancel</button>
                <button onClick={handleFinalSubmit} className="flex-1 py-5 rounded-2xl text-white font-bold text-xs uppercase tracking-widest shadow-xl hover:brightness-110 transition-all" style={{ backgroundColor: 'var(--theme-primary)' }}>Confirm Booking</button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default BookingForm;