/**
 * ComponentGrid Component
 * 
 * Displays a grid of shadcn/ui components with previews and information
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Code, Eye, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface Component {
  name: string;
  description: string;
}

interface ComponentGridProps {
  components: Component[];
  category: string;
  className?: string;
}

export function ComponentGrid({ components, category, className }: ComponentGridProps) {
  const [copiedComponent, setCopiedComponent] = useState<string | null>(null);

  const handleCopyImport = async (componentName: string) => {
    const importStatement = `import { ${componentName.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join('')} } from '@/components/ui/${componentName}';`;
    
    try {
      await navigator.clipboard.writeText(importStatement);
      setCopiedComponent(componentName);
      setTimeout(() => setCopiedComponent(null), 2000);
    } catch (err) {
      console.error('Failed to copy import statement:', err);
    }
  };

  const getComponentStatus = (componentName: string) => {
    // This would be connected to your actual component status
    const implementedComponents = ['button', 'card', 'input', 'label', 'badge'];
    return implementedComponents.includes(componentName) ? 'implemented' : 'available';
  };

  const getComponentComplexity = (componentName: string) => {
    const complexComponents = ['table', 'chart', 'calendar', 'command', 'navigation-menu'];
    const mediumComponents = ['dialog', 'form', 'carousel', 'accordion', 'tabs'];
    
    if (complexComponents.includes(componentName)) return 'complex';
    if (mediumComponents.includes(componentName)) return 'medium';
    return 'simple';
  };

  return (
    <div className={cn('grid gap-4 md:grid-cols-2 lg:grid-cols-3', className)}>
      {components.map((component) => {
        const status = getComponentStatus(component.name);
        const complexity = getComponentComplexity(component.name);
        const isCopied = copiedComponent === component.name;

        return (
          <Card key={component.name} className="group relative overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg font-medium">
                    {component.name}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge 
                      variant={status === 'implemented' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {status}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        'text-xs',
                        complexity === 'complex' && 'border-red-200 text-red-700',
                        complexity === 'medium' && 'border-yellow-200 text-yellow-700',
                        complexity === 'simple' && 'border-green-200 text-green-700'
                      )}
                    >
                      {complexity}
                    </Badge>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => handleCopyImport(component.name)}
                >
                  {isCopied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <CardDescription className="text-sm">
                {component.description}
              </CardDescription>
              
              {/* Component Preview Placeholder */}
              <div className="rounded-md border bg-muted/30 p-4">
                <div className="flex items-center justify-center text-xs text-muted-foreground">
                  {component.name} preview
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => window.open(`/ui-showcase/${component.name}`, '_blank')}
                >
                  <Eye className="mr-2 h-3 w-3" />
                  Demo
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => window.open(`https://ui.shadcn.com/docs/components/${component.name}`, '_blank')}
                >
                  <ExternalLink className="mr-2 h-3 w-3" />
                  Docs
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => window.open(`/ui-showcase/${component.name}/code`, '_blank')}
                >
                  <Code className="mr-2 h-3 w-3" />
                  Code
                </Button>
              </div>
              
              {/* Integration Status */}
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Domain Theming:</span>
                  <span className="text-green-600">✓ Supported</span>
                </div>
                <div className="flex justify-between">
                  <span>Accessibility:</span>
                  <span className="text-green-600">✓ WCAG 2.1 AA</span>
                </div>
                <div className="flex justify-between">
                  <span>TypeScript:</span>
                  <span className="text-green-600">✓ Full Support</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}