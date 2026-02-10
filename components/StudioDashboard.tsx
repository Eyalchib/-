
import React, { useState, useEffect, useRef } from 'react';
import { Submission, SubmissionStatus } from '../types';
import { LayoutDashboard, Users, FileText, Download, Clock, CheckCircle2, Circle, ArrowRight, Loader2, ChevronRight } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface Props {
  onExit: () => void;
}

const StudioDashboard: React.FC<Props> = ({ onExit }) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const [filter, setFilter] = useState<SubmissionStatus | 'all'>('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = () => {
    const data = localStorage.getItem('adva_submissions');
    if (data) {
      setSubmissions(JSON.parse(data));
    }
  };

  const updateStatus = (id: string, status: SubmissionStatus) => {
    const updated = submissions.map(sub => sub.id === id ? { ...sub, status } : sub);
    setSubmissions(updated);
    localStorage.setItem('adva_submissions', JSON.stringify(updated));
    if (selectedSub?.id === id) {
      setSelectedSub({ ...selectedSub, status });
    }
  };

  const deleteSubmission = (id: string) => {
    if(window.confirm('האם את בטוחה שברצונך למחוק איפיון זה?')) {
      const updated = submissions.filter(sub => sub.id !== id);
      setSubmissions(updated);
      localStorage.setItem('adva_submissions', JSON.stringify(updated));
      if (selectedSub?.id === id) setSelectedSub(null);
    }
  };

  const filteredSubs = submissions.filter(s => filter === 'all' ? true : s.status === filter);

  const generatePDF = async () => {
    if (!printRef.current || !selectedSub) return;
    setIsGenerating(true);
    
    try {
      // Create a temporary clone for better PDF rendering regardless of screen size
      const clone = printRef.current.cloneNode(true) as HTMLElement;
      clone.style.width = '800px'; // Fixed width for consistent PDF
      clone.style.position = 'absolute';
      clone.style.top = '-9999px';
      document.body.appendChild(clone);

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      document.body.removeChild(clone);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`איפיון-${selectedSub.businessName}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const getStatusIcon = (status: SubmissionStatus) => {
    switch(status) {
      case 'new': return <Circle className="w-4 h-4 text-blue-500 fill-blue-50" />;
      case 'in_progress': return <Clock className="w-4 h-4 text-amber-500" />;
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans" dir="rtl">
      {/* Top Navbar */}
      <header className="bg-slate-900 text-white p-3 sm:p-4 shadow-lg z-10 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-cyan-500 rounded-lg flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h1 className="font-black text-lg sm:text-xl tracking-tight leading-tight">סטודיו אדוה קורן</h1>
            <p className="text-cyan-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest">מערכת ניהול</p>
          </div>
        </div>
        <button onClick={onExit} className="text-slate-400 hover:text-white flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold bg-slate-800 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-colors">
          <span className="hidden sm:inline">חזרה לאתר</span>
          <span className="sm:hidden">יציאה</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden h-[calc(100vh-64px)] sm:h-[calc(100vh-72px)]">
        {/* Sidebar List - Hidden on mobile if a submission is selected */}
        <div className={`${selectedSub ? 'hidden md:flex' : 'flex'} w-full md:w-80 bg-white md:border-l border-slate-200 flex-col h-full overflow-hidden shrink-0`}>
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <div className="flex gap-1 sm:gap-2 mb-4 bg-slate-100 p-1 rounded-lg overflow-x-auto no-scrollbar">
              {(['all', 'new', 'in_progress', 'completed'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex-1 min-w-[60px] py-1.5 text-xs font-bold rounded-md transition-all ${filter === f ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {f === 'all' ? 'הכל' : f === 'new' ? 'חדש' : f === 'in_progress' ? 'בטיפול' : 'סוים'}
                </button>
              ))}
            </div>
            <div className="text-sm font-bold text-slate-400 flex justify-between items-center px-2">
              <span>{filteredSubs.length} שאלונים</span>
              <Users className="w-4 h-4" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {filteredSubs.map(sub => (
              <div 
                key={sub.id}
                onClick={() => setSelectedSub(sub)}
                className={`p-4 rounded-xl cursor-pointer transition-all border ${selectedSub?.id === sub.id ? 'bg-cyan-50 border-cyan-200 shadow-sm' : 'bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-900 truncate pl-2">{sub.businessName || 'עסק ללא שם'}</h3>
                  {getStatusIcon(sub.status)}
                </div>
                <div className="text-xs text-slate-500 mb-1 line-clamp-1">{sub.oneLineDescription}</div>
                <div className="text-[10px] text-slate-400 font-medium bg-slate-100 inline-block px-2 py-0.5 rounded-sm">
                  {new Date(sub.submittedAt).toLocaleDateString('he-IL')}
                </div>
              </div>
            ))}
            {filteredSubs.length === 0 && (
              <div className="text-center p-8 text-slate-400 text-sm font-medium">
                אין איפיונים להצגה בסטטוס זה.
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area - Hidden on mobile if NO submission is selected */}
        <div className={`${!selectedSub ? 'hidden md:flex' : 'flex'} flex-1 bg-slate-50 overflow-y-auto relative h-full flex-col`}>
          {selectedSub ? (
            <div className="max-w-4xl mx-auto w-full p-4 sm:p-8 pb-32">
              
              {/* Mobile Back Button */}
              <button 
                onClick={() => setSelectedSub(null)}
                className="md:hidden flex items-center gap-2 text-slate-500 font-bold mb-4 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 active:scale-95"
              >
                <ChevronRight className="w-5 h-5" />
                חזרה לרשימה
              </button>

              {/* Header Actions */}
              <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mb-6 sm:mb-8 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">{selectedSub.businessName}</h2>
                  <div className="flex flex-wrap gap-3 items-center">
                    <select 
                      value={selectedSub.status}
                      onChange={(e) => updateStatus(selectedSub.id, e.target.value as SubmissionStatus)}
                      className="text-sm font-bold bg-slate-100 border-none rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 cursor-pointer"
                    >
                      <option value="new">סטטוס: חדש</option>
                      <option value="in_progress">סטטוס: בטיפול</option>
                      <option value="completed">סטטוס: סוים</option>
                    </select>
                    <button onClick={() => deleteSubmission(selectedSub.id)} className="text-sm font-bold text-red-500 hover:text-red-700 transition-colors bg-red-50 px-3 py-2 rounded-lg">
                      מחק שאלון
                    </button>
                  </div>
                </div>

                <button 
                  onClick={generatePDF}
                  disabled={isGenerating}
                  className="flex justify-center items-center gap-2 sm:gap-3 bg-slate-900 text-white px-4 sm:px-6 py-3 rounded-xl font-bold hover:bg-black transition-all shadow-lg shadow-slate-200 active:scale-95 disabled:opacity-70 w-full lg:w-auto"
                >
                  {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                  הורד כ-PDF
                </button>
              </div>

              {/* Data Display & Printable Area */}
              <div className="overflow-x-auto pb-4">
                <div ref={printRef} className="bg-white rounded-2xl sm:rounded-[2rem] p-6 sm:p-12 shadow-xl border border-slate-100 relative min-w-full sm:min-w-[700px]">
                  <div className="absolute top-0 left-0 w-full h-2 sm:h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-t-2xl sm:rounded-t-[2rem]"></div>
                  
                  <div className="flex flex-col items-center text-center border-b-2 border-slate-100 pb-6 sm:pb-8 mb-8 sm:mb-10 mt-2 sm:mt-4">
                    <div className="text-3xl sm:text-4xl font-black text-slate-900 mb-2">אדוה קורן</div>
                    <div className="text-cyan-500 font-bold tracking-widest uppercase text-xs sm:text-sm">סיכום שאלון איפיון מותג</div>
                  </div>

                  <div className="space-y-10 sm:space-y-12">
                    <Section title="פרטי העסק">
                      <GridItem label="שם העסק" value={selectedSub.businessName} />
                      <GridItem label="תמצית" value={selectedSub.oneLineDescription} full />
                      <GridItem label="מטרה" value={selectedSub.businessGoal} full />
                    </Section>

                    <Section title="חזון וערכים">
                      <GridItem label="חזון" value={selectedSub.vision} full />
                      <GridItem label="ערכים מובילים" value={selectedSub.coreValues} />
                      <GridItem label="ייחוד / בידול" value={selectedSub.uniqueSellingPoint} />
                      <GridItem label="מסר מרכזי" value={selectedSub.mainMessage} />
                      <GridItem label="רגש רצוי" value={selectedSub.desiredEmotion} />
                    </Section>

                    <Section title="קהל יעד">
                      <GridItem label="קהל רחב" value={selectedSub.targetAudience} full />
                      <GridItem label="פרופיל אידיאלי" value={selectedSub.idealClientProfile} full />
                      <GridItem label="אתגרי הלקוח" value={selectedSub.clientChallenges} full />
                    </Section>

                    <Section title="עיצוב וסגנון">
                      <GridItem label="סגנון מבוקש" value={selectedSub.preferredStyle} />
                      <GridItem label="סקאלת המותג" value={selectedSub.vibeScale === 'emotional' ? 'רגשי / חם' : selectedSub.vibeScale === 'professional' ? 'עסקי / ענייני' : 'מאוזן'} />
                      <GridItem label="צבעים רצויים" value={selectedSub.brandColors} />
                      <GridItem label="צבעים להימנע" value={selectedSub.avoidColors} textClass="text-red-500" />
                    </Section>

                    <Section title="מידע נוסף">
                      <GridItem label="מוצרים ושירותים" value={selectedSub.productsServices} full />
                      <GridItem label="לוגו קיים" value={selectedSub.existingLogo === 'yes' ? 'כן' : 'לא'} />
                      {selectedSub.existingLogo === 'yes' && <GridItem label="פירוט לוגו קודם" value={selectedSub.existingLogoDetails} />}
                      <GridItem label="מעורבים נוספים" value={selectedSub.professionalsInvolved} />
                      <GridItem label="מקבלי החלטות" value={selectedSub.decisionMakers} />
                      <GridItem label="השראות" value={selectedSub.inspirationMaterials} full />
                    </Section>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="hidden md:flex flex-col items-center justify-center h-full text-slate-400">
              <FileText className="w-20 h-20 mb-6 text-slate-200" />
              <p className="text-xl font-bold text-slate-500">בחרי איפיון מהתפריט כדי לצפות בפרטים</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Section: React.FC<{title: string, children: React.ReactNode}> = ({title, children}) => (
  <div>
    <h3 className="text-lg font-black text-slate-800 border-b-2 border-slate-100 pb-2 mb-4 sm:mb-6 inline-block pr-2">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 sm:gap-x-12 sm:gap-y-8">
      {children}
    </div>
  </div>
);

const GridItem: React.FC<{label: string, value: string, full?: boolean, textClass?: string}> = ({label, value, full, textClass}) => (
  <div className={`flex flex-col gap-1.5 sm:gap-2 ${full ? 'col-span-1 md:col-span-2' : ''}`}>
    <span className="text-[10px] sm:text-[11px] font-black text-cyan-500 uppercase tracking-widest">{label}</span>
    <p className={`font-bold text-slate-900 leading-relaxed text-base sm:text-lg ${textClass || ''}`}>
      {value || <em className="text-slate-300 font-normal text-sm">לא הוזן</em>}
    </p>
  </div>
);

export default StudioDashboard;
