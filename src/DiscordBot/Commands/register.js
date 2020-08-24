const Template = require('./template/template');
const Discord = require('discord.js');
const path = require('path');
const events = require('events');

const fsp = require('fs').promises;

const dataPath = path.resolve(__dirname, 'registredServer.json');

class RegisterCommand extends Template {
    constructor(commandName, desc, args, adminID) {
        super(commandName, desc, args);
        this.registredServer;
        this.adminID = adminID;
        this.events = new events.EventEmitter();
    }
//bot, channelId, channelName, guildRef, channelToSendBac
//ma ladowac z pliku zarejestrowany server
    async Execute(channelToSendBack, args = undefined) {

        if(args[0] == "reset"){
            if(await this.PruneServer(channelToSendBack.author.id))
            {
                this.events.emit('serverReseted');
                await channelToSendBack.channel.send('Pomyślnie usunięto ten server z listy zarejestrowanych!');
                return;
            }
            else 
            {
                await channelToSendBack.channel.send('Nie jesteś moim właścicielem, albo wystąpił problem z obsługą plików!');
                return;
            }
        }


        if(args.length < 2) {
            await channelToSendBack.channel.send('Podałeś/aś za mało argumentów.');
            return;
        }

        await this.LoadServer();

        if(this.registredServer.serverID != '')
        {
            await channelToSendBack.channel.send('Zostałam już przypisana do jakiegoś serwera 🤷‍♀️');
            return;
        }        

        this.registredServer.serverID = channelToSendBack.guild.id;
        this.registredServer.channelID = args[0];
        this.registredServer.messageTemplate = args[1];

        this.events.emit('serverRegistred');

        await this.SaveServer();
        await channelToSendBack.channel.send('Pomyślnie zapisałam ten serwer oneee chan');
        

    }

    async LoadServer() {
        let file;
        try {
            file = await fsp.open(dataPath, 'r');
            const fileData = await file.readFile({encoding:'utf-8'});
            const parsedData = JSON.parse(fileData);
            this.registredServer = parsedData;
        } finally {
            if(file != undefined)
                await file.close();
        }
    }

    async SaveServer() {
        if(this.registredServer == undefined)
            return;
        try {
            await fsp.writeFile(dataPath, JSON.stringify(this.registredServer, 0, 2));
        } catch (err) {}
    }

    async PruneServer(userIDwhoSendMessage) {
        console.log(this.adminID);
        console.log(userIDwhoSendMessage)
        if(userIDwhoSendMessage != this.adminID)
            return false;
        
            const clearData = {
                "serverID": "",
                "channelID": "",
                "messageTemplate": ""
            }

            let errorDidntAppear = true;

            try {
                await fsp.writeFile(dataPath, JSON.stringify(clearData, 0, 2));
            } catch (err) {
                errorAppeared = true;
                console.log(err);
            }

            return errorDidntAppear;
        
    }   

}

module.exports = RegisterCommand;