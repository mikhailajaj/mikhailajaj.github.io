"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Send,
  Copy,
  Download,
  RefreshCw,
  Settings,
  ChevronDown,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Types for API Explorer
interface ApiEndpoint {
  id: string;
  name: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  url: string;
  description: string;
  parameters?: ApiParameter[];
  headers?: ApiHeader[];
  body?: ApiBodySchema;
  responses?: ApiResponse[];
  authentication?: "none" | "bearer" | "api-key" | "basic";
}

interface ApiParameter {
  name: string;
  type: "string" | "number" | "boolean" | "array";
  required: boolean;
  description: string;
  example?: any;
  enum?: string[];
}

interface ApiHeader {
  name: string;
  value: string;
  required: boolean;
  description?: string;
}

interface ApiBodySchema {
  type: "json" | "form-data" | "raw";
  schema?: any;
  example?: string;
}

interface ApiResponse {
  status: number;
  description: string;
  example: any;
  headers?: Record<string, string>;
}

interface ApiExplorerProps {
  endpoints: ApiEndpoint[];
  baseUrl?: string;
  className?: string;
  onRequest?: (endpoint: ApiEndpoint, params: any) => Promise<any>;
}

interface RequestResult {
  status: number;
  statusText: string;
  data: any;
  headers: Record<string, string>;
  duration: number;
  timestamp: string;
}

// Form validation schema
const createParameterSchema = (parameters: ApiParameter[]) => {
  const schemaObject: Record<string, any> = {};

  parameters.forEach((param) => {
    let fieldSchema;

    switch (param.type) {
      case "string":
        fieldSchema = z.string();
        break;
      case "number":
        fieldSchema = z.number();
        break;
      case "boolean":
        fieldSchema = z.boolean();
        break;
      case "array":
        fieldSchema = z.array(z.string());
        break;
      default:
        fieldSchema = z.string();
    }

    if (!param.required) {
      fieldSchema = fieldSchema.optional();
    }

    schemaObject[param.name] = fieldSchema;
  });

  return z.object(schemaObject);
};

const ApiExplorer: React.FC<ApiExplorerProps> = ({
  endpoints = [],
  baseUrl = "",
  className = "",
  onRequest,
}) => {
  // Default endpoints if none provided
  const defaultEndpoints: ApiEndpoint[] = [
    {
      id: "get-projects",
      name: "Get Projects",
      method: "GET",
      url: "/api/projects",
      description: "Retrieve a list of all projects",
      parameters: [
        {
          name: "category",
          type: "string",
          required: false,
          description: "Filter projects by category",
          enum: ["full-stack", "cloud", "data", "ux-ui", "consulting"],
        },
        {
          name: "limit",
          type: "number",
          required: false,
          description: "Maximum number of projects to return",
          example: 10,
        },
      ],
      responses: [
        {
          status: 200,
          description: "Success",
          example: {
            projects: [
              { id: 1, name: "E-commerce Platform", category: "full-stack" },
              { id: 2, name: "Cloud Infrastructure", category: "cloud" },
            ],
            total: 2,
          },
        },
      ],
    },
  ];

  const apiEndpoints = endpoints.length > 0 ? endpoints : defaultEndpoints;
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint>(
    apiEndpoints[0],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RequestResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["parameters"]),
  );

  // Form setup
  const parameterSchema = selectedEndpoint.parameters
    ? createParameterSchema(selectedEndpoint.parameters)
    : z.object({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(parameterSchema),
  });

  // Reset form when endpoint changes
  useEffect(() => {
    reset();
    setError(null);
    setResult(null);

    // Set default values for parameters
    selectedEndpoint.parameters?.forEach((param) => {
      if (param.example !== undefined) {
        setValue(param.name, param.example);
      }
    });
  }, [selectedEndpoint, reset, setValue]);

  // Toggle section expansion
  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  // Execute API request
  const executeRequest = async (formData: any) => {
    setIsLoading(true);
    setError(null);
    const startTime = performance.now();

    try {
      let requestResult: RequestResult;

      if (onRequest) {
        // Use custom request handler
        const response = await onRequest(selectedEndpoint, formData);

        requestResult = {
          status: 200,
          statusText: "OK",
          data: response,
          headers: {},
          duration: performance.now() - startTime,
          timestamp: new Date().toISOString(),
        };
      } else {
        // Simulate API request
        requestResult = await simulateApiRequest(selectedEndpoint, formData);
        requestResult.duration = performance.now() - startTime;
        requestResult.timestamp = new Date().toISOString();
      }

      setResult(requestResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate API request for demo purposes
  const simulateApiRequest = async (
    endpoint: ApiEndpoint,
    params: any,
  ): Promise<RequestResult> => {
    // Simulate network delay
    await new Promise((resolve) =>
      setTimeout(resolve, 500 + Math.random() * 1500),
    );

    // Find matching response or use first one
    const response = endpoint.responses?.[0] || {
      status: 200,
      description: "Success",
      example: { message: "Request completed successfully", data: params },
    };

    return {
      status: response.status,
      statusText: response.status === 200 ? "OK" : "Error",
      data: response.example,
      headers: response.headers || {
        "content-type": "application/json",
        "x-response-time": `${Math.floor(Math.random() * 100)}ms`,
      },
      duration: 0, // Will be set by caller
      timestamp: "", // Will be set by caller
    };
  };

  // Copy response to clipboard
  const copyResponse = async () => {
    if (result) {
      try {
        await navigator.clipboard.writeText(
          JSON.stringify(result.data, null, 2),
        );
      } catch (error) {
        console.error("Failed to copy response:", error);
      }
    }
  };

  // Get status color
  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "#00d9ff";
    if (status >= 400 && status < 500) return "#f5a623";
    if (status >= 500) return "#e00";
    return "#888888";
  };

  return (
    <div className={`api-explorer ${className}`}>
      {/* Header */}
      <div className="explorer-header">
        <h3>API Explorer</h3>
        <div className="endpoint-selector">
          <select
            value={selectedEndpoint.id}
            onChange={(e) => {
              const endpoint = apiEndpoints.find(
                (ep) => ep.id === e.target.value,
              );
              if (endpoint) setSelectedEndpoint(endpoint);
            }}
            className="endpoint-select"
          >
            {apiEndpoints.map((endpoint) => (
              <option key={endpoint.id} value={endpoint.id}>
                {endpoint.method} {endpoint.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Endpoint Details */}
      <div className="endpoint-details">
        <div className="endpoint-info">
          <div className="method-url">
            <span
              className={`method-badge ${selectedEndpoint.method.toLowerCase()}`}
            >
              {selectedEndpoint.method}
            </span>
            <code className="endpoint-url">
              {baseUrl}
              {selectedEndpoint.url}
            </code>
          </div>
          <p className="endpoint-description">{selectedEndpoint.description}</p>
        </div>
      </div>

      <div className="explorer-content">
        {/* Request Configuration */}
        <div className="request-panel">
          <form onSubmit={handleSubmit(executeRequest)}>
            {/* Parameters Section */}
            {selectedEndpoint.parameters &&
              selectedEndpoint.parameters.length > 0 && (
                <div className="config-section">
                  <button
                    type="button"
                    onClick={() => toggleSection("parameters")}
                    className="section-header"
                  >
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${
                        expandedSections.has("parameters") ? "rotate-90" : ""
                      }`}
                    />
                    Parameters ({selectedEndpoint.parameters.length})
                  </button>

                  <AnimatePresence>
                    {expandedSections.has("parameters") && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="section-content"
                      >
                        {selectedEndpoint.parameters.map((param) => (
                          <div key={param.name} className="parameter-field">
                            <label className="field-label">
                              {param.name}
                              {param.required && (
                                <span className="required">*</span>
                              )}
                            </label>
                            <p className="field-description">
                              {param.description}
                            </p>

                            {param.enum ? (
                              <select
                                {...register(param.name)}
                                className="field-input"
                              >
                                <option value="">Select {param.name}</option>
                                {param.enum.map((option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>
                            ) : param.type === "boolean" ? (
                              <select
                                {...register(param.name)}
                                className="field-input"
                              >
                                <option value="">Select value</option>
                                <option value="true">true</option>
                                <option value="false">false</option>
                              </select>
                            ) : (
                              <input
                                {...register(param.name)}
                                type={
                                  param.type === "number" ? "number" : "text"
                                }
                                placeholder={
                                  param.example?.toString() ||
                                  `Enter ${param.name}`
                                }
                                className="field-input"
                              />
                            )}

                            {errors[param.name] && (
                              <span className="field-error">
                                {errors[param.name]?.message as string}
                              </span>
                            )}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

            {/* Send Button */}
            <div className="send-section">
              <button
                type="submit"
                disabled={isLoading}
                className="send-button"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Request
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Response Panel */}
        <div className="response-panel">
          <div className="response-header">
            <h4>Response</h4>
            {result && (
              <div className="response-actions">
                <button onClick={copyResponse} className="action-button">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="response-content">
            {isLoading ? (
              <div className="response-loading">
                <RefreshCw className="w-6 h-6 animate-spin" />
                <span>Sending request...</span>
              </div>
            ) : error ? (
              <div className="response-error">
                <XCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            ) : result ? (
              <>
                {/* Status and Timing */}
                <div className="response-meta">
                  <div className="status-info">
                    <span
                      className="status-code"
                      style={{ color: getStatusColor(result.status) }}
                    >
                      {result.status} {result.statusText}
                    </span>
                    <span className="response-time">
                      <Clock className="w-4 h-4" />
                      {result.duration.toFixed(0)}ms
                    </span>
                  </div>
                  <span className="timestamp">
                    {new Date(result.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                {/* Response Body */}
                <div className="response-section">
                  <h5>Response</h5>
                  <div className="response-body">
                    <SyntaxHighlighter
                      language="json"
                      style={vscDarkPlus}
                      customStyle={{
                        margin: 0,
                        background: "transparent",
                        fontSize: "13px",
                        lineHeight: 1.5,
                      }}
                    >
                      {JSON.stringify(result.data, null, 2)}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </>
            ) : (
              <div className="response-placeholder">
                <AlertCircle className="w-8 h-8" />
                <p>Send a request to see the response</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .api-explorer {
          background: #1a1a1a;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 16px 32px rgba(0, 0, 0, 0.2);
          border: 1px solid #333333;
          margin: 24px 0;
        }

        .explorer-header {
          background: #2a2a2a;
          padding: 20px 24px;
          border-bottom: 1px solid #333333;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .explorer-header h3 {
          margin: 0;
          color: #ffffff;
          font-size: 20px;
          font-weight: 600;
        }

        .endpoint-select {
          background: #333333;
          border: 1px solid #444444;
          color: #ffffff;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 14px;
          min-width: 200px;
        }

        .endpoint-details {
          background: #252525;
          padding: 20px 24px;
          border-bottom: 1px solid #333333;
        }

        .method-url {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .method-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .method-badge.get {
          background: #00d9ff;
          color: #000000;
        }
        .method-badge.post {
          background: #00ff88;
          color: #000000;
        }
        .method-badge.put {
          background: #f5a623;
          color: #000000;
        }
        .method-badge.delete {
          background: #e00;
          color: #ffffff;
        }
        .method-badge.patch {
          background: #7928ca;
          color: #ffffff;
        }

        .endpoint-url {
          background: #1a1a1a;
          color: #00d9ff;
          padding: 8px 12px;
          border-radius: 4px;
          font-family: "JetBrains Mono", monospace;
          font-size: 14px;
        }

        .endpoint-description {
          color: #cccccc;
          margin: 0;
          line-height: 1.5;
        }

        .explorer-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 400px;
        }

        .request-panel {
          background: #1e1e1e;
          padding: 24px;
          border-right: 1px solid #333333;
          overflow-y: auto;
        }

        .config-section {
          margin-bottom: 24px;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: none;
          color: #ffffff;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          padding: 8px 0;
          width: 100%;
          text-align: left;
        }

        .section-content {
          overflow: hidden;
        }

        .parameter-field {
          margin-bottom: 16px;
        }

        .field-label {
          display: block;
          color: #ffffff;
          font-weight: 500;
          margin-bottom: 4px;
          font-size: 14px;
        }

        .required {
          color: #e00;
          margin-left: 4px;
        }

        .field-description {
          color: #888888;
          font-size: 12px;
          margin: 0 0 8px 0;
          line-height: 1.4;
        }

        .field-input {
          width: 100%;
          background: #333333;
          border: 1px solid #444444;
          color: #ffffff;
          padding: 10px 12px;
          border-radius: 6px;
          font-size: 14px;
          transition: border-color 0.2s ease;
        }

        .field-input:focus {
          outline: none;
          border-color: #0070f3;
        }

        .field-error {
          color: #e00;
          font-size: 12px;
          margin-top: 4px;
          display: block;
        }

        .send-section {
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid #333333;
        }

        .send-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #0070f3;
          color: #ffffff;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s ease;
          width: 100%;
          justify-content: center;
        }

        .send-button:hover:not(:disabled) {
          background: #0051a2;
        }

        .send-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .response-panel {
          background: #1a1a1a;
          display: flex;
          flex-direction: column;
        }

        .response-header {
          background: #2a2a2a;
          padding: 16px 24px;
          border-bottom: 1px solid #333333;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .response-header h4 {
          margin: 0;
          color: #ffffff;
          font-size: 16px;
          font-weight: 600;
        }

        .response-actions {
          display: flex;
          gap: 8px;
        }

        .action-button {
          background: transparent;
          border: 1px solid #333333;
          color: #888888;
          padding: 6px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .action-button:hover {
          background: #333333;
          color: #ffffff;
        }

        .response-content {
          flex: 1;
          padding: 24px;
          overflow-y: auto;
        }

        .response-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          color: #888888;
          height: 200px;
        }

        .response-error {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #e00;
          background: rgba(238, 0, 0, 0.1);
          padding: 16px;
          border-radius: 6px;
          border: 1px solid rgba(238, 0, 0, 0.2);
        }

        .response-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          color: #666666;
          height: 200px;
          text-align: center;
        }

        .response-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #333333;
        }

        .status-info {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .status-code {
          font-weight: 600;
          font-size: 16px;
        }

        .response-time {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #888888;
          font-size: 14px;
        }

        .timestamp {
          color: #666666;
          font-size: 12px;
          font-family: monospace;
        }

        .response-section {
          margin-bottom: 24px;
        }

        .response-section h5 {
          color: #ffffff;
          font-size: 14px;
          font-weight: 600;
          margin: 0 0 12px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .response-body {
          background: #252525;
          border-radius: 6px;
          overflow: auto;
          max-height: 400px;
        }

        @media (max-width: 768px) {
          .explorer-content {
            grid-template-columns: 1fr;
          }

          .request-panel {
            border-right: none;
            border-bottom: 1px solid #333333;
          }
        }
      `}</style>
    </div>
  );
};

export default ApiExplorer;
