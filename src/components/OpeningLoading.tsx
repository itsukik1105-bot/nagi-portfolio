import { useEffect, useState } from 'react'

export function OpeningLoading() {
  const [count, setCount] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const [isHidden, setIsHidden] = useState(false)

  useEffect(() => {
    // 少しだけゆっくりにして、溜めを作る
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setIsFinished(true), 400) // 完了後の余韻を少し長く
          setTimeout(() => setIsHidden(true), 2000)
          return 100
        }
        // 滑らかに進むように調整
        const increment = Math.random() > 0.5 ? 2 : 1
        return Math.min(prev + increment, 100)
      })
    }, 30)

    return () => clearInterval(interval)
  }, [])

  if (isHidden) return null

  return (
    <div 
      className={`fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center transition-transform duration-[1.5s] cubic-bezier(0.87, 0, 0.13, 1)
        ${isFinished ? '-translate-y-full' : 'translate-y-0'}
      `}
    >
      {/* ノイズ */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.07] mix-blend-overlay pointer-events-none"></div>

      {/* メインのプログレスバーエリア */}
      <div className={`w-full max-w-md px-6 relative transition-opacity duration-700 ${isFinished ? 'opacity-0' : 'opacity-100'}`}>
        
        {/* バーの背景（薄い線） */}
        <div className="w-full h-[1px] bg-[#222] overflow-visible relative">
          
          {/* 進捗バー（白い線） */}
          <div 
            className="h-full bg-[#f0f0f0] transition-all duration-100 ease-linear relative"
            style={{ width: `${count}%` }}
          >
            {/* 先端の光（カーソル） */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[2px] h-[8px] bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
          </div>

        </div>

        {/* 左下のテキスト */}
        <div className="absolute top-4 left-6 text-[10px] text-[#555] font-mono tracking-[0.2em] uppercase">
          Initialize...
        </div>

      </div>

      {/* 右下のカウント表示（極小・システムログ風） */}
      <div className={`absolute bottom-8 right-8 text-right transition-opacity duration-500 ${isFinished ? 'opacity-0' : 'opacity-100'}`}>
        <div className="text-[40px] md:text-[60px] font-bold text-[#1a1a1a] font-mono leading-none tracking-tighter select-none pointer-events-none">
          {count.toString().padStart(3, '0')}
        </div>
        <div className="text-[9px] text-[#444] font-mono tracking-widest mt-2 uppercase">
          System Loading
        </div>
      </div>

    </div>
  )
}