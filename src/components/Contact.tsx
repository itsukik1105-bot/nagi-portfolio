import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { X, ArrowRight } from 'lucide-react'

interface ContactProps {
  onBack: () => void
}

export function Contact({ onBack }: ContactProps) {
  // 送信状態管理
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // フォーム送信ハンドラ (Formspree等のサービスを利用する場合)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      // ★重要: ここにご自身のFormspreeのエンドポイントURLを入れてください
      // 例: "https://formspree.io/f/xay......"
      const response = await fetch("https://formspree.io/f/xzznlbaj", {
        method: "POST",
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#f0f0f0] relative z-50 pt-32 pb-40 px-6">
      
      {/* 閉じるボタン */}
      <div className="fixed top-8 right-8 z-50 mix-blend-difference">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="rounded-full w-12 h-12 hover:bg-white/20 active:bg-white/20 text-white transition-colors border border-transparent hover:border-white/20 active:border-white/20"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="max-w-[800px] mx-auto">
        
        {/* ヘッダー */}
        <div className="mb-20 fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h1 className="text-sm font-medium tracking-[0.2em] uppercase text-[#666] mb-2">
            Contact
          </h1>
          <div className="w-full h-px bg-[#222]"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* 左側：メッセージ */}
          <div className="md:col-span-4 fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Let's talk.</h2>
            <p className="text-sm text-[#888] leading-relaxed mb-8">
              制作のご依頼、ご相談、その他お問い合わせはこちらからお願いいたします。<br/>
              通常3日以内に返信いたします。
            </p>
            <div className="text-xs text-[#444] tracking-widest font-mono">
              TOKYO, JAPAN<br/>
              EST. 2024
            </div>
          </div>

          {/* 右側：フォーム */}
          <div className="md:col-span-8 fade-in-up" style={{ animationDelay: '0.3s' }}>
            
            {status === "success" ? (
              <div className="h-64 flex flex-col items-center justify-center border border-[#222] bg-[#0a0a0a]">
                <p className="text-lg mb-2">Message Sent.</p>
                <p className="text-sm text-[#666]">お問い合わせありがとうございます。</p>
                <Button variant="link" onClick={() => setStatus("idle")} className="mt-4 text-white underline">
                  戻る
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-12">
                
                {/* Name */}
                <div className="group">
                  <label htmlFor="name" className="block text-[10px] tracking-[0.2em] uppercase text-[#555] mb-2 group-focus-within:text-white transition-colors">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full bg-transparent border-b border-[#333] py-4 text-lg text-white focus:outline-none focus:border-white transition-colors placeholder:text-[#333]"
                    placeholder="John Doe"
                  />
                </div>

                {/* Email */}
                <div className="group">
                  <label htmlFor="email" className="block text-[10px] tracking-[0.2em] uppercase text-[#555] mb-2 group-focus-within:text-white transition-colors">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full bg-transparent border-b border-[#333] py-4 text-lg text-white focus:outline-none focus:border-white transition-colors placeholder:text-[#333]"
                    placeholder="hello@example.com"
                  />
                </div>

                {/* Message */}
                <div className="group">
                  <label htmlFor="message" className="block text-[10px] tracking-[0.2em] uppercase text-[#555] mb-2 group-focus-within:text-white transition-colors">
                    Message
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    className="w-full bg-transparent border-b border-[#333] py-4 text-lg text-white focus:outline-none focus:border-white transition-colors placeholder:text-[#333] resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="group flex items-center gap-4 text-sm tracking-[0.2em] uppercase hover:text-[#888] active:text-[#888] transition-colors disabled:opacity-50"
                  >
                    {status === "submitting" ? "Sending..." : "Send Message"}
                    <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black group-active:bg-white group-active:text-black transition-all duration-300">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>
                </div>

                {status === "error" && (
                  <p className="text-red-500 text-xs">送信に失敗しました。もう一度お試しください。</p>
                )}
              </form>
            )}

          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in-up {
          opacity: 0;
          animation: fadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  )
}