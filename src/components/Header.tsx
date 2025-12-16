import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { useGlitchText } from '../hooks/useGlitchText'

interface HeaderProps {
  siteName: string
  onAboutClick: () => void
  onContactClick: () => void
  onLogoClick: () => void
}

export function Header({ siteName, onAboutClick, onContactClick, onLogoClick }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  
  const { displayText, triggerGlitch } = useGlitchText(siteName)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-700 ease-out px-6 md:px-12 flex flex-col md:flex-row items-center md:justify-between
        ${isScrolled 
          ? 'py-4 bg-black/40 backdrop-blur-md border-b border-white/5' 
          : 'py-6 md:py-8 bg-transparent'
        }
      `}
    >
      {/* ロゴエリア */}
      <div 
        onClick={onLogoClick}
        onMouseEnter={triggerGlitch}
        onTouchStart={triggerGlitch}
        className="cursor-pointer group mb-4 md:mb-0 text-center md:text-left"
      >
        <h1 className="text-sm font-bold tracking-[0.2em] text-white uppercase font-mono min-w-[120px]">
          {displayText}
        </h1>
      </div>

      {/* ナビゲーションエリア */}
      <nav className="flex gap-8 md:gap-8">
        <Button
          variant="ghost"
          onClick={onAboutClick}
          className="text-xs font-medium tracking-[0.2em] text-white hover:text-white/60 active:text-white/60 hover:bg-transparent active:bg-transparent transition-colors uppercase p-0"
        >
          Profile
        </Button>
        <Button
          variant="ghost"
          onClick={onContactClick}
          className="text-xs font-medium tracking-[0.2em] text-white hover:text-white/60 active:text-white/60 hover:bg-transparent active:bg-transparent transition-colors uppercase p-0"
        >
          Contact
        </Button>
      </nav>

      {/* スクロール時のボーダーライン */}
      <div 
        className={`absolute bottom-0 left-0 h-px bg-white/10 transition-all duration-1000 ease-in-out
          ${isScrolled ? 'w-full opacity-100' : 'w-0 opacity-0'}
        `} 
      />
    </header>
  )
}