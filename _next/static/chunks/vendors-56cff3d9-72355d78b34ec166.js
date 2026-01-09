"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[6919],{8398:(e,t,r)=>{var a=r(87548);a.Mesh},39544:(e,t,r)=>{r(87548),r(76141),r(85475),r(14814)},76141:(e,t,r)=>{r.d(t,{J:()=>l});var a=r(87548),o=r(14814),n=Object.defineProperty;let l=(()=>{let e=class extends a.Mesh{constructor(t,r={}){super(t),this.isReflector=!0,this.type="Reflector",this.camera=new a.PerspectiveCamera;let o=this,n=new a.Color(void 0!==r.color?r.color:8355711),l=r.textureWidth||512,i=r.textureHeight||512,s=r.clipBias||0,u=r.shader||e.ReflectorShader,d=void 0!==r.multisample?r.multisample:4,p=new a.Plane,c=new a.Vector3,m=new a.Vector3,f=new a.Vector3,v=new a.Matrix4,b=new a.Vector3(0,0,-1),x=new a.Vector4,g=new a.Vector3,h=new a.Vector3,M=new a.Vector4,y=new a.Matrix4,w=this.camera,S=new a.WebGLRenderTarget(l,i,{samples:d,type:a.HalfFloatType}),_=new a.ShaderMaterial({uniforms:a.UniformsUtils.clone(u.uniforms),fragmentShader:u.fragmentShader,vertexShader:u.vertexShader});_.uniforms.tDiffuse.value=S.texture,_.uniforms.color.value=n,_.uniforms.textureMatrix.value=y,this.material=_,this.onBeforeRender=function(e,t,r){if(m.setFromMatrixPosition(o.matrixWorld),f.setFromMatrixPosition(r.matrixWorld),v.extractRotation(o.matrixWorld),c.set(0,0,1),c.applyMatrix4(v),g.subVectors(m,f),g.dot(c)>0)return;g.reflect(c).negate(),g.add(m),v.extractRotation(r.matrixWorld),b.set(0,0,-1),b.applyMatrix4(v),b.add(f),h.subVectors(m,b),h.reflect(c).negate(),h.add(m),w.position.copy(g),w.up.set(0,1,0),w.up.applyMatrix4(v),w.up.reflect(c),w.lookAt(h),w.far=r.far,w.updateMatrixWorld(),w.projectionMatrix.copy(r.projectionMatrix),y.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),y.multiply(w.projectionMatrix),y.multiply(w.matrixWorldInverse),y.multiply(o.matrixWorld),p.setFromNormalAndCoplanarPoint(c,m),p.applyMatrix4(w.matrixWorldInverse),x.set(p.normal.x,p.normal.y,p.normal.z,p.constant);let n=w.projectionMatrix;M.x=(Math.sign(x.x)+n.elements[8])/n.elements[0],M.y=(Math.sign(x.y)+n.elements[9])/n.elements[5],M.z=-1,M.w=(1+n.elements[10])/n.elements[14],x.multiplyScalar(2/x.dot(M)),n.elements[2]=x.x,n.elements[6]=x.y,n.elements[10]=x.z+1-s,n.elements[14]=x.w,o.visible=!1;let l=e.getRenderTarget(),i=e.xr.enabled,u=e.shadowMap.autoUpdate,d=e.toneMapping,_=!1;_="outputColorSpace"in e?"srgb"===e.outputColorSpace:3001===e.outputEncoding,e.xr.enabled=!1,e.shadowMap.autoUpdate=!1,"outputColorSpace"in e?e.outputColorSpace="srgb-linear":e.outputEncoding=3e3,e.toneMapping=a.NoToneMapping,e.setRenderTarget(S),e.state.buffers.depth.setMask(!0),!1===e.autoClear&&e.clear(),e.render(t,w),e.xr.enabled=i,e.shadowMap.autoUpdate=u,e.toneMapping=d,"outputColorSpace"in e?e.outputColorSpace=_?"srgb":"srgb-linear":e.outputEncoding=_?3001:3e3,e.setRenderTarget(l);let C=r.viewport;void 0!==C&&e.state.viewport(C),o.visible=!0},this.getRenderTarget=function(){return S},this.dispose=function(){S.dispose(),o.material.dispose()}}};return((e,t,r)=>((e,t,r)=>t in e?n(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r)(e,"symbol"!=typeof t?t+"":t,r))(e,"ReflectorShader",{uniforms:{color:{value:null},tDiffuse:{value:null},textureMatrix:{value:null}},vertexShader:`
		uniform mat4 textureMatrix;
		varying vec4 vUv;

		#include <common>
		#include <logdepthbuf_pars_vertex>

		void main() {

			vUv = textureMatrix * vec4( position, 1.0 );

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

			#include <logdepthbuf_vertex>

		}`,fragmentShader:`
		uniform vec3 color;
		uniform sampler2D tDiffuse;
		varying vec4 vUv;

		#include <logdepthbuf_pars_fragment>

		float blendOverlay( float base, float blend ) {

			return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );

		}

		vec3 blendOverlay( vec3 base, vec3 blend ) {

			return vec3( blendOverlay( base.r, blend.r ), blendOverlay( base.g, blend.g ), blendOverlay( base.b, blend.b ) );

		}

		void main() {

			#include <logdepthbuf_fragment>

			vec4 base = texture2DProj( tDiffuse, vUv );
			gl_FragColor = vec4( blendOverlay( base.rgb, color ), 1.0 );

			#include <tonemapping_fragment>
			#include <${o.r>=154?"colorspace_fragment":"encodings_fragment"}>

		}`}),e})()},84248:(e,t,r)=>{r(87548),r(14814)},85475:(e,t,r)=>{r(87548),r(14814)},89597:(e,t,r)=>{r(87548)},92773:(e,t,r)=>{r(76141).J},99702:(e,t,r)=>{var a=r(87548);r(14814),a.Mesh}}]);