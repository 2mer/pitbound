precision mediump float;
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec4 uWorld;
uniform vec2 uResolution;

float minWorldWidth=700.;
float maxWorldWidth=2500.;

float getDepthWorldWidth(float depth){
	float d=depth/100.;
	float depthProgress=((sin(d*5.)*50.+cos(d*25.)*25.+cos(d*50.)*5.)/(50.+25.+5.)+1.)/2.;
	return mix(minWorldWidth,maxWorldWidth,depthProgress);
}

void main(void){
	
	//vec4 color = texture2D(uSampler, vTextureCoord);
	// gl_FragColor = vec4(vTextureCoord.x, vTextureCoord.y, 0.5, 1.0) * color;
	// gl_FragColor = vec4(vTextureCoord.x, vTextureCoord.y, 0., 1.0);
	// gl_FragColor = vec4(1.0);
	// vec2 st = fract(gl_FragCoord.xy/10.);
	// gl_FragColor = vec4(st, 0.,1.);
	
	vec2 uv=gl_FragCoord.xy/uResolution.xy;
	// remap coordinate axis to top left coords
	uv.y=1.-uv.y;
	
	float worldX=uWorld.x+uWorld.z*uv.x;
	float worldY=uWorld.y+uWorld.w*uv.y;
	
	float depth=worldY;
	
	float depthWidth=getDepthWorldWidth(depth);
	
	// vec2 st=(gl_FragCoord.xy-uTest.xy)/uTest.zw;
	
	vec4 color=vec4(0.);
	
	color=vec4(worldX,worldY,0.,1.);
	
	// if(worldX<depthWidth){
		// 	color=vec4(0.,0.,1.,1.);
	// }
	
	gl_FragColor=color;
}