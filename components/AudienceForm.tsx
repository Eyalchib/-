
import React from 'react';
import { QuestionnaireData } from '../types';

interface Props {
  data: QuestionnaireData;
  update: (data: Partial<QuestionnaireData>) => void;
}

const AudienceForm: React.FC<Props> = ({ data, update }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">קהל היעד</h3>
        <p className="text-slate-500">למי אנחנו פונים?</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">מי הלקוחות שלך?</label>
          <p className="text-xs text-slate-400 mb-2">גיל, מגדר, מקום מגורים, תחומי עניין</p>
          <textarea
            value={data.targetAudience}
            onChange={(e) => update({ targetAudience: e.target.value })}
            rows={2}
            className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-indigo-600 focus:bg-white focus:outline-none transition-all"
            placeholder="תארו את הקהל הרחב שלכם"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">מהו הפרופיל של הלקוח האידיאלי שלך?</label>
          <textarea
            value={data.idealClientProfile}
            onChange={(e) => update({ idealClientProfile: e.target.value })}
            rows={2}
            className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-indigo-600 focus:bg-white focus:outline-none transition-all"
            placeholder="אם הייתם יכולים לשכפל לקוח אחד, מי הוא היה?"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">אילו אתגרים או צרכים שיש ללקוח הזה?</label>
          <textarea
            value={data.clientChallenges}
            onChange={(e) => update({ clientChallenges: e.target.value })}
            rows={2}
            className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-indigo-600 focus:bg-white focus:outline-none transition-all"
            placeholder="מה כואב להם? מה הם מחפשים?"
          />
        </div>
      </div>
    </div>
  );
};

export default AudienceForm;
