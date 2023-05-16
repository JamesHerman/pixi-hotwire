import { AnimatedSprite, FederatedPointerEvent, Container, Texture, TextureSource, Ticker} from "pixi.js";
import { Skill } from '../../static/structures/Skill'

export class Scene extends Container {
    private animatedClampy: AnimatedSprite;
    private clampyVelocity: number = 6;
    constructor() {
        super(); // Mandatory! This calls the superclass constructor.

        // see how members of the class need `this.`?
        let mining = new Skill()
        console.log(mining.getLevel())
        while (mining.getLevel() < 2) {
            console.log('Checking mining')
        mining.check({
            successRate: 0.55,
            level: 2,
            outcome: (result: boolean) => {
                if (result) {
                    console.log('the mining was a success, mining level: ' + mining.getLevel())
                }
                else {
                    console.log('The mining failed')
                }
            }
        })}


        // This is an array of strings, we need an array of Texture
        const clampyFrames: Array<TextureSource> = [
          "./clampies/walk_simplified_all_1.png",
          "./clampies/walk_simplified_all_2.png",
          "./clampies/walk_simplified_all_3.png",
          "./clampies/walk_simplified_all_4.png"
        ];
        

        // `array.map()` creates an array from another array by doing something to each element.
        // `(stringy) => Texture.from(stringy)` means
        // "A function that takes a string and returns a Texture.from(that String)"
        this.animatedClampy = new AnimatedSprite(clampyFrames.map((frame) => Texture.from(frame)));
        // (if this javascript is too much, you can do a simple for loop and create a new array with Texture.from())


        this.addChild(this.animatedClampy); // we just add it to the scene
        this.animatedClampy.loop = true;
        this.animatedClampy.animationSpeed = .1
        this.animatedClampy.play();
        this.animatedClampy.scale.set(1.55)
        this.animatedClampy.interactive = true;
        this.animatedClampy.anchor.set(.5)
        this.animatedClampy.y = 250

        this.animatedClampy.on("pointermove", (e: FederatedPointerEvent) =>  {
            this.clampyVelocity = (e.global.x - this.animatedClampy.x) /5
            this.animatedClampy.scale.set(this.clampyVelocity > 0 ? 1.55 : -1.55,1.55)
        })
        
        Ticker.shared.add(this.update, this);

        // Now... what did we learn about assigning functions...
        this.animatedClampy.onFrameChange = this.onClampyFrameChange.bind(this);
    }

    private update(deltaTime: number): void {
        this.animatedClampy.x = this.animatedClampy.x + this.clampyVelocity * deltaTime;

        if (this.animatedClampy.x > 2200) {
            // Woah there clampy, come back inside the screen!
            this.animatedClampy.x = -300;
        }
        if (this.animatedClampy.x < -300) {
            // Woah there clampy, come back inside the screen!
            this.animatedClampy.x = 2200;
        }
    }

    private onClampyFrameChange(currentFrame: any): void {
        console.log("Clampy's current frame is", currentFrame);
    }
}