/**
 * Three.js Fiber Type Declarations
 * 
 * Extends JSX namespace to include Three.js elements for proper TypeScript support
 */

// Extend the JSX namespace to include Three.js elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      // Geometry elements
      boxGeometry: React.DetailedHTMLProps<any, any>
      cylinderGeometry: React.DetailedHTMLProps<any, any>
      planeGeometry: React.DetailedHTMLProps<any, any>
      sphereGeometry: React.DetailedHTMLProps<any, any>

      // Material elements
      meshStandardMaterial: React.DetailedHTMLProps<any, any>
      meshBasicMaterial: React.DetailedHTMLProps<any, any>
      meshPhongMaterial: React.DetailedHTMLProps<any, any>

      // Object3D elements
      group: React.DetailedHTMLProps<any, any>
      mesh: React.DetailedHTMLProps<any, any>

      // Light elements
      ambientLight: React.DetailedHTMLProps<any, any>
      directionalLight: React.DetailedHTMLProps<any, any>
      pointLight: React.DetailedHTMLProps<any, any>
      spotLight: React.DetailedHTMLProps<any, any>

      // Camera elements
      perspectiveCamera: React.DetailedHTMLProps<any, any>
      orthographicCamera: React.DetailedHTMLProps<any, any>
    }
  }
}

export { }