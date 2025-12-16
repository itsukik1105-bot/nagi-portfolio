interface FooterProps {
  siteConfig: {
    siteName: string
    siteDescription: string
    contactEmail: string
    phone: string
    location: string
    social: {
      instagram: string
      vimeo: string
      twitter: string
    }
  }
}

export function Footer({ siteConfig }: FooterProps) {
  return (
    <footer className="border-t border-white/10 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl mb-4">{siteConfig.siteName}</h3>
            <p className="text-white/60 leading-relaxed">
              {siteConfig.siteDescription}
            </p>
          </div>
          
          <div>
            <h4 className="mb-4">Contact</h4>
            <div className="space-y-2 text-white/70">
              <p>{siteConfig.contactEmail}</p>
              <p>{siteConfig.phone}</p>
              <p>{siteConfig.location}</p>
            </div>
          </div>
          
          <div>
            <h4 className="mb-4">Connect</h4>
            <div className="flex space-x-6">
              {siteConfig.social.instagram && (
                <a 
                  href={siteConfig.social.instagram} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  Instagram
                </a>
              )}
              {siteConfig.social.vimeo && (
                <a 
                  href={siteConfig.social.vimeo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  Vimeo
                </a>
              )}
              {siteConfig.social.twitter && (
                <a 
                  href={siteConfig.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  Twitter
                </a>
              )}
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-white/50 text-sm">
          <p>&copy; 2024 {siteConfig.siteName}. All rights reserved.</p>
          <p>Portfolio designed for visual excellence</p>
        </div>
      </div>
    </footer>
  )
}