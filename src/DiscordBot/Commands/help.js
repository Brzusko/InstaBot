
const Discord = require('discord.js');
const Template = require('./template/template.js');

class HelpCommand extends Template {

    constructor(commandName, desc, args, commands) {
        super(commandName, desc, args);
        this.commands = commands;
    }

    async Execute(channelToSendMessage, args = undefined) {
        const embendMess = new Discord.MessageEmbed();

        embendMess.setTitle("Lista moich rozkazów:")
        embendMess.setColor("BLUE")
        const iconUrl = channelToSendMessage.guild.iconURL();
        

        embendMess.setThumbnail(iconUrl);


        for(const key in this.commands){
            if(key == 'pomoc')
                continue;
            this.commands[key].toString(embendMess);
        }

        await channelToSendMessage.channel.send(embendMess);
    }

}

module.exports = HelpCommand;