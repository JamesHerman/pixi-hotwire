export class Selector {
    private baseDistribution: ProbabilityDistribution;

    constructor(baseDistribution: ProbabilityDistribution) {
        this.baseDistribution = baseDistribution;
    }

    public select(context?: SelectionContext, number?: number): any {
        number = number || 1;

        //Make a copy of the base distribution
        let distribution = this.copyDistribution(this.baseDistribution);

        //Apply conditions to the distribution
        for (let option of distribution.options) {
            if (typeof option.conditions !== 'undefined') {
                for (let condition of option.conditions) {
                    option.probability = condition.condition(option.probability, context);
                }
            }
        }

        //Choose events from the distribution
        let events = this.choose(distribution, number);
        return events.length === 1 ? events[0] : events;

    }

    //Make a copy of a distribution
    private copyDistribution(distribution: ProbabilityDistribution): ProbabilityDistribution {
        let newDistribution: ProbabilityDistribution = {options: []};
        for (let option of distribution.options) {
            let newOption: Possibility = {event: option.event, probability: option.probability, conditions: option.conditions};
            newDistribution.options.push(newOption);
        }
        return newDistribution;
    }

    //Choose events from a distribution
    private choose(startDistribution: ProbabilityDistribution, number: number): any[] {
        let events: any[] = [];
        let distribution = this.copyDistribution(startDistribution);
        let sum = distribution.options.reduce((a,b) => a + b.probability, 0);
        while (events.length < number) {
            let random = Math.random()*sum;
            for (let option of distribution.options) {
                if (random < option.probability) {
                    sum -= option.probability;
                    events.push(option.event);
                    distribution.options.splice(distribution.options.indexOf(option),1)
                    break;
                }
                random -= option.probability;
            }
        }
        return events;
    }
}



export interface SelectionContext {
    relatives: Relatives[],
}

export interface Relatives {
    relationship: string,
    entity: any,
}

export interface ProbabilityDistribution {
    options: Possibility[],
}

export interface Possibility {
    event: any,
    probability: number
    conditions?: Condition[],
}

export interface Condition {
    condition: (probability: number, context?: SelectionContext) => number,
}

