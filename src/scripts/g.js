import Engine from './engine'

import { Canvas, CanvasEvent, Group, Rect } from '@antv/g'
import { Renderer as CanvasRenderer } from '@antv/g-canvas'

class G extends Engine {
  constructor() {
    super()

    const container = document.createElement('div')
    this.content.appendChild(container)
    this.app = new Canvas({
      container: container,
      width: this.width,
      height: this.height,
      renderer: new CanvasRenderer(),
    })
    this.rects = []
    this.root = new Group()

    this.app.addEventListener(CanvasEvent.READY, () => {
      this.app.appendChild(this.root)
    })
  }

  onTick() {
    const rectsToRemove = []

    for (let i = 0; i < this.count.value; i++) {
      const rect = this.rects[i]
      rect.x -= rect.speed
      rect.el.style.x = rect.x
      if (rect.x + rect.size < 0) rectsToRemove.push(i)
    }

    rectsToRemove.forEach((i) => {
      this.rects[i].x = this.width + this.rects[i].size / 2
    })

    this.meter.tick()
  }

  render() {
    this.app.removeEventListener(CanvasEvent.AFTER_RENDER)
    this.root.removeChildren()
    this.rects = []
    for (let i = 0; i < this.count.value; i++) {
      const x = Math.random() * this.width
      const y = Math.random() * this.height
      const size = 10 + Math.random() * 40
      const speed = 1 + Math.random()

      const rect = new Rect({
        style: {
          x,
          y,
          width: size,
          height: size,
          fill: 'white',
          stroke: 'black',
        },
      })
      this.root.appendChild(rect)
      this.rects[i] = { x, y, size, speed, el: rect }
    }

    this.app.addEventListener(CanvasEvent.AFTER_RENDER, () => this.onTick())
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const engine = new G()
  engine.render()
})
