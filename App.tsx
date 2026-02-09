
import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Target, 
  Palette, 
  Users, 
  Info, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  FileText
} from 'lucide-react';
import { QuestionnaireData, StepKey } from './types';
import BusinessForm from './components/BusinessForm';
import VisionForm from './components/VisionForm';
import AudienceForm from './components/AudienceForm';
import StyleForm from './components/StyleForm';
import AdditionalForm from './components/AdditionalForm';
import Summary from './components/Summary';
import Welcome from './components/Welcome';

const INITIAL_DATA: QuestionnaireData = {
  businessName: '',
  oneLineDescription: '',
  businessGoal: '',
  vision: '',
  coreValues: '',
  uniqueSellingPoint: '',
  mainMessage: '',
  desiredEmotion: '',
  targetAudience: '',
  idealClientProfile: '',
  clientChallenges: '',
  preferredStyle: '',
  likedDesigns: '',
  brandColors: '',
  avoidColors: '',
  fontTypes: '',
  vibeScale: 'balanced',
  productsServices: '',
  currentChallenges: '',
  existingLogo: 'no',
  existingLogoDetails: '',
  professionalsInvolved: '',
  decisionMakers: '',
  inspirationMaterials: ''
};

const STEPS: { key: StepKey; label: string; icon: React.ReactNode }[] = [
  { key: 'welcome', label: 'פתיחה', icon: <Sparkles className="w-5 h-5" /> },
  { key: 'business', label: 'פרטי עסק', icon: <Building2 className="w-5 h-5" /> },
  { key: 'vision', label: 'חזון וערכים', icon: <Target className="w-5 h-5" /> },
  { key: 'audience', label: 'קהל יעד', icon: <Users className="w-5 h-5" /> },
  { key: 'style', label: 'עיצוב וסגנון', icon: <Palette className="w-5 h-5" /> },
  { key: 'additional', label: 'מידע נוסף', icon: <Info className="w-5 h-5" /> },
  { key: 'summary', label: 'סיכום', icon: <FileText className="w-5 h-5" /> },
];

export default function App() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState<QuestionnaireData>(INITIAL_DATA);

  const updateFormData = (data: Partial<QuestionnaireData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const currentStep = STEPS[currentStepIndex].key;
  const progressPercentage = (currentStepIndex / (STEPS.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center">
      {/* Top Sticky Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-slate-100 z-50">
        <div 
          className="h-full bg-cyan-400 transition-all duration-700 ease-out animate-progress bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-400"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className="w-full max-w-4xl py-12 px-4 sm:px-6">
        {/* Logo Header */}
        <header className="w-full mb-16 flex flex-col items-center text-center">
          <div className="mb-4 relative">
            <div className="relative mb-2">
              <h1 className="text-6xl sm:text-7xl font-black text-slate-900 leading-none tracking-tight">אדוה קורן</h1>
              <div className="absolute top-[-4px] right-[52%] w-3.5 h-3.5 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>
            </div>
            
            <p className="text-2xl sm:text-3xl font-serif text-slate-600 italic tracking-wide">
              סטודיו לעיצוב ומיתוג
            </p>
            
            <div className="w-32 h-1 bg-cyan-400 mx-auto rounded-full mt-4 opacity-80"></div>
            
            <div className="text-slate-400 font-bold mt-6 tracking-[0.2em] text-sm uppercase">
              Premium Branding & Design
            </div>
          </div>
        </header>

        {/* Stepper Navigation */}
        <div className="w-full mb-12 overflow-x-auto no-scrollbar pb-4">
          <div className="flex justify-between items-center min-w-[650px] px-4">
            {STEPS.map((step, idx) => (
              <div 
                key={step.key} 
                className={`flex flex-col items-center relative transition-all duration-500 flex-1 ${
                  idx <= currentStepIndex ? 'text-cyan-500' : 'text-slate-300'
                }`}
              >
                <div className={`
                  w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 z-10
                  ${idx < currentStepIndex ? 'bg-cyan-500 border-cyan-500 text-white' : 
                    idx === currentStepIndex ? 'bg-white border-cyan-500 text-cyan-500 shadow-[0_15px_30px_rgba(34,211,238,0.15)] ring-4 ring-cyan-50' : 
                    'bg-white border-slate-100'}
                `}>
                  {idx < currentStepIndex ? <CheckCircle2 className="w-7 h-7" /> : step.icon}
                </div>
                <span className={`text-[11px] font-black mt-3 whitespace-nowrap tracking-widest uppercase ${idx === currentStepIndex ? 'opacity-100' : 'opacity-60'}`}>
                  {step.label}
                </span>
                
                {idx < STEPS.length - 1 && (
                  <div className={`
                    absolute top-7 -right-1/2 w-full h-0.5 z-0
                    ${idx < currentStepIndex ? 'bg-cyan-500' : 'bg-slate-100'}
                  `} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Card */}
        <main className="w-full bg-white rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.06)] border border-slate-50 p-6 sm:p-16 mb-20 relative overflow-hidden">
          {/* Decorative corner element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-50/30 rounded-bl-[5rem] -mr-16 -mt-16 pointer-events-none" />
          
          <div className="relative z-10 min-h-[450px]">
            {currentStep === 'welcome' && <Welcome onNext={handleNext} />}
            {currentStep === 'business' && <BusinessForm data={formData} update={updateFormData} />}
            {currentStep === 'vision' && <VisionForm data={formData} update={updateFormData} />}
            {currentStep === 'audience' && <AudienceForm data={formData} update={updateFormData} />}
            {currentStep === 'style' && <StyleForm data={formData} update={updateFormData} />}
            {currentStep === 'additional' && <AdditionalForm data={formData} update={updateFormData} />}
            {currentStep === 'summary' && (
              <Summary data={formData} />
            )}
            
            {/* Footer Navigation */}
            {currentStep !== 'welcome' && currentStepIndex < STEPS.length && (
              <div className="mt-20 pt-10 border-t border-slate-50 flex justify-between items-center">
                <button
                  onClick={handleBack}
                  disabled={currentStepIndex === 0}
                  className="flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-slate-100 text-slate-400 font-bold hover:bg-slate-50 hover:text-slate-600 transition-all disabled:opacity-0 active:scale-95"
                >
                  <ArrowRight className="w-5 h-5" />
                  <span>חזור</span>
                </button>
                
                {currentStepIndex < STEPS.length - 1 ? (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-3 px-12 py-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-black shadow-[0_15px_30px_rgba(0,0,0,0.1)] transition-all active:scale-95 group"
                  >
                    <span>הבא</span>
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  </button>
                ) : null}
              </div>
            )}
          </div>
        </main>

        {/* Studio Signature */}
        <footer className="w-full py-12 flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-0.5 bg-cyan-400/30"></div>
            <div className="text-cyan-500 text-2xl font-black tracking-tight">
              העסק שלך ראוי למותג מנצח
            </div>
            <div className="w-8 h-0.5 bg-cyan-400/30"></div>
          </div>
          <div className="text-slate-400 text-xs font-bold tracking-[0.3em] uppercase">
            Designed by Studio Adva Korn &copy; {new Date().getFullYear()}
          </div>
        </footer>
      </div>
    </div>
  );
}
