import { Input } from './ui/input'
import { Label } from './ui/label'

interface ImageSelectorProps {
  currentImage: string
  onImageSelect: (url: string) => void
}

export function ImageSelector({ currentImage, onImageSelect }: ImageSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Thumbnail URL</Label>
        <div className="flex gap-2">
          <Input 
            value={currentImage} 
            onChange={(e) => onImageSelect(e.target.value)}
            placeholder="https://..."
            className="bg-neutral-800 border-neutral-700"
          />
        </div>
      </div>
      
      {currentImage && (
        <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-md border border-white/10 bg-neutral-900 mt-2">
          <img 
            src={currentImage} 
            alt="Preview" 
            className="h-full w-full object-cover"
          />
        </div>
      )}
    </div>
  )
}