
import * as PIXI from 'pixi.js'

export default class SceneEnd extends PIXI.Container {
    constructor(app) {
        super()
        this.name = 'scene-end'

        const { resources } = app

        const spBG2 = new PIXI.Sprite(resources['bg-end'].texture)
        this.addChild(spBG2)
        
        const btnReplay = new PIXI.Sprite(resources['btn-replay'].texture)
        btnReplay.anchor.set(0.5, 0.5)
        btnReplay.position.set(window.innerWidth/2, window.innerHeight/2)
        btnReplay.interactive = true
        this.addChild(btnReplay)

        btnReplay.on('pointertap', () => { this.emit('scene-switch', { to: 'cover' }) })
    }
}
