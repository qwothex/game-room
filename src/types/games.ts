import * as THREE from 'three'

const games = ['digdug', 'crosstheroad', 'doom', 'donkeykong', 'sleep', 'off'] as const

export type GamesType = typeof games[number]

export interface GameModule {
  scene: THREE.Scene
  camera: THREE.Camera
  renderTarget: THREE.WebGLRenderTarget
  update?: (delta: number) => void
//   reset?: () => void
//   dispose?: () => void
}
