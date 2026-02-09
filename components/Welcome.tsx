
import React from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';

interface Props {
  onNext: () => void;
}

const Welcome: React.FC<Props> = ({ onNext }) => {
  return (
    <div className="flex flex-col items-center text-center py-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="p-6 bg-cyan-50 rounded-3xl mb-10 transform -rotate-3 border border-cyan-100">
        <Sparkles className="w-14 h-14 text-cyan-500" />
      </div>
      <h2 className="text-4xl font-black text-slate-900 mb-8 tracking-tight">
        בואו נבנה את המותג שלכם
      </h2>
      <div className="space-y-6 text-xl text-slate-500 max-w-xl mx-auto mb-12 leading-relaxed font-medium">
        <p>
          לוגו טוב הוא הרבה יותר מציור יפה – <span className="text-slate-900 font-bold">הוא הפנים של העסק שלך.</span>
        </p>
        <p>
          הוא מעביר לעולם מי אתה, מה אתה מציע ולמי. כדי שאוכל ליצור עבורך לוגו שמדויק לך, לערכים שלך וללקוחות שלך – חשוב שנבין יחד את הבסיס.
        </p>
        <p className="text-cyan-500 font-black text-2xl">
          מתחילים?
        </p>
      </div>
      <button
        onClick={onNext}
        className="group relative flex items-center gap-4 px-14 py-5 bg-slate-900 text-white font-black rounded-[2rem] hover:bg-black shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-all active:scale-95 text-2xl overflow-hidden"
      >
        <span>מתחילים באיפיון</span>
        <ArrowLeft className="w-8 h-8 group-hover:-translate-x-2 transition-transform duration-300" />
        <div className="absolute inset-0 bg-cyan-400/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
      </button>
    </div>
  );
};

export default Welcome;
