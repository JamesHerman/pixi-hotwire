import { Grid } from "./Grid";
import { Graphics } from "pixi.js";

export class Cell {
    private x: number;
    private y: number;
    private parent: Grid;
    //private neighbors: Cell[];
    private image: Graphics;
    constructor (x: number,y: number,parent: Grid) {
        this.x = x;
        this.y = y;
        this.parent = parent;
        //this.neighbors = this.parent.getNeighbors(this.x,this.y);
        this.image = new Graphics;
        this.image.beginTextureFill();
        this.image.lineStyle({width:0.1,color: 0x000000})
        this.image.drawPolygon([1,0,0.5,0.866,-0.5,0.866,-1,0,-0.5,-0.866,0.5,-0.866])
        this.image.x = x * 1.5;
        this.image.y = y * 1.732 + x%2*0.866
        this.image.eventMode = 'dynamic'
        this.image.onpointertap = (e) => {
            if (!e.movement.x && !e.movementY){
                this.image.tint = (this.image.tint == 0x000) ? 0xffffff : 0x000
                for (let cell of this.getNeighbors()) {
                    cell.image.tint = (cell.image.tint == 0x000) ? 0xffffff : 0x000;
                }
            }
        }
    }
    


    public getCoordinates() {
        return (this.x,this.y)
    }

    public getImage(): Graphics {
        return this.image
    }

    public getNeighbors(): Cell[] {
        return (this.parent.getNeighbors(this.x,this.y))
    }
}