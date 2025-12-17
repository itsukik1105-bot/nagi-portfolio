import { useState, useMemo, useRef, useEffect } from 'react'
import { type Work } from '../data/works'

interface WorksProps {
  works: Work[]
  onWorkClick: (work: Work) => void
}

// 個別の作品カードコンポーネント
function WorkCard({ work, onClick, isMobileOrTablet }: { 
  work: Work
  onClick: () => void
  isMobileOrTablet: boolean 
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isInCenter, setIsInCenter] = useState(false)

  useEffect(() => {
    if (!isMobileOrTablet) return // PCではIntersection Observer不要
    
    const element = cardRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInCenter(entry.isIntersecting)
      },
      {
        threshold: 0.5,
        rootMargin: '-25% 0px -25% 0px', // 上下25%カット、中央50%で検出
      }
    )

    observer.observe(element)

    return () => observer.unobserve(element)
  }, [isMobileOrTablet])

  // スマホ時は中央検出、PC時はhoverで制御
  const isColorActive = isMobileOrTablet ? isInCenter : false

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      className="group cursor-pointer fade-in-up"
    >
      {/* サムネイル */}
      <div className="relative aspect-[16/10] bg-[#111] overflow-hidden mb-6">
        {work.thumbnail ? (
          <img
            src={work.thumbnail}
            alt={work.title}
            className={`w-full h-full object-cover transition-all duration-700 ease-out
              ${isMobileOrTablet 
                ? (isColorActive ? 'grayscale-0 scale-[1.02]' : 'grayscale scale-100')
                : 'grayscale group-hover:grayscale-0 group-hover:scale-[1.02]'
              }
            `}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          // サムネイルがない場合のプレースホルダー
          <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center">
            <span className="text-4xl font-bold text-[#333]">{work.title.charAt(0)}</span>
          </div>
        )}
        <div 
          className={`absolute inset-0 transition-opacity duration-500 pointer-events-none
            ${isMobileOrTablet
              ? (isColorActive ? 'bg-white/5 opacity-100' : 'bg-white/5 opacity-0')
              : 'bg-white/5 opacity-0 group-hover:opacity-100'
            }
          `}
        />
      </div>

      {/* テキスト情報 */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h3 
            className={`text-xl md:text-2xl font-medium transition-colors duration-300
              ${isMobileOrTablet
                ? (isColorActive ? 'text-white' : 'text-[#ccc]')
                : 'text-[#ccc] group-hover:text-white'
              }
            `}
          >
            {work.title}
          </h3>
          {/* カテゴリー / 年 / 役割 を表示 */}
          <div 
            className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-xs tracking-widest uppercase transition-colors
              ${isMobileOrTablet
                ? (isColorActive ? 'text-[#777]' : 'text-[#555]')
                : 'text-[#555] group-hover:text-[#777]'
              }
            `}
          >
            <span>{work.category}</span>
            <span className="text-[#333]">—</span>
            <span>{work.year}</span>
            {work.role && (
              <>
                <span className="text-[#333]">—</span>
                <span className="normal-case tracking-normal">{work.role}</span>
              </>
            )}
          </div>
        </div>
        
        <div 
          className={`transition-all duration-500 text-white/50 text-xl
            ${isMobileOrTablet
              ? (isColorActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2')
              : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
            }
          `}
        >
          →
        </div>
      </div>
    </div>
  )
}

export function Works({ works, onWorkClick }: WorksProps) {
  const [activeCategory, setActiveCategory] = useState("All")
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false)

  // モバイル/タブレット判定
  useEffect(() => {
    const checkDevice = () => {
      const isSmallScreen = window.innerWidth < 1024
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      setIsMobileOrTablet(isSmallScreen || isTouchDevice)
    }

    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  // データからユニークなカテゴリー一覧を抽出
  const categories = useMemo(() => {
    const uniqueCats = Array.from(new Set(works.map(w => w.category)))
    return ["All", ...uniqueCats]
  }, [works])

  // 選択されたカテゴリーでフィルタリング
  const filteredWorks = useMemo(() => {
    if (activeCategory === "All") return works
    return works.filter(w => w.category === activeCategory)
  }, [works, activeCategory])

  return (
    <section className="py-40 px-6 relative z-10">
      
      {/* リストヘッダー & ソートタブ */}
      <div className="max-w-[1200px] mx-auto mb-20 flex flex-col md:flex-row md:items-end justify-between border-b border-[#222] pb-4 gap-6">
        
        {/* カテゴリータブ */}
        <div className="flex flex-wrap gap-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-sm tracking-[0.2em] uppercase transition-colors duration-300 relative group
                ${activeCategory === cat ? 'text-white' : 'text-[#444] hover:text-[#888] active:text-[#888]'}
              `}
            >
              {cat}
              <span className={`absolute -bottom-4 left-0 w-full h-[2px] bg-white transition-transform duration-300 origin-left
                ${activeCategory === cat ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-50'}
              `} />
            </button>
          ))}
        </div>

        {/* 件数表示 */}
        <span className="text-xs text-[#444] font-mono text-right">
          {filteredWorks.length.toString().padStart(2, '0')} / {works.length.toString().padStart(2, '0')}
        </span>
      </div>

      {/* 作品グリッド */}
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24 min-h-[50vh]">
        {filteredWorks.map((work) => (
          <WorkCard
            key={work.id}
            work={work}
            onClick={() => onWorkClick(work)}
            isMobileOrTablet={isMobileOrTablet}
          />
        ))}
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in-up {
          animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </section>
  )
}