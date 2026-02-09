
import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface Props {
  onNext: () => void;
}

const Welcome: React.FC<Props> = ({ onNext }) => {
  return (
    <div className="flex flex-col items-center text-center py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h2 className="text-5xl font-black text-slate-900 mb-10 tracking-tight leading-tight">
        בואו נבנה את המותג <br/> המנצח שלכם
      </h2>
      <div className="space-y-8 text-2xl text-slate-500 max-w-xl mx-auto mb-16 leading-relaxed font-medium">
        <p>
          לוגו טוב הוא הרבה יותר מציור יפה – <span className="text-slate-900 font-extrabold">הוא הפנים של העסק שלך.</span>
        </p>
        <p className="text-xl">
          הוא מעביר לעולם מי אתה, מה אתה מציע ולמי. כדי שאוכל ליצור עבורך לוגו שמדויק לך, לערכים שלך וללקוחות שלך – חשוב שנבין יחד את הבסיס.
        </p>
        <p className="text-cyan-500 font-black text-3xl">
          מתחילים?
        </p>
      </div>
      <button
        onClick={onNext}
        className="group relative flex items-center gap-4 px-16 py-6 bg-slate-900 text-white font-black rounded-[2rem] hover:bg-black shadow-[0_25px_50px_rgba(0,0,0,0.2)] transition-all active:scale-95 text-3xl overflow-hidden"
      >
        <span>מתחילים באיפיון</span>
        <ArrowLeft className="w-8 h-8 group-hover:-translate-x-3 transition-transform duration-300" />
        <div className="absolute inset-0 bg-cyan-400/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
      </button>
    </div>
  );
};

export default Welcome;
