import {PCFSoftShadowMap, WebGLRenderer} from 'three'

export const renderer = new WebGLRenderer({ alpha: true, powerPreference: "high-performance", antialias: true });
    renderer.setClearColor(0x000000, 0)
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = PCFSoftShadowMap;