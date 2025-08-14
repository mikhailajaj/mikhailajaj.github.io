"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Play,
  Square,
  RotateCcw,
  Copy,
  Download,
  Share2,
  Settings,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Types for code playground
interface CodePlaygroundConfig {
  id: string;
  title: string;
  description: string;
  language: string;
  initialCode: string;
  theme?: "dark" | "light";
  editable?: boolean;
  runnable?: boolean;
  downloadable?: boolean;
  shareable?: boolean;
  autoRun?: boolean;
  dependencies?: string[];
}

interface CodePlaygroundProps {
  config: CodePlaygroundConfig;
  className?: string;
  onCodeChange?: (code: string) => void;
  onRun?: (code: string) => Promise<any>;
}

interface ExecutionResult {
  output?: string;
  error?: string;
  logs?: string[];
  executionTime?: number;
}

const CodePlayground: React.FC<CodePlaygroundProps> = ({
  config,
  className = "",
  onCodeChange,
  onRun,
}) => {
  const [code, setCode] = useState(config.initialCode);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [lineNumbers, setLineNumbers] = useState(true);
  const [wordWrap, setWordWrap] = useState(false);

  // Auto-run code when it changes (if enabled)
  useEffect(() => {
    if (config.autoRun && code !== config.initialCode) {
      const timer = setTimeout(() => {
        runCode();
      }, 1000); // Debounce auto-run
      return () => clearTimeout(timer);
    }
  }, [code, config.autoRun]);

  // Handle code changes
  const handleCodeChange = useCallback(
    (newCode: string) => {
      setCode(newCode);
      onCodeChange?.(newCode);
    },
    [onCodeChange],
  );

  // Execute code
  const runCode = async () => {
    if (!config.runnable || isRunning) return;

    setIsRunning(true);
    const startTime = performance.now();

    try {
      let executionResult: ExecutionResult;

      if (onRun) {
        // Use custom execution handler
        const customResult = await onRun(code);
        executionResult = {
          output: JSON.stringify(customResult, null, 2),
          executionTime: performance.now() - startTime,
        };
      } else {
        // Default execution simulation
        executionResult = await simulateExecution(code, config.language);
        executionResult.executionTime = performance.now() - startTime;
      }

      setResult(executionResult);
    } catch (error) {
      setResult({
        error: error instanceof Error ? error.message : "Execution failed",
        executionTime: performance.now() - startTime,
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Simulate code execution for demo purposes
  const simulateExecution = async (
    code: string,
    language: string,
  ): Promise<ExecutionResult> => {
    // Simulate execution delay
    await new Promise((resolve) =>
      setTimeout(resolve, 800 + Math.random() * 1200),
    );

    // Mock execution results based on language
    switch (language) {
      case "javascript":
      case "typescript":
        return {
          output: `// Output from ${language} execution\nconsole.log("Code executed successfully!");\n// Result: ${Math.floor(Math.random() * 100)}`,
          logs: ["Code compiled successfully", "Execution completed"],
        };

      case "python":
        return {
          output: `# Python execution result\nprint("Hello from Python!")\n# Output: ${Math.floor(Math.random() * 100)}`,
          logs: ["Python interpreter started", "Code executed successfully"],
        };

      case "sql":
        return {
          output: `-- SQL Query Result\n-- Rows affected: ${Math.floor(Math.random() * 50)}\n-- Execution time: ${(Math.random() * 100).toFixed(2)}ms`,
          logs: ["Connected to database", "Query executed successfully"],
        };

      default:
        return {
          output: `// ${language} execution completed\n// Result: Success`,
          logs: ["Code executed"],
        };
    }
  };

  // Reset code to initial state
  const resetCode = () => {
    setCode(config.initialCode);
    setResult(null);
  };

  // Copy code to clipboard
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      // Could add a toast notification here
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };

  // Download code as file
  const downloadCode = () => {
    const fileExtension = getFileExtension(config.language);
    const filename = `${config.title.toLowerCase().replace(/\s+/g, "-")}.${fileExtension}`;

    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Share code (could integrate with various platforms)
  const shareCode = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: config.title,
          text: config.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Failed to share:", error);
      }
    } else {
      // Fallback: copy URL to clipboard
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  // Get file extension for language
  const getFileExtension = (language: string): string => {
    const extensions: Record<string, string> = {
      javascript: "js",
      typescript: "ts",
      python: "py",
      sql: "sql",
      html: "html",
      css: "css",
      json: "json",
      yaml: "yml",
      markdown: "md",
    };
    return extensions[language] || "txt";
  };

  return (
    <div
      className={`code-playground ${isFullscreen ? "fullscreen" : ""} ${className}`}
    >
      {/* Header */}
      <div className="playground-header">
        <div className="header-left">
          <h3 className="playground-title">{config.title}</h3>
          <span className="language-badge">{config.language}</span>
        </div>

        <div className="header-controls">
          {config.runnable && (
            <button
              onClick={runCode}
              disabled={isRunning}
              className="control-button run"
            >
              {isRunning ? (
                <>
                  <Square className="w-4 h-4" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Run
                </>
              )}
            </button>
          )}

          <button onClick={resetCode} className="control-button">
            <RotateCcw className="w-4 h-4" />
          </button>

          <button onClick={copyCode} className="control-button">
            <Copy className="w-4 h-4" />
          </button>

          {config.downloadable && (
            <button onClick={downloadCode} className="control-button">
              <Download className="w-4 h-4" />
            </button>
          )}

          {config.shareable && (
            <button onClick={shareCode} className="control-button">
              <Share2 className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="control-button"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="control-button"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="settings-panel"
          >
            <div className="settings-content">
              <div className="setting-group">
                <label>Font Size</label>
                <input
                  type="range"
                  min="10"
                  max="20"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="setting-slider"
                />
                <span>{fontSize}px</span>
              </div>

              <div className="setting-group">
                <label>
                  <input
                    type="checkbox"
                    checked={lineNumbers}
                    onChange={(e) => setLineNumbers(e.target.checked)}
                  />
                  Line Numbers
                </label>
              </div>

              <div className="setting-group">
                <label>
                  <input
                    type="checkbox"
                    checked={wordWrap}
                    onChange={(e) => setWordWrap(e.target.checked)}
                  />
                  Word Wrap
                </label>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="playground-content">
        {/* Code Editor */}
        <div className="code-editor">
          {config.editable ? (
            <textarea
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              className="code-textarea"
              style={{
                fontSize: `${fontSize}px`,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                lineHeight: 1.5,
                whiteSpace: wordWrap ? "pre-wrap" : "pre",
              }}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
            />
          ) : (
            <SyntaxHighlighter
              language={config.language}
              style={vscDarkPlus}
              showLineNumbers={lineNumbers}
              wrapLines={wordWrap}
              customStyle={{
                margin: 0,
                background: "transparent",
                fontSize: `${fontSize}px`,
                lineHeight: 1.5,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              }}
            >
              {code}
            </SyntaxHighlighter>
          )}
        </div>

        {/* Output Panel */}
        {(config.runnable || result) && (
          <div className="output-panel">
            <div className="output-header">
              <h4>Output</h4>
              {result?.executionTime && (
                <span className="execution-time">
                  {result.executionTime.toFixed(2)}ms
                </span>
              )}
            </div>

            <div className="output-content">
              {isRunning ? (
                <div className="output-loading">
                  <div className="loading-spinner" />
                  <span>Executing code...</span>
                </div>
              ) : result ? (
                <>
                  {result.error ? (
                    <div className="output-error">
                      <pre>{result.error}</pre>
                    </div>
                  ) : (
                    <div className="output-success">
                      <pre>{result.output}</pre>
                    </div>
                  )}

                  {result.logs && result.logs.length > 0 && (
                    <div className="output-logs">
                      <h5>Logs</h5>
                      {result.logs.map((log, index) => (
                        <div key={index} className="log-entry">
                          {log}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="output-placeholder">
                  <p>Click &quot;Run&quot; to execute the code</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      {config.description && (
        <div className="playground-description">
          <p>{config.description}</p>
        </div>
      )}

      <style jsx>{`
        .code-playground {
          background: #1a1a1a;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 16px 32px rgba(0, 0, 0, 0.2);
          border: 1px solid #333333;
          margin: 24px 0;
          transition: all 0.3s ease;
        }

        .code-playground.fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1000;
          margin: 0;
          border-radius: 0;
        }

        .playground-header {
          background: #2a2a2a;
          padding: 16px 24px;
          border-bottom: 1px solid #333333;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .playground-title {
          font-size: 18px;
          font-weight: 600;
          color: #ffffff;
          margin: 0;
        }

        .language-badge {
          background: rgba(0, 112, 243, 0.1);
          color: #0070f3;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          border: 1px solid rgba(0, 112, 243, 0.2);
        }

        .header-controls {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .control-button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          background: transparent;
          border: 1px solid #333333;
          color: #888888;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 12px;
          font-weight: 500;
        }

        .control-button:hover {
          background: #333333;
          color: #ffffff;
        }

        .control-button.run {
          background: #0070f3;
          color: #ffffff;
          border-color: #0070f3;
        }

        .control-button.run:hover {
          background: #0051a2;
        }

        .control-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .settings-panel {
          background: #252525;
          border-bottom: 1px solid #333333;
          overflow: hidden;
        }

        .settings-content {
          padding: 16px 24px;
          display: flex;
          gap: 24px;
          align-items: center;
        }

        .setting-group {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #cccccc;
          font-size: 14px;
        }

        .setting-group label {
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
        }

        .setting-slider {
          width: 80px;
        }

        .playground-content {
          display: grid;
          grid-template-columns: 1fr;
          min-height: 400px;
        }

        .code-playground.fullscreen .playground-content {
          min-height: calc(100vh - 120px);
        }

        .code-editor {
          background: #1e1e1e;
          position: relative;
        }

        .code-textarea {
          width: 100%;
          height: 100%;
          min-height: 400px;
          background: transparent;
          border: none;
          outline: none;
          color: #ffffff;
          padding: 16px;
          resize: none;
          tab-size: 2;
        }

        .code-playground.fullscreen .code-textarea {
          min-height: calc(100vh - 200px);
        }

        .output-panel {
          background: #1a1a1a;
          border-top: 1px solid #333333;
          max-height: 300px;
          display: flex;
          flex-direction: column;
        }

        .output-header {
          background: #2a2a2a;
          padding: 12px 24px;
          border-bottom: 1px solid #333333;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .output-header h4 {
          margin: 0;
          color: #ffffff;
          font-size: 14px;
          font-weight: 600;
        }

        .execution-time {
          color: #888888;
          font-size: 12px;
          font-family: monospace;
        }

        .output-content {
          flex: 1;
          overflow: auto;
          padding: 16px;
        }

        .output-loading {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #888888;
        }

        .loading-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid #0070f3;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .output-success pre,
        .output-error pre {
          margin: 0;
          font-family: "JetBrains Mono", "Fira Code", monospace;
          font-size: 13px;
          line-height: 1.5;
          white-space: pre-wrap;
        }

        .output-success pre {
          color: #cccccc;
        }

        .output-error pre {
          color: #ff6b6b;
        }

        .output-logs {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #333333;
        }

        .output-logs h5 {
          margin: 0 0 8px 0;
          color: #888888;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .log-entry {
          color: #888888;
          font-size: 12px;
          font-family: monospace;
          margin-bottom: 4px;
        }

        .output-placeholder {
          color: #666666;
          text-align: center;
          padding: 40px 20px;
        }

        .playground-description {
          background: #2a2a2a;
          padding: 16px 24px;
          border-top: 1px solid #333333;
        }

        .playground-description p {
          margin: 0;
          color: #cccccc;
          line-height: 1.6;
        }

        @media (min-width: 768px) {
          .playground-content {
            grid-template-columns: 1fr 1fr;
          }

          .output-panel {
            border-top: none;
            border-left: 1px solid #333333;
            max-height: none;
          }
        }

        @media (max-width: 768px) {
          .playground-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .header-controls {
            width: 100%;
            justify-content: flex-start;
            flex-wrap: wrap;
          }

          .settings-content {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default CodePlayground;
