"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { RefreshCw, AlertCircle, CheckCircle } from "lucide-react";

// Types for real-time preview updates
interface PreviewUpdateConfig {
  debounceMs?: number;
  autoUpdate?: boolean;
  errorRetryCount?: number;
  retryDelayMs?: number;
}

interface PreviewState {
  isUpdating: boolean;
  lastUpdate: Date | null;
  error: string | null;
  updateCount: number;
}

interface PreviewUpdaterProps {
  content: string;
  language?: string;
  config?: PreviewUpdateConfig;
  onUpdate?: (content: string) => Promise<any>;
  onError?: (error: string) => void;
  className?: string;
  children?: React.ReactNode;
}

const PreviewUpdater: React.FC<PreviewUpdaterProps> = ({
  content,
  language = "javascript",
  config = {},
  onUpdate,
  onError,
  className = "",
  children,
}) => {
  const {
    debounceMs = 1000,
    autoUpdate = true,
    errorRetryCount = 3,
    retryDelayMs = 1000,
  } = config;

  const [previewState, setPreviewState] = useState<PreviewState>({
    isUpdating: false,
    lastUpdate: null,
    error: null,
    updateCount: 0,
  });

  const [previewContent, setPreviewContent] = useState<any>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);
  const lastContentRef = useRef(content);

  // Debounced update function
  const debouncedUpdate = useCallback(
    (newContent: string) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        updatePreview(newContent);
      }, debounceMs);
    },
    [debounceMs],
  );

  // Update preview with error handling and retry logic
  const updatePreview = async (contentToUpdate: string) => {
    if (!onUpdate || contentToUpdate === lastContentRef.current) return;

    setPreviewState((prev) => ({
      ...prev,
      isUpdating: true,
      error: null,
    }));

    try {
      const result = await onUpdate(contentToUpdate);

      setPreviewContent(result);
      setPreviewState((prev) => ({
        ...prev,
        isUpdating: false,
        lastUpdate: new Date(),
        error: null,
        updateCount: prev.updateCount + 1,
      }));

      lastContentRef.current = contentToUpdate;
      retryCountRef.current = 0;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Preview update failed";

      // Retry logic
      if (retryCountRef.current < errorRetryCount) {
        retryCountRef.current++;

        setTimeout(() => {
          updatePreview(contentToUpdate);
        }, retryDelayMs * retryCountRef.current);

        setPreviewState((prev) => ({
          ...prev,
          isUpdating: true,
          error: `Retrying... (${retryCountRef.current}/${errorRetryCount})`,
        }));
      } else {
        setPreviewState((prev) => ({
          ...prev,
          isUpdating: false,
          error: errorMessage,
        }));

        onError?.(errorMessage);
        retryCountRef.current = 0;
      }
    }
  };

  // Auto-update when content changes
  useEffect(() => {
    if (autoUpdate && content !== lastContentRef.current) {
      debouncedUpdate(content);
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [content, autoUpdate, debouncedUpdate]);

  // Manual update trigger
  const triggerUpdate = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    updatePreview(content);
  };

  // Clear error
  const clearError = () => {
    setPreviewState((prev) => ({
      ...prev,
      error: null,
    }));
  };

  return (
    <div className={`preview-updater ${className}`}>
      {/* Update Status Bar */}
      <div className="update-status-bar">
        <div className="status-left">
          <div className="update-indicator">
            {previewState.isUpdating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Updating preview...</span>
              </>
            ) : previewState.error ? (
              <>
                <AlertCircle className="w-4 h-4" />
                <span>Update failed</span>
              </>
            ) : previewState.lastUpdate ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>
                  Updated {previewState.lastUpdate.toLocaleTimeString()}
                </span>
              </>
            ) : (
              <span>Ready to update</span>
            )}
          </div>

          {previewState.updateCount > 0 && (
            <span className="update-count">
              {previewState.updateCount} update
              {previewState.updateCount !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        <div className="status-actions">
          {!autoUpdate && (
            <button
              onClick={triggerUpdate}
              disabled={previewState.isUpdating}
              className="update-button"
            >
              <RefreshCw className="w-4 h-4" />
              Update
            </button>
          )}

          {previewState.error && (
            <button onClick={clearError} className="clear-error-button">
              Clear Error
            </button>
          )}
        </div>
      </div>

      {/* Error Display */}
      {previewState.error && (
        <div className="error-display">
          <AlertCircle className="w-5 h-5" />
          <div className="error-content">
            <div className="error-message">{previewState.error}</div>
            <button onClick={triggerUpdate} className="retry-button">
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Preview Content */}
      <div className="preview-content">
        {children || (
          <div className="default-preview">
            {previewContent ? (
              <div className="preview-result">
                {typeof previewContent === "string" ? (
                  <pre>{previewContent}</pre>
                ) : (
                  <pre>{JSON.stringify(previewContent, null, 2)}</pre>
                )}
              </div>
            ) : (
              <div className="preview-placeholder">
                <RefreshCw className="w-8 h-8" />
                <p>Preview will appear here after update</p>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .preview-updater {
          background: #1a1a1a;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #333333;
        }

        .update-status-bar {
          background: #2a2a2a;
          padding: 12px 16px;
          border-bottom: 1px solid #333333;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .status-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .update-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #cccccc;
          font-size: 14px;
        }

        .update-indicator svg {
          color: #0070f3;
        }

        .update-count {
          color: #888888;
          font-size: 12px;
          background: #333333;
          padding: 2px 8px;
          border-radius: 12px;
        }

        .status-actions {
          display: flex;
          gap: 8px;
        }

        .update-button {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #0070f3;
          color: #ffffff;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s ease;
          font-size: 12px;
          font-weight: 500;
        }

        .update-button:hover:not(:disabled) {
          background: #0051a2;
        }

        .update-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .clear-error-button {
          background: transparent;
          color: #888888;
          border: 1px solid #333333;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 12px;
        }

        .clear-error-button:hover {
          background: #333333;
          color: #ffffff;
        }

        .error-display {
          background: rgba(238, 0, 0, 0.1);
          border: 1px solid rgba(238, 0, 0, 0.2);
          padding: 16px;
          margin: 16px;
          border-radius: 6px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          color: #e00;
        }

        .error-content {
          flex: 1;
        }

        .error-message {
          margin-bottom: 8px;
          font-size: 14px;
          line-height: 1.4;
        }

        .retry-button {
          background: #e00;
          color: #ffffff;
          border: none;
          padding: 4px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 500;
          transition: background-color 0.2s ease;
        }

        .retry-button:hover {
          background: #c00;
        }

        .preview-content {
          min-height: 200px;
        }

        .default-preview {
          padding: 16px;
        }

        .preview-result {
          background: #1e1e1e;
          border-radius: 6px;
          padding: 16px;
          overflow: auto;
          max-height: 400px;
        }

        .preview-result pre {
          margin: 0;
          color: #cccccc;
          font-family: "JetBrains Mono", monospace;
          font-size: 13px;
          line-height: 1.5;
          white-space: pre-wrap;
        }

        .preview-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          color: #666666;
          height: 200px;
          text-align: center;
        }

        .preview-placeholder svg {
          color: #444444;
        }

        @media (max-width: 768px) {
          .update-status-bar {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .status-left {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .status-actions {
            width: 100%;
            justify-content: flex-end;
          }
        }
      `}</style>
    </div>
  );
};

export default PreviewUpdater;
