import { Grid } from "./Grid";
import { Container, Graphics, Polygon, Sprite } from "pixi.js";

export class Cell extends Container {
    private map: Grid;
    private coordinates: {x:number,y:number}
    //private neighbors: Cell[];
    private sprite: Sprite;
    private image: Graphics;
    private outline: Graphics = new Graphics;
    private selected: boolean;
    constructor (x: number,y: number,parent: Grid,sprite: Sprite) {
        super();
        this.image = new Graphics;
        this.selected = false;
        this.map = parent;
        this.coordinates = {
            x: x,
            y: y 
        };
        this.x = x * 1.5;
        this.y = y * 0.866 + x%2*0.433
        //console.log(this.x, this.y)
        this.drawHex()
        this.eventMode = "static"
        this.onpointertap = () => {
            this.map.setSelectedCell(this);
        }
        this.onpointerover = () => {
            this.outline.tint = 0x00FF00;
            this.zIndex = 1;
            this.map.setHoveredCell(this);
        }
        this.onpointerleave = () => {
            this.outline.tint = 0xFFFFFF;
            this.zIndex = 0;
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
        this.image.beginTextureFill();
        this.image.lineStyle({width:0.1,color: 0x000000})
        this.image.drawPolygon([1,0,0.5,0.866,-0.5,0.866,-1,0,-0.5,-0.866,0.5,-0.866])
        this.image.tint = '#'+(0x1000000+Math.random()*0xffffff).toString(16).substr(1,6)
        this.outline.beginTextureFill();
        this.outline.fill.alpha = 0;
        this.outline.lineStyle({width:0.1,color: 0xFFFFFF})
        this.outline.drawPolygon([1,0,0.5,0.866,-0.5,0.866,-1,0,-0.5,-0.866,0.5,-0.866])
        //this.addChild(this.image);
        //this.addChild(this.outline);
    }

    public select(): void {
        this.selected = true;
        this.sprite.tint = 0x000;
    }

    public deselect(): void {
        this.selected = false;
        this.sprite.tint = '#'+(0x1000000+Math.random()*0xffffff).toString(16).substr(1,6);
    }

    public getCoordinates() {
        return (this.x,this.y)
    }

    public getImage(): Graphics {
        return this.image
    }

    public getNeighbors(): Cell[] {
        return (this.map.getNeighbors(this.coordinates.x,this.coordinates.y))
    }
}