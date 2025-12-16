import { useEffect } from 'react'
import { Button } from './ui/button'
import { X, ArrowUpRight } from 'lucide-react'

interface AboutSectionProps {
  onBack: () => void
  siteConfig: any
}

export function AboutSection({ onBack, siteConfig }: AboutSectionProps) {
  const { about } = siteConfig

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 3段構成用のラベル定義
  const bioLabels = ["BACKGROUND", "CAREER", "VISION"];

  return (
    <div className="min-h-screen bg-black text-[#f0f0f0] relative z-50 pt-24 pb-40 px-6 md:px-12">
      
      {/* 閉じるボタン */}
      <div className="fixed top-8 right-8 z-50 mix-blend-difference fade-in-delay-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="rounded-full w-12 h-12 hover:bg-white/20 text-white transition-colors border border-transparent hover:border-white/20"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* 左カラム：固定エリア */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 lg:h-fit">
            <div className="aspect-[3/4] w-full max-w-md overflow-hidden bg-[#111] mb-10 relative group">
              <img 
                src={about.profileImage} 
                alt={about.title}
                className="w-full h-full object-cover grayscale transition-all duration-1000 ease-out group-hover:grayscale-0 group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-black z-20 animate-curtain-reveal pointer-events-none"></div>
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"></div>
            </div>

            <div className="fade-in-up">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-none">
                {about.title}
              </h1>
              <p className="text-xs md:text-sm text-[#666] font-normal tracking-wider mb-8 flex items-center gap-3">
                <span className="w-2 h-px bg-[#444]"></span>
                {about.subtitle}
              </p>
              <div className="flex gap-6 text-[10px] tracking-[0.2em] text-[#555] font-mono uppercase">
                <a href="#" className="hover:text-white transition-colors flex items-center gap-2 group">
                  Instagram <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </a>
                <a href="#" className="hover:text-white transition-colors flex items-center gap-2 group">
                  Twitter <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </a>
              </div>
            </div>
          </div>

          {/* 右カラム：スクロールエリア */}
          <div className="lg:col-span-7 pt-12 lg:pt-4">
            
            {/* Biography */}
            <div className="mb-32 fade-in-up-delay-1">
              <h2 className="text-[10px] text-[#444] font-bold tracking-[0.3em] uppercase mb-12 flex items-center gap-4">
                Biography
                <span className="flex-1 h-px bg-[#222]"></span>
              </h2>
              <div className="space-y-12">
                {about.bio.map((paragraph: string, index: number) => (
                  <div key={index} className="group/bio">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-[10px] font-mono text-[#444] group-hover/bio:text-white transition-colors duration-500">
                        0{index + 1}
                      </span>
                      <span className="text-[10px] tracking-[0.2em] text-[#666] uppercase group-hover/bio:text-white transition-colors duration-500">
                        {bioLabels[index] || 'STORY'}
                      </span>
                      <span className="h-px w-8 bg-[#222] group-hover/bio:bg-white/20 transition-colors duration-500"></span>
                    </div>
                    <p className="text-sm md:text-base text-[#ccc] leading-[2.2] font-light text-justify opacity-80 group-hover/bio:opacity-100 transition-opacity duration-500">
                      {paragraph}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience (★ここを修正) */}
            <div className="mb-32 fade-in-up-delay-2">
              <h2 className="text-[10px] text-[#444] font-bold tracking-[0.3em] uppercase mb-12 flex items-center gap-4">
                Experience
                <span className="flex-1 h-px bg-[#222]"></span>
              </h2>
              
              <div className="border-l border-[#222] ml-2 md:ml-4 pl-8 md:pl-12 space-y-16 group/list">
                {about.experience.map((exp: any, index: number) => (
                  <div 
                    key={index} 
                    className="group/item relative transition-all duration-500 group-hover/list:opacity-30 hover:!opacity-100"
                  >
                    {/* ドット装飾 */}
                    <div className="absolute -left-[37px] md:-left-[53px] top-2 w-3 h-3 bg-[#111] rounded-full border border-[#333] group-hover/item:bg-white group-hover/item:border-white group-hover/item:shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all duration-300"></div>
                    
                    {/* 1. 期間 (Period) */}
                    <span className="block text-[10px] text-[#555] tracking-widest mb-2 font-mono group-hover/item:text-white transition-colors">
                      {exp.period}
                    </span>

                    {/* 2. 会社名 (Company) - 一番大きく強調 */}
                    <h3 className="text-2xl md:text-4xl font-bold mb-2 text-[#e0e0e0] group-hover/item:text-white transition-colors tracking-tight">
                      {exp.company}
                    </h3>

                    {/* 3. 役職 (Position) - 少し控えめに */}
                    <p className="text-sm md:text-base text-[#888] mb-4 font-medium group-hover/item:text-[#ccc] transition-colors uppercase tracking-wider">
                      {exp.position}
                    </p>
                    
                    {/* 4. 詳細説明 (Description) - データから読み込み */}
                    <p className="text-xs md:text-sm text-[#555] leading-relaxed max-w-lg group-hover/item:text-[#999] transition-colors font-light text-justify">
                       {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className="fade-in-up-delay-3">
              <h2 className="text-[10px] text-[#444] font-bold tracking-[0.3em] uppercase mb-8 flex items-center gap-4">
                Skills
                <span className="flex-1 h-px bg-[#222]"></span>
              </h2>
              <div className="flex flex-wrap gap-x-4 gap-y-3">
                {about.skills.map((skill: string, index: number) => (
                  <span 
                    key={index}
                    className="px-4 py-2 border border-[#222] bg-[#0a0a0a] text-xs text-[#888] hover:text-white hover:border-white hover:bg-white/10 transition-all duration-300 rounded-sm cursor-default hover:-translate-y-1"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @keyframes curtainReveal {
          0% { height: 100%; top: 0; }
          100% { height: 0%; top: 0; }
        }
        .animate-curtain-reveal {
          animation: curtainReveal 1.2s cubic-bezier(0.77, 0, 0.175, 1) 0.2s forwards;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .fade-in-up {
          opacity: 0;
          animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .fade-in-up-delay-1 {
          opacity: 0;
          animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
        }
        .fade-in-up-delay-2 {
          opacity: 0;
          animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards;
        }
        .fade-in-up-delay-3 {
          opacity: 0;
          animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s forwards;
        }
        .fade-in-delay-3 {
          opacity: 0;
          animation: fadeUp 0.8s ease 1s forwards;
        }
      `}</style>
    </div>
  )
}