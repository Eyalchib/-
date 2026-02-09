
import React from 'react';
import { QuestionnaireData } from '../types';

interface Props {
  data: QuestionnaireData;
  update: (data: Partial<QuestionnaireData>) => void;
}

const BusinessForm: React.FC<Props> = ({ data, update }) => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h3 className="text-3xl font-black text-slate-900 mb-2">פרטי העסק</h3>
        <div className="h-1 w-12 bg-cyan-400 mb-3"></div>
        <p className="text-slate-500 text-lg">נתחיל מהבסיס - הכירו לי את העסק שלכם</p>
      </div>

      <div className="space-y-8">
        <div className="group">
          <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-3 group-focus-within:text-cyan-500 transition-colors">שם העסק:</label>
          <input
            type="text"
            value={data.businessName}
            onChange={(e) => update({ businessName: e.target.value })}
            className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-cyan-500 focus:bg-white focus:outline-none transition-all placeholder:text-slate-300 text-xl font-bold"
            placeholder="איך קוראים לעסק?"
          />
        </div>

        <div>
          <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-3">שורת תיאור קצרה:</label>
          <p className="text-xs text-slate-400 mb-3">מה העסק עושה במשפט אחד?</p>
          <textarea
            value={data.oneLineDescription}
            onChange={(e) => update({ oneLineDescription: e.target.value })}
            rows={2}
            className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-cyan-500 focus:bg-white focus:outline-none transition-all placeholder:text-slate-300 text-lg"
            placeholder="לדוגמה: משרד אדריכלות לעיצוב בתים פרטיים בסגנון כפרי"
          />
        </div>

        <div>
          <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-3">מטרת העסק:</label>
          <p className="text-xs text-slate-400 mb-3">למה העסק קיים? מה הבעיה שהוא פותר?</p>
          <textarea
            value={data.businessGoal}
            onChange={(e) => update({ businessGoal: e.target.value })}
            rows={4}
            className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-cyan-500 focus:bg-white focus:outline-none transition-all placeholder:text-slate-300 text-lg"
            placeholder="ספרו לי על המהות שלכם..."
          />
        </div>
      </div>
    </div>
  );
};

export default BusinessForm;
