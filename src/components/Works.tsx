import { useState, useMemo } from 'react'
import { type Work } from '../data/works'

interface WorksProps {
  works: Work[]
  onWorkClick: (work: Work) => void
}

export function Works({ works, onWorkClick }: WorksProps) {
  // 現在選択されているカテゴリー (デフォルトは "All")
  const [activeCategory, setActiveCategory] = useState("All")

  // データからユニークなカテゴリー一覧を抽出
  const categories = useMemo(() => {
    // セット(重複排除)を使ってリスト化
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
              {/* アクティブ時の下線 */}
              <span className={`absolute -bottom-4 left-0 w-full h-[2px] bg-white transition-transform duration-300 origin-left
                ${activeCategory === cat ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-50 group-active:scale-x-50'}
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
          <div
            key={work.id}
            onClick={() => onWorkClick(work)}
            className="group cursor-pointer fade-in-up" // アニメーションクラス付与
          >
            {/* サムネイル */}
            <div className="relative aspect-[16/10] bg-[#111] overflow-hidden mb-6">
              <img
                src={work.thumbnail}
                alt={work.title}
                className="w-full h-full object-cover grayscale transition-all duration-700 ease-out group-hover:grayscale-0 group-hover:scale-[1.02] group-active:grayscale-0 group-active:scale-[1.02]"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>

            {/* テキスト情報 */}
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="text-xl md:text-2xl font-medium text-[#ccc] group-hover:text-white group-active:text-white transition-colors duration-300">
                  {work.title}
                </h3>
                <p className="text-xs text-[#555] tracking-widest uppercase group-hover:text-[#777] group-active:text-[#777] transition-colors">
                  {work.category} — {work.year}
                </p>
              </div>
              
              <div className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-active:opacity-100 group-active:translate-x-0 transition-all duration-500 text-white/50 text-xl">
                →
              </div>
            </div>
          </div>
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