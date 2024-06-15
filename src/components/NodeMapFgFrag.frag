precision mediump float;
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec4 uWorld;
uniform vec2 uResolution;
uniform vec2 uVision;
uniform vec2 uPlayerPos;

float minWorldWidth=700.;
float maxWorldWidth=2500.;
float depthHeight=150.;

float getDepthWorldWidth(float depth){
	float d=(depth)/100./depthHeight;
	float depthProgress=((sin(d*5.)*50.+cos(d*25.)*25.+cos(d*50.)*5.)/(50.+25.+5.)+1.)/2.;
	return mix(minWorldWidth,maxWorldWidth,depthProgress);
}

float FogOfWar(vec2 worldPos){
	float diff=(uPlayerPos.y*depthHeight)-worldPos.y;
	float ratio;
	
	if(diff>0.){
		ratio=diff/(uVision.x*depthHeight);
	}else{
		ratio=-diff/(uVision.y*depthHeight);
	}
	
	return 1.-clamp(ratio,0.,1.);
}

void main(void){
	
	vec2 uv=gl_FragCoord.xy/uResolution.xy;
	// remap coordinate axis to top left coords
	uv.y=1.-uv.y;
	
	vec3 color=vec3(0.);
	
	vec2 worldPos=uWorld.xy+uWorld.zw*uv.xy;
	
	float fow=FogOfWar(worldPos);
	
	gl_FragColor=vec4(color,1.-fow);
}