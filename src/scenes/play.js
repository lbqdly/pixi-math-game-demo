import * as PIXI from 'pixi.js'
import { Tween, Easing } from 'es6-tween'

function getIndex(len) {
    return Math.floor(len * Math.random())
}

export default class ScenePlay extends PIXI.Container {
    constructor(app) {
        super()
        this.name = 'scene-play'
        this.app = app

        const { resources } = app

        const bg = new PIXI.Sprite(resources['bg-play'].texture)
        this.addChild(bg)

        // 题目组成
        const questionList = window.QUESTION
        const index = getIndex(questionList.length)
        const { xName, math, yName , zName } = questionList[index]
        const spA = new PIXI.Sprite(resources[xName].texture)
        spA.position.set(10, 60)
        this.addChild(spA)

        const spMath = new PIXI.Sprite(resources[math].texture)
        spMath.position.set(90, 80)
        this.addChild(spMath)

        const spB = new PIXI.Sprite(resources[yName].texture)
        spB.position.set(140, 60)
        this.addChild(spB)
        
        const spDengyu = new PIXI.Sprite(resources['dengyu'].texture)
        spDengyu.position.set(220, 80)
        this.addChild(spDengyu)

        const spJieguo = new PIXI.Sprite(resources['box'].texture)
        spJieguo.position.set(260, 50)
        this.addChild(spJieguo)

        this.tips = new PIXI.Text('请拖动数字，完成作答吧~', { fontSize: 20, fill : 0xff1010 })
        this.tips.anchor.set(0.5)
        this.tips.position.set(window.innerWidth/2, window.innerHeight/2)
        this.addChild(this.tips)

        // 所有待选数字
        const nums = []
        ;(['n0', 'n1', 'n2', 'n3', 'n4', 'n5', 'n6', 'n7', 'n8', 'n9']).forEach((n, index) => {
            const spN = new PIXI.Sprite(resources[n].texture)
            if (index < 5) { spN.position.set(index * 72 + 8, 450) }
            else { spN.position.set((index - 5) * 72 + 8, 550) }
            
            this.addChild(spN)
            nums.push({ name: n, sp: spN, x: spN.x, y: spN.y })
        })
        
        const addRelease = ({ sp, x, y, name }) => {
            // // console.log(sp)
            app.tink.makeInteractive(sp)
            // 为备选数字添加拖动
            app.tink.makeDraggable(sp)
            sp.interactive = true
            // 添加释放监听
            sp.on('pointerup', () => {
                // // console.log('up :', name)
                if(app.bump.hit(sp, spJieguo)) {
                    // 判断答案是否正确
                    // console.log(name, 'b')
                    if (name === zName) {
                        // ✅
                        sp.position.set(spJieguo.x + 15, spJieguo.y + 12)
                        // console.log('hit:', name, 'c')
                        this.effcet(true)
                        // 为备选数字添加拖动
                        const arr = nums.map(el => el.sp)
                        app.tink.makeUndraggable(...arr)
                    } else {
                        // 错误
                        // ❎
                        // 缓动到原位
                        new Tween(sp).to({ x, y }, 300).easing(Easing.Quadratic.Out).start()
                        this.effcet(false)
                    }
                    // 结束
                    return
                }
                new Tween(sp).to({ x, y }, 300).easing(Easing.Quadratic.Out).start()
            })
        }

        // 批量添加释放事件
        nums.forEach(el => { addRelease(el) })
    }

    // 答题特效
    effcet(b) {
        // 
        const { resources } = this.app
        if (this.tips) { this.tips.destroy() }
        if (this.spEffcet) { this.spEffcet.destroy() }
        this.tips = new PIXI.Text(b ? '太棒了，回答正确！' : '不对噢，再想想！', { fontSize: 20, fill : 0xff1010 })
        this.addChild(this.tips)
        this.tips.anchor.set(0.5)
        this.tips.position.set(window.innerWidth/2, window.innerHeight/2)

        // 答案特效
        // 构建一个特效sp
        this.spEffcet = new PIXI.Sprite(resources[b? 'yes' : 'no'].texture)
        this.spEffcet.position.set(window.innerWidth/2, window.innerHeight/2 - 100)
        this.spEffcet.anchor.set(0.5, 0.5)
        this.addChild(this.spEffcet)
        new Tween({ scale: 0 })
        .to({ scale: 1 }, 300)
        .easing(Easing.Quadratic.Out)
        .on('update', data => {
            this.spEffcet.scale.set(data.scale, 1)
        })
        .start()

        new Tween({ alpha: 1 })
        .to({ alpha: 0 }, 500)
        .on('update', data => {
            if (!b) {
                this.tips.alpha = data.alpha
                this.spEffcet.alpha = data.alpha
            }
        })
        .on('complete', () => {
            if (b) {
                this.emit('scene-switch', { to: 'end' })
            }
        })
        .delay(1000)
        .start()
    }

}
