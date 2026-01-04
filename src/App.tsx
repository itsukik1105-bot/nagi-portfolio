import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { Hero } from './components/Hero'
import { Works } from './components/Works'
import { AboutSection } from './components/AboutSection'
import { WorkDetail } from './components/WorkDetail'
import { Header } from './components/Header'
import { CustomCursor } from './components/CustomCursor'
import { OpeningLoading } from './components/OpeningLoading'
import { Contact } from './components/Contact'
import { WordsGenerator } from './components/WordsGenerator'
import { Footer } from './components/Footer'
import { Timeline } from './components/Timeline'
import { siteConfig } from './data/site-config'
import { fetchWorks } from './utils/fetchWorks'
import { type Work } from './data/works'
import { useContentProtection } from './hooks/useContentProtection'
import { ArrowLeft } from 'lucide-react'
import { Button } from './components/ui/button'

// 戻るボタン（タイムラインページ用）
function BackButton() {
  const location = useLocation()
  if (location.pathname === '/') return null

  return (
    <div className="fixed top-8 left-8 z-50 mix-blend-difference">
      <Link to="/">
        <Button
          variant="ghost"
          className="text-white hover:text-white/60 active:text-white/60 p-0 hover:bg-transparent active:bg-transparent transition-colors duration-300"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="text-xs tracking-[0.2em] font-medium uppercase">Home</span>
        </Button>
      </Link>
    </div>
  )
}

// ポートフォリオ（トップページ）の中身
function Portfolio() {
  const [selectedWork, setSelectedWork] = useState<Work | null>(null)
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const [isContactOpen, setIsContactOpen] = useState(false)
  const [works, setWorks] = useState<Work[]>([])

  useEffect(() => {
    fetchWorks().then((data) => {
      setWorks(data)
    })
  }, [])

  const handleBackToHome = () => {
    setSelectedWork(null)
    setIsAboutOpen(false)
    setIsContactOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (selectedWork) {
    return <WorkDetail work={selectedWork} onBack={handleBackToHome} />
  } 
  
  if (isAboutOpen) {
    return <AboutSection onBack={handleBackToHome} siteConfig={siteConfig} />
  } 
  
  if (isContactOpen) {
    return <Contact onBack={handleBackToHome} />
  }

  return (
    <>
      <Header 
        siteName={siteConfig.siteName} 
        onAboutClick={() => setIsAboutOpen(true)}
        onContactClick={() => setIsContactOpen(true)}
        onLogoClick={handleBackToHome}
      />

      <Hero 
        videoUrl={siteConfig.heroVideoUrl} 
        title={siteConfig.siteName}
        subtitle={siteConfig.siteDescription}
        onAboutClick={() => setIsAboutOpen(true)}
      />
      
      <Works 
        works={works} 
        onWorkClick={setSelectedWork} 
      />
      
      <WordsGenerator />

      {/* Timelineへのリンクボタン */}
      <div className="flex justify-center py-20 bg-black relative z-10">
        <Link to="/timeline" className="group relative px-10 py-4 rounded-full border border-white/20 hover:bg-white/10 transition-all duration-500">
          <span className="text-xs tracking-[0.3em] text-white/60 group-hover:text-white uppercase font-light">
            View Timeline
          </span>
        </Link>
      </div>

      <Footer siteConfig={siteConfig} />
    </>
  )
}

// アプリ全体（ルーティング設定）
function App() {
  // 画像・動画の保護
  useContentProtection()

  // Google Fonts読み込み
  useEffect(() => {
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@300;400;500;700;900&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
    return () => {
      document.head.removeChild(link)
    }
  }, [])

  return (
    <BrowserRouter>
      <div className="min-h-screen text-[#f0f0f0] font-sans selection:bg-white selection:text-black bg-black relative cursor-none">
        <OpeningLoading />
        <CustomCursor />
        <BackButton />
        
        <style>{`
          /* フォント設定 */
          * {
            font-family: 'Zen Kaku Gothic New', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          }
          
          .film-grain {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
            opacity: 0.07;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
            mix-blend-mode: overlay;
          }
          body {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          ::-webkit-scrollbar {
            display: none;
          }
          a, button, .cursor-pointer {
            cursor: none !important;
          }
        `}</style>

        <div className="film-grain"></div>
        
        {/* ページ遷移の設定 */}
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/timeline" element={<Timeline />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App