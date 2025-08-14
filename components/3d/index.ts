// Dynamic exports for 3D components
export {
  DynamicCloudArchitecture as CloudArchitecture,
  DynamicDataFlowViz as DataFlowViz,
  DynamicNetworkTopology as NetworkTopology,
} from "@/components/ui/DynamicLoader";

// Core 3D components (lightweight, can be imported directly)
export { default as Scene3DBase } from "./core/Scene3DBase";
export { default as Lighting3D } from "./core/Lighting3D";
export { default as Camera3D } from "./core/Camera3D";

// Accessibility and optimization components
export { default as AccessibilityControls } from "./AccessibilityControls";
export { default as KeyboardNavigation } from "./KeyboardNavigation";
export { default as PerformanceOptimizer } from "./PerformanceOptimizer";
export { default as FallbackRenderer } from "./FallbackRenderer";

// 3D component utilities
export { default as ServiceNode } from "./components/ServiceNode";
export { default as ConnectionLine } from "./components/ConnectionLine";
export { default as DataParticle } from "./components/DataParticle";
export { default as PipelineStage } from "./components/PipelineStage";
export { default as SecurityLayer } from "./components/SecurityLayer";
