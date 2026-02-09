
import React, { useRef, useState } from 'react';
import { QuestionnaireData } from '../types';
import { Send, FileDown, CheckCircle, Loader2, MessageCircle, Mail } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface Props {
  data: QuestionnaireData;
}

const Summary: React.FC<Props> = ({ data }) => {
  const summaryRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const STUDIO_PHONE = '972542444576';
  const STUDIO_EMAIL = 'advakoreninfo@gmail.com';

  const getPDFFile = async (): Promise<{ file: File; fileName: string } | null> => {
    if (!summaryRef.current) return null;
    setIsGenerating(true);
    
    try {
      const canvas = await html2canvas(summaryRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
      const fileName = `שאלון-איפיון-${data.businessName || 'עסק'}.pdf`;
      const blob = pdf.output('blob');
      return { 
        file: new File([blob], fileName, { type: 'application/pdf' }),
        fileName 
      };
    } catch (err) {
      console.error('Error generating PDF:', err);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async (method: 'whatsapp' | 'email') => {
    const result = await getPDFFile();
    if (!result) return;

    const { file, fileName } = result;

    // Check if Web Share API is available and can share files
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: `שאלון איפיון - ${data.businessName}`,
          text: method === 'whatsapp' 
            ? `היי אדוה, מצורף שאלון האיפיון עבור המותג: ${data.businessName}`
            : `שלום אדוה, מצורף שאלון האיפיון עבור העסק ${data.businessName}`,
        });
        return;
      } catch (err) {
        // If user cancelled or error occurred, proceed to fallback
        console.log('Share failed or dismissed', err);
      }
    }

    // Fallback logic for Desktop or non-supporting browsers
    if (method === 'whatsapp') {
      const text = encodeURIComponent(`היי אדוה, מילאתי את שאלון האיפיון עבור ${data.businessName || 'העסק שלי'}. הקובץ יורד כעת למכשיר שלי ואשלח לך אותו מיד.`);
      window.open(`https://wa.me/${STUDIO_PHONE}?text=${text}`, '_blank');
    } else {
      const subject = encodeURIComponent(`שאלון איפיון מותג - ${data.businessName || 'עסק חדש'}`);
      const body = encodeURIComponent(`שלום אדוה, מצורף שאלון האיפיון שמילאתי באתר.\n\nהקובץ יורד ברגעים אלו למכשיר שלי, אנא צרפי אותו למייל זה.`);
      window.location.href = `mailto:${STUDIO_EMAIL}?subject=${subject}&body=${body}`;
    }

    // Download the file automatically in fallback mode
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
    
    alert(`קובץ ה-PDF יורד כעת למכשירך.\nאנא צרפי אותו ל${method === 'whatsapp' ? 'הוואטסאפ' : 'מייל'} שנפתח.`);
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center">
        <div className="inline-flex items-center justify-center p-5 bg-green-50 rounded-full mb-6 shadow-sm">
          <CheckCircle className="w-14 h-14 text-green-500" />
        </div>
        <h3 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">האיפיון הושלם!</h3>
        <p className="text-slate-400 text-xl font-medium max-w-md mx-auto leading-relaxed">
          תודה רבה! ריכזתי את כל התשובות שלך למסמך איפיון מסודר. בואו נשלח אותו לאדוה.
        </p>
      </div>

      {/* Summary View Container */}
      <div 
        ref={summaryRef}
        className="bg-white rounded-[3rem] p-10 sm:p-14 space-y-10 border-2 border-slate-50 shadow-2xl shadow-slate-200/50 text-right overflow-hidden relative"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-cyan-400" />
        
        <div className="flex flex-col items-center text-center border-b border-slate-100 pb-10 mb-4">
           <div className="text-4xl font-black text-slate-900 mb-2">אדוה קורן</div>
           <div className="text-cyan-500 font-black tracking-[0.3em] uppercase text-xs">Studio Brand Analysis</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          <SummaryItem label="שם המותג" value={data.businessName} />
          <SummaryItem label="תמצית העסק" value={data.oneLineDescription} />
          <SummaryItem label="מטרת המותג" value={data.businessGoal} />
          <SummaryItem label="ערכים מובילים" value={data.coreValues} />
          <SummaryItem label="קהל היעד" value={data.targetAudience} />
          <SummaryItem label="סגנון עיצוב" value={data.preferredStyle} />
          <SummaryItem label="צבעוניות" value={data.brandColors} />
          <SummaryItem label="מסר מרכזי" value={data.mainMessage} />
          <SummaryItem label="הרגש הרצוי" value={data.desiredEmotion} />
          <SummaryItem label="ויב המותג" value={data.vibeScale === 'emotional' ? 'רגשי וחם' : data.vibeScale === 'professional' ? 'מקצועי וענייני' : 'מאוזן'} />
        </div>

        <div className="pt-10 border-t border-slate-50 mt-4 text-xs text-slate-300 text-center font-bold tracking-widest">
           סוכם על ידי מערכת האיפיון של סטודיו אדוה קורן | 054-2444576
        </div>
      </div>

      <div className="flex flex-col gap-5 max-w-lg mx-auto w-full pt-10">
        {/* Primary WhatsApp Action */}
        <button
          onClick={() => handleShare('whatsapp')}
          disabled={isGenerating}
          className="flex items-center justify-center gap-4 px-10 py-7 bg-[#25D366] text-white font-black rounded-3xl hover:bg-[#128C7E] shadow-[0_25px_50px_-12px_rgba(37,211,102,0.4)] transition-all active:scale-95 disabled:opacity-70 group text-2xl"
        >
          {isGenerating ? <Loader2 className="w-8 h-8 animate-spin" /> : <MessageCircle className="w-8 h-8 group-hover:rotate-12 transition-transform" />}
          <span>שליחה בוואטסאפ לסטודיו</span>
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Email Action */}
          <button
            onClick={() => handleShare('email')}
            disabled={isGenerating}
            className="flex items-center justify-center gap-3 px-6 py-5 bg-slate-900 text-white font-bold rounded-2xl hover:bg-black shadow-lg transition-all active:scale-95 disabled:opacity-70"
          >
            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mail className="w-5 h-5" />}
            <span>שליחה במייל</span>
          </button>

          {/* Simple Download */}
          <button
            onClick={async () => {
              const result = await getPDFFile();
              if (result) {
                const url = URL.createObjectURL(result.file);
                const link = document.createElement('a');
                link.href = url;
                link.download = result.fileName;
                link.click();
                URL.revokeObjectURL(url);
              }
            }}
            disabled={isGenerating}
            className="flex items-center justify-center gap-3 px-6 py-5 border-2 border-slate-100 rounded-2xl text-slate-500 font-bold hover:bg-slate-50 hover:border-slate-200 transition-all disabled:opacity-50 active:scale-95"
          >
            <FileDown className="w-5 h-5" />
            <span>רק שמירת PDF</span>
          </button>
        </div>
        
        <p className="text-center text-slate-400 text-xs font-medium px-4">
          * בנייד: יפתח תפריט שיתוף עם הקובץ מצורף.<br/>
          * במחשב: הקובץ יורד והמייל יפתח - יש לצרף את הקובץ ידנית.
        </p>
      </div>
    </div>
  );
};

const SummaryItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex flex-col gap-2">
    <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em]">{label}</span>
    <p className="text-slate-800 font-bold leading-relaxed text-xl">{value || "לא צוין"}</p>
  </div>
);

export default Summary;
