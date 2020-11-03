//***************************************************
// C O M M A N D
//***************************************************

class Command {

}

class Rule extends Command {
    constructor(conditions, actions) {
        super();
        this.conditions = conditions;
        this.actions = actions;
    }

}
