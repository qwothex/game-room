import {WebGLRenderTarget} from 'three'
import {SRGBColorSpace} from 'three'

export const crossRenderTarget = new WebGLRenderTarget(1024, 1024)
crossRenderTarget.texture.colorSpace = SRGBColorSpace;