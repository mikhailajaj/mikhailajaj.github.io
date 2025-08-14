/**
 * Context7 Demo Layout Component
 * 
 * Advanced layout for Context7 MCP demonstrations with enhanced features:
 * - Context7 provider integration for MCP access
 * - Interactive demonstration components
 * - Real-time feature showcases
 * - Documentation integration
 * - Live editing capabilities
 * - Integration with existing domain theming and accessibility systems
 * 
 * @fileoverview Context7-specific layout with advanced UI components
 */

"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaCode, 
  FaRocket, 
  FaBook, 
  FaCog, 
  FaExpand, 
  FaCompress,
  FaEye,
  FaEyeSlash,
  FaPlay,
  FaPause,
  FaTerminal,
  FaFileCode,
  FaLightbulb,
  FaMagic,
  FaDatabase,
  FaCloud,
  FaWifi,
  FaHistory,
  FaDownload,
  FaUpload,
  FaEdit
} from "react-icons/fa";

// Context7 Provider Context
interface Context7ContextType {
  isConnected: boolean;
  mcpEndpoint: string;
  documentationCache: Map<string, any>;
  liveEditingEnabled: boolean;
  demoMode: 'interactive' | 'showcase' | 'documentation' | 'live-coding';
  codeGenerationHistory: CodeGenerationEntry[];
  realTimeUpdates: boolean;
  toggleLiveEditing: () => void;
  setDemoMode: (mode: 'interactive' | 'showcase' | 'documentation' | 'live-coding') => void;
  toggleRealTimeUpdates: () => void;
  queryMCP: (libraryId: string, topic?: string) => Promise<any>;
  generateCode: (prompt: string, context?: string) => Promise<string>;
  executeCode: (code: string) => Promise<ExecutionResult>;
  getDocumentation: (libraryId: string) => Promise<DocumentationResponse>;
  saveCodeSnippet: (code: string, title: string) => void;
}

interface CodeGenerationEntry {
  id: string;
  prompt: string;
  code: string;
  timestamp: Date;
  context?: string;
}

interface ExecutionResult {
  success: boolean;
  output?: string;
  error?: string;
  executionTime: number;
}

interface DocumentationResponse {
  libraryId: string;
  sections: DocumentationSection[];
  examples: CodeExample[];
  apiReference: ApiReference[];
}

interface DocumentationSection {
  title: string;
  content: string;
  subsections?: DocumentationSection[];
}

interface CodeExample {
  title: string;
  description: string;
  code: string;
  language: string;
  tags: string[];
}

interface ApiReference {
  name: string;
  description: string;
  parameters: Parameter[];
  returnType: string;
  examples: string[];
}

interface Parameter {
  name: string;
  type: string;
  description: string;
  required: boolean;
  defaultValue?: string;
}

const Context7Context = createContext<Context7ContextType | null>(null);

export const useContext7 = () => {
  const context = useContext(Context7Context);
  if (!context) {
    throw new Error('useContext7 must be used within Context7DemoLayout');
  }
  return context;
};

// Context7 Provider Component
const Context7Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [documentationCache] = useState(new Map());
  const [liveEditingEnabled, setLiveEditingEnabled] = useState(false);
  const [demoMode, setDemoMode] = useState<'interactive' | 'showcase' | 'documentation' | 'live-coding'>('interactive');
  const [codeGenerationHistory, setCodeGenerationHistory] = useState<CodeGenerationEntry[]>([]);
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);
  
  const mcpEndpoint = process.env.NEXT_PUBLIC_CONTEXT7_MCP_ENDPOINT || 'ws://localhost:3001/mcp';

  useEffect(() => {
    // Simulate Context7 MCP connection
    const connectToMCP = async () => {
      try {
        // In a real implementation, this would establish WebSocket connection to Context7 MCP
        console.log('Connecting to Context7 MCP:', mcpEndpoint);
        
        // Simulate connection delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setIsConnected(true);
        console.log('Context7 MCP connected successfully');
      } catch (error) {
        console.error('Failed to connect to Context7 MCP:', error);
        setIsConnected(false);
      }
    };

    connectToMCP();
  }, [mcpEndpoint]);

  const toggleLiveEditing = () => {
    setLiveEditingEnabled(prev => !prev);
  };

  const toggleRealTimeUpdates = () => {
    setRealTimeUpdates(prev => !prev);
  };

  const queryMCP = async (libraryId: string, topic?: string) => {
    if (!isConnected) {
      throw new Error('Context7 MCP not connected');
    }

    // Check cache first
    const cacheKey = `${libraryId}:${topic || 'default'}`;
    if (documentationCache.has(cacheKey)) {
      return documentationCache.get(cacheKey);
    }

    // Simulate MCP query
    console.log(`Querying Context7 MCP for library: ${libraryId}, topic: ${topic}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockResponse = {
      libraryId,
      topic,
      documentation: `Documentation for ${libraryId}${topic ? ` - ${topic}` : ''}`,
      examples: [
        {
          title: `Basic ${libraryId} Usage`,
          code: `// Example usage of ${libraryId}\nimport { ${libraryId} } from '${libraryId}';\n\nconst example = new ${libraryId}();`,
          description: `Basic implementation example for ${libraryId}`
        }
      ],
      timestamp: new Date().toISOString()
    };

    // Cache the response
    documentationCache.set(cacheKey, mockResponse);
    
    return mockResponse;
  };

  const generateCode = async (prompt: string, context?: string) => {
    if (!isConnected) {
      throw new Error('Context7 MCP not connected');
    }

    console.log('Generating code with Context7 MCP:', prompt, context ? `with context: ${context}` : '');
    
    // Simulate code generation delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Enhanced mock code generation with context awareness
    const generatedCode = context?.includes('react') 
      ? `// Generated React component for: ${prompt}
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ${prompt.replace(/\s+/g, '')}Props {
  title?: string;
  onAction?: () => void;
}

export const ${prompt.replace(/\s+/g, '')}Component: React.FC<${prompt.replace(/\s+/g, '')}Props> = ({ 
  title = "Generated Component", 
  onAction 
}) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    console.log('Component mounted:', title);
  }, [title]);

  return (
    <motion.div 
      className="p-6 border rounded-lg shadow-lg bg-white dark:bg-gray-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        {title}
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        This component was generated based on: "${prompt}"
      </p>
      <button
        onClick={() => {
          setIsActive(!isActive);
          onAction?.();
        }}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        {isActive ? 'Deactivate' : 'Activate'}
      </button>
    </motion.div>
  );
};

export default ${prompt.replace(/\s+/g, '')}Component;`
      : `// Generated utility for: ${prompt}
export class ${prompt.replace(/\s+/g, '')}Utility {
  private config: Record<string, any>;

  constructor(config: Record<string, any> = {}) {
    this.config = config;
  }

  public execute(input: any): any {
    console.log('Executing ${prompt} with input:', input);
    
    // Implementation based on prompt: ${prompt}
    return {
      success: true,
      result: input,
      timestamp: new Date().toISOString(),
      config: this.config
    };
  }

  public configure(newConfig: Record<string, any>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

export default ${prompt.replace(/\s+/g, '')}Utility;`;

    // Add to generation history
    const entry: CodeGenerationEntry = {
      id: Date.now().toString(),
      prompt,
      code: generatedCode,
      timestamp: new Date(),
      context
    };
    
    setCodeGenerationHistory(prev => [entry, ...prev.slice(0, 9)]); // Keep last 10 entries
    
    return generatedCode;
  };

  const executeCode = async (code: string): Promise<ExecutionResult> => {
    if (!isConnected) {
      throw new Error('Context7 MCP not connected');
    }

    console.log('Executing code with Context7 MCP');
    
    const startTime = Date.now();
    
    // Simulate code execution
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const executionTime = Date.now() - startTime;
    
    // Mock execution result
    const success = !code.includes('throw') && !code.includes('error');
    
    return {
      success,
      output: success ? 'Code executed successfully!' : undefined,
      error: success ? undefined : 'Simulated execution error',
      executionTime
    };
  };

  const getDocumentation = async (libraryId: string): Promise<DocumentationResponse> => {
    if (!isConnected) {
      throw new Error('Context7 MCP not connected');
    }

    console.log('Fetching documentation for:', libraryId);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock comprehensive documentation response
    return {
      libraryId,
      sections: [
        {
          title: 'Getting Started',
          content: `Welcome to ${libraryId}! This library provides powerful tools for modern development.`,
          subsections: [
            {
              title: 'Installation',
              content: `npm install ${libraryId}`
            },
            {
              title: 'Basic Usage',
              content: `Import and use ${libraryId} in your project.`
            }
          ]
        },
        {
          title: 'Advanced Features',
          content: `Explore the advanced capabilities of ${libraryId}.`
        }
      ],
      examples: [
        {
          title: 'Basic Example',
          description: `Simple usage of ${libraryId}`,
          code: `import { ${libraryId} } from '${libraryId}';\n\nconst instance = new ${libraryId}();\ninstance.init();`,
          language: 'typescript',
          tags: ['basic', 'getting-started']
        }
      ],
      apiReference: [
        {
          name: 'init',
          description: 'Initialize the library',
          parameters: [
            {
              name: 'config',
              type: 'object',
              description: 'Configuration options',
              required: false,
              defaultValue: '{}'
            }
          ],
          returnType: 'void',
          examples: ['instance.init()', 'instance.init({ debug: true })']
        }
      ]
    };
  };

  const saveCodeSnippet = (code: string, title: string) => {
    const snippet: CodeGenerationEntry = {
      id: Date.now().toString(),
      prompt: title,
      code,
      timestamp: new Date(),
      context: 'saved-snippet'
    };
    
    setCodeGenerationHistory(prev => [snippet, ...prev.slice(0, 9)]);
    console.log('Code snippet saved:', title);
  };

  const contextValue: Context7ContextType = {
    isConnected,
    mcpEndpoint,
    documentationCache,
    liveEditingEnabled,
    demoMode,
    codeGenerationHistory,
    realTimeUpdates,
    toggleLiveEditing,
    setDemoMode,
    toggleRealTimeUpdates,
    queryMCP,
    generateCode,
    executeCode,
    getDocumentation,
    saveCodeSnippet
  };

  return (
    <Context7Context.Provider value={contextValue}>
      {children}
    </Context7Context.Provider>
  );
};

// Context7 Control Panel Component
const Context7ControlPanel: React.FC = () => {
  const { 
    isConnected, 
    liveEditingEnabled, 
    demoMode, 
    realTimeUpdates,
    codeGenerationHistory,
    toggleLiveEditing, 
    setDemoMode,
    toggleRealTimeUpdates
  } = useContext7();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-20 right-4 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 min-w-[320px] max-h-[80vh] overflow-y-auto"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <FaCog className="text-blue-500" />
          Context7 Controls
        </h3>
        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
      </div>

      {/* Connection Status */}
      <div className="mb-4 p-3 rounded bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center gap-2 mb-2">
          {isConnected ? <FaWifi className="text-green-500" /> : <FaWifi className="text-red-500" />}
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            MCP Connection
          </span>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Status: <span className={`font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          Endpoint: ws://localhost:3001/mcp
        </div>
      </div>

      {/* Demo Mode Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Demo Mode
        </label>
        <div className="grid grid-cols-1 gap-2">
          {(['interactive', 'showcase', 'documentation', 'live-coding'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setDemoMode(mode)}
              className={`px-3 py-2 text-sm rounded transition-colors flex items-center gap-2 ${
                demoMode === mode
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {mode === 'interactive' && <FaPlay />}
              {mode === 'showcase' && <FaRocket />}
              {mode === 'documentation' && <FaBook />}
              {mode === 'live-coding' && <FaCode />}
              {mode.charAt(0).toUpperCase() + mode.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Feature Toggles */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <FaEdit />
            Live Editing
          </span>
          <button
            onClick={toggleLiveEditing}
            className={`flex items-center gap-2 px-3 py-1 rounded text-sm transition-colors ${
              liveEditingEnabled
                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            {liveEditingEnabled ? <FaEye /> : <FaEyeSlash />}
            {liveEditingEnabled ? 'ON' : 'OFF'}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <FaWifi />
            Real-time Updates
          </span>
          <button
            onClick={toggleRealTimeUpdates}
            className={`flex items-center gap-2 px-3 py-1 rounded text-sm transition-colors ${
              realTimeUpdates
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            {realTimeUpdates ? <FaPlay /> : <FaPause />}
            {realTimeUpdates ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Code Generation History */}
      {codeGenerationHistory.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <FaHistory className="text-purple-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Recent Generations
            </span>
          </div>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {codeGenerationHistory.slice(0, 3).map((entry) => (
              <div
                key={entry.id}
                className="p-2 bg-gray-50 dark:bg-gray-900 rounded text-xs"
              >
                <div className="font-medium text-gray-900 dark:text-white truncate">
                  {entry.prompt}
                </div>
                <div className="text-gray-500 dark:text-gray-500">
                  {entry.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Context7 Status Bar Component
const Context7StatusBar: React.FC = () => {
  const { isConnected, demoMode, liveEditingEnabled, realTimeUpdates, codeGenerationHistory } = useContext7();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 left-4 right-4 bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 text-white rounded-lg p-3 shadow-lg z-40"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FaRocket className="text-yellow-300 animate-pulse" />
            <span className="font-medium">Context7 MCP Demo</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-300 animate-pulse' : 'bg-red-300'}`} />
            <span>MCP {isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <FaHistory className="text-purple-300" />
            <span>{codeGenerationHistory.length} generations</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <FaCode />
            <span>{demoMode.replace('-', ' ')}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaEdit />
            <span>Live: {liveEditingEnabled ? 'ON' : 'OFF'}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaWifi />
            <span>RT: {realTimeUpdates ? 'ON' : 'OFF'}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Main Layout Component
interface Context7DemoLayoutProps {
  children: React.ReactNode;
}

const Context7DemoLayout: React.FC<Context7DemoLayoutProps> = ({ children }) => {
  const [showControls, setShowControls] = useState(true);

  return (
    <Context7Provider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-black dark:to-purple-900">
        {/* Context7 Control Panel */}
        <AnimatePresence>
          {showControls && <Context7ControlPanel />}
        </AnimatePresence>

        {/* Toggle Controls Button */}
        <button
          onClick={() => setShowControls(!showControls)}
          className="fixed top-20 right-4 z-50 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
          style={{ marginRight: showControls ? '300px' : '0' }}
        >
          {showControls ? <FaCompress /> : <FaExpand />}
        </button>

        {/* Main Content */}
        <div className="relative">
          {children}
        </div>

        {/* Context7 Status Bar */}
        <Context7StatusBar />
      </div>
    </Context7Provider>
  );
};

export default Context7DemoLayout;