import { useState, useEffect, useRef } from 'react'
import { type Work } from '../data/works'
import { ImageWithFallback } from './figma/ImageWithFallback'

interface WorksSectionProps {
  works: Work[]
  onWorkClick: (work: Work) => void
}

// 個別の作品カードコンポーネント
function WorkCard({ 
  work, 
  onClick, 
  isMobileOrTablet 
}: { 
  work: Work
  onClick: () => void
  isMobileOrTablet: boolean 
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isInCenter, setIsInCenter] = useState(false)

  useEffect(() => {
    if (!isMobileOrTablet) return
    
    const element = cardRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInCenter(entry.isIntersecting)
      },
      {
        threshold: 0.5,
        rootMargin: '-25% 0px -25% 0px',
      }
    )

    observer.observe(element)
    return () => observer.unobserve(element)
  }, [isMobileOrTablet])

  const isColorActive = isMobileOrTablet ? isInCenter : false

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4">
        <ImageWithFallback
          src={work.thumbnail}
          alt={work.title}
          className={`w-full h-full object-cover transition-transform duration-700
            ${isMobileOrTablet
              ? (isColorActive ? 'scale-105' : 'scale-100')
              : 'group-hover:scale-105'
            }
          `}
        />
        
        {/* ホバー時の暗幕 */}
        <div 
          className={`absolute inset-0 transition-colors duration-300
            ${isMobileOrTablet
              ? (isColorActive ? 'bg-black/20' : 'bg-black/0')
              : 'bg-black/0 group-hover:bg-black/20'
            }
          `}
        />
        
        {/* カテゴリーバッジ */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-black/70 backdrop-blur-sm rounded-full text-xs tracking-wide">
            {work.category}
          </span>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 
          className={`text-xl transition-colors
            ${isMobileOrTablet
              ? (isColorActive ? 'text-white/80' : 'text-white')
              : 'group-hover:text-white/80'
            }
          `}
        >
          {work.title}
        </h3>
        <div className="flex items-center space-x-3 text-sm text-white/50">
          <span>{work.year}</span>
          {work.role && (
            <>
              <span>•</span>
              <span>{work.role}</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export function WorksSection({ works, onWorkClick }: WorksSectionProps) {
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

  // 新しい順（年数の降順）にソート
  const sortedWorks = [...works].sort((a, b) => b.year - a.year)
  
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl mb-6">Selected Works</h2>
          <p className="text-white/60 text-lg max-w-2xl">
            A curated collection of visual narratives.
          </p>
        </div>
        
        {/* 作品グリッド */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedWorks.map((work) => (
            <WorkCard
              key={work.id}
              work={work}
              onClick={() => onWorkClick(work)}
              isMobileOrTablet={isMobileOrTablet}
            />
          ))}
        </div>
      </div>
    </section>
  )
}