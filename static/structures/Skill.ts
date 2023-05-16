export class Skill {
    private experience: number;
    private level: number;

    constructor() {
        this.experience = 0;
        this.level = 1;
        //console.log('Skill created')
    }

    public check(
        challenge: {
            successRate: number; 
            level: number; 
            outcome: (result: boolean) => void
        }        
    ) {
        let result: boolean;
        let numberOfTries = 1 + this.level - challenge.level
        let failureRate = Math.pow((1 - challenge.successRate),numberOfTries)
        let roll = Math.random();
        if (challenge.level <= this.level) {
            result = roll > failureRate
        }
        //Consecutive successes required to succeed challenges above current level
        else {
            result = roll < (Math.pow(challenge.successRate,(challenge.level - this.level)))
        }
        //console.log('Roll:' + roll + ' failureRate: ' + failureRate + ' result:' + result + ' Tries: ' + numberOfTries + ' Level: ' + this.level)
        if (result) {
            let experience = Math.max(challenge.level-this.level+1,0);
            this.gainExperience(experience)
            challenge.outcome(result)
        }
    }

    private gainExperience(amount: number) {
        this.experience += amount;
        //console.log('Gained ' + amount + ' experience')
        while (this.experience >= 10) {
            //console.log('Level up')
            this.level += 1;
            this.experience -= 10;
        }
    }

    public getLevel() {
        return this.level;
    }
}