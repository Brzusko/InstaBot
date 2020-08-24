
class Template {
    constructor(commandName, desc, args) {
        this.commandName = commandName;
        this.args = args;
        this.desc = desc;
    }

    toString(emMess = undefined) {

        if(emMess === undefined)
        {

            const message = {
                name: this.commandName,
                value: `Opis: ${this.desc}, lista argumentow:[${this.args}]`
            }
            return message;
        }

        emMess.addField(this.commandName, `**Opis**: ${this.desc} \n**lista argumentow**: [${this.args}]`);
    }
}

module.exports = Template;