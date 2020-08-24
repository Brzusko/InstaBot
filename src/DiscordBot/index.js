
const Discord = require('discord.js');
const Utils = require('./utils.js');
const path = require('path');
const utils = require('./utils.js');

const bot = new Discord.Client();
const helpCommand = require('./Commands/help');
const registerCommand = require('./Commands/register');
const template = require('./Commands/template/template');
const { changeMemberCountChannelName } = require('./utils.js');



const registredCommands = {

}

const server ={
    serverID: "",
    channelID: "",
    messageTemplate: ""
}

let serverMembers = 0;

//EventsHandlers
let onReset;
let onRegister;
//Loop Condition and interval

let isServerRegistred = false;
let botLoop;

bot.on('message', async msg =>{

    if(!msg.content.startsWith(process.env.PREFIX))
        return;

    const prefix = msg.content.split(process.env.PREFIX);

    const command = prefix[1].split(' ');

    const commandFlag = command.length > 1 ? "WITH_PARAMS" : "WITHOUT_PARAMS"

    if(!(command[0] in registredCommands))
    {
        await msg.channel.send(`Nie posiadam takiego rozkazu, sprawdź dostępne komendy na ${process.env.PREFIX}pomoc`);
    }
    else{
        if(commandFlag == "WITH_PARAMS")
        {
            const args = command.slice(1);
            await registredCommands[command[0]].Execute(msg, args);
        }
        else {
            await registredCommands[command[0]].Execute(msg);
        }
    }
})

bot.once('ready', async () =>{
    await utils.LoadServer(path.resolve(__dirname, './Commands/registredServer.json'), server);

    if(server.serverID != '')
        isServerRegistred = true;

    const _registerCommand = new registerCommand('Komenda Register', 'Komanda służy do rejestrowania bota na serverze', ['idKanalu', 'nazwaKanalu'], process.env.ADMIN_ID);

    onRegister = _registerCommand.events.on('serverRegistred', async () => {
        isServerRegistred = true;
    });

    onReset = _registerCommand.events.on('serverReseted', async () =>{
        isServerRegistred = false;
    });
    
    

    registredCommands['register']  = _registerCommand;
    registredCommands['pomoc'] = new helpCommand('Pomoc', 'Komenda, która służy do wyświetlania listy komend', [], registredCommands);

    

    botLoop = setInterval(async () => {
        if(isServerRegistred){
            await changeMemberCountChannelName(bot, server);
        }
    },  60000);
    
})

bot.login(process.env.DISCORD_TOKEN);