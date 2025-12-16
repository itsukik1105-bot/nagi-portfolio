import { type Work } from '../data/works' // ← ここに type を追加
import { ImageWithFallback } from './figma/ImageWithFallback'

interface WorksSectionProps {
  works: Work[]
  onWorkClick: (work: Work) => void
}

export function WorksSection({ works, onWorkClick }: WorksSectionProps) {
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
            <div
              key={work.id}
              onClick={() => onWorkClick(work)}
              className="group cursor-pointer"
            >
              <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4">
                <ImageWithFallback
                  src={work.thumbnail}
                  alt={work.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 group-active:scale-105"
                />
                
                {/* ホバー時の暗幕 */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 group-active:bg-black/20 transition-colors duration-300" />
                
                {/* カテゴリーバッジ */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-black/70 backdrop-blur-sm rounded-full text-xs tracking-wide">
                    {work.category}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl group-hover:text-white/80 group-active:text-white/80 transition-colors">
                  {work.title}
                </h3>
                <div className="flex items-center space-x-3 text-sm text-white/50">
                  <span>{work.year}</span>
                  {/* Roleがあれば表示 */}
                  {work.role && (
                    <>
                      <span>•</span>
                      <span>{work.role}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}