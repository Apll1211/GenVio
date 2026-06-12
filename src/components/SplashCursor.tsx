"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSplashCursor } from "@/context/SplashCursorContext";

interface ColorRGB {
  r: number;
  g: number;
  b: number;
}

interface SplashCursorProps {
  SIM_RESOLUTION?: number;
  DYE_RESOLUTION?: number;
  CAPTURE_RESOLUTION?: number;
  DENSITY_DISSIPATION?: number;
  VELOCITY_DISSIPATION?: number;
  PRESSURE?: number;
  PRESSURE_ITERATIONS?: number;
  CURL?: number;
  SPLAT_RADIUS?: number;
  SPLAT_FORCE?: number;
  SHADING?: boolean;
  COLOR_UPDATE_SPEED?: number;
  BACK_COLOR?: ColorRGB;
  TRANSPARENT?: boolean;
}

interface Pointer {
  id: number;
  texcoordX: number;
  texcoordY: number;
  prevTexcoordX: number;
  prevTexcoordY: number;
  deltaX: number;
  deltaY: number;
  down: boolean;
  moved: boolean;
  color: ColorRGB;
}

function pointerPrototype(): Pointer {
  return {
    id: -1,
    texcoordX: 0,
    texcoordY: 0,
    prevTexcoordX: 0,
    prevTexcoordY: 0,
    deltaX: 0,
    deltaY: 0,
    down: false,
    moved: false,
    color: { r: 0, g: 0, b: 0 },
  };
}

export default function SplashCursor({
  SIM_RESOLUTION = 32, // Reduced from 64
  DYE_RESOLUTION = 256, // Reduced from 512
  CAPTURE_RESOLUTION = 128, // Reduced from 256
  DENSITY_DISSIPATION = 3.5,
  VELOCITY_DISSIPATION = 2,
  PRESSURE = 0.1,
  PRESSURE_ITERATIONS = 8, // Reduced from 10
  CURL = 3,
  SPLAT_RADIUS = 0.2,
  SPLAT_FORCE = 6000,
  SHADING = true,
  COLOR_UPDATE_SPEED = 10,
  BACK_COLOR = { r: 0.5, g: 0, b: 0 },
  TRANSPARENT = true,
}: SplashCursorProps) {
  const pathname = usePathname();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isNotFoundPage, setIsNotFoundPage] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { isEnabled } = useSplashCursor();

  const isAdminPage = pathname?.startsWith("/admin");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const checkNotFoundPage = () => {
      const notFoundElement = document.querySelector(".not-found-page");
      setIsNotFoundPage(!!notFoundElement);
    };

    checkNotFoundPage();

    const observer = new MutationObserver(() => {
      checkNotFoundPage();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [isMounted]);

  useEffect(() => {
    if (!isEnabled || isAdminPage || isNotFoundPage) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const pointers: Pointer[] = [pointerPrototype()];

    const config = {
      SIM_RESOLUTION,
      DYE_RESOLUTION,
      CAPTURE_RESOLUTION,
      DENSITY_DISSIPATION,
      VELOCITY_DISSIPATION,
      PRESSURE,
      PRESSURE_ITERATIONS,
      CURL,
      SPLAT_RADIUS,
      SPLAT_FORCE,
      SHADING,
      COLOR_UPDATE_SPEED,
      PAUSED: false,
      BACK_COLOR,
      TRANSPARENT,
    };

    let { gl, ext } = getWebGLContext(canvas);
    if (!gl || !ext) return;

    if (!ext.supportLinearFiltering) {
      config.DYE_RESOLUTION = 256;
      config.SHADING = false;
    }

    function getWebGLContext(canvas: HTMLCanvasElement) {
      const params = {
        alpha: true,
        depth: false,
        stencil: false,
        antialias: false,
        preserveDrawingBuffer: false,
      };

      let gl = canvas.getContext("webgl2", params) as WebGL2RenderingContext | null;

      if (!gl) {
        gl = (canvas.getContext("webgl", params) ||
          canvas.getContext("experimental-webgl", params)) as WebGL2RenderingContext | null;
      }

      if (!gl) return { gl: null, ext: null };

      const isWebGL2 = "drawBuffers" in gl;
      let supportLinearFiltering = false;
      let halfFloat = null;

      if (isWebGL2) {
        gl.getExtension("EXT_color_buffer_float");
        supportLinearFiltering = !!gl.getExtension("OES_texture_float_linear");
      } else {
        halfFloat = gl.getExtension("OES_texture_half_float");
        supportLinearFiltering = !!gl.getExtension("OES_texture_half_float_linear");
      }

      gl.clearColor(0, 0, 0, 1);

      const halfFloatTexType = isWebGL2
        ? (gl as WebGL2RenderingContext).HALF_FLOAT
        : (halfFloat && (halfFloat as any).HALF_FLOAT_OES) || 0;

      let formatRGBA: any;
      let formatRG: any;
      let formatR: any;

      if (isWebGL2) {
        formatRGBA = getSupportedFormat(gl, (gl as WebGL2RenderingContext).RGBA16F, gl.RGBA, halfFloatTexType);
        formatRG = getSupportedFormat(gl, (gl as WebGL2RenderingContext).RG16F, (gl as WebGL2RenderingContext).RG, halfFloatTexType);
        formatR = getSupportedFormat(gl, (gl as WebGL2RenderingContext).R16F, (gl as WebGL2RenderingContext).RED, halfFloatTexType);
      } else {
        formatRGBA = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
        formatRG = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
        formatR = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
      }

      return {
        gl,
        ext: { formatRGBA, formatRG, formatR, halfFloatTexType, supportLinearFiltering },
      };
    }

    function getSupportedFormat(
      gl: WebGLRenderingContext | WebGL2RenderingContext,
      internalFormat: number,
      format: number,
      type: number,
    ): { internalFormat: number; format: number } | null {
      if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
        if ("drawBuffers" in gl) {
          const gl2 = gl as WebGL2RenderingContext;
          switch (internalFormat) {
            case gl2.R16F: return getSupportedFormat(gl2, gl2.RG16F, gl2.RG, type);
            case gl2.RG16F: return getSupportedFormat(gl2, gl2.RGBA16F, gl2.RGBA, type);
            default: return null;
          }
        }
        return null;
      }
      return { internalFormat, format };
    }

    function supportRenderTextureFormat(
      gl: WebGLRenderingContext | WebGL2RenderingContext,
      internalFormat: number,
      format: number,
      type: number,
    ) {
      const texture = gl.createTexture();
      if (!texture) return false;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
      const fbo = gl.createFramebuffer();
      if (!fbo) return false;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
      return status === gl.FRAMEBUFFER_COMPLETE;
    }

    function addKeywords(source: string, keywords: string[] | null) {
      if (!keywords) return source;
      let keywordsString = "";
      for (const keyword of keywords) keywordsString += `#define ${keyword}\n`;
      return keywordsString + source;
    }

    function compileShader(type: number, source: string, keywords: string[] | null = null): WebGLShader | null {
      const shaderSource = addKeywords(source, keywords);
      const shader = gl!.createShader(type);
      if (!shader) return null;
      gl!.shaderSource(shader, shaderSource);
      gl!.compileShader(shader);
      return shader;
    }

    function createProgram(vertexShader: WebGLShader | null, fragmentShader: WebGLShader | null): WebGLProgram | null {
      if (!vertexShader || !fragmentShader) return null;
      const program = gl!.createProgram();
      if (!program) return null;
      gl!.attachShader(program, vertexShader);
      gl!.attachShader(program, fragmentShader);
      gl!.linkProgram(program);
      return program;
    }

    function getUniforms(program: WebGLProgram) {
      const uniforms: Record<string, WebGLUniformLocation | null> = {};
      const uniformCount = gl!.getProgramParameter(program, gl!.ACTIVE_UNIFORMS);
      for (let i = 0; i < uniformCount; i++) {
        const uniformInfo = gl!.getActiveUniform(program, i);
        if (uniformInfo) uniforms[uniformInfo.name] = gl!.getUniformLocation(program, uniformInfo.name);
      }
      return uniforms;
    }

    class Program {
      program: WebGLProgram | null;
      uniforms: Record<string, WebGLUniformLocation | null>;
      constructor(vertexShader: WebGLShader | null, fragmentShader: WebGLShader | null) {
        this.program = createProgram(vertexShader, fragmentShader);
        this.uniforms = this.program ? getUniforms(this.program) : {};
      }
      bind() { if (this.program) gl!.useProgram(this.program); }
    }

    class Material {
      vertexShader: WebGLShader | null;
      fragmentShaderSource: string;
      programs: Record<number, WebGLProgram | null> = {};
      activeProgram: WebGLProgram | null = null;
      uniforms: Record<string, WebGLUniformLocation | null> = {};
      constructor(vertexShader: WebGLShader | null, fragmentShaderSource: string) {
        this.vertexShader = vertexShader;
        this.fragmentShaderSource = fragmentShaderSource;
      }
      setKeywords(keywords: string[]) {
        let hash = 0;
        for (const kw of keywords) {
          for (let i = 0; i < kw.length; i++) hash = (hash << 5) - hash + kw.charCodeAt(i) | 0;
        }
        let program = this.programs[hash];
        if (program == null) {
          const fragmentShader = compileShader(gl!.FRAGMENT_SHADER, this.fragmentShaderSource, keywords);
          program = createProgram(this.vertexShader, fragmentShader);
          this.programs[hash] = program;
        }
        if (program === this.activeProgram) return;
        if (program) this.uniforms = getUniforms(program);
        this.activeProgram = program;
      }
      bind() { if (this.activeProgram) gl!.useProgram(this.activeProgram); }
    }

    const baseVertexShader = compileShader(gl.VERTEX_SHADER, `
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform vec2 texelSize;
      void main () {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `);

    const copyProgram = new Program(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      uniform sampler2D uTexture;
      void main () { gl_FragColor = texture2D(uTexture, vUv); }
    `));

    const clearProgram = new Program(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      uniform sampler2D uTexture;
      uniform float value;
      void main () { gl_FragColor = value * texture2D(uTexture, vUv); }
    `));

    const displayMaterial = new Material(baseVertexShader, `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uTexture;
      uniform vec2 texelSize;
      void main () {
          vec3 c = texture2D(uTexture, vUv).rgb;
          #ifdef SHADING
              vec3 lc = texture2D(uTexture, vL).rgb;
              vec3 rc = texture2D(uTexture, vR).rgb;
              vec3 tc = texture2D(uTexture, vT).rgb;
              vec3 bc = texture2D(uTexture, vB).rgb;
              float dx = length(rc) - length(lc);
              float dy = length(tc) - length(bc);
              vec3 n = normalize(vec3(dx, dy, length(texelSize)));
              c *= clamp(dot(n, vec3(0.0, 0.0, 1.0)) + 0.7, 0.7, 1.0);
          #endif
          gl_FragColor = vec4(c, max(c.r, max(c.g, c.b)));
      }
    `);

    const splatProgram = new Program(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uTarget;
      uniform float aspectRatio;
      uniform vec3 color;
      uniform vec2 point;
      uniform float radius;
      void main () {
          vec2 p = vUv - point.xy;
          p.x *= aspectRatio;
          vec3 splat = exp(-dot(p, p) / radius) * color;
          gl_FragColor = vec4(texture2D(uTarget, vUv).xyz + splat, 1.0);
      }
    `));

    const advectionProgram = new Program(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 texelSize;
      uniform vec2 dyeTexelSize;
      uniform float dt;
      uniform float dissipation;
      vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
          vec2 st = uv / tsize - 0.5;
          vec2 iuv = floor(st);
          vec2 fuv = fract(st);
          vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
          vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
          vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
          vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
          return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
      }
      void main () {
          #ifdef MANUAL_FILTERING
              vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
              vec4 result = bilerp(uSource, coord, dyeTexelSize);
          #else
              vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
              vec4 result = texture2D(uSource, coord);
          #endif
          gl_FragColor = result / (1.0 + dissipation * dt);
      }
    `, ext.supportLinearFiltering ? null : ["MANUAL_FILTERING"]));

    const divergenceProgram = new Program(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;
      void main () {
          float L = texture2D(uVelocity, vL).x;
          float R = texture2D(uVelocity, vR).x;
          float T = texture2D(uVelocity, vT).y;
          float B = texture2D(uVelocity, vB).y;
          vec2 C = texture2D(uVelocity, vUv).xy;
          if (vL.x < 0.0) L = -C.x;
          if (vR.x > 1.0) R = -C.x;
          if (vT.y > 1.0) T = -C.y;
          if (vB.y < 0.0) B = -C.y;
          gl_FragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
      }
    `));

    const curlProgram = new Program(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;
      void main () {
          float L = texture2D(uVelocity, vL).y;
          float R = texture2D(uVelocity, vR).y;
          float T = texture2D(uVelocity, vT).x;
          float B = texture2D(uVelocity, vB).x;
          gl_FragColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
      }
    `));

    const vorticityProgram = new Program(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;
      uniform sampler2D uCurl;
      uniform float curl;
      uniform float dt;
      void main () {
          float L = texture2D(uCurl, vL).x;
          float R = texture2D(uCurl, vR).x;
          float T = texture2D(uCurl, vT).x;
          float B = texture2D(uCurl, vB).x;
          float C = texture2D(uCurl, vUv).x;
          vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
          force /= length(force) + 0.0001;
          force *= curl * C;
          force.y *= -1.0;
          vec2 velocity = texture2D(uVelocity, vUv).xy + force * dt;
          gl_FragColor = vec4(min(max(velocity, -1000.0), 1000.0), 0.0, 1.0);
      }
    `));

    const pressureProgram = new Program(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uDivergence;
      void main () {
          float L = texture2D(uPressure, vL).x;
          float R = texture2D(uPressure, vR).x;
          float T = texture2D(uPressure, vT).x;
          float B = texture2D(uPressure, vB).x;
          float divergence = texture2D(uDivergence, vUv).x;
          gl_FragColor = vec4((L + R + B + T - divergence) * 0.25, 0.0, 0.0, 1.0);
      }
    `));

    const gradienSubtractProgram = new Program(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uVelocity;
      void main () {
          float L = texture2D(uPressure, vL).x;
          float R = texture2D(uPressure, vR).x;
          float T = texture2D(uPressure, vT).x;
          float B = texture2D(uPressure, vB).x;
          vec2 velocity = texture2D(uVelocity, vUv).xy - vec2(R - L, T - B);
          gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `));

    const blit = (() => {
      const buffer = gl!.createBuffer()!;
      gl!.bindBuffer(gl!.ARRAY_BUFFER, buffer);
      gl!.bufferData(gl!.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl!.STATIC_DRAW);
      const elemBuffer = gl!.createBuffer()!;
      gl!.bindBuffer(gl!.ELEMENT_ARRAY_BUFFER, elemBuffer);
      gl!.bufferData(gl!.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl!.STATIC_DRAW);
      gl!.vertexAttribPointer(0, 2, gl!.FLOAT, false, 0, 0);
      gl!.enableVertexAttribArray(0);
      return (target: FBO | null, doClear = false) => {
        if (!gl) return;
        if (!target) {
          gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
          gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        } else {
          gl.viewport(0, 0, target.width, target.height);
          gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
        }
        if (doClear) { gl.clearColor(0, 0, 0, 1); gl.clear(gl.COLOR_BUFFER_BIT); }
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
      };
    })();

    interface FBO {
      texture: WebGLTexture; fbo: WebGLFramebuffer; width: number; height: number;
      texelSizeX: number; texelSizeY: number; attach: (id: number) => number;
    }
    interface DoubleFBO {
      width: number; height: number; texelSizeX: number; texelSizeY: number;
      read: FBO; write: FBO; swap: () => void;
    }

    let dye: DoubleFBO, velocity: DoubleFBO, divergence: FBO, curl: FBO, pressure: DoubleFBO;

    function createFBO(w: number, h: number, internalFormat: number, format: number, type: number, param: number): FBO {
      gl!.activeTexture(gl!.TEXTURE0);
      const texture = gl!.createTexture()!;
      gl!.bindTexture(gl!.TEXTURE_2D, texture);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, param);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, param);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
      gl!.texImage2D(gl!.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);
      const fbo = gl!.createFramebuffer()!;
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, fbo);
      gl!.framebufferTexture2D(gl!.FRAMEBUFFER, gl!.COLOR_ATTACHMENT0, gl!.TEXTURE_2D, texture, 0);
      gl!.viewport(0, 0, w, h);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      return {
        texture, fbo, width: w, height: h, texelSizeX: 1/w, texelSizeY: 1/h,
        attach(id: number) { gl!.activeTexture(gl!.TEXTURE0 + id); gl!.bindTexture(gl!.TEXTURE_2D, texture); return id; }
      };
    }

    function createDoubleFBO(w: number, h: number, internalFormat: number, format: number, type: number, param: number): DoubleFBO {
      const fbo1 = createFBO(w, h, internalFormat, format, type, param);
      const fbo2 = createFBO(w, h, internalFormat, format, type, param);
      return { width: w, height: h, texelSizeX: fbo1.texelSizeX, texelSizeY: fbo1.texelSizeY, read: fbo1, write: fbo2, swap() { const tmp = this.read; this.read = this.write; this.write = tmp; } };
    }

    function initFramebuffers() {
      const simRes = getResolution(config.SIM_RESOLUTION);
      const dyeRes = getResolution(config.DYE_RESOLUTION);
      const texType = ext.halfFloatTexType, rgba = ext.formatRGBA, rg = ext.formatRG, r = ext.formatR;
      const filtering = ext.supportLinearFiltering ? gl!.LINEAR : gl!.NEAREST;
      gl!.disable(gl!.BLEND);
      dye = createDoubleFBO(dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering);
      velocity = createDoubleFBO(simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering);
      divergence = createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl!.NEAREST);
      curl = createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl!.NEAREST);
      pressure = createDoubleFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl!.NEAREST);
    }

    function getResolution(resolution: number) {
      const aspectRatio = gl!.drawingBufferWidth / gl!.drawingBufferHeight;
      const aspect = aspectRatio < 1 ? 1 / aspectRatio : aspectRatio;
      const min = Math.round(resolution), max = Math.round(resolution * aspect);
      return gl!.drawingBufferWidth > gl!.drawingBufferHeight ? { width: max, height: min } : { width: min, height: max };
    }

    function scaleByPixelRatio(input: number) { return Math.floor(input * (window.devicePixelRatio || 1)); }

    displayMaterial.setKeywords(config.SHADING ? ["SHADING"] : []);
    initFramebuffers();

    let lastUpdateTime = Date.now(), colorUpdateTimer = 0.0, rafId: number;
    function updateFrame() {
      const now = Date.now();
      const dt = Math.min((now - lastUpdateTime) / 1000, 0.016666);
      if (dt < 0.015) { rafId = requestAnimationFrame(updateFrame); return; } // Cap to ~60FPS
      lastUpdateTime = now;

      const width = scaleByPixelRatio(canvas!.clientWidth), height = scaleByPixelRatio(canvas!.clientHeight);
      if (canvas!.width !== width || canvas!.height !== height) { canvas!.width = width; canvas!.height = height; initFramebuffers(); }

      colorUpdateTimer += dt * config.COLOR_UPDATE_SPEED;
      if (colorUpdateTimer >= 1) { colorUpdateTimer = 0; pointers.forEach(p => p.color = generateColor()); }

      pointers.forEach(p => { if (p.moved) { p.moved = false; splatPointer(p); } });

      gl!.disable(gl!.BLEND);
      curlProgram.bind();
      gl!.uniform2f(curlProgram.uniforms.texelSize!, velocity.texelSizeX, velocity.texelSizeY);
      gl!.uniform1i(curlProgram.uniforms.uVelocity!, velocity.read.attach(0));
      blit(curl);
      vorticityProgram.bind();
      gl!.uniform2f(vorticityProgram.uniforms.texelSize!, velocity.texelSizeX, velocity.texelSizeY);
      gl!.uniform1i(vorticityProgram.uniforms.uVelocity!, velocity.read.attach(0));
      gl!.uniform1i(vorticityProgram.uniforms.uCurl!, curl.attach(1));
      gl!.uniform1f(vorticityProgram.uniforms.curl!, config.CURL);
      gl!.uniform1f(vorticityProgram.uniforms.dt!, dt);
      blit(velocity.write); velocity.swap();
      divergenceProgram.bind();
      gl!.uniform2f(divergenceProgram.uniforms.texelSize!, velocity.texelSizeX, velocity.texelSizeY);
      gl!.uniform1i(divergenceProgram.uniforms.uVelocity!, velocity.read.attach(0));
      blit(divergence);
      clearProgram.bind();
      gl!.uniform1i(clearProgram.uniforms.uTexture!, pressure.read.attach(0));
      gl!.uniform1f(clearProgram.uniforms.value!, config.PRESSURE);
      blit(pressure.write); pressure.swap();
      pressureProgram.bind();
      gl!.uniform2f(pressureProgram.uniforms.texelSize!, velocity.texelSizeX, velocity.texelSizeY);
      gl!.uniform1i(pressureProgram.uniforms.uDivergence!, divergence.attach(0));
      for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
        gl!.uniform1i(pressureProgram.uniforms.uPressure!, pressure.read.attach(1));
        blit(pressure.write); pressure.swap();
      }
      gradienSubtractProgram.bind();
      gl!.uniform2f(gradienSubtractProgram.uniforms.texelSize!, velocity.texelSizeX, velocity.texelSizeY);
      gl!.uniform1i(gradienSubtractProgram.uniforms.uPressure!, pressure.read.attach(0));
      gl!.uniform1i(gradienSubtractProgram.uniforms.uVelocity!, velocity.read.attach(1));
      blit(velocity.write); velocity.swap();
      advectionProgram.bind();
      gl!.uniform2f(advectionProgram.uniforms.texelSize!, velocity.texelSizeX, velocity.texelSizeY);
      if (!ext.supportLinearFiltering) gl!.uniform2f(advectionProgram.uniforms.dyeTexelSize!, velocity.texelSizeX, velocity.texelSizeY);
      const vId = velocity.read.attach(0);
      gl!.uniform1i(advectionProgram.uniforms.uVelocity!, vId);
      gl!.uniform1i(advectionProgram.uniforms.uSource!, vId);
      gl!.uniform1f(advectionProgram.uniforms.dt!, dt);
      gl!.uniform1f(advectionProgram.uniforms.dissipation!, config.VELOCITY_DISSIPATION);
      blit(velocity.write); velocity.swap();
      if (!ext.supportLinearFiltering) gl!.uniform2f(advectionProgram.uniforms.dyeTexelSize!, dye.texelSizeX, dye.texelSizeY);
      gl!.uniform1i(advectionProgram.uniforms.uVelocity!, velocity.read.attach(0));
      gl!.uniform1i(advectionProgram.uniforms.uSource!, dye.read.attach(1));
      gl!.uniform1f(advectionProgram.uniforms.dissipation!, config.DENSITY_DISSIPATION);
      blit(dye.write); dye.swap();
      gl!.blendFunc(gl!.ONE, gl!.ONE_MINUS_SRC_ALPHA);
      gl!.enable(gl!.BLEND);
      displayMaterial.bind();
      if (config.SHADING) gl!.uniform2f(displayMaterial.uniforms.texelSize!, 1/gl!.drawingBufferWidth, 1/gl!.drawingBufferHeight);
      gl!.uniform1i(displayMaterial.uniforms.uTexture!, dye.read.attach(0));
      blit(null, false);
      rafId = requestAnimationFrame(updateFrame);
    }

    function splatPointer(p: Pointer) { splat(p.texcoordX, p.texcoordY, p.deltaX * config.SPLAT_FORCE, p.deltaY * config.SPLAT_FORCE, p.color); }
    function splat(x: number, y: number, dx: number, dy: number, color: ColorRGB) {
      splatProgram.bind();
      gl!.uniform1i(splatProgram.uniforms.uTarget!, velocity.read.attach(0));
      gl!.uniform1f(splatProgram.uniforms.aspectRatio!, canvas!.width / canvas!.height);
      gl!.uniform2f(splatProgram.uniforms.point!, x, y);
      gl!.uniform3f(splatProgram.uniforms.color!, dx, dy, 0);
      let r = config.SPLAT_RADIUS / 100; if (canvas!.width / canvas!.height > 1) r *= canvas!.width / canvas!.height;
      gl!.uniform1f(splatProgram.uniforms.radius!, r);
      blit(velocity.write); velocity.swap();
      gl!.uniform1i(splatProgram.uniforms.uTarget!, dye.read.attach(0));
      gl!.uniform3f(splatProgram.uniforms.color!, color.r, color.g, color.b);
      blit(dye.write); dye.swap();
    }

    function updatePointerDownData(p: Pointer, id: number, posX: number, posY: number) {
      p.id = id; p.down = true; p.moved = false; p.texcoordX = posX / canvas!.width; p.texcoordY = 1 - posY / canvas!.height;
      p.prevTexcoordX = p.texcoordX; p.prevTexcoordY = p.texcoordY; p.deltaX = 0; p.deltaY = 0; p.color = generateColor();
    }
    function updatePointerMoveData(p: Pointer, posX: number, posY: number, color: ColorRGB) {
      p.prevTexcoordX = p.texcoordX; p.prevTexcoordY = p.texcoordY; p.texcoordX = posX / canvas!.width; p.texcoordY = 1 - posY / canvas!.height;
      let dx = p.texcoordX - p.prevTexcoordX, dy = p.texcoordY - p.prevTexcoordY, aspect = canvas!.width / canvas!.height;
      p.deltaX = aspect < 1 ? dx * aspect : dx; p.deltaY = aspect > 1 ? dy / aspect : dy;
      p.moved = Math.abs(p.deltaX) > 0 || Math.abs(p.deltaY) > 0; p.color = color;
    }

    function generateColor(): ColorRGB {
      const h = Math.random(), s = 1.0, v = 1.0, i = Math.floor(h * 6), f = h * 6 - i, p = v * (1 - s), q = v * (1 - f * s), t = v * (1 - (1 - f) * s);
      let r, g, b;
      switch (i % 6) {
        case 0: r = v; g = t; b = p; break; case 1: r = q; g = v; b = p; break; case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break; case 4: r = t; g = p; b = v; break; case 5: r = v; g = p; b = q; break;
      }
      return { r: r! * 0.15, g: g! * 0.15, b: b! * 0.15 };
    }

    const onMouseDown = (e: MouseEvent) => { const p = pointers[0]; updatePointerDownData(p, -1, scaleByPixelRatio(e.clientX), scaleByPixelRatio(e.clientY)); splat(p.texcoordX, p.texcoordY, 10*(Math.random()-0.5), 30*(Math.random()-0.5), {r:p.color.r*10, g:p.color.g*10, b:p.color.b*10}); };
    const onMouseMove = (e: MouseEvent) => { updatePointerMoveData(pointers[0], scaleByPixelRatio(e.clientX), scaleByPixelRatio(e.clientY), pointers[0].color); };
    const onTouchStart = (e: TouchEvent) => { for (let i = 0; i < e.targetTouches.length; i++) updatePointerDownData(pointers[0], e.targetTouches[i].identifier, scaleByPixelRatio(e.targetTouches[i].clientX), scaleByPixelRatio(e.targetTouches[i].clientY)); };
    const onTouchMove = (e: TouchEvent) => { for (let i = 0; i < e.targetTouches.length; i++) updatePointerMoveData(pointers[0], scaleByPixelRatio(e.targetTouches[i].clientX), scaleByPixelRatio(e.targetTouches[i].clientY), pointers[0].color); };
    const onTouchEnd = () => pointers[0].down = false;

    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);
    rafId = requestAnimationFrame(updateFrame);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [isEnabled, isAdminPage, isNotFoundPage, SIM_RESOLUTION, DYE_RESOLUTION, CAPTURE_RESOLUTION, DENSITY_DISSIPATION, VELOCITY_DISSIPATION, PRESSURE, PRESSURE_ITERATIONS, CURL, SPLAT_RADIUS, SPLAT_FORCE, SHADING, COLOR_UPDATE_SPEED, BACK_COLOR, TRANSPARENT]);

  if (!isMounted) return null;

  return (
    <div className="fixed top-0 left-0 z-[100] pointer-events-none w-full h-full">
      {isEnabled && !isAdminPage && !isNotFoundPage && (
        <canvas ref={canvasRef} id="fluid" className="w-screen h-screen block" />
      )}
    </div>
  );
}
