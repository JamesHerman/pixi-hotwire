import { Relatives } from "./Selector";

export class Place {
    public location: {x: number, y: number};
    public relatives: Relatives[];

    constructor(location?: {x: number, y: number}, relatives?: Relatives[]) {
        this.location = location || {x: 0, y: 0};
        this.relatives = relatives || [];
    }
}