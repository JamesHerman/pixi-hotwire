import { Container, Sprite, Ticker} from "pixi.js";
import { Cell } from "./MapCell";
import { SpriteGenerator } from "../Generators/SpriteGenerator";

export class Grid extends Container{
    private cells: Cell[][];
    private nullCell = new Cell(-1,-1,this,new Sprite);
    private hoveredCell: Cell;
    private selectedCell: Cell;
    private lastTouch: any;
    private followPointer = false;
    private desired = {
        x: 0,
        y: 0,
        scale: 1,
    }
    private type: string;
    constructor(width: number,height:number,type: 'hex' | 'square',scale:number, spriteGenerator: SpriteGenerator) {
        super();
        this.hoveredCell = this.nullCell;
        this.selectedCell = this.nullCell;
        this.cells = new Array<Array<Cell>>;
        this.type = type;
        this.desired.scale = scale;
        //console.log(width, height)
        for (let x = 0; x < width; x++) {
            let column:Cell[] = new Array<Cell>();
            this.cells.push(column);
        }
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x+=2) {
                this.cells[x].push(new Cell(x,y,this,spriteGenerator.Generate()));
                this.addChild(this.cells[x][y]);
            }
            for (let x = 1; x < width; x+=2) {
                this.cells[x].push(new Cell(x,y,this,spriteGenerator.Generate()));
                this.addChild(this.cells[x][y]);
            }
        }
        this.eventMode = 'dynamic';
        this.onpointerdown = () => {
            this.followPointer = true
        }
        this.ontouchstart = (e) => {
            console.log(e)
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
            }
        }
        Ticker.shared.add(this.updatePosition,this)
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

    public setHoveredCell(cell: Cell) {
        this.hoveredCell = cell;
    }

    public getHoveredCell(): Cell {
        return this.hoveredCell;
    }

    public setSelectedCell(cell: Cell) {
        this.selectedCell.deselect();
        this.selectedCell = cell;
        this.selectedCell.select();
    }

    public getSelectedCell(): Cell {
        return this.selectedCell;
    }

    public isFollowingPointer(): boolean {
        return this.followPointer;
    }

    public getCell(x: number, y: number):Cell {
        return(this.cells[x][y])
    }

    public getNeighbors(x: number, y: number):Cell[] {
        let neighbors:Cell[]  = new Array<Cell>();
        (y > 0) ? neighbors.push(
            this.cells[x][y-1],
        ) : null;
        (y + 1 < this.cells[0].length) ? neighbors.push(
            this.cells[x][y+1],
        ) : null;
        (x > 0) ? neighbors.push(
            this.cells[x-1][y],
        ) : null;
        //console.log(this.cells.length);
        //console.log("x: ",x);
        //console.log("y: ",y);
        (x + 1 < this.cells.length) ? neighbors.push(
            this.cells[x+1][y],
        ) : null;

        if (this.type == 'hex') {
            let shiftY = (x%2) ? y + 1 : y + -1;
            //console.log("shifty: ",shiftY);
            (x > 0 && 0 <= shiftY && shiftY < this.cells[0].length) ? neighbors.push(
                this.cells[x-1][shiftY],
            ) : null;
            (x + 1 < this.cells.length && 0 <= shiftY && shiftY < this.cells[0].length) ? neighbors.push(
                this.cells[x+1][shiftY],
            ) : null;
        }        
        return (neighbors)
    }
}