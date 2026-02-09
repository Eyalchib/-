
import React from 'react';
import { QuestionnaireData } from '../types';

interface Props {
  data: QuestionnaireData;
  update: (data: Partial<QuestionnaireData>) => void;
}

const AdditionalForm: React.FC<Props> = ({ data, update }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">מידע נוסף</h3>
        <p className="text-slate-500">כל מה שעוד כדאי לי לדעת</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">אילו מוצרים או שירותים אתה מציע?</label>
          <textarea
            value={data.productsServices}
            onChange={(e) => update({ productsServices: e.target.value })}
            rows={2}
            className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-indigo-600 focus:bg-white focus:outline-none transition-all"
            placeholder="פירוט הסל שלכם"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">האם יש לוגו קיים?</label>
            <select
              value={data.existingLogo}
              onChange={(e) => update({ existingLogo: e.target.value })}
              className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-indigo-600 focus:bg-white focus:outline-none transition-all"
            >
              <option value="no">לא</option>
              <option value="yes">כן</option>
            </select>
          </div>
          {data.existingLogo === 'yes' && (
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">מה אהבת בו ומה לא?</label>
              <input
                type="text"
                value={data.existingLogoDetails}
                onChange={(e) => update({ existingLogoDetails: e.target.value })}
                className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-indigo-600 focus:bg-white focus:outline-none transition-all"
                placeholder="ספרו לי על הלוגו הישן"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">האם יש ליווי מקצועי נוסף בתהליך?</label>
          <p className="text-xs text-slate-400 mb-2">יועץ עסקי, שיווקי וכו'</p>
          <input
            type="text"
            value={data.professionalsInvolved}
            onChange={(e) => update({ professionalsInvolved: e.target.value })}
            className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-indigo-600 focus:bg-white focus:outline-none transition-all"
            placeholder="מי עוד בצוות שלכם?"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">האם יש שותפים בתהליך קבלת ההחלטות?</label>
          <input
            type="text"
            value={data.decisionMakers}
            onChange={(e) => update({ decisionMakers: e.target.value })}
            className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-indigo-600 focus:bg-white focus:outline-none transition-all"
            placeholder="מי מאשר את העבודה?"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">האם יש חומרים קיימים שיכולים להוות השראה?</label>
          <p className="text-xs text-slate-400 mb-2">צילומים, חומרים גרפיים, מוצרים קיימים</p>
          <textarea
            value={data.inspirationMaterials}
            onChange={(e) => update({ inspirationMaterials: e.target.value })}
            rows={2}
            className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-indigo-600 focus:bg-white focus:outline-none transition-all"
            placeholder="כל דבר שיעזור לי להכיר את העולם שלכם"
          />
        </div>
      </div>
    </div>
  );
};

export default AdditionalForm;
