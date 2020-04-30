import 'normalize.css'
import './style.css'

import * as PIXI from 'pixi.js'
import Tink from './utils/tink'
import Bump from './utils/bump'
import imgLoading from './loading.png'
import SceneInit from './scenes/init'
import SceneCover from './scenes/cover'
import { Tween, update as tweenUpdate, Easing } from 'es6-tween'
import ScenePlay from './scenes/play'
import SceneEnd from './scenes/end'

// PIXI.utils.sayHello()

const app = new PIXI.Application()
app.tink = new Tink(PIXI, app.view)
app.bump = new Bump(PIXI)
app.renderer.backgroundColor = 0xffffff;
app.renderer.view.style.position = "absolute"
app.renderer.view.style.display = "block"
app.renderer.autoResize = true
app.renderer.resize(window.innerWidth, window.innerHeight)
document.body.appendChild(app.view)

let state = () => {}
function gameLoop(delta) {
    app.tink.update()
    tweenUpdate()
    state(delta)
}
app.ticker.add(delta => gameLoop(delta))

// 进度条
PIXI.Loader.shared.add(imgLoading).load((loader, resources) => {
    // 场景容器
    const texture = resources[imgLoading].texture
    const sceneInit = new SceneInit(texture)
    app.stage.addChild(sceneInit)
    sceneInit.on('load-complete', ({ resources }) => {
        app.resources = resources
        gameStart()
    })
    sceneInit.loadStart(window.ASSET_LIST)
})

// 场景列表
app.sceneList = []
function gameStart() {
   switchScene('cover')
}

// 切换场景
function switchScene(to) {
    console.log(to, 't0000d0')
    app.stage.removeChildren()
    if (to === 'cover') {
        const sceneCover = new SceneCover(app)
        app.stage.addChild(sceneCover)
        sceneCover.on('scene-switch', data => switchScene(data.to))
    } else if (to === 'end') {
        const sceneEnd = new SceneEnd(app)
        app.stage.addChild(sceneEnd)
        sceneEnd.on('scene-switch', data => switchScene(data.to))
    } else if (to === 'play') {
        const scenePlay = new ScenePlay(app)
        app.stage.addChild(scenePlay)
        scenePlay.on('scene-switch', data => switchScene(data.to))
    }
}

// function init() {
//     // 创建资源加载器
//     const assetsLoader = new PIXI.Loader()
//     const assetList = window.ASSET_LIST
//     // console.log(window, 222)
//     assetsLoader.add(assetList.map(el => ({ name: el.name, url: el.url })))
//     assetsLoader.on('progress', ld => { console.log(ld.progress) })
//     assetsLoader.load(() => {
//         // 素材加载完成
//         createCoverScene(assetsLoader)
//         // 构建内容元素
//         createPlayScene(assetsLoader)
//         // 构建结束场景
//         createEndScene(assetsLoader)
//         // 切换到封面场景
//         switchScene('scene-cover')
//     })
// }

