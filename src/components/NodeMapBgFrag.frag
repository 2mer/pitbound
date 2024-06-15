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

/*
x - dist from tunnel center in world units
y - depth lengthified
z - tunnel edge sdf
w - tunnel edge sdf normalized by depth width
*/
vec4 Tunnel(vec2 worldPos){
	float depth=worldPos.y;
	
	float depthWidth=getDepthWorldWidth(depth);
	float center=(maxWorldWidth)/2.;
	
	depthWidth+=200.;
	
	float centerDist=abs(worldPos.x-center);
	
	vec2 px=1./uResolution.xy;
	vec2 pxToWorld=uWorld.zw*px;
	vec2 factor=pxToWorld*4.;
	
	// pixelate center dist
	// centerDist=floor(centerDist/factor.x)*factor.x;
	
	float tunnelHorizontalOutwardProgress=(centerDist-(depthWidth/2.))/(center);
	float tunnelHorizontalInwardProgress=(centerDist-(depthWidth/2.))/(depthWidth/2.);
	
	return vec4(centerDist,depth/depthHeight,tunnelHorizontalOutwardProgress,tunnelHorizontalInwardProgress);
}

void main(void){
	
	vec2 st=gl_FragCoord.xy;
	
	// st=floor(st/4.)*4.;
	
	vec2 uv=st/uResolution.xy;
	// remap coordinate axis to top left coords
	uv.y=1.-uv.y;
	
	vec3 color=vec3(0.);
	
	vec2 pxRes=vec2(4.);
	
	vec2 worldPos=uWorld.xy+uWorld.zw*uv.xy;
	
	vec4 tunnel=Tunnel(worldPos);
	
	color=vec3(tunnel.z);
	
	vec3 bgColor=vec3(.102,.0824,.0824);
	vec3 wallColor=vec3(.0392,.0353,.0314);
	vec3 wallLightColor=vec3(.3216,.2902,.2627);
	
	if(tunnel.z<0.){
		color=mix(bgColor,vec3(0.,0.,0.),pow(clamp(tunnel.w+1.,0.,1.),50.));
	}else{
		color=mix(wallColor,wallLightColor,pow(1.-clamp(tunnel.z,0.,1.),5.));
	}
	
	// const pxDist = tunnel.z
	
	float lipHeight=3.;
	float lipWidth=3.;
	float lipContrib=sin(clamp(tunnel.z/lipWidth,0.,5.)*3.14)/((max(1.,tunnel.z-1.))/2.);
	float lipCurrentHeight=lipHeight*lipContrib;
	
	if(tunnel.y<-lipCurrentHeight){
		if(tunnel.x<2800.&&tunnel.y<0.&&tunnel.y>-5.5){
			color=bgColor;
		}else{
			color=vec3(.4353,.5843,.8078);
		}
	}
	
	gl_FragColor=vec4(color,1.);
}