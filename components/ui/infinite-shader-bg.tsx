"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";

interface ShaderPlaneProps {
  vertexShader: string;
  fragmentShader: string;
  uniforms: { [key: string]: { value: unknown } };
  isMobile: boolean;
}

function ShaderPlane({
  vertexShader,
  fragmentShader,
  uniforms,
  isMobile,
}: ShaderPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { size } = useThree();

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.u_time.value = state.clock.elapsedTime * 0.5;
      material.uniforms.u_resolution.value.set(size.width, size.height, 1.0);

      // Cinema-quality responsive parameters - Maximum mobile visibility
      material.uniforms.u_brightness.value = 1.5; // Consistent brightness everywhere
      material.uniforms.u_cameraZ.value = isMobile ? -4.0 : -1.0; // Mobile: dramatic wide landscape view
      material.uniforms.u_cameraY.value = isMobile ? 9.0 : 6.0; // Mobile frames higher - centers peaks
      material.uniforms.u_terrainFreq.value = 0.25; // Same wave size all screens
      material.uniforms.u_terrainAmp.value = isMobile ? 1.0 : 0.5; // Mobile: dramatic peaks for visibility
      material.uniforms.u_fogDist.value = isMobile ? 85.0 : 98.0; // Mobile: see farther before fog
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

interface InfiniteShaderBgProps {
  className?: string;
}

export default function InfiniteShaderBg({ className = "w-full h-full" }: InfiniteShaderBgProps) {
  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    precision highp float;

    varying vec2 vUv;
    uniform float u_time;
    uniform vec3 u_resolution;
    uniform float u_brightness;
    uniform float u_cameraZ;
    uniform float u_cameraY;
    uniform float u_terrainFreq;
    uniform float u_terrainAmp;
    uniform float u_fogDist;

    #define STEP 256
    #define EPS .001

    float smin( float a, float b, float k )
    {
        float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
        return mix( b, a, h ) - k*h*(1.0-h);
    }

    const mat2 m = mat2(.8,.6,-.6,.8);

    float noise( in vec2 x )
    {
      return sin(1.5*x.x)*sin(1.5*x.y);
    }

    float fbm6( vec2 p )
    {
        float f = 0.0;
        f += 0.500000*(0.5+0.5*noise( p )); p = m*p*2.02;
        f += 0.250000*(0.5+0.5*noise( p )); p = m*p*2.03;
        f += 0.125000*(0.5+0.5*noise( p )); p = m*p*2.01;
        f += 0.062500*(0.5+0.5*noise( p )); p = m*p*2.04;
        f += 0.015625*(0.5+0.5*noise( p ));
        return f/0.96875;
    }

    mat2 getRot(float a)
    {
        float sa = sin(a), ca = cos(a);
        return mat2(ca,-sa,sa,ca);
    }

    vec3 _position;

    float sphere(vec3 center, float radius)
    {
        return distance(_position,center) - radius;
    }

    float swingPlane(float height)
    {
        vec3 pos = _position + vec3(0.,0.,u_time * 5.5);
        float def =  fbm6(pos.xz * u_terrainFreq) * u_terrainAmp;

        float way = pow(abs(pos.x) * 34. ,2.5) *.0000125;
        def *= way;

        float ch = height + def;
        return max(pos.y - ch,0.);
    }

    float map(vec3 pos)
    {
        _position = pos;

        float dist;
        dist = swingPlane(0.);

        float sminFactor = 5.25;
        dist = smin(dist,sphere(vec3(0.,-15.,80.),60.),sminFactor);
        return dist;
    }

    vec3 getNormal(vec3 pos)
    {
        vec3 nor = vec3(0.);
        vec3 vv = vec3(0.,1.,-1.)*.01;
        nor.x = map(pos + vv.zxx) - map(pos + vv.yxx);
        nor.y = map(pos + vv.xzx) - map(pos + vv.xyx);
        nor.z = map(pos + vv.xxz) - map(pos + vv.xxy);
        nor /= 2.;
        return normalize(nor);
    }

    // Film grain dithering - eliminates gradient banding (cinema-quality)
    float dither(vec2 uv) {
        return fract(sin(dot(uv + u_time * 0.01, vec2(12.9898, 78.233))) * 43758.5453) * 0.03;
    }

    void mainImage( out vec4 fragColor, in vec2 fragCoord )
    {
      vec2 uv = (fragCoord.xy-.5*u_resolution.xy)/u_resolution.y;

        vec3 rayOrigin = vec3(uv + vec2(0., u_cameraY), u_cameraZ);

        vec3 rayDir = normalize(vec3(uv , 1.));

        rayDir.zy = getRot(.15) * rayDir.zy;

        vec3 position = rayOrigin;

        float curDist;
        int nbStep = 0;

        for(; nbStep < STEP;++nbStep)
        {
            curDist = map(position);

            if(curDist < EPS)
                break;
            position += rayDir * curDist * .5;
        }

        float f;

        float dist = distance(rayOrigin,position);
        f = dist / u_fogDist;
        f = float(nbStep) / float(STEP);

        f *= u_brightness;

        // Add film grain to eliminate banding (professional technique)
        f += dither(fragCoord.xy);

        vec3 col = vec3(f);

        fragColor = vec4(col,1.0);
    }

    void main() {
      vec4 fragColor;
      vec2 fragCoord = vUv * u_resolution.xy;
      mainImage(fragColor, fragCoord);
      gl_FragColor = fragColor;
    }
  `;

  const shaderUniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector3(1, 1, 1) },
      u_brightness: { value: 1.5 }, // Consistent brightness everywhere
      u_cameraZ: { value: -1.0 },
      u_cameraY: { value: 6.0 }, // Vertical framing
      u_terrainFreq: { value: 0.25 },
      u_terrainAmp: { value: 0.5 },
      u_fogDist: { value: 98.0 },
    }),
    [],
  );

  return (
    <div className={className}>
      <Canvas className={className}>
        <ShaderPlane
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={shaderUniforms}
          isMobile={isMobile}
        />
      </Canvas>
    </div>
  );
}