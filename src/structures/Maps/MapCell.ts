import { Grid } from "./Grid";
import { Container, Graphics, Polygon, Sprite } from "pixi.js";

export class Cell extends Container {
    private map: Grid;
    private coordinates: {x:number,y:number}
    //private neighbors: Cell[];
    private sprite: Sprite;
    public tile: string;
    private outline: Graphics = new Graphics;
    private selected: boolean;
    constructor (x: number,y: number,parent: Grid,sprite: Sprite) {
        super();
        this.tile = sprite.texture.textureCacheIds[0];
        this.selected = false;
        this.map = parent;
        this.coordinates = {
            x: x,
            y: y 
        };
        this.zIndex = x + 2 * y;
        this.x = x * 1.5;
        this.y = y * 0.866 + x*0.433
        this.drawHex()
        this.eventMode = "static"
        this.onpointertap = () => {
            console.log(this.coordinates)
            this.map.setSelectedCell(this);
        }
        this.onpointerover = () => {
            this.outline.tint = 0x00FF00;
            this.map.setHoveredCell(this);
        }
        this.onpointerleave = () => {
            this.outline.tint = 0xFFFFFF;
        }
        
        let scale = 0.0095;
        sprite.y = 1
        sprite.scale.set(scale);
        sprite.anchor.set(0.5,0.8)
        this.sprite = sprite;
        let hitArea = new Polygon([1,-0.64,0.5,-0.2,-0.5,-0.2,-1,-0.64,-0.5,-1.08,0.5,-1.08])
        for (let point in hitArea.points) {
            hitArea.points[point] /= scale;
        }

        this.sprite.hitArea = hitArea;
        this.addChild(sprite);
        this.selected;
    }

    private drawHex() {
        this.outline.beginTextureFill();
        this.outline.fill.alpha = 0;
        this.outline.lineStyle({width:0.1,color: 0xFFFFFF})
        this.outline.drawPolygon([1,0,0.5,0.866,-0.5,0.866,-1,0,-0.5,-0.866,0.5,-0.866])
        //this.addChild(this.image);
        //this.addChild(this.outline);
    }

    public select(): void {
        this.selected = true;
        console.log(this.getCoordinates());
    }

    public deselect(): void {
        this.selected = false;
    }

    public getCoordinates() : {x:number,y:number} {
        return {x:this.coordinates.x,y:this.coordinates.y}
    }

    public getNeighbors(): Cell[] {
        return (this.map.getNeighbors(this.coordinates.x,this.coordinates.y))
    }
}