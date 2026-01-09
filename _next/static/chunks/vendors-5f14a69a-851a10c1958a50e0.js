"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[9716],{1767:(e,t,o)=>{},2358:(e,t,o)=>{},3381:(e,t,o)=>{},3803:(e,t,o)=>{},3845:(e,t,o)=>{o.d(t,{T:()=>a});var r=o(87548);let a={uniforms:{tDiffuse:{value:null},tSize:{value:new r.Vector2(256,256)},center:{value:new r.Vector2(.5,.5)},angle:{value:1.57},scale:{value:1}},vertexShader:`
    varying vec2 vUv;

    void main() {

    	vUv = uv;
    	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

    }
  `,fragmentShader:`
    uniform vec2 center;
    uniform float angle;
    uniform float scale;
    uniform vec2 tSize;

    uniform sampler2D tDiffuse;

    varying vec2 vUv;

    float pattern() {

    	float s = sin( angle ), c = cos( angle );

    	vec2 tex = vUv * tSize - center;
    	vec2 point = vec2( c * tex.x - s * tex.y, s * tex.x + c * tex.y ) * scale;

    	return ( sin( point.x ) * sin( point.y ) ) * 4.0;

    }

    void main() {

    	vec4 color = texture2D( tDiffuse, vUv );

    	float average = ( color.r + color.g + color.b ) / 3.0;

    	gl_FragColor = vec4( vec3( average * 10.0 - 5.0 + pattern() ), color.a );

    }
  `}},4198:(e,t,o)=>{o.d(t,{YW:()=>a,fz:()=>l,zE:()=>i});var r=o(87548);let a={defines:{SMAA_THRESHOLD:"0.1"},uniforms:{tDiffuse:{value:null},resolution:{value:new r.Vector2(1/1024,1/512)}},vertexShader:`
    uniform vec2 resolution;

    varying vec2 vUv;
    varying vec4 vOffset[ 3 ];

    void SMAAEdgeDetectionVS( vec2 texcoord ) {
    	vOffset[ 0 ] = texcoord.xyxy + resolution.xyxy * vec4( -1.0, 0.0, 0.0,  1.0 ); // WebGL port note: Changed sign in W component
    	vOffset[ 1 ] = texcoord.xyxy + resolution.xyxy * vec4(  1.0, 0.0, 0.0, -1.0 ); // WebGL port note: Changed sign in W component
    	vOffset[ 2 ] = texcoord.xyxy + resolution.xyxy * vec4( -2.0, 0.0, 0.0,  2.0 ); // WebGL port note: Changed sign in W component
    }

    void main() {

    	vUv = uv;

    	SMAAEdgeDetectionVS( vUv );

    	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

    }
  `,fragmentShader:`
    uniform sampler2D tDiffuse;

    varying vec2 vUv;
    varying vec4 vOffset[ 3 ];

    vec4 SMAAColorEdgeDetectionPS( vec2 texcoord, vec4 offset[3], sampler2D colorTex ) {
    	vec2 threshold = vec2( SMAA_THRESHOLD, SMAA_THRESHOLD );

    // Calculate color deltas:
    	vec4 delta;
    	vec3 C = texture2D( colorTex, texcoord ).rgb;

    	vec3 Cleft = texture2D( colorTex, offset[0].xy ).rgb;
    	vec3 t = abs( C - Cleft );
    	delta.x = max( max( t.r, t.g ), t.b );

    	vec3 Ctop = texture2D( colorTex, offset[0].zw ).rgb;
    	t = abs( C - Ctop );
    	delta.y = max( max( t.r, t.g ), t.b );

    // We do the usual threshold:
    	vec2 edges = step( threshold, delta.xy );

    // Then discard if there is no edge:
    	if ( dot( edges, vec2( 1.0, 1.0 ) ) == 0.0 )
    		discard;

    // Calculate right and bottom deltas:
    	vec3 Cright = texture2D( colorTex, offset[1].xy ).rgb;
    	t = abs( C - Cright );
    	delta.z = max( max( t.r, t.g ), t.b );

    	vec3 Cbottom  = texture2D( colorTex, offset[1].zw ).rgb;
    	t = abs( C - Cbottom );
    	delta.w = max( max( t.r, t.g ), t.b );

    // Calculate the maximum delta in the direct neighborhood:
    	float maxDelta = max( max( max( delta.x, delta.y ), delta.z ), delta.w );

    // Calculate left-left and top-top deltas:
    	vec3 Cleftleft  = texture2D( colorTex, offset[2].xy ).rgb;
    	t = abs( C - Cleftleft );
    	delta.z = max( max( t.r, t.g ), t.b );

    	vec3 Ctoptop = texture2D( colorTex, offset[2].zw ).rgb;
    	t = abs( C - Ctoptop );
    	delta.w = max( max( t.r, t.g ), t.b );

    // Calculate the final maximum delta:
    	maxDelta = max( max( maxDelta, delta.z ), delta.w );

    // Local contrast adaptation in action:
    	edges.xy *= step( 0.5 * maxDelta, delta.xy );

    	return vec4( edges, 0.0, 0.0 );
    }

    void main() {

    	gl_FragColor = SMAAColorEdgeDetectionPS( vUv, vOffset, tDiffuse );

    }
  `},l={defines:{SMAA_MAX_SEARCH_STEPS:"8",SMAA_AREATEX_MAX_DISTANCE:"16",SMAA_AREATEX_PIXEL_SIZE:"( 1.0 / vec2( 160.0, 560.0 ) )",SMAA_AREATEX_SUBTEX_SIZE:"( 1.0 / 7.0 )"},uniforms:{tDiffuse:{value:null},tArea:{value:null},tSearch:{value:null},resolution:{value:new r.Vector2(1/1024,1/512)}},vertexShader:`
    uniform vec2 resolution;

    varying vec2 vUv;
    varying vec4 vOffset[ 3 ];
    varying vec2 vPixcoord;

    void SMAABlendingWeightCalculationVS( vec2 texcoord ) {
    	vPixcoord = texcoord / resolution;

    // We will use these offsets for the searches later on (see @PSEUDO_GATHER4):
    	vOffset[ 0 ] = texcoord.xyxy + resolution.xyxy * vec4( -0.25, 0.125, 1.25, 0.125 ); // WebGL port note: Changed sign in Y and W components
    	vOffset[ 1 ] = texcoord.xyxy + resolution.xyxy * vec4( -0.125, 0.25, -0.125, -1.25 ); // WebGL port note: Changed sign in Y and W components

    // And these for the searches, they indicate the ends of the loops:
    	vOffset[ 2 ] = vec4( vOffset[ 0 ].xz, vOffset[ 1 ].yw ) + vec4( -2.0, 2.0, -2.0, 2.0 ) * resolution.xxyy * float( SMAA_MAX_SEARCH_STEPS );

    }

    void main() {

    	vUv = uv;

    	SMAABlendingWeightCalculationVS( vUv );

    	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

    }
  `,fragmentShader:`
    #define SMAASampleLevelZeroOffset( tex, coord, offset ) texture2D( tex, coord + float( offset ) * resolution, 0.0 )

    uniform sampler2D tDiffuse;
    uniform sampler2D tArea;
    uniform sampler2D tSearch;
    uniform vec2 resolution;

    varying vec2 vUv;
    varying vec4 vOffset[3];
    varying vec2 vPixcoord;

    #if __VERSION__ == 100
    vec2 round( vec2 x ) {
    	return sign( x ) * floor( abs( x ) + 0.5 );
    }
    #endif

    float SMAASearchLength( sampler2D searchTex, vec2 e, float bias, float scale ) {
    // Not required if searchTex accesses are set to point:
    // float2 SEARCH_TEX_PIXEL_SIZE = 1.0 / float2(66.0, 33.0);
    // e = float2(bias, 0.0) + 0.5 * SEARCH_TEX_PIXEL_SIZE +
    //     e * float2(scale, 1.0) * float2(64.0, 32.0) * SEARCH_TEX_PIXEL_SIZE;
    	e.r = bias + e.r * scale;
    	return 255.0 * texture2D( searchTex, e, 0.0 ).r;
    }

    float SMAASearchXLeft( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {
    /**
     * @PSEUDO_GATHER4
     * This texcoord has been offset by (-0.25, -0.125) in the vertex shader to
     * sample between edge, thus fetching four edges in a row.
     * Sampling with different offsets in each direction allows to disambiguate
     * which edges are active from the four fetched ones.
     */
    	vec2 e = vec2( 0.0, 1.0 );

    	for ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) { // WebGL port note: Changed while to for
    		e = texture2D( edgesTex, texcoord, 0.0 ).rg;
    		texcoord -= vec2( 2.0, 0.0 ) * resolution;
    		if ( ! ( texcoord.x > end && e.g > 0.8281 && e.r == 0.0 ) ) break;
    	}

    // We correct the previous (-0.25, -0.125) offset we applied:
    	texcoord.x += 0.25 * resolution.x;

    // The searches are bias by 1, so adjust the coords accordingly:
    	texcoord.x += resolution.x;

    // Disambiguate the length added by the last step:
    	texcoord.x += 2.0 * resolution.x; // Undo last step
    	texcoord.x -= resolution.x * SMAASearchLength(searchTex, e, 0.0, 0.5);

    	return texcoord.x;
    }

    float SMAASearchXRight( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {
    	vec2 e = vec2( 0.0, 1.0 );

    	for ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) { // WebGL port note: Changed while to for
    		e = texture2D( edgesTex, texcoord, 0.0 ).rg;
    		texcoord += vec2( 2.0, 0.0 ) * resolution;
    		if ( ! ( texcoord.x < end && e.g > 0.8281 && e.r == 0.0 ) ) break;
    	}

    	texcoord.x -= 0.25 * resolution.x;
    	texcoord.x -= resolution.x;
    	texcoord.x -= 2.0 * resolution.x;
    	texcoord.x += resolution.x * SMAASearchLength( searchTex, e, 0.5, 0.5 );

    	return texcoord.x;
    }

    float SMAASearchYUp( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {
    	vec2 e = vec2( 1.0, 0.0 );

    	for ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) { // WebGL port note: Changed while to for
    		e = texture2D( edgesTex, texcoord, 0.0 ).rg;
    		texcoord += vec2( 0.0, 2.0 ) * resolution; // WebGL port note: Changed sign
    		if ( ! ( texcoord.y > end && e.r > 0.8281 && e.g == 0.0 ) ) break;
    	}

    	texcoord.y -= 0.25 * resolution.y; // WebGL port note: Changed sign
    	texcoord.y -= resolution.y; // WebGL port note: Changed sign
    	texcoord.y -= 2.0 * resolution.y; // WebGL port note: Changed sign
    	texcoord.y += resolution.y * SMAASearchLength( searchTex, e.gr, 0.0, 0.5 ); // WebGL port note: Changed sign

    	return texcoord.y;
    }

    float SMAASearchYDown( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {
    	vec2 e = vec2( 1.0, 0.0 );

    	for ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) { // WebGL port note: Changed while to for
    		e = texture2D( edgesTex, texcoord, 0.0 ).rg;
    		texcoord -= vec2( 0.0, 2.0 ) * resolution; // WebGL port note: Changed sign
    		if ( ! ( texcoord.y < end && e.r > 0.8281 && e.g == 0.0 ) ) break;
    	}

    	texcoord.y += 0.25 * resolution.y; // WebGL port note: Changed sign
    	texcoord.y += resolution.y; // WebGL port note: Changed sign
    	texcoord.y += 2.0 * resolution.y; // WebGL port note: Changed sign
    	texcoord.y -= resolution.y * SMAASearchLength( searchTex, e.gr, 0.5, 0.5 ); // WebGL port note: Changed sign

    	return texcoord.y;
    }

    vec2 SMAAArea( sampler2D areaTex, vec2 dist, float e1, float e2, float offset ) {
    // Rounding prevents precision errors of bilinear filtering:
    	vec2 texcoord = float( SMAA_AREATEX_MAX_DISTANCE ) * round( 4.0 * vec2( e1, e2 ) ) + dist;

    // We do a scale and bias for mapping to texel space:
    	texcoord = SMAA_AREATEX_PIXEL_SIZE * texcoord + ( 0.5 * SMAA_AREATEX_PIXEL_SIZE );

    // Move to proper place, according to the subpixel offset:
    	texcoord.y += SMAA_AREATEX_SUBTEX_SIZE * offset;

    	return texture2D( areaTex, texcoord, 0.0 ).rg;
    }

    vec4 SMAABlendingWeightCalculationPS( vec2 texcoord, vec2 pixcoord, vec4 offset[ 3 ], sampler2D edgesTex, sampler2D areaTex, sampler2D searchTex, ivec4 subsampleIndices ) {
    	vec4 weights = vec4( 0.0, 0.0, 0.0, 0.0 );

    	vec2 e = texture2D( edgesTex, texcoord ).rg;

    	if ( e.g > 0.0 ) { // Edge at north
    		vec2 d;

    // Find the distance to the left:
    		vec2 coords;
    		coords.x = SMAASearchXLeft( edgesTex, searchTex, offset[ 0 ].xy, offset[ 2 ].x );
    		coords.y = offset[ 1 ].y; // offset[1].y = texcoord.y - 0.25 * resolution.y (@CROSSING_OFFSET)
    		d.x = coords.x;

    // Now fetch the left crossing edges, two at a time using bilinear
    // filtering. Sampling at -0.25 (see @CROSSING_OFFSET) enables to
    // discern what value each edge has:
    		float e1 = texture2D( edgesTex, coords, 0.0 ).r;

    // Find the distance to the right:
    		coords.x = SMAASearchXRight( edgesTex, searchTex, offset[ 0 ].zw, offset[ 2 ].y );
    		d.y = coords.x;

    // We want the distances to be in pixel units (doing this here allow to
    // better interleave arithmetic and memory accesses):
    		d = d / resolution.x - pixcoord.x;

    // SMAAArea below needs a sqrt, as the areas texture is compressed
    // quadratically:
    		vec2 sqrt_d = sqrt( abs( d ) );

    // Fetch the right crossing edges:
    		coords.y -= 1.0 * resolution.y; // WebGL port note: Added
    		float e2 = SMAASampleLevelZeroOffset( edgesTex, coords, ivec2( 1, 0 ) ).r;

    // Ok, we know how this pattern looks like, now it is time for getting
    // the actual area:
    		weights.rg = SMAAArea( areaTex, sqrt_d, e1, e2, float( subsampleIndices.y ) );
    	}

    	if ( e.r > 0.0 ) { // Edge at west
    		vec2 d;

    // Find the distance to the top:
    		vec2 coords;

    		coords.y = SMAASearchYUp( edgesTex, searchTex, offset[ 1 ].xy, offset[ 2 ].z );
    		coords.x = offset[ 0 ].x; // offset[1].x = texcoord.x - 0.25 * resolution.x;
    		d.x = coords.y;

    // Fetch the top crossing edges:
    		float e1 = texture2D( edgesTex, coords, 0.0 ).g;

    // Find the distance to the bottom:
    		coords.y = SMAASearchYDown( edgesTex, searchTex, offset[ 1 ].zw, offset[ 2 ].w );
    		d.y = coords.y;

    // We want the distances to be in pixel units:
    		d = d / resolution.y - pixcoord.y;

    // SMAAArea below needs a sqrt, as the areas texture is compressed
    // quadratically:
    		vec2 sqrt_d = sqrt( abs( d ) );

    // Fetch the bottom crossing edges:
    		coords.y -= 1.0 * resolution.y; // WebGL port note: Added
    		float e2 = SMAASampleLevelZeroOffset( edgesTex, coords, ivec2( 0, 1 ) ).g;

    // Get the area for this direction:
    		weights.ba = SMAAArea( areaTex, sqrt_d, e1, e2, float( subsampleIndices.x ) );
    	}

    	return weights;
    }

    void main() {

    	gl_FragColor = SMAABlendingWeightCalculationPS( vUv, vPixcoord, vOffset, tDiffuse, tArea, tSearch, ivec4( 0.0 ) );

    }
  `},i={uniforms:{tDiffuse:{value:null},tColor:{value:null},resolution:{value:new r.Vector2(1/1024,1/512)}},vertexShader:`
    uniform vec2 resolution;

    varying vec2 vUv;
    varying vec4 vOffset[ 2 ];

    void SMAANeighborhoodBlendingVS( vec2 texcoord ) {
    	vOffset[ 0 ] = texcoord.xyxy + resolution.xyxy * vec4( -1.0, 0.0, 0.0, 1.0 ); // WebGL port note: Changed sign in W component
    	vOffset[ 1 ] = texcoord.xyxy + resolution.xyxy * vec4( 1.0, 0.0, 0.0, -1.0 ); // WebGL port note: Changed sign in W component
    }

    void main() {

    	vUv = uv;

    	SMAANeighborhoodBlendingVS( vUv );

    	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

    }
  `,fragmentShader:`
    uniform sampler2D tDiffuse;
    uniform sampler2D tColor;
    uniform vec2 resolution;

    varying vec2 vUv;
    varying vec4 vOffset[ 2 ];

    vec4 SMAANeighborhoodBlendingPS( vec2 texcoord, vec4 offset[ 2 ], sampler2D colorTex, sampler2D blendTex ) {
    // Fetch the blending weights for current pixel:
    	vec4 a;
    	a.xz = texture2D( blendTex, texcoord ).xz;
    	a.y = texture2D( blendTex, offset[ 1 ].zw ).g;
    	a.w = texture2D( blendTex, offset[ 1 ].xy ).a;

    // Is there any blending weight with a value greater than 0.0?
    	if ( dot(a, vec4( 1.0, 1.0, 1.0, 1.0 )) < 1e-5 ) {
    		return texture2D( colorTex, texcoord, 0.0 );
    	} else {
    // Up to 4 lines can be crossing a pixel (one through each edge). We
    // favor blending by choosing the line with the maximum weight for each
    // direction:
    		vec2 offset;
    		offset.x = a.a > a.b ? a.a : -a.b; // left vs. right
    		offset.y = a.g > a.r ? -a.g : a.r; // top vs. bottom // WebGL port note: Changed signs

    // Then we go in the direction that has the maximum weight:
    		if ( abs( offset.x ) > abs( offset.y )) { // horizontal vs. vertical
    			offset.y = 0.0;
    		} else {
    			offset.x = 0.0;
    		}

    // Fetch the opposite color and lerp by hand:
    		vec4 C = texture2D( colorTex, texcoord, 0.0 );
    		texcoord += sign( offset ) * resolution;
    		vec4 Cop = texture2D( colorTex, texcoord, 0.0 );
    		float s = abs( offset.x ) > abs( offset.y ) ? abs( offset.x ) : abs( offset.y );

    // WebGL port note: Added gamma correction
    		C.xyz = pow(C.xyz, vec3(2.2));
    		Cop.xyz = pow(Cop.xyz, vec3(2.2));
    		vec4 mixed = mix(C, Cop, s);
    		mixed.xyz = pow(mixed.xyz, vec3(1.0 / 2.2));

    		return mixed;
    	}
    }

    void main() {

    	gl_FragColor = SMAANeighborhoodBlendingPS( vUv, vOffset, tColor, tDiffuse );

    }
  `}},4257:(e,t,o)=>{o(87548)},5111:(e,t,o)=>{o(87548).Object3D},9792:(e,t,o)=>{},18082:(e,t,o)=>{},20238:(e,t,o)=>{o(87548)},21015:(e,t,o)=>{},21853:(e,t,o)=>{o(87548)},23895:(e,t,o)=>{o.d(t,{n:()=>r});let r={uniforms:{damp:{value:.96},tOld:{value:null},tNew:{value:null}},vertexShader:`
    varying vec2 vUv;

    void main() {

    	vUv = uv;
    	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

    }
  `,fragmentShader:`
    uniform float damp;

    uniform sampler2D tOld;
    uniform sampler2D tNew;

    varying vec2 vUv;

    vec4 when_gt( vec4 x, float y ) {

    	return max( sign( x - y ), 0.0 );

    }

    void main() {

    	vec4 texelOld = texture2D( tOld, vUv );
    	vec4 texelNew = texture2D( tNew, vUv );

    	texelOld *= damp * when_gt( texelOld, 0.1 );

    	gl_FragColor = max(texelNew, texelOld);

    }
  `}},29950:(e,t,o)=>{},34258:(e,t,o)=>{},34623:(e,t,o)=>{},35813:(e,t,o)=>{},35841:(e,t,o)=>{},36876:(e,t,o)=>{},38408:(e,t,o)=>{},41235:(e,t,o)=>{o(87548)},41320:(e,t,o)=>{o(87548)},41992:(e,t,o)=>{o(87548)},43565:(e,t,o)=>{o(87548)},44855:(e,t,o)=>{},50466:(e,t,o)=>{o(87548)},56435:(e,t,o)=>{},56437:(e,t,o)=>{},59800:(e,t,o)=>{o.d(t,{s:()=>r});let r={uniforms:{tDiffuse:{value:null},averageLuminance:{value:1},luminanceMap:{value:null},maxLuminance:{value:16},minLuminance:{value:.01},middleGrey:{value:.6}},vertexShader:`
    varying vec2 vUv;

    void main() {

    	vUv = uv;
    	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

    }
  `,fragmentShader:`
    #include <common>

    uniform sampler2D tDiffuse;

    varying vec2 vUv;

    uniform float middleGrey;
    uniform float minLuminance;
    uniform float maxLuminance;
    #ifdef ADAPTED_LUMINANCE
    	uniform sampler2D luminanceMap;
    #else
    	uniform float averageLuminance;
    #endif

    vec3 ToneMap( vec3 vColor ) {
    	#ifdef ADAPTED_LUMINANCE
    // Get the calculated average luminance
    		float fLumAvg = texture2D(luminanceMap, vec2(0.5, 0.5)).r;
    	#else
    		float fLumAvg = averageLuminance;
    	#endif

    // Calculate the luminance of the current pixel
    	float fLumPixel = linearToRelativeLuminance( vColor );

    // Apply the modified operator (Eq. 4)
    	float fLumScaled = (fLumPixel * middleGrey) / max( minLuminance, fLumAvg );

    	float fLumCompressed = (fLumScaled * (1.0 + (fLumScaled / (maxLuminance * maxLuminance)))) / (1.0 + fLumScaled);
    	return fLumCompressed * vColor;
    }

    void main() {

    	vec4 texel = texture2D( tDiffuse, vUv );

    	gl_FragColor = vec4( ToneMap( texel.xyz ), texel.w );

    }
  `}},60885:(e,t,o)=>{},64481:(e,t,o)=>{},65018:(e,t,o)=>{},65210:(e,t,o)=>{o(87548)},66541:(e,t,o)=>{o.d(t,{Z:()=>r});let r={uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`
    varying vec2 vUv;

    void main() {

    	vUv = uv;
    	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

    }
  `,fragmentShader:`
    uniform float opacity;

    uniform sampler2D tDiffuse;

    varying vec2 vUv;

    void main() {

    	vec4 texel = texture2D( tDiffuse, vUv );
    	gl_FragColor = opacity * texel;

    }
  `}},71531:(e,t,o)=>{o(87548)},73504:(e,t,o)=>{},76156:(e,t,o)=>{o.d(t,{C:()=>r});let r={defines:{KERNEL_SIZE_FLOAT:"25.0",KERNEL_SIZE_INT:"25"},uniforms:{tDiffuse:{value:null},uImageIncrement:{value:new(o(87548)).Vector2(.001953125,0)},cKernel:{value:[]}},vertexShader:`
    uniform vec2 uImageIncrement;

    varying vec2 vUv;

    void main() {

    	vUv = uv - ( ( KERNEL_SIZE_FLOAT - 1.0 ) / 2.0 ) * uImageIncrement;
    	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

    }
  `,fragmentShader:`
    uniform float cKernel[ KERNEL_SIZE_INT ];

    uniform sampler2D tDiffuse;
    uniform vec2 uImageIncrement;

    varying vec2 vUv;

    void main() {

    	vec2 imageCoord = vUv;
    	vec4 sum = vec4( 0.0, 0.0, 0.0, 0.0 );

    	for( int i = 0; i < KERNEL_SIZE_INT; i ++ ) {

    		sum += texture2D( tDiffuse, imageCoord ) * cKernel[ i ];
    		imageCoord += uImageIncrement;

    	}

    	gl_FragColor = sum;

    }
  `,buildKernel:function(e){let t=Math.min(2*Math.ceil(3*e)+1,25),o=(t-1)*.5,r=Array(t),a=0;for(let i=0;i<t;++i){var l;r[i]=Math.exp(-((l=i-o)*l)/(2*e*e)),a+=r[i]}for(let e=0;e<t;++e)r[e]/=a;return r}}},77706:(e,t,o)=>{o.d(t,{i:()=>r});let r={uniforms:{tDiffuse:{value:null},time:{value:0},nIntensity:{value:.5},sIntensity:{value:.05},sCount:{value:4096},grayscale:{value:1}},vertexShader:`
    varying vec2 vUv;

    void main() {

    	vUv = uv;
    	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

    }
  `,fragmentShader:`
    #include <common>

    // control parameter
    uniform float time;

    uniform bool grayscale;

    // noise effect intensity value (0 = no effect, 1 = full effect)
    uniform float nIntensity;

    // scanlines effect intensity value (0 = no effect, 1 = full effect)
    uniform float sIntensity;

    // scanlines effect count value (0 = no effect, 4096 = full effect)
    uniform float sCount;

    uniform sampler2D tDiffuse;

    varying vec2 vUv;

    void main() {

    // sample the source
    	vec4 cTextureScreen = texture2D( tDiffuse, vUv );

    // make some noise
    	float dx = rand( vUv + time );

    // add noise
    	vec3 cResult = cTextureScreen.rgb + cTextureScreen.rgb * clamp( 0.1 + dx, 0.0, 1.0 );

    // get us a sine and cosine
    	vec2 sc = vec2( sin( vUv.y * sCount ), cos( vUv.y * sCount ) );

    // add scanlines
    	cResult += cTextureScreen.rgb * vec3( sc.x, sc.y, sc.x ) * sIntensity;

    // interpolate between source and result by intensity
    	cResult = cTextureScreen.rgb + clamp( nIntensity, 0.0,1.0 ) * ( cResult - cTextureScreen.rgb );

    // convert to grayscale if desired
    	if( grayscale ) {

    		cResult = vec3( cResult.r * 0.3 + cResult.g * 0.59 + cResult.b * 0.11 );

    	}

    	gl_FragColor =  vec4( cResult, cTextureScreen.a );

    }
  `}},79943:(e,t,o)=>{o(87548)},81025:(e,t,o)=>{o(87548)},83121:(e,t,o)=>{o.d(t,{f:()=>r});let r={uniforms:{tDiffuse:{value:null},shape:{value:1},radius:{value:4},rotateR:{value:Math.PI/12*1},rotateG:{value:Math.PI/12*2},rotateB:{value:Math.PI/12*3},scatter:{value:0},width:{value:1},height:{value:1},blending:{value:1},blendingMode:{value:1},greyscale:{value:!1},disable:{value:!1}},vertexShader:`
    varying vec2 vUV;

    void main() {

    	vUV = uv;
    	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

    }
  `,fragmentShader:`
    #define SQRT2_MINUS_ONE 0.41421356
    #define SQRT2_HALF_MINUS_ONE 0.20710678
    #define PI2 6.28318531
    #define SHAPE_DOT 1
    #define SHAPE_ELLIPSE 2
    #define SHAPE_LINE 3
    #define SHAPE_SQUARE 4
    #define BLENDING_LINEAR 1
    #define BLENDING_MULTIPLY 2
    #define BLENDING_ADD 3
    #define BLENDING_LIGHTER 4
    #define BLENDING_DARKER 5
    uniform sampler2D tDiffuse;
    uniform float radius;
    uniform float rotateR;
    uniform float rotateG;
    uniform float rotateB;
    uniform float scatter;
    uniform float width;
    uniform float height;
    uniform int shape;
    uniform bool disable;
    uniform float blending;
    uniform int blendingMode;
    varying vec2 vUV;
    uniform bool greyscale;
    const int samples = 8;

    float blend( float a, float b, float t ) {

    // linear blend
    	return a * ( 1.0 - t ) + b * t;

    }

    float hypot( float x, float y ) {

    // vector magnitude
    	return sqrt( x * x + y * y );

    }

    float rand( vec2 seed ){

    // get pseudo-random number
    return fract( sin( dot( seed.xy, vec2( 12.9898, 78.233 ) ) ) * 43758.5453 );

    }

    float distanceToDotRadius( float channel, vec2 coord, vec2 normal, vec2 p, float angle, float rad_max ) {

    // apply shape-specific transforms
    	float dist = hypot( coord.x - p.x, coord.y - p.y );
    	float rad = channel;

    	if ( shape == SHAPE_DOT ) {

    		rad = pow( abs( rad ), 1.125 ) * rad_max;

    	} else if ( shape == SHAPE_ELLIPSE ) {

    		rad = pow( abs( rad ), 1.125 ) * rad_max;

    		if ( dist != 0.0 ) {
    			float dot_p = abs( ( p.x - coord.x ) / dist * normal.x + ( p.y - coord.y ) / dist * normal.y );
    			dist = ( dist * ( 1.0 - SQRT2_HALF_MINUS_ONE ) ) + dot_p * dist * SQRT2_MINUS_ONE;
    		}

    	} else if ( shape == SHAPE_LINE ) {

    		rad = pow( abs( rad ), 1.5) * rad_max;
    		float dot_p = ( p.x - coord.x ) * normal.x + ( p.y - coord.y ) * normal.y;
    		dist = hypot( normal.x * dot_p, normal.y * dot_p );

    	} else if ( shape == SHAPE_SQUARE ) {

    		float theta = atan( p.y - coord.y, p.x - coord.x ) - angle;
    		float sin_t = abs( sin( theta ) );
    		float cos_t = abs( cos( theta ) );
    		rad = pow( abs( rad ), 1.4 );
    		rad = rad_max * ( rad + ( ( sin_t > cos_t ) ? rad - sin_t * rad : rad - cos_t * rad ) );

    	}

    	return rad - dist;

    }

    struct Cell {

    // grid sample positions
    	vec2 normal;
    	vec2 p1;
    	vec2 p2;
    	vec2 p3;
    	vec2 p4;
    	float samp2;
    	float samp1;
    	float samp3;
    	float samp4;

    };

    vec4 getSample( vec2 point ) {

    // multi-sampled point
    	vec4 tex = texture2D( tDiffuse, vec2( point.x / width, point.y / height ) );
    	float base = rand( vec2( floor( point.x ), floor( point.y ) ) ) * PI2;
    	float step = PI2 / float( samples );
    	float dist = radius * 0.66;

    	for ( int i = 0; i < samples; ++i ) {

    		float r = base + step * float( i );
    		vec2 coord = point + vec2( cos( r ) * dist, sin( r ) * dist );
    		tex += texture2D( tDiffuse, vec2( coord.x / width, coord.y / height ) );

    	}

    	tex /= float( samples ) + 1.0;
    	return tex;

    }

    float getDotColour( Cell c, vec2 p, int channel, float angle, float aa ) {

    // get colour for given point
    	float dist_c_1, dist_c_2, dist_c_3, dist_c_4, res;

    	if ( channel == 0 ) {

    		c.samp1 = getSample( c.p1 ).r;
    		c.samp2 = getSample( c.p2 ).r;
    		c.samp3 = getSample( c.p3 ).r;
    		c.samp4 = getSample( c.p4 ).r;

    	} else if (channel == 1) {

    		c.samp1 = getSample( c.p1 ).g;
    		c.samp2 = getSample( c.p2 ).g;
    		c.samp3 = getSample( c.p3 ).g;
    		c.samp4 = getSample( c.p4 ).g;

    	} else {

    		c.samp1 = getSample( c.p1 ).b;
    		c.samp3 = getSample( c.p3 ).b;
    		c.samp2 = getSample( c.p2 ).b;
    		c.samp4 = getSample( c.p4 ).b;

    	}

    	dist_c_1 = distanceToDotRadius( c.samp1, c.p1, c.normal, p, angle, radius );
    	dist_c_2 = distanceToDotRadius( c.samp2, c.p2, c.normal, p, angle, radius );
    	dist_c_3 = distanceToDotRadius( c.samp3, c.p3, c.normal, p, angle, radius );
    	dist_c_4 = distanceToDotRadius( c.samp4, c.p4, c.normal, p, angle, radius );
    	res = ( dist_c_1 > 0.0 ) ? clamp( dist_c_1 / aa, 0.0, 1.0 ) : 0.0;
    	res += ( dist_c_2 > 0.0 ) ? clamp( dist_c_2 / aa, 0.0, 1.0 ) : 0.0;
    	res += ( dist_c_3 > 0.0 ) ? clamp( dist_c_3 / aa, 0.0, 1.0 ) : 0.0;
    	res += ( dist_c_4 > 0.0 ) ? clamp( dist_c_4 / aa, 0.0, 1.0 ) : 0.0;
    	res = clamp( res, 0.0, 1.0 );

    	return res;

    }

    Cell getReferenceCell( vec2 p, vec2 origin, float grid_angle, float step ) {

    // get containing cell
    	Cell c;

    // calc grid
    	vec2 n = vec2( cos( grid_angle ), sin( grid_angle ) );
    	float threshold = step * 0.5;
    	float dot_normal = n.x * ( p.x - origin.x ) + n.y * ( p.y - origin.y );
    	float dot_line = -n.y * ( p.x - origin.x ) + n.x * ( p.y - origin.y );
    	vec2 offset = vec2( n.x * dot_normal, n.y * dot_normal );
    	float offset_normal = mod( hypot( offset.x, offset.y ), step );
    	float normal_dir = ( dot_normal < 0.0 ) ? 1.0 : -1.0;
    	float normal_scale = ( ( offset_normal < threshold ) ? -offset_normal : step - offset_normal ) * normal_dir;
    	float offset_line = mod( hypot( ( p.x - offset.x ) - origin.x, ( p.y - offset.y ) - origin.y ), step );
    	float line_dir = ( dot_line < 0.0 ) ? 1.0 : -1.0;
    	float line_scale = ( ( offset_line < threshold ) ? -offset_line : step - offset_line ) * line_dir;

    // get closest corner
    	c.normal = n;
    	c.p1.x = p.x - n.x * normal_scale + n.y * line_scale;
    	c.p1.y = p.y - n.y * normal_scale - n.x * line_scale;

    // scatter
    	if ( scatter != 0.0 ) {

    		float off_mag = scatter * threshold * 0.5;
    		float off_angle = rand( vec2( floor( c.p1.x ), floor( c.p1.y ) ) ) * PI2;
    		c.p1.x += cos( off_angle ) * off_mag;
    		c.p1.y += sin( off_angle ) * off_mag;

    	}

    // find corners
    	float normal_step = normal_dir * ( ( offset_normal < threshold ) ? step : -step );
    	float line_step = line_dir * ( ( offset_line < threshold ) ? step : -step );
    	c.p2.x = c.p1.x - n.x * normal_step;
    	c.p2.y = c.p1.y - n.y * normal_step;
    	c.p3.x = c.p1.x + n.y * line_step;
    	c.p3.y = c.p1.y - n.x * line_step;
    	c.p4.x = c.p1.x - n.x * normal_step + n.y * line_step;
    	c.p4.y = c.p1.y - n.y * normal_step - n.x * line_step;

    	return c;

    }

    float blendColour( float a, float b, float t ) {

    // blend colours
    	if ( blendingMode == BLENDING_LINEAR ) {
    		return blend( a, b, 1.0 - t );
    	} else if ( blendingMode == BLENDING_ADD ) {
    		return blend( a, min( 1.0, a + b ), t );
    	} else if ( blendingMode == BLENDING_MULTIPLY ) {
    		return blend( a, max( 0.0, a * b ), t );
    	} else if ( blendingMode == BLENDING_LIGHTER ) {
    		return blend( a, max( a, b ), t );
    	} else if ( blendingMode == BLENDING_DARKER ) {
    		return blend( a, min( a, b ), t );
    	} else {
    		return blend( a, b, 1.0 - t );
    	}

    }

    void main() {

    	if ( ! disable ) {

    // setup
    		vec2 p = vec2( vUV.x * width, vUV.y * height );
    		vec2 origin = vec2( 0, 0 );
    		float aa = ( radius < 2.5 ) ? radius * 0.5 : 1.25;

    // get channel samples
    		Cell cell_r = getReferenceCell( p, origin, rotateR, radius );
    		Cell cell_g = getReferenceCell( p, origin, rotateG, radius );
    		Cell cell_b = getReferenceCell( p, origin, rotateB, radius );
    		float r = getDotColour( cell_r, p, 0, rotateR, aa );
    		float g = getDotColour( cell_g, p, 1, rotateG, aa );
    		float b = getDotColour( cell_b, p, 2, rotateB, aa );

    // blend with original
    		vec4 colour = texture2D( tDiffuse, vUV );
    		r = blendColour( r, colour.r, blending );
    		g = blendColour( g, colour.g, blending );
    		b = blendColour( b, colour.b, blending );

    		if ( greyscale ) {
    			r = g = b = (r + b + g) / 3.0;
    		}

    		gl_FragColor = vec4( r, g, b, 1.0 );

    	} else {

    		gl_FragColor = texture2D( tDiffuse, vUV );

    	}

    }
  `}},83936:(e,t,o)=>{o(87548)},84074:(e,t,o)=>{},84575:(e,t,o)=>{o.d(t,{Y:()=>a,j:()=>r});let r={uniforms:{textureWidth:{value:1},textureHeight:{value:1},focalDepth:{value:1},focalLength:{value:24},fstop:{value:.9},tColor:{value:null},tDepth:{value:null},maxblur:{value:1},showFocus:{value:0},manualdof:{value:0},vignetting:{value:0},depthblur:{value:0},threshold:{value:.5},gain:{value:2},bias:{value:.5},fringe:{value:.7},znear:{value:.1},zfar:{value:100},noise:{value:1},dithering:{value:1e-4},pentagon:{value:0},shaderFocus:{value:1},focusCoords:{value:new(o(87548)).Vector2}},vertexShader:`
    varying vec2 vUv;

    void main() {

    	vUv = uv;
    	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

    }
  `,fragmentShader:`
    #include <common>

    varying vec2 vUv;

    uniform sampler2D tColor;
    uniform sampler2D tDepth;
    uniform float textureWidth;
    uniform float textureHeight;

    uniform float focalDepth;  //focal distance value in meters, but you may use autofocus option below
    uniform float focalLength; //focal length in mm
    uniform float fstop; //f-stop value
    uniform bool showFocus; //show debug focus point and focal range (red = focal point, green = focal range)

    /*
    make sure that these two values are the same for your camera, otherwise distances will be wrong.
    */

    uniform float znear; // camera clipping start
    uniform float zfar; // camera clipping end

    //------------------------------------------
    //user variables

    const int samples = SAMPLES; //samples on the first ring
    const int rings = RINGS; //ring count

    const int maxringsamples = rings * samples;

    uniform bool manualdof; // manual dof calculation
    float ndofstart = 1.0; // near dof blur start
    float ndofdist = 2.0; // near dof blur falloff distance
    float fdofstart = 1.0; // far dof blur start
    float fdofdist = 3.0; // far dof blur falloff distance

    float CoC = 0.03; //circle of confusion size in mm (35mm film = 0.03mm)

    uniform bool vignetting; // use optical lens vignetting

    float vignout = 1.3; // vignetting outer border
    float vignin = 0.0; // vignetting inner border
    float vignfade = 22.0; // f-stops till vignete fades

    uniform bool shaderFocus;
    // disable if you use external focalDepth value

    uniform vec2 focusCoords;
    // autofocus point on screen (0.0,0.0 - left lower corner, 1.0,1.0 - upper right)
    // if center of screen use vec2(0.5, 0.5);

    uniform float maxblur;
    //clamp value of max blur (0.0 = no blur, 1.0 default)

    uniform float threshold; // highlight threshold;
    uniform float gain; // highlight gain;

    uniform float bias; // bokeh edge bias
    uniform float fringe; // bokeh chromatic aberration / fringing

    uniform bool noise; //use noise instead of pattern for sample dithering

    uniform float dithering;

    uniform bool depthblur; // blur the depth buffer
    float dbsize = 1.25; // depth blur size

    /*
    next part is experimental
    not looking good with small sample and ring count
    looks okay starting from samples = 4, rings = 4
    */

    uniform bool pentagon; //use pentagon as bokeh shape?
    float feather = 0.4; //pentagon shape feather

    //------------------------------------------

    float penta(vec2 coords) {
    	//pentagonal shape
    	float scale = float(rings) - 1.3;
    	vec4  HS0 = vec4( 1.0,         0.0,         0.0,  1.0);
    	vec4  HS1 = vec4( 0.309016994, 0.951056516, 0.0,  1.0);
    	vec4  HS2 = vec4(-0.809016994, 0.587785252, 0.0,  1.0);
    	vec4  HS3 = vec4(-0.809016994,-0.587785252, 0.0,  1.0);
    	vec4  HS4 = vec4( 0.309016994,-0.951056516, 0.0,  1.0);
    	vec4  HS5 = vec4( 0.0        ,0.0         , 1.0,  1.0);

    	vec4  one = vec4( 1.0 );

    	vec4 P = vec4((coords),vec2(scale, scale));

    	vec4 dist = vec4(0.0);
    	float inorout = -4.0;

    	dist.x = dot( P, HS0 );
    	dist.y = dot( P, HS1 );
    	dist.z = dot( P, HS2 );
    	dist.w = dot( P, HS3 );

    	dist = smoothstep( -feather, feather, dist );

    	inorout += dot( dist, one );

    	dist.x = dot( P, HS4 );
    	dist.y = HS5.w - abs( P.z );

    	dist = smoothstep( -feather, feather, dist );
    	inorout += dist.x;

    	return clamp( inorout, 0.0, 1.0 );
    }

    float bdepth(vec2 coords) {
    	// Depth buffer blur
    	float d = 0.0;
    	float kernel[9];
    	vec2 offset[9];

    	vec2 wh = vec2(1.0/textureWidth,1.0/textureHeight) * dbsize;

    	offset[0] = vec2(-wh.x,-wh.y);
    	offset[1] = vec2( 0.0, -wh.y);
    	offset[2] = vec2( wh.x -wh.y);

    	offset[3] = vec2(-wh.x,  0.0);
    	offset[4] = vec2( 0.0,   0.0);
    	offset[5] = vec2( wh.x,  0.0);

    	offset[6] = vec2(-wh.x, wh.y);
    	offset[7] = vec2( 0.0,  wh.y);
    	offset[8] = vec2( wh.x, wh.y);

    	kernel[0] = 1.0/16.0;   kernel[1] = 2.0/16.0;   kernel[2] = 1.0/16.0;
    	kernel[3] = 2.0/16.0;   kernel[4] = 4.0/16.0;   kernel[5] = 2.0/16.0;
    	kernel[6] = 1.0/16.0;   kernel[7] = 2.0/16.0;   kernel[8] = 1.0/16.0;

    	for( int i=0; i<9; i++ ) {
    		float tmp = texture2D(tDepth, coords + offset[i]).r;
    		d += tmp * kernel[i];
    	}

    	return d;
    }

    vec3 color(vec2 coords,float blur) {
    	//processing the sample

    	vec3 col = vec3(0.0);
    	vec2 texel = vec2(1.0/textureWidth,1.0/textureHeight);

    	col.r = texture2D(tColor,coords + vec2(0.0,1.0)*texel*fringe*blur).r;
    	col.g = texture2D(tColor,coords + vec2(-0.866,-0.5)*texel*fringe*blur).g;
    	col.b = texture2D(tColor,coords + vec2(0.866,-0.5)*texel*fringe*blur).b;

    	vec3 lumcoeff = vec3(0.299,0.587,0.114);
    	float lum = dot(col.rgb, lumcoeff);
    	float thresh = max((lum-threshold)*gain, 0.0);
    	return col+mix(vec3(0.0),col,thresh*blur);
    }

    vec3 debugFocus(vec3 col, float blur, float depth) {
    	float edge = 0.002*depth; //distance based edge smoothing
    	float m = clamp(smoothstep(0.0,edge,blur),0.0,1.0);
    	float e = clamp(smoothstep(1.0-edge,1.0,blur),0.0,1.0);

    	col = mix(col,vec3(1.0,0.5,0.0),(1.0-m)*0.6);
    	col = mix(col,vec3(0.0,0.5,1.0),((1.0-e)-(1.0-m))*0.2);

    	return col;
    }

    float linearize(float depth) {
    	return -zfar * znear / (depth * (zfar - znear) - zfar);
    }

    float vignette() {
    	float dist = distance(vUv.xy, vec2(0.5,0.5));
    	dist = smoothstep(vignout+(fstop/vignfade), vignin+(fstop/vignfade), dist);
    	return clamp(dist,0.0,1.0);
    }

    float gather(float i, float j, int ringsamples, inout vec3 col, float w, float h, float blur) {
    	float rings2 = float(rings);
    	float step = PI*2.0 / float(ringsamples);
    	float pw = cos(j*step)*i;
    	float ph = sin(j*step)*i;
    	float p = 1.0;
    	if (pentagon) {
    		p = penta(vec2(pw,ph));
    	}
    	col += color(vUv.xy + vec2(pw*w,ph*h), blur) * mix(1.0, i/rings2, bias) * p;
    	return 1.0 * mix(1.0, i /rings2, bias) * p;
    }

    void main() {
    	//scene depth calculation

    	float depth = linearize(texture2D(tDepth,vUv.xy).x);

    	// Blur depth?
    	if ( depthblur ) {
    		depth = linearize(bdepth(vUv.xy));
    	}

    	//focal plane calculation

    	float fDepth = focalDepth;

    	if (shaderFocus) {

    		fDepth = linearize(texture2D(tDepth,focusCoords).x);

    	}

    	// dof blur factor calculation

    	float blur = 0.0;

    	if (manualdof) {
    		float a = depth-fDepth; // Focal plane
    		float b = (a-fdofstart)/fdofdist; // Far DoF
    		float c = (-a-ndofstart)/ndofdist; // Near Dof
    		blur = (a>0.0) ? b : c;
    	} else {
    		float f = focalLength; // focal length in mm
    		float d = fDepth*1000.0; // focal plane in mm
    		float o = depth*1000.0; // depth in mm

    		float a = (o*f)/(o-f);
    		float b = (d*f)/(d-f);
    		float c = (d-f)/(d*fstop*CoC);

    		blur = abs(a-b)*c;
    	}

    	blur = clamp(blur,0.0,1.0);

    	// calculation of pattern for dithering

    	vec2 noise = vec2(rand(vUv.xy), rand( vUv.xy + vec2( 0.4, 0.6 ) ) )*dithering*blur;

    	// getting blur x and y step factor

    	float w = (1.0/textureWidth)*blur*maxblur+noise.x;
    	float h = (1.0/textureHeight)*blur*maxblur+noise.y;

    	// calculation of final color

    	vec3 col = vec3(0.0);

    	if(blur < 0.05) {
    		//some optimization thingy
    		col = texture2D(tColor, vUv.xy).rgb;
    	} else {
    		col = texture2D(tColor, vUv.xy).rgb;
    		float s = 1.0;
    		int ringsamples;

    		for (int i = 1; i <= rings; i++) {
    			/*unboxstart*/
    			ringsamples = i * samples;

    			for (int j = 0 ; j < maxringsamples ; j++) {
    				if (j >= ringsamples) break;
    				s += gather(float(i), float(j), ringsamples, col, w, h, blur);
    			}
    			/*unboxend*/
    		}

    		col /= s; //divide by sample count
    	}

    	if (showFocus) {
    		col = debugFocus(col, blur, depth);
    	}

    	if (vignetting) {
    		col *= vignette();
    	}

    	gl_FragColor.rgb = col;
    	gl_FragColor.a = 1.0;
    } 
  `},a={uniforms:{mNear:{value:1},mFar:{value:1e3}},vertexShader:`
    varying float vViewZDepth;

    void main() {

    	#include <begin_vertex>
    	#include <project_vertex>

    	vViewZDepth = - mvPosition.z;

    }
  `,fragmentShader:`
    uniform float mNear;
    uniform float mFar;

    varying float vViewZDepth;

    void main() {

    	float color = 1.0 - smoothstep( mNear, mFar, vViewZDepth );
    	gl_FragColor = vec4( vec3( color ), 1.0 );

    } 
  `}},86551:(e,t,o)=>{},87527:(e,t,o)=>{},91505:(e,t,o)=>{o(87548)},92649:(e,t,o)=>{o.d(t,{l:()=>r});let r={uniforms:{tDiffuse:{value:null}},vertexShader:`
    varying vec2 vUv;

    void main() {

    	vUv = uv;

    	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

    }
  `,fragmentShader:`
    #include <common>

    uniform sampler2D tDiffuse;

    varying vec2 vUv;

    void main() {

    	vec4 texel = texture2D( tDiffuse, vUv );

    	float l = linearToRelativeLuminance( texel.rgb );

    	gl_FragColor = vec4( l, l, l, texel.w );

    }
  `}},93230:(e,t,o)=>{o(87548).Object3D},94963:(e,t,o)=>{o(87548)},95528:(e,t,o)=>{o(87548)},95774:(e,t,o)=>{o.d(t,{S:()=>r});let r={uniforms:{tDiffuse:{value:null},tDisp:{value:null},byp:{value:0},amount:{value:.08},angle:{value:.02},seed:{value:.02},seed_x:{value:.02},seed_y:{value:.02},distortion_x:{value:.5},distortion_y:{value:.6},col_s:{value:.05}},vertexShader:`
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}
	`,fragmentShader:`
		uniform int byp; //should we apply the glitch ?
		uniform sampler2D tDiffuse;
		uniform sampler2D tDisp;
		uniform float amount;
		uniform float angle;
		uniform float seed;
		uniform float seed_x;
		uniform float seed_y;
		uniform float distortion_x;
		uniform float distortion_y;
		uniform float col_s;

		varying vec2 vUv;

		float rand(vec2 co){
			return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
		}

		void main() {
			if(byp<1) {
				vec2 p = vUv;
				float xs = floor(gl_FragCoord.x / 0.5);
				float ys = floor(gl_FragCoord.y / 0.5);
		//based on staffantans glitch shader for unity https://github.com/staffantan/unityglitch
				vec4 normal = texture2D (tDisp, p*seed*seed);
				if(p.y<distortion_x+col_s && p.y>distortion_x-col_s*seed) {
					if(seed_x>0.){
						p.y = 1. - (p.y + distortion_y);
					}
					else {
						p.y = distortion_y;
					}
				}
				if(p.x<distortion_y+col_s && p.x>distortion_y-col_s*seed) {
					if(seed_y>0.){
						p.x=distortion_x;
					}
					else {
						p.x = 1. - (p.x + distortion_x);
					}
				}
				p.x+=normal.x*seed_x*(seed/5.);
				p.y+=normal.y*seed_y*(seed/5.);
		//base from RGB shift shader
				vec2 offset = amount * vec2( cos(angle), sin(angle));
				vec4 cr = texture2D(tDiffuse, p + offset);
				vec4 cga = texture2D(tDiffuse, p);
				vec4 cb = texture2D(tDiffuse, p - offset);
				gl_FragColor = vec4(cr.r, cga.g, cb.b, cga.a);
		//add noise
				vec4 snow = 200.*amount*vec4(rand(vec2(xs * seed,ys * seed*50.))*0.2);
				gl_FragColor = gl_FragColor+ snow;
			}
			else {
				gl_FragColor=texture2D (tDiffuse, vUv);
			}
		}
`}},96777:(e,t,o)=>{},96991:(e,t,o)=>{o.d(t,{L:()=>r});let r={defines:{DEPTH_PACKING:1,PERSPECTIVE_CAMERA:1},uniforms:{tColor:{value:null},tDepth:{value:null},focus:{value:1},aspect:{value:1},aperture:{value:.025},maxblur:{value:.01},nearClip:{value:1},farClip:{value:1e3}},vertexShader:`
    varying vec2 vUv;

    void main() {

    	vUv = uv;
    	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

    }
  `,fragmentShader:`
    #include <common>

    varying vec2 vUv;

    uniform sampler2D tColor;
    uniform sampler2D tDepth;

    uniform float maxblur; // max blur amount
    uniform float aperture; // aperture - bigger values for shallower depth of field

    uniform float nearClip;
    uniform float farClip;

    uniform float focus;
    uniform float aspect;

    #include <packing>

    float getDepth( const in vec2 screenPosition ) {
    	#if DEPTH_PACKING == 1
    	return unpackRGBAToDepth( texture2D( tDepth, screenPosition ) );
    	#else
    	return texture2D( tDepth, screenPosition ).x;
    	#endif
    }

    float getViewZ( const in float depth ) {
    	#if PERSPECTIVE_CAMERA == 1
    	return perspectiveDepthToViewZ( depth, nearClip, farClip );
    	#else
    	return orthographicDepthToViewZ( depth, nearClip, farClip );
    	#endif
    }

    void main() {

    	vec2 aspectcorrect = vec2( 1.0, aspect );

    	float viewZ = getViewZ( getDepth( vUv ) );

    	float factor = ( focus + viewZ ); // viewZ is <= 0, so this is a difference equation

    	vec2 dofblur = vec2 ( clamp( factor * aperture, -maxblur, maxblur ) );

    	vec2 dofblur9 = dofblur * 0.9;
    	vec2 dofblur7 = dofblur * 0.7;
    	vec2 dofblur4 = dofblur * 0.4;

    	vec4 col = vec4( 0.0 );

    	col += texture2D( tColor, vUv.xy );
    	col += texture2D( tColor, vUv.xy + ( vec2(  0.0,   0.4  ) * aspectcorrect ) * dofblur );
    	col += texture2D( tColor, vUv.xy + ( vec2(  0.15,  0.37 ) * aspectcorrect ) * dofblur );
    	col += texture2D( tColor, vUv.xy + ( vec2(  0.29,  0.29 ) * aspectcorrect ) * dofblur );
    	col += texture2D( tColor, vUv.xy + ( vec2( -0.37,  0.15 ) * aspectcorrect ) * dofblur );
    	col += texture2D( tColor, vUv.xy + ( vec2(  0.40,  0.0  ) * aspectcorrect ) * dofblur );
    	col += texture2D( tColor, vUv.xy + ( vec2(  0.37, -0.15 ) * aspectcorrect ) * dofblur );
    	col += texture2D( tColor, vUv.xy + ( vec2(  0.29, -0.29 ) * aspectcorrect ) * dofblur );
    	col += texture2D( tColor, vUv.xy + ( vec2( -0.15, -0.37 ) * aspectcorrect ) * dofblur );
    	col += texture2D( tColor, vUv.xy + ( vec2(  0.0,  -0.4  ) * aspectcorrect ) * dofblur );
    	col += texture2D( tColor, vUv.xy + ( vec2( -0.15,  0.37 ) * aspectcorrect ) * dofblur );
    	col += texture2D( tColor, vUv.xy + ( vec2( -0.29,  0.29 ) * aspectcorrect ) * dofblur );
    	col += texture2D( tColor, vUv.xy + ( vec2(  0.37,  0.15 ) * aspectcorrect ) * dofblur );
    	col += texture2D( tColor, vUv.xy + ( vec2( -0.4,   0.0  ) * aspectcorrect ) * dofblur );
    	col += texture2D( tColor, vUv.xy + ( vec2( -0.37, -0.15 ) * aspectcorrect ) * dofblur );
    	col += texture2D( tColor, vUv.xy + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur );
    	col += texture2D( tColor, vUv.xy + ( vec2(  0.15, -0.37 ) * aspectcorrect ) * dofblur );

    	col += texture2D( tColor, vUv.xy + ( vec2(  0.15,  0.37 ) * aspectcorrect ) * dofblur9 );
    	col += texture2D( tColor, vUv.xy + ( vec2( -0.37,  0.15 ) * aspectcorrect ) * dofblur9 );
    	col += texture2D( tColor, vUv.xy + ( vec2(  0.37, -0.15 ) * aspectcorrect ) * dofblur9 );
    	col += texture2D( tColor, vUv.xy + ( vec2( -0.15, -0.37 ) * aspectcorrect ) * dofblur9 );
    	col += texture2D( tColor, vUv.xy + ( vec2( -0.15,  0.37 ) * aspectcorrect ) * dofblur9 );
    	col += texture2D( tColor, vUv.xy + ( vec2(  0.37,  0.15 ) * aspectcorrect ) * dofblur9 );
    	col += texture2D( tColor, vUv.xy + ( vec2( -0.37, -0.15 ) * aspectcorrect ) * dofblur9 );
    	col += texture2D( tColor, vUv.xy + ( vec2(  0.15, -0.37 ) * aspectcorrect ) * dofblur9 );

    	col += texture2D( tColor, vUv.xy + ( vec2(  0.29,  0.29 ) * aspectcorrect ) * dofblur7 );
    	col += texture2D( tColor, vUv.xy + ( vec2(  0.40,  0.0  ) * aspectcorrect ) * dofblur7 );
    	col += texture2D( tColor, vUv.xy + ( vec2(  0.29, -0.29 ) * aspectcorrect ) * dofblur7 );
    	col += texture2D( tColor, vUv.xy + ( vec2(  0.0,  -0.4  ) * aspectcorrect ) * dofblur7 );
    	col += texture2D( tColor, vUv.xy + ( vec2( -0.29,  0.29 ) * aspectcorrect ) * dofblur7 );
    	col += texture2D( tColor, vUv.xy + ( vec2( -0.4,   0.0  ) * aspectcorrect ) * dofblur7 );
    	col += texture2D( tColor, vUv.xy + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur7 );
    	col += texture2D( tColor, vUv.xy + ( vec2(  0.0,   0.4  ) * aspectcorrect ) * dofblur7 );

    	col += texture2D( tColor, vUv.xy + ( vec2(  0.29,  0.29 ) * aspectcorrect ) * dofblur4 );
    	col += texture2D( tColor, vUv.xy + ( vec2(  0.4,   0.0  ) * aspectcorrect ) * dofblur4 );
    	col += texture2D( tColor, vUv.xy + ( vec2(  0.29, -0.29 ) * aspectcorrect ) * dofblur4 );
    	col += texture2D( tColor, vUv.xy + ( vec2(  0.0,  -0.4  ) * aspectcorrect ) * dofblur4 );
    	col += texture2D( tColor, vUv.xy + ( vec2( -0.29,  0.29 ) * aspectcorrect ) * dofblur4 );
    	col += texture2D( tColor, vUv.xy + ( vec2( -0.4,   0.0  ) * aspectcorrect ) * dofblur4 );
    	col += texture2D( tColor, vUv.xy + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur4 );
    	col += texture2D( tColor, vUv.xy + ( vec2(  0.0,   0.4  ) * aspectcorrect ) * dofblur4 );

    	gl_FragColor = col / 41.0;
    	gl_FragColor.a = 1.0;

    }
  `}},97642:(e,t,o)=>{o(87548)},98127:(e,t,o)=>{var r=o(87548);o(81025),r.Object3D}}]);