
import React, { useRef, useState } from 'react';
import { QuestionnaireData } from '../types';
import { Send, FileDown, CheckCircle, Loader2, MessageCircle, Share2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface Props {
  data: QuestionnaireData;
}

const Summary: React.FC<Props> = ({ data }) => {
  const summaryRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const STUDIO_PHONE = '972542444576'; // Adva Korn's number in international format

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

  const handleWhatsAppShare = async () => {
    const result = await getPDFBlob();
    if (!result) return;

    const { blob, fileName } = result;
    const file = new File([blob], fileName, { type: 'application/pdf' });

    // Use Web Share API if supported - this allows sending the file directly to WhatsApp without saving
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: `שאלון איפיון - ${data.businessName}`,
          text: `היי אדוה, מצורף שאלון האיפיון שלי עבור המותג: ${data.businessName}`,
        });
        return;
      } catch (err) {
        console.log('Share was cancelled or not supported for this file type.');
      }
    }

    // Fallback if Native Share is not available (e.g., Desktop or older browsers)
    // We send a message and then trigger a download so they can attach it manually
    const text = encodeURIComponent(`היי אדוה, מילאתי את שאלון האיפיון עבור ${data.businessName || 'העסק שלי'}. הקובץ יורד עכשיו למכשיר שלי ואשלח לך אותו מיד.`);
    window.open(`https://wa.me/${STUDIO_PHONE}?text=${text}`, '_blank');
    
    // Trigger download as fallback
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
    
    alert('הקובץ יורד למכשירך. ניתן לצרף אותו עכשיו בשיחת הוואטסאפ שנפתחה.');
  };

  const handleSendEmail = async () => {
    const result = await getPDFBlob();
    if (!result) return;

    const { blob, fileName } = result;
    
    // Emails usually require manual attachment from browser blobs
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);

    const subject = encodeURIComponent(`שאלון איפיון מותג - ${data.businessName || 'עסק חדש'}`);
    const body = encodeURIComponent(`
שלום אדוה, מצורף שאלון האיפיון שמילאתי באתר.
הקובץ ירד הרגע למכשיר שלי, אנא צרפי אותו למייל זה.

בברכה,
${data.businessName || 'לקוח השאלון'}
    `);

    setTimeout(() => {
      window.location.href = `mailto:advakoreninfo@gmail.com?subject=${subject}&body=${body}`;
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

      <div className="flex flex-col gap-4 max-w-lg mx-auto w-full pt-8">
        {/* Primary Action: WhatsApp */}
        <button
          onClick={handleWhatsAppShare}
          disabled={isGenerating}
          className="flex items-center justify-center gap-4 px-10 py-6 bg-[#25D366] text-white font-black rounded-3xl hover:bg-[#128C7E] shadow-[0_20px_40px_rgba(37,211,102,0.25)] transition-all active:scale-95 disabled:opacity-70 group text-2xl"
        >
          {isGenerating ? <Loader2 className="w-8 h-8 animate-spin" /> : <MessageCircle className="w-8 h-8 group-hover:scale-110 transition-transform" />}
          <span>שלח בוואטסאפ לסטודיו</span>
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Secondary Action: Email */}
          <button
            onClick={handleSendEmail}
            disabled={isGenerating}
            className="flex items-center justify-center gap-3 px-6 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-black shadow-xl shadow-slate-100 transition-all active:scale-95 disabled:opacity-70 group"
          >
            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            <span>שלח במייל</span>
          </button>

          {/* Tertiary Action: Download */}
          <button
            onClick={handleJustDownload}
            disabled={isGenerating}
            className="flex items-center justify-center gap-3 px-6 py-4 border-2 border-slate-100 rounded-2xl text-slate-500 font-bold hover:bg-slate-50 hover:border-slate-200 transition-all disabled:opacity-50"
          >
            <FileDown className="w-5 h-5" />
            <span>שמור PDF למכשיר</span>
          </button>
        </div>
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
