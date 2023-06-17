import { Container, Sprite, Ticker} from "pixi.js";
import { Cell } from "./MapCell";
import { Generator } from "../Generators/Generator";

export class Grid extends Container{
    private cells: { [key: number]: { [key: number]: Cell }};
    private nullCell = new Cell(-1,-1,this,new Sprite);
    private hoveredCell: Cell;
    private selectedCell: Cell;
    private spriteGenerator: Generator;
    private lastTouch: any;
    private followPointer = false;
    private desired = {
        x: 0,
        y: 0,
        scale: 1,
    }
    private type: string;
    constructor(width: number,height:number,type: 'hex' | 'square',scale:number, spriteGenerator: Generator) {
        super();
        this.sortableChildren = true;
        this.hoveredCell = this.nullCell;
        this.selectedCell = this.nullCell;
        this.cells = new Array<Array<Cell>>;
        this.type = type;
        this.desired.scale = scale;
        this.spriteGenerator = spriteGenerator;
        //console.log(width, height)
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let cell = new Cell(x,y,this,Sprite.from(
                    this.spriteGenerator.Generate({
                        relatives: this.getNeighbors(x,y).map(
                            (cell: Cell) => {
                                return {relationship: 'neighbor', relative: cell}
                            }
                        )})));
                this.cells[x]!==undefined ? this.cells[x][y] = cell : this.cells[x] = {[y] : cell};
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
        if (this.selectedCell.getNeighbors().length < (this.type == 'hex'? 6:4)) {
            this.generateNeighbors(this.selectedCell.getCoordinates().x,this.selectedCell.getCoordinates().y)
        }
    }

    public getSelectedCell(): Cell {
        return this.selectedCell;
    }

    public isFollowingPointer(): boolean {
        return this.followPointer;
    }

    public getCell(x: number, y: number):Cell {
        console.log(x,y)
        return(this.cells[x][y])
    }

    private generateNeighbors(x: number, y: number): void {
        console.log(x,y)
        if (!this.cells[x] || !this.cells[x][y+1]) {
            this.cells[x][y+1] = new Cell(x,y+1,this,Sprite.from(
                this.spriteGenerator.Generate({
                    relatives: this.getNeighbors(x,y+1).map(
                        (cell: Cell) => {
                            return {relationship: 'neighbor', relative: cell}
                        }
                    )})));
            this.addChild(this.cells[x][y+1]);
        }
        if (!this.cells[x] ||!this.cells[x][y-1]) {
            this.cells[x][y-1] = new Cell(x,y-1,this,Sprite.from(
                this.spriteGenerator.Generate({
                    relatives: this.getNeighbors(x,y-1).map(
                        (cell: Cell) => {
                            return {relationship: 'neighbor', relative: cell}
                        }
                    )})));
            this.addChild(this.cells[x][y-1]);
        }
        if (!this.cells[x-1] || !this.cells[x-1][y]) {
            let cell = new Cell(x-1,y,this,Sprite.from(
                this.spriteGenerator.Generate({
                    relatives: this.getNeighbors(x-1,y).map(
                        (cell: Cell) => {
                            return {relationship: 'neighbor', relative: cell}
                        }
                    )})));
            this.cells[x-1]!==undefined ? this.cells[x-1][y] = cell : this.cells[x-1] = {[y] : cell};
            this.addChild(this.cells[x-1][y]);
        }
        if (!this.cells[x+1] || !this.cells[x+1][y]) {
            let cell = new Cell(x+1,y,this,Sprite.from(
                this.spriteGenerator.Generate({
                    relatives: this.getNeighbors(x+1,y).map(
                        (cell: Cell) => {
                            return {relationship: 'neighbor', relative: cell}
                        }
                    )})));
            this.cells[x+1]!==undefined ? this.cells[x+1][y] = cell : this.cells[x+1] = {[y] : cell};
            this.addChild(this.cells[x+1][y]);
        }
        if (this.type == 'hex') {
            if (!this.cells[x-1] || !this.cells[x-1][y+1]) {
                let cell = new Cell(x-1,y+1,this,Sprite.from(
                    this.spriteGenerator.Generate({
                        relatives: this.getNeighbors(x-1,y+1).map(
                            (cell: Cell) => {
                                return {relationship: 'neighbor', relative: cell}
                            }
                        )})));
                this.cells[x-1]!==undefined ? this.cells[x-1][y+1] = cell : this.cells[x-1] = {[y-1] : cell};
                this.addChild(this.cells[x-1][y+1]);
            }
            if (!this.cells[x+1] || !this.cells[x+1][y-1]) {
                let cell = new Cell(x+1,y-1,this,Sprite.from(
                    this.spriteGenerator.Generate({
                        relatives: this.getNeighbors(x+1,y-1).map(
                            (cell: Cell) => {
                                return {relationship: 'neighbor', relative: cell}
                            }
                        )})));
                this.cells[x+1]!==undefined ? this.cells[x+1][y-1] = cell : this.cells[x+1] = {[y+1] : cell};
                this.addChild(this.cells[x+1][y-1]);
            }
        }
        


    }

    public getNeighbors(x: number, y: number):Cell[] {
        let neighbors:Cell[]  = new Array<Cell>();
        if (this.cells[x]!=undefined) {
            this.cells[x][y-1] ? neighbors.push(
                this.cells[x][y-1],
            ) : null;
            this.cells[x][y+1] ? neighbors.push(
                this.cells[x][y+1],
            ) : null;
        }
        (this.cells[x-1] && this.cells[x-1][y]) ? neighbors.push(
            this.cells[x-1][y],
        ) : null;
        (this.cells[x+1] && this.cells[x+1][y]) ? neighbors.push(
            this.cells[x+1][y],
        ) : null;

        if (this.type == 'hex') {
            (this.cells[x-1] && this.cells[x-1][y+1]) ? neighbors.push(
                this.cells[x-1][y+1],
            ) : null;
            (this.cells[x+1] && this.cells[x+1][y-1]) ? neighbors.push(
                this.cells[x+1][y-1],
            ) : null;
        }
        console.log(neighbors)
        return (neighbors)
    }
}