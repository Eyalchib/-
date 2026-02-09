
import React from 'react';
import { QuestionnaireData } from '../types';

interface Props {
  data: QuestionnaireData;
  update: (data: Partial<QuestionnaireData>) => void;
}

const VisionForm: React.FC<Props> = ({ data, update }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">ערכי המותג והחזון</h3>
        <p className="text-slate-500">מה עומד מאחורי העסק שלכם?</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">מה החזון של העסק שלך?</label>
          <textarea
            value={data.vision}
            onChange={(e) => update({ vision: e.target.value })}
            rows={2}
            className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-indigo-600 focus:bg-white focus:outline-none transition-all"
            placeholder="לאן אתם שואפים להגיע בעתיד?"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">מהם הערכים המרכזיים של העסק?</label>
          <p className="text-xs text-slate-400 mb-2">לדוגמה: אמינות, יצירתיות, קהילה, חדשנות</p>
          <input
            type="text"
            value={data.coreValues}
            onChange={(e) => update({ coreValues: e.target.value })}
            className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-indigo-600 focus:bg-white focus:outline-none transition-all"
            placeholder="בחרו 3-5 ערכים מובילים"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">מה מייחד אותך ביחס למתחרים?</label>
          <textarea
            value={data.uniqueSellingPoint}
            onChange={(e) => update({ uniqueSellingPoint: e.target.value })}
            rows={2}
            className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-indigo-600 focus:bg-white focus:outline-none transition-all"
            placeholder="הסוד שלכם להצלחה..."
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">מה המסר המרכזי שאתה רוצה שהלוגו יעביר?</label>
          <input
            type="text"
            value={data.mainMessage}
            onChange={(e) => update({ mainMessage: e.target.value })}
            className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-indigo-600 focus:bg-white focus:outline-none transition-all"
            placeholder="מה הדבר הראשון שאנשים צריכים להבין?"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">מה התחושה שתרצו לעורר באמצעות הלוגו?</label>
          <p className="text-xs text-slate-400 mb-2">לדוגמה: ביטחון, התלהבות, רוגע, סקרנות</p>
          <input
            type="text"
            value={data.desiredEmotion}
            onChange={(e) => update({ desiredEmotion: e.target.value })}
            className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-indigo-600 focus:bg-white focus:outline-none transition-all"
            placeholder="איזו הרגשה צריכה לעבור לצופה?"
          />
        </div>
      </div>
    </div>
  );
};

export default VisionForm;
