import { Application, Container, Graphics, Text, Ticker } from "pixi.js"
import { HexNode, HexTree } from "../structures/Generators/HexTree"

export class HexTreeTest extends Container {
    private tree: HexTree;
    private lastTouch: any;
    private followPointer = false;
    private time = 0;
    private desired = {
        x: screen.availWidth/4,
        y: screen.availHeight/2,
        scale: 1,
        layer: 0,
    }
    private layers: [Container] = [new Container()];
    constructor(app: Application) {
        super()
        this.addChild(this.layers[0])
        this.x = app.screen.width/2;
        this.y = app.screen.height/2;
        this.tree = new HexTree()
        let hexSize = 40
        let minorHexSize = Math.sqrt(3)/2

        this.tree.onNodeCreate = (node) => {
            while (node.z > this.layers.length-1) {
                //add the new layer below existing layers
                this.addLayer()
            }
            let color = this.computeColor(node)
            node.data = {
                color: color,
                time: this.time,
            }      
            let hex = new Graphics()
            let zscale = hexSize * Math.pow((2*minorHexSize),(node.z))
            hex.beginTextureFill({color: 0xFFFFFF});
            hex.fill.alpha = 0.4;
            hex.lineStyle({width:0.1*hexSize/zscale,color: 0xFFFFFF})
            hex.drawPolygon([
                    1,0,
                    0.5,minorHexSize,
                    -0.5,minorHexSize,
                    -1,0,
                    -0.5,-minorHexSize,
                    0.5,-minorHexSize
                ])
            hex.scale.set(zscale)
            let orientation = node.z%2===0 ? 0 : 1
            hex.rotation = orientation * Math.PI/2
            hex.x = !orientation ? node.x * 1.5 *(zscale) : node.x * minorHexSize*(zscale)
            hex.y = !orientation ? node.y * (zscale) * minorHexSize: node.y * 1.5*(zscale)
            hex.tint = this.rgbToHex(color.r,color.g,color.b)
            this.layers[node.z].addChild(hex)
            node.data.hex = hex
            let hexText = new Text(`${color.r},${color.g},${color.b}`,{fill: 0xFFFFFF,})
            hexText.anchor.set(0.5)
            hexText.scale.set(0.5/zscale)
            hexText.rotation = -hex.rotation
            hexText.visible = false
            hex.addChild(hexText)
            hex.eventMode = "static"
            if(node.z==0){
                hex.on('pointerover',() => {
                node.addNeighborNodes()
                this.tree.updateNode(node.x,node.y,node.z)
            })}
            hex.on('pointertap',() => {
                this.tree.updateNode(node.x,node.y,node.z)
            })

        }

        this.tree.onNodeUpdate = (node) => {
            let hex = node.data.hex
            this.time++
            let deltaTime = this.time - node.data.time
            let color = this.computeColor(node, deltaTime)
            node.data.color = color
            hex.tint = this.rgbToHex(color.r,color.g,color.b)
            hex.children[0].text = `${color.r},${color.g},${color.b}`
        }

        this.tree.addNode(0,0,0)


        this.eventMode = 'dynamic';
        this.onpointerdown = () => {
            this.followPointer = true
        }
        this.ontouchstart = (e) => {
            this.lastTouch = e.nativeEvent as unknown as Touch;
            this.followPointer = true
        }
        this.ontouchmove = (e) => {
            this.lastTouch ? this.move((e.clientX - this.lastTouch.clientX),(e.clientY - this.lastTouch.clientY)) : null
            this.lastTouch = e.nativeEvent as unknown as Touch;
        }

        this.onpointermove = (e) => {
            this.followPointer ? this.move(e.movementX/2,e.movementY/2) : null;
        }

        this.onpointerup = () => {
            this.followPointer = false
        }
        this.onpointerupoutside = () => {
            this.followPointer = false
        }
        this.onwheel = (e) => {
            if (e.deltaY) {
                let scaleFactor = Math.pow(0.8,Math.sign(e.deltaY))
                this.desired.x = (this.desired.x - e.x) * scaleFactor + e.x;
                this.desired.y = (this.desired.y - e.y) * scaleFactor + e.y;
                this.desired.scale = this.desired.scale * (scaleFactor)
                //this.layers[this.desired.layer].visible = false;
                this.desired.layer += Math.sign(e.deltaY)
                if (this.desired.layer < 0) {
                    this.desired.layer = 0
                }
                if (this.desired.layer > this.layers.length-1) {
                    this.desired.layer = this.layers.length-1
                }
                //this.layers[this.desired.layer].visible = true;
            }
        }
        Ticker.shared.add(this.updatePosition,this)
        this.on('destroyed', () => {
            Ticker.shared.remove(this.updatePosition,this)
        })
        
    }

    private computeColor(node: HexNode,deltaTime?: number) {
        let deltaTimeFactor = deltaTime ? Math.pow(0.9,deltaTime) : 1
        let balance = {random: Math.random()*1, parent: 1, child: 1*deltaTimeFactor, base: 50}
        let weight = balance.random;
        let color = {
            r: Math.floor(Math.random()*255)*balance.random,
            g: Math.floor(Math.random()*255)*balance.random,
            b: Math.floor(Math.random()*255)*balance.random,
        }

        let children: HexNode[] = node.getChildren()
        let childAverage = {r: 0, g: 0, b: 0}
        let childWeight = 0
        if (children[0]) {
            children.forEach((child) => {
                let childParents = child.getParents()
                let childParentAverage = {r: 0, g: 0, b: 0}
                let childParentWeight = 0
                if (childParents[0]) {
                    childParents.forEach((childParent) => {
                        if (childParent.data&&childParent.data.color){
                            childParentAverage.r += childParent.data.color.r;
                            childParentAverage.g += childParent.data.color.g
                            childParentAverage.b += childParent.data.color.b
                            childParentWeight++
                        }
                    })
                    childParentAverage.r = childParentAverage.r/childParentWeight
                    childParentAverage.g = childParentAverage.g/childParentWeight
                    childParentAverage.b = childParentAverage.b/childParentWeight
                }
                childAverage.r += child.data.color.r*(childParents.length + 1) - childParentAverage.r*childParents.length;
                childAverage.g += child.data.color.g*(childParents.length + 1) - childParentAverage.g*childParents.length;
                childAverage.b += child.data.color.b*(childParents.length + 1) - childParentAverage.b*childParents.length;
                childWeight++
            })
            childAverage.r = childAverage.r/childWeight
            childAverage.g = childAverage.g/childWeight
            childAverage.b = childAverage.b/childWeight
            weight += balance.child*deltaTimeFactor
            color.r += childAverage.r*balance.child
            color.g += childAverage.g*balance.child
            color.b += childAverage.b*balance.child
        }

        let parents: HexNode[] = node.getParents()
        let parentAverage = {r: 0, g: 0, b: 0}
        let parentWeight = 0
        if (parents[0]) {
            parents.forEach((parent) => {
                let parentChildren = parent.getChildren()
                let parentChildAverage = {r: 0, g: 0, b: 0}
                let parentChildWeight = 0
                if (parentChildren[0]) {
                    parentChildren.forEach((parentChild) => {
                        if (parentChild.data&&parentChild.data.color){
                            parentChildAverage.r += parentChild.data.color.r;
                            parentChildAverage.g += parentChild.data.color.g
                            parentChildAverage.b += parentChild.data.color.b
                            parentChildWeight++
                        }
                    })
                    parentChildAverage.r = parentChildAverage.r/parentChildWeight
                    parentChildAverage.g = parentChildAverage.g/parentChildWeight
                    parentChildAverage.b = parentChildAverage.b/parentChildWeight
                }
                parentAverage.r += parent.data.color.r*(parentChildren.length + 1) - parentChildAverage.r*parentChildren.length;
                parentAverage.g += parent.data.color.g*(parentChildren.length + 1) - parentChildAverage.g*parentChildren.length;
                parentAverage.b += parent.data.color.b*(parentChildren.length + 1) - parentChildAverage.b*parentChildren.length;
                parentWeight++
            })
            parentAverage.r = parentAverage.r/parentWeight
            parentAverage.g = parentAverage.g/parentWeight
            parentAverage.b = parentAverage.b/parentWeight
            weight += balance.parent
            color.r += parentAverage.r*balance.parent
            color.g += parentAverage.g*balance.parent
            color.b += parentAverage.b*balance.parent
        }

        if (node.data&&node.data.color) {
            color.r += node.data.color.r*balance.base
            color.g += node.data.color.g*balance.base
            color.b += node.data.color.b*balance.base
            weight += balance.base
        }

        color.r = Math.min(Math.max(Math.floor(color.r/weight),0),255);
        color.g = Math.min(Math.max(Math.floor(color.g/weight),0),255);
        color.b = Math.min(Math.max(Math.floor(color.b/weight),0),255);

        return color
    }
                




    private addLayer() {
        let layer = new Container()
        this.addChild(layer)
        //layer.visible = false;
        //add the new layer below existing layers
        this.setChildIndex(layer,0)
        this.layers.push(layer)
    }
    private rgbToHex(r:number, g:number, b:number): string {
        return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
    }

    private move(x: number,y: number) {
        this.desired.x += x
        this.desired.y += y
    }

    private updatePosition() {
        this.x += (this.desired.x - this.x)
        this.y += (this.desired.y - this.y)
        this.scale.set(this.desired.scale)
    }

}