import { Grid } from "./Grid";
import { Container, Graphics } from "pixi.js";

export class Cell extends Container {
    private map: Grid;
    private coordinates: {x:number,y:number}
    //private neighbors: Cell[];
    private image: Graphics;
    constructor (x: number,y: number,parent: Grid) {
        super();
        this.map = parent;
        this.coordinates = {
            x: x,
            y: y 
        };
        this.x = x * 1.5;
        this.y = y * 1.732 + x%2*0.866
        //console.log(this.x, this.y)
        this.image = new Graphics;
        this.drawHex()
        this.eventMode = "static"
        this.onpointertap = () => {
            this.changeColor()
        }
    }

    private drawHex() {
        this.image.beginTextureFill();
        this.image.lineStyle({width:0.1,color: 0x000000})
        this.image.drawPolygon([1,0,0.5,0.866,-0.5,0.866,-1,0,-0.5,-0.866,0.5,-0.866])
        this.image.tint = '#'+(0x1000000+Math.random()*0xffffff).toString(16).substr(1,6)
        this.addChild(this.image);
    }
    
    private changeColor(): void {
        this.image.tint = (this.image.tint == 0x000) ? '#'+(0x1000000+Math.random()*0xffffff).toString(16).substr(1,6) : 0x000
        for (let cell of this.getNeighbors()) {
            cell.image.tint = (cell.image.tint == 0x000) ? '#'+(0x1000000+Math.random()*0xffffff).toString(16).substr(1,6) : 0x000;
        }
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