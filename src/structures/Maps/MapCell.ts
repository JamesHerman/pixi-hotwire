import { Grid } from "./Grid";
import { Container, Graphics } from "pixi.js";

export class Cell extends Container {
    private map: Grid;
    private coordinates: {x:number,y:number}
    //private neighbors: Cell[];
//    private sprite: Sprite;
//    public tile: string;
    private outline: Graphics = new Graphics;
//    private selected: boolean;
    constructor (x: number,y: number,parent: Grid, type?: 'hex' | 'square') {
        super();
//        this.selected = false;
        this.map = parent;
        this.coordinates = {
            x: x,
            y: y 
        };
        this.zIndex = x + 2 * y;
        this.x = x * 1.5;
        console.log(type)
        if (type==='hex') {
            this.y = y * 0.866 + x*0.433 
            this.drawHex()
        } else {
            this.y = y * 1.5;
        }
        this.eventMode = "static"
        this.onpointertap = () => {
            this.map.setSelectedCell(this);
        }
        this.onpointerover = () => {
            this.outline.tint = 0x00FF00;
            this.map.setHoveredCell(this);
        }
        this.onpointerleave = () => {
            this.outline.tint = 0xFFFFFF;
        }
    }

    private drawHex() {
        this.outline.beginTextureFill({color: 0xFFFFFF});
        this.outline.fill.alpha = 0;
        this.outline.lineStyle({width:0.1,color: 0xFFFFFF})
        this.outline.drawPolygon([1,0,0.5,0.866,-0.5,0.866,-1,0,-0.5,-0.866,0.5,-0.866])
        //this.addChild(this.image);
        //this.addChild(this.outline);
    }

    public select(): void {
//        this.selected = true;
//        this.sprite.tint = 0xFFFF00;
    }

    public deselect(): void {
//        this.selected = false;
//        this.sprite.tint = 0xFFFFFF;
    } 

    public generateNeighbors() : void {
        this.map.generateNeighbors(this.coordinates.x,this.coordinates.y);
    }

    public getCoordinates() : {x:number,y:number} {
        return {x:this.coordinates.x,y:this.coordinates.y}
    }

    public getNeighbors(): Cell[] {
        return (this.map.getNeighbors(this.coordinates.x,this.coordinates.y))
    }
}