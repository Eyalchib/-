
import React from 'react';
import { QuestionnaireData } from '../types';

interface Props {
  data: QuestionnaireData;
  update: (data: Partial<QuestionnaireData>) => void;
}

const StyleForm: React.FC<Props> = ({ data, update }) => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h3 className="text-3xl font-black text-slate-900 mb-2">עיצוב וסגנון</h3>
        <div className="h-1 w-12 bg-cyan-400 mb-3"></div>
        <p className="text-slate-500 text-lg">איך המותג צריך להיראות?</p>
      </div>

      <div className="space-y-8">
        <div>
          <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-3">איזה סגנון עיצוב אתה אוהב?</label>
          <p className="text-xs text-slate-400 mb-3">מינימליסטי / נועז / קלאסי / צעיר / יוקרתי וכדומה</p>
          <input
            type="text"
            value={data.preferredStyle}
            onChange={(e) => update({ preferredStyle: e.target.value })}
            className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-cyan-500 focus:bg-white focus:outline-none transition-all placeholder:text-slate-300 text-lg font-bold"
            placeholder="תארו את הויז'ואל שבדמיון שלכם"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="group">
            <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-3 group-focus-within:text-cyan-500 transition-colors">צבעים מתאימים:</label>
            <input
              type="text"
              value={data.brandColors}
              onChange={(e) => update({ brandColors: e.target.value })}
              className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-cyan-500 focus:bg-white focus:outline-none transition-all placeholder:text-slate-300"
              placeholder="כחול, זהב, ירוק עד..."
            />
          </div>
          <div className="group">
            <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-3 group-focus-within:text-red-400 transition-colors">צבעים להימנע:</label>
            <input
              type="text"
              value={data.avoidColors}
              onChange={(e) => update({ avoidColors: e.target.value })}
              className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-red-400 focus:bg-white focus:outline-none transition-all placeholder:text-slate-300"
              placeholder="צבעים שפחות מתאימים"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-6">איפה המותג נמצא על הסקאלה?</label>
          <div className="flex items-center gap-6 bg-slate-50 p-6 rounded-[2rem]">
            <span className={`text-sm font-black transition-all duration-300 ${data.vibeScale === 'emotional' ? 'text-cyan-500 scale-110' : 'text-slate-400'}`}>רגשי / חם</span>
            <div className="flex-1 relative h-2 bg-slate-200 rounded-full">
              <input
                type="range"
                min="0"
                max="2"
                step="1"
                value={data.vibeScale === 'emotional' ? 0 : data.vibeScale === 'balanced' ? 1 : 2}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  const scale = val === 0 ? 'emotional' : val === 1 ? 'balanced' : 'professional';
                  update({ vibeScale: scale });
                }}
                className="absolute inset-0 w-full appearance-none bg-transparent cursor-pointer accent-cyan-500 z-10"
              />
              <div className="absolute top-0 bottom-0 left-0 bg-cyan-400 rounded-full transition-all duration-500" style={{ width: data.vibeScale === 'emotional' ? '0%' : data.vibeScale === 'balanced' ? '50%' : '100%' }}></div>
            </div>
            <span className={`text-sm font-black transition-all duration-300 ${data.vibeScale === 'professional' ? 'text-cyan-500 scale-110' : 'text-slate-400'}`}>עסקי / ענייני</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StyleForm;
