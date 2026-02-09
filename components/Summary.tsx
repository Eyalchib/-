
import React from 'react';
import { QuestionnaireData } from '../types';
import { Send, Printer, CheckCircle } from 'lucide-react';

interface Props {
  data: QuestionnaireData;
}

const Summary: React.FC<Props> = ({ data }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleSendEmail = () => {
    const subject = encodeURIComponent(`שאלון איפיון מותג - ${data.businessName || 'עסק חדש'}`);
    const body = encodeURIComponent(`
שלום אדוה, מצורף שאלון האיפיון שמילאתי באתר:

--- פרטי העסק ---
שם העסק: ${data.businessName}
תיאור קצר: ${data.oneLineDescription}
מטרת העסק: ${data.businessGoal}

--- חזון וערכים ---
חזון: ${data.vision}
ערכים מרכזיים: ${data.coreValues}
ייחוד עסקי: ${data.uniqueSellingPoint}
מסר מרכזי: ${data.mainMessage}
רגש רצוי: ${data.desiredEmotion}

--- קהל יעד ---
פרופיל קהל יעד: ${data.targetAudience}
לקוח אידיאלי: ${data.idealClientProfile}
אתגרים/צרכים: ${data.clientChallenges}

--- עיצוב וסגנון ---
סגנון מועדף: ${data.preferredStyle}
צבעים מתאימים: ${data.brandColors}
צבעים להימנע: ${data.avoidColors}
סוגי פונטים: ${data.fontTypes}
סקאלת המותג: ${data.vibeScale === 'emotional' ? 'רגשי/חם' : data.vibeScale === 'professional' ? 'עסקי/ענייני' : 'מאוזן'}

--- מידע נוסף ---
מוצרים/שירותים: ${data.productsServices}
לוגו קיים: ${data.existingLogo === 'yes' ? 'כן - ' + data.existingLogoDetails : 'לא'}
ליווי מקצועי נוסף: ${data.professionalsInvolved}
שותפים להחלטה: ${data.decisionMakers}
חומרי השראה: ${data.inspirationMaterials}

בברכה,
${data.businessName || 'לקוח השאלון'}
    `);

    window.location.href = `mailto:advakoreninfo@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center">
        <div className="inline-flex items-center justify-center p-4 bg-green-50 rounded-full mb-6">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">סיימנו!</h3>
        <p className="text-slate-500 text-xl font-medium">הנה סיכום האיפיון שלך - צעד ראשון למיתוג מנצח.</p>
      </div>

      <div className="bg-slate-50 rounded-[2.5rem] p-8 space-y-6 max-h-[450px] overflow-y-auto border border-slate-100 print:max-h-none print:bg-white print:p-0 custom-scrollbar shadow-inner text-right">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4 mb-4">
          <div className="w-3 h-8 bg-cyan-400 rounded-full"></div>
          <h4 className="font-black text-slate-900 text-lg">פרופיל המותג החדש</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <SummaryItem label="שם המותג" value={data.businessName} />
          <SummaryItem label="תמצית העסק" value={data.oneLineDescription} />
          <SummaryItem label="ערכים מובילים" value={data.coreValues} />
          <SummaryItem label="קהל היעד" value={data.targetAudience} />
          <SummaryItem label="כיוון סגנוני" value={data.preferredStyle} />
          <SummaryItem label="צבעוניות" value={data.brandColors} />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
        <button
          onClick={handleSendEmail}
          className="w-full sm:w-auto flex items-center justify-center gap-3 px-14 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-black shadow-xl shadow-slate-200 transition-all active:scale-95"
        >
          <Send className="w-5 h-5" />
          <span>שליחה לסטודיו</span>
        </button>

        <button
          onClick={handlePrint}
          className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4 border-2 border-slate-100 rounded-2xl text-slate-500 font-bold hover:bg-slate-50 hover:border-slate-200 transition-all"
        >
          <Printer className="w-5 h-5" />
          <span>שמירה כ-PDF</span>
        </button>
      </div>
    </div>
  );
};

const SummaryItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex flex-col gap-2 p-4 bg-white rounded-2xl border border-slate-100/50 shadow-sm">
    <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em]">{label}</span>
    <p className="text-slate-900 font-bold leading-relaxed">{value || <em className="text-slate-200 font-normal">טרם הוזן</em>}</p>
  </div>
);

export default Summary;
