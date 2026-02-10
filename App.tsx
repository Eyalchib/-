
import React, { useState } from 'react';
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
import StudioDashboard from './components/StudioDashboard';

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
  const [isAdminView, setIsAdminView] = useState(false);

  // Secret Admin Login trigger (click 3 times fast on the logo)
  const [clickCount, setClickCount] = useState(0);
  const handleLogoClick = () => {
    setClickCount(prev => prev + 1);
    if (clickCount >= 2) {
      setIsAdminView(true);
      setClickCount(0);
    }
    setTimeout(() => setClickCount(0), 1000); // Reset after 1 second
  };

  if (isAdminView) {
    return <StudioDashboard onExit={() => setIsAdminView(false)} />;
  }

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

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-12 px-4 sm:px-6">
      {/* Exact Logo Representation Header */}
      <header 
        className="w-full max-w-4xl mb-16 flex flex-col items-center text-center select-none cursor-default"
        onClick={handleLogoClick}
      >
        <div className="mb-4 relative">
          <div className="relative mb-2">
            <h1 className="text-6xl font-black text-slate-900 leading-none tracking-tight">אדוה קורן</h1>
            <div className="absolute top-[-8px] right-[52%] w-3 h-3 bg-cyan-400 rounded-full"></div>
          </div>
          <p className="text-3xl font-serif text-slate-800 italic" style={{ fontFamily: 'Assistant, sans-serif' }}>
            סטודיו לעיצוב ומיתוג
          </p>
          <div className="w-48 h-1.5 bg-cyan-400 mx-auto rounded-full mt-3 opacity-90"></div>
          <div className="text-slate-900 font-extrabold mt-6 tracking-widest text-2xl">
            054-2444576
          </div>
        </div>
      </header>

      {/* Stepper Navigation */}
      <div className="w-full max-w-4xl mb-12 overflow-x-auto no-scrollbar pb-2">
        <div className="flex justify-between items-center min-w-[600px] px-8">
          {STEPS.map((step, idx) => (
            <div 
              key={step.key} 
              className={`flex flex-col items-center relative transition-all duration-500 ${
                idx <= currentStepIndex ? 'text-cyan-500' : 'text-slate-300'
              }`}
            >
              <div className={`
                w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-500
                ${idx < currentStepIndex ? 'bg-cyan-500 border-cyan-500 text-white' : 
                  idx === currentStepIndex ? 'bg-white border-cyan-500 text-cyan-500 shadow-xl shadow-cyan-100 ring-4 ring-cyan-50' : 
                  'bg-white border-slate-100'}
              `}>
                {idx < currentStepIndex ? <CheckCircle2 className="w-6 h-6" /> : step.icon}
              </div>
              <span className="text-xs font-bold mt-3 whitespace-nowrap tracking-wide uppercase">{step.label}</span>
              
              {idx < STEPS.length - 1 && (
                <div className={`
                  absolute top-6 -right-[110%] w-[180%] h-0.5 z-0
                  ${idx < currentStepIndex ? 'bg-cyan-500' : 'bg-slate-100'}
                `} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Card */}
      <main className="w-full max-w-3xl bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-slate-100 p-8 sm:p-12 mb-20 relative min-h-[500px]">
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
          <div className="mt-16 pt-10 border-t border-slate-50 flex justify-between items-center">
            <button
              onClick={handleBack}
              disabled={currentStepIndex === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl border-2 border-slate-100 text-slate-400 font-bold hover:bg-slate-50 hover:text-slate-600 transition-all disabled:opacity-0"
            >
              <ArrowRight className="w-5 h-5" />
              <span>חזור</span>
            </button>
            
            {currentStepIndex < STEPS.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-3 px-10 py-3 rounded-2xl bg-slate-900 text-white font-bold hover:bg-black shadow-2xl shadow-slate-200 transition-all active:scale-95 group"
              >
                <span>הבא</span>
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </button>
            ) : null}
          </div>
        )}
      </main>

      {/* Signature Footer */}
      <footer className="w-full py-8 border-t border-slate-50 mt-auto flex flex-col items-center gap-2 relative">
        <div className="text-cyan-500 text-2xl font-black tracking-tight">
          לבניית תדמית מנצחת לעסק שלך!
        </div>
        <div className="text-slate-400 text-sm font-medium">
          &copy; {new Date().getFullYear()} סטודיו אדוה קורן - כל הזכויות שמורות
        </div>
        
        {/* Hidden button for developers, normally use the 3 clicks on logo */}
        <button 
          onClick={() => setIsAdminView(true)} 
          className="absolute bottom-2 right-2 w-4 h-4 opacity-0 hover:opacity-10 cursor-pointer"
          title="כניסה לניהול"
        />
      </footer>
    </div>
  );
}
