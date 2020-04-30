
import * as PIXI from 'pixi.js'

export default class SceneInit extends PIXI.Container {
    constructor(texture) {
        super()
        this.name = 'scene-init'

        this.spLoading = new PIXI.Sprite(texture)
        this.addChild(this.spLoading)
        this.spLoading.anchor.set(0.5, 0.5)
        this.spLoading.position.set(window.innerWidth/2, window.innerHeight/2)
    }
    progress(num) {
        console.log(num)
    }

    loadStart(assets) {
        const loader = new PIXI.Loader()
        loader.add(assets.map(el => ({ name: el.name, url: el.url })))
        loader.on('progress', ld => { this.progress(ld.progress) })
        loader.load(() => this.emit('load-complete', { resources: loader.resources }))
    }
}
