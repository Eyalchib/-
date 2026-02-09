
import React, { useRef, useState } from 'react';
import { QuestionnaireData } from '../types';
import { Send, FileDown, CheckCircle, Loader2, Share2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface Props {
  data: QuestionnaireData;
}

const Summary: React.FC<Props> = ({ data }) => {
  const summaryRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const getPDFBlob = async (): Promise<{ blob: Blob; fileName: string } | null> => {
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
      const fileName = `אדוה-קורן-איפיון-${data.businessName || 'עסק'}.pdf`;
      const blob = pdf.output('blob');
      return { blob, fileName };
    } catch (err) {
      console.error('Error generating PDF:', err);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendToStudio = async () => {
    const result = await getPDFBlob();
    if (!result) return;

    const { blob, fileName } = result;
    const file = new File([blob], fileName, { type: 'application/pdf' });

    // Try to use Web Share API (best for mobile/modern browsers to send directly)
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: `שאלון איפיון - ${data.businessName}`,
          text: `שלום אדוה, מצורף שאלון האיפיון שלי עבור ${data.businessName}.`,
        });
        return; // Success
      } catch (err) {
        console.log('Share was cancelled or failed, falling back to email/download.');
      }
    }

    // Fallback: Automatic download + Mailto (Standard browser behavior)
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);

    const subject = encodeURIComponent(`שאלון איפיון מותג - ${data.businessName || 'עסק חדש'}`);
    const body = encodeURIComponent(`
שלום אדוה, מצורף שאלון האיפיון שמילאתי באתר.
הקובץ ירד הרגע למחשב שלי, אנא צרפי אותו למייל זה.

--- פרטים כלליים ---
שם העסק: ${data.businessName}
תיאור קצר: ${data.oneLineDescription}

בברכה,
${data.businessName || 'לקוח השאלון'}
    `);

    setTimeout(() => {
      window.location.href = `mailto:advakoreninfo@gmail.com?subject=${subject}&body=${body}`;
      alert('קובץ ה-PDF ירד למכשיר שלך. אנא צרפי אותו למייל שנפתח כעת (מגבלות דפדפן לא מאפשרות צירוף אוטומטי).');
    }, 500);
  };

  const handleJustDownload = async () => {
    const result = await getPDFBlob();
    if (result) {
      const url = URL.createObjectURL(result.blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = result.fileName;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center">
        <div className="inline-flex items-center justify-center p-4 bg-green-50 rounded-full mb-6">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">האיפיון מוכן!</h3>
        <p className="text-slate-500 text-xl font-medium">סיכום התשובות שלך מוכן לשליחה לסטודיו.</p>
      </div>

      <div 
        ref={summaryRef}
        className="bg-white rounded-[2.5rem] p-10 space-y-8 border-2 border-slate-100 shadow-xl text-right overflow-hidden"
      >
        <div className="flex flex-col items-center text-center border-b-2 border-slate-50 pb-8 mb-4">
           <div className="text-3xl font-black text-slate-900 mb-1">אדוה קורן</div>
           <div className="text-cyan-500 font-bold tracking-widest uppercase text-xs">איפיון מותג מקצועי</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          <SummaryItem label="שם המותג" value={data.businessName} />
          <SummaryItem label="תמצית העסק" value={data.oneLineDescription} />
          <SummaryItem label="מטרת המותג" value={data.businessGoal} />
          <SummaryItem label="ערכים מובילים" value={data.coreValues} />
          <SummaryItem label="פרופיל קהל היעד" value={data.targetAudience} />
          <SummaryItem label="סגנון עיצוב מבוקש" value={data.preferredStyle} />
          <SummaryItem label="צבעוניות מועדפת" value={data.brandColors} />
          <SummaryItem label="המסר המרכזי" value={data.mainMessage} />
          <SummaryItem label="הרגש הרצוי" value={data.desiredEmotion} />
          <SummaryItem label="סקאלת המותג" value={data.vibeScale === 'emotional' ? 'רגשי / חם' : data.vibeScale === 'professional' ? 'עסקי / ענייני' : 'מאוזן'} />
        </div>

        <div className="pt-8 border-t border-slate-50 mt-4 text-xs text-slate-400 text-center font-bold">
           סטודיו אדוה קורן | עיצוב ומיתוג | 054-2444576
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
        <button
          onClick={handleSendToStudio}
          disabled={isGenerating}
          className="w-full sm:w-auto flex items-center justify-center gap-4 px-16 py-5 bg-slate-900 text-white font-black rounded-3xl hover:bg-black shadow-[0_20px_40px_rgba(0,0,0,0.15)] transition-all active:scale-95 disabled:opacity-70 group"
        >
          {isGenerating ? <Loader2 className="w-6 h-6 animate-spin" /> : (
            navigator.share ? <Share2 className="w-6 h-6 group-hover:scale-110 transition-transform" /> : <Send className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          )}
          <span>{navigator.share ? 'שלח לסטודיו' : 'הורד ושלח במייל'}</span>
        </button>

        <button
          onClick={handleJustDownload}
          disabled={isGenerating}
          className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 border-2 border-slate-100 rounded-3xl text-slate-500 font-bold hover:bg-slate-50 hover:border-slate-200 transition-all disabled:opacity-50"
        >
          <FileDown className="w-5 h-5" />
          <span>שמירה כ-PDF</span>
        </button>
      </div>
    </div>
  );
};

const SummaryItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex flex-col gap-2">
    <span className="text-[11px] font-black text-cyan-500 uppercase tracking-[0.2em]">{label}</span>
    <p className="text-slate-900 font-bold leading-relaxed text-lg">{value || <em className="text-slate-200 font-normal italic">טרם הוזן</em>}</p>
  </div>
);

export default Summary;
