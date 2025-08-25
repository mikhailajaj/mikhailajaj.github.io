import { AlertTriangle, Hammer } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DevelopmentBannerProps {
  variant?: 'site' | 'template' | 'feature';
  message?: string;
  className?: string;
}

export function DevelopmentBanner({ 
  variant = 'site', 
  message,
  className = '' 
}: DevelopmentBannerProps) {
  const getContent = () => {
    switch (variant) {
      case 'template':
        return {
          icon: <AlertTriangle className="h-4 w-4" />,
          text: message || "This content is placeholder text and will be updated with real information soon.",
          bgColor: "bg-amber-50 border-amber-200 text-amber-800"
        };
      case 'feature':
        return {
          icon: <Hammer className="h-4 w-4" />,
          text: message || "This feature is currently in development and may not function as expected.",
          bgColor: "bg-blue-50 border-blue-200 text-blue-800"
        };
      default:
        return {
          icon: <Hammer className="h-4 w-4" />,
          text: message || "🚧 This site is under active development. Some features may be incomplete or contain placeholder content.",
          bgColor: "bg-orange-50 border-orange-200 text-orange-800"
        };
    }
  };

  const content = getContent();

  return (
    <Alert className={`${content.bgColor} ${className}`}>
      <div className="flex items-center gap-2">
        {content.icon}
        <AlertDescription className="text-sm font-medium">
          {content.text}
        </AlertDescription>
      </div>
    </Alert>
  );
}