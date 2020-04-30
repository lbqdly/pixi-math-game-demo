
import * as PIXI from 'pixi.js'

export default class SceneCover extends PIXI.Container {
    constructor(app) {
        super()
        this.name = 'scene-cover'
        const { resources } = app

        const spBG0 = new PIXI.Sprite(resources['bg-cover'].texture)
        this.addChild(spBG0)
        
        const btnPlay = new PIXI.Sprite(resources['btn-start'].texture)
        btnPlay.x = window.innerWidth/2 - btnPlay.width/2
        btnPlay.y = window.innerHeight/2 - btnPlay.height/2
        // 点击前往play场景
        btnPlay.interactive = true
        btnPlay.on('pointertap', () => { 
            this.emit('scene-switch', { to: 'play' })
        })
        this.addChild(btnPlay)
    }
}
