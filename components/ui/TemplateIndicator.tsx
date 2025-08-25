import { FileText, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TemplateIndicatorProps {
  type?: 'inline' | 'badge' | 'watermark';
  text?: string;
  className?: string;
}

export function TemplateIndicator({ 
  type = 'badge', 
  text = 'Template Content',
  className = '' 
}: TemplateIndicatorProps) {
  if (type === 'inline') {
    return (
      <span className={`inline-flex items-center gap-1 text-xs text-muted-foreground ${className}`}>
        <FileText className="h-3 w-3" />
        <em>{text}</em>
      </span>
    );
  }

  if (type === 'watermark') {
    return (
      <div className={`absolute top-2 right-2 opacity-60 ${className}`}>
        <Badge variant="outline" className="text-xs bg-background/80 backdrop-blur-sm">
          <FileText className="h-3 w-3 mr-1" />
          {text}
        </Badge>
      </div>
    );
  }

  return (
    <Badge variant="secondary" className={`text-xs ${className}`}>
      <AlertCircle className="h-3 w-3 mr-1" />
      {text}
    </Badge>
  );
}