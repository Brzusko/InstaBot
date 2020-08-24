const fsp = require('fs').promises;
const path = require('path');

const registerCommands = async (pathToCommands) => {
    const commands = {};

    const commandsDirectory = await fsp.readdir(pathToCommands, {withFileTypes: true});

    for await(const dirent of commandsDirectory){
        if(dirent.name.endsWith('.js')) {
            const modulePath = path.resolve(pathToCommands, dirent.name);
            const commandModule = require(modulePath);
        }
    }
};

const changeMemberCountChannelName = async (bot, serverInfo) => {
    if(serverInfo.serverID == '')
        return;
    
    const registredGuild = await bot.guilds.cache.filter(guild => guild.id == serverInfo.serverID).array();
    
    if(registredGuild[0].name == undefined)
        return;
    
    const channelToChange = registredGuild[0].channels.cache.filter(channel => channel.id == serverInfo.channelID).array();

    const newChannelName = `${serverInfo.messageTemplate}-${registredGuild[0].memberCount}`;

    await channelToChange[0].setName(newChannelName);
}

const LoadServer = async (pathToResource, serverToLoad) => {
    let file;
    try {
        file = await fsp.open(pathToResource, 'r');
        const fileData = await file.readFile({encoding:'utf-8'});
        const parsedData = JSON.parse(fileData);
        
        serverToLoad.serverID = parsedData.serverID;
        serverToLoad.channelID = parsedData.channelID;
        serverToLoad.messageTemplate = parsedData.messageTemplate;

    } finally {
        if(file != undefined)
            await file.close();
    }
} 


module.exports = {
    registerCommands,
    LoadServer,
    changeMemberCountChannelName
}