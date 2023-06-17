export class Generator {
    private baseDistribution: ProbabilityDistribution;

    constructor(baseDistribution: ProbabilityDistribution) {
        this.baseDistribution = baseDistribution;
    }

    public Generate(context?: GenerationContext): any {
        let distribution = this.copyDistribution(this.baseDistribution);
        for (let option of distribution.options) {
            if (typeof option.conditions !== 'undefined') {
                for (let condition of option.conditions) {
                    option.probability = condition.condition(option.probability, context);
                }
            }
        }
        let sum = distribution.options.reduce((a,b) => a + b.probability, 0);
        let random = Math.random()*sum;
        for (let option of distribution.options) {
            if (random < option.probability) {
                return option.event;
            }
            random -= option.probability;
        }
        return distribution.options[distribution.options.length - 1].event;
    }

    private copyDistribution(distribution: ProbabilityDistribution): ProbabilityDistribution {
        let newDistribution: ProbabilityDistribution = {options: []};
        for (let option of distribution.options) {
            let newOption: Probability = {event: option.event, probability: option.probability, conditions: option.conditions};
            newDistribution.options.push(newOption);
        }
        return newDistribution;
    }
}

export interface GenerationContext {
    relatives: Relatives[],
}

export interface Relatives {
    relationship: string,
    relative: any,
}

export interface ProbabilityDistribution {
    options: Probability[],
}

export interface Condition {
    condition: (probability: number, context?: GenerationContext) => number,
}

export interface Probability {
    event: any,
    probability: number
    conditions?: Condition[],
}
