require('dotenv').config();
const express = require('express');
const child_process = require('child_process');
const path = require('path');

const childProcesses = [];

const mainServer = express();

const port = process.env.PORT || 3030


mainServer.listen(port, async () => {
    const discordModulePath = path.resolve('./src/DiscordBot', 'index.js');
    const discordProcess = child_process.fork(discordModulePath, {
        env: process.env
    });
    console.log('Main server is up');
});