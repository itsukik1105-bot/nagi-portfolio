import { useState, useEffect } from 'react'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { About } from './components/About' // ★ここを追加

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // ローディング演出（1.5秒後に表示）
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  // スクロール関数
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="w-16 h-1 bg-white/20 overflow-hidden">
          <div className="w-full h-full bg-white animate-loading-bar origin-left"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <Header 
        siteName="NAGI"
        onAboutClick={() => scrollToSection('about')}
        onContactClick={() => scrollToSection('contact')}
        onLogoClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      />
      
      <main>
        <Hero 
          title="VISUAL DESIGN"
          subtitle="TOKYO BASED CREATIVE"
          onAboutClick={() => scrollToSection('about')}
        />
        
        {/* ★ここにAboutセクションを追加 */}
        <About onContactClick={() => scrollToSection('contact')} />

        {/* Contactなどの他のセクションがあればここに続く... */}
        <div id="contact" className="h-screen flex items-center justify-center bg-neutral-900">
          <p className="text-white/50">Contact Section (Coming Soon)</p>
        </div>
      </main>
    </div>
  )
}

export default App