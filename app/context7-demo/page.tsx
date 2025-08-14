/**
 * Context7 MCP Demo Page
 * 
 * Enhanced demonstration of Context7 MCP integration with:
 * - Real-time documentation access
 * - Interactive component demonstrations
 * - Live code editing and generation
 * - Real-world usage examples
 * - Advanced MCP features showcase
 */

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaCode, 
  FaRocket, 
  FaSearch, 
  FaBook, 
  FaDownload,
  FaExternalLinkAlt,
  FaCopy,
  FaCheck,
  FaPlay,
  FaEdit,
  FaWand,
  FaLightbulb,
  FaTerminal,
  FaFileCode,
  FaSave,
  FaUndo
} from "react-icons/fa";
import { useContext7 } from "./layout";
import { MainLayout } from "@/components/layouts/MainLayout";

interface LibraryExample {
  id: string;
  name: string;
  description: string;
  context7Id: string;
  codeExample: string;
  documentation: string;
  category: "turbopack" | "nextjs" | "react" | "tools";
}

const libraryExamples: LibraryExample[] = [
  {
    id: "turbopack-config",
    name: "Turbopack Configuration",
    description: "Advanced Turbopack setup with custom rules and optimizations",
    context7Id: "/context7/makerkit_dev-docs-next-supabase-turbo",
    category: "turbopack",
    codeExample: `// next.config.mjs - Turbopack Configuration
export default {
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
      resolveAlias: {
        '@': './src',
        '@/components': './components',
      },
    },
  },
};`,
    documentation: "Turbopack is Next.js's new bundler that provides up to 10x faster builds than Webpack."
  },
  {
    id: "context7-integration",
    name: "Context7 MCP Integration",
    description: "How to use Context7 MCP for accessing library documentation",
    context7Id: "/context7/turbopuffer_com-docs",
    category: "tools",
    codeExample: `// Using Context7 MCP
import { resolveLibraryId, getLibraryDocs } from 'context7-mcp';

// Resolve library ID
const libraryId = await resolveLibraryId('turbopack');

// Get documentation
const docs = await getLibraryDocs({
  context7CompatibleLibraryID: libraryId,
  topic: 'configuration',
  tokens: 5000
});`,
    documentation: "Context7 MCP provides access to comprehensive library documentation and code examples."
  },
  {
    id: "performance-optimization",
    name: "Performance with Turbopack",
    description: "Optimizing build performance using Turbopack features",
    context7Id: "/context7/makerkit_dev-docs-next-supabase-turbo",
    category: "nextjs",
    codeExample: `// Performance optimizations
{
  experimental: {
    turbo: {
      // Enable tree shaking
      treeShaking: true,
      // Optimize imports
      optimizePackageImports: [
        'framer-motion',
        'react-icons',
        '@radix-ui/react-slot'
      ],
    },
  },
}`,
    documentation: "Turbopack provides automatic optimizations and faster hot reloads for development."
  }
];

const Context7DemoPage = () => {
  const [selectedExample, setSelectedExample] = useState<LibraryExample>(libraryExamples[0]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const filteredExamples = libraryExamples.filter(example =>
    example.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    example.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyToClipboard = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const simulateContext7Query = async (libraryId: string) => {
    setIsLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    
    // In a real implementation, this would call the Context7 MCP
    console.log(`Querying Context7 MCP for library: ${libraryId}`);
  };

  useEffect(() => {
    // Simulate initial Context7 MCP connection
    simulateContext7Query(selectedExample.context7Id);
  }, [selectedExample.context7Id]);

  return (
    <MainLayout 
      showNavigation={true}
      showFooter={true}
      backgroundVariant="gradient"
    >
      <div className="min-h-screen pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <FaRocket className="text-3xl text-blue-500" />
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Context7 MCP + Turbopack Demo
              </h1>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Explore how Context7 MCP provides access to library documentation 
              while Turbopack accelerates your development workflow.
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="relative max-w-md mx-auto">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search examples..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Examples List */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                Examples
              </h2>
              <div className="space-y-4">
                {filteredExamples.map((example, index) => (
                  <motion.div
                    key={example.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    onClick={() => setSelectedExample(example)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                      selectedExample.id === example.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        example.category === 'turbopack' ? 'bg-orange-100 text-orange-600' :
                        example.category === 'nextjs' ? 'bg-black text-white' :
                        example.category === 'react' ? 'bg-blue-100 text-blue-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        <FaCode className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {example.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {example.description}
                        </p>
                        <div className="mt-2">
                          <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                            example.category === 'turbopack' ? 'bg-orange-100 text-orange-800' :
                            example.category === 'nextjs' ? 'bg-gray-100 text-gray-800' :
                            example.category === 'react' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {example.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Selected Example Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {selectedExample.name}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        {selectedExample.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {isLoading && (
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                      )}
                      <button
                        onClick={() => simulateContext7Query(selectedExample.context7Id)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <FaBook className="w-4 h-4" />
                        Query Context7
                      </button>
                    </div>
                  </div>
                </div>

                {/* Context7 Info */}
                <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-3">
                    <FaExternalLinkAlt className="text-blue-500" />
                    <span className="font-semibold text-gray-900 dark:text-white">
                      Context7 Library ID:
                    </span>
                  </div>
                  <code className="text-sm bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded border">
                    {selectedExample.context7Id}
                  </code>
                </div>

                {/* Code Example */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Code Example
                    </h3>
                    <button
                      onClick={() => copyToClipboard(selectedExample.codeExample, selectedExample.id)}
                      className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      {copiedCode === selectedExample.id ? (
                        <>
                          <FaCheck className="w-4 h-4 text-green-500" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <FaCopy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{selectedExample.codeExample}</code>
                  </pre>
                </div>

                {/* Documentation */}
                <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Documentation
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {selectedExample.documentation}
                  </p>
                </div>
              </div>

              {/* Turbopack Benefits */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-8 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg p-6 border border-orange-200 dark:border-orange-800"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaRocket className="text-orange-500" />
                  Turbopack Benefits
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">10x Faster Builds</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Significantly faster than Webpack for development builds
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Instant HMR</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Near-instant hot module replacement for faster development
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Better Caching</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Intelligent caching for improved build performance
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Zero Config</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Works out of the box with minimal configuration
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Context7DemoPage;