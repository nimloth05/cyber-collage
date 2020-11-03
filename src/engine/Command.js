//* **************************************************
// C O M M A N D
//* **************************************************

export class Command {

}

export class Rule extends Command {
    constructor(conditions, actions) {
        super();
        this.conditions = conditions;
        this.actions = actions;
    }
}
