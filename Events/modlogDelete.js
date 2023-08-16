const { Events } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: Events.ChannelDelete,

    run(client, channel){
        const currentChannel = require('../JSON/modlog.json');

        if(channel.id != currentChannel.id) return;

        fs.writeFileSync(`${process.cwd()}/JSON/modlog.json`, '{}');
        console.log(`Modlog channel "${currentChannel.name}" was deleted`);
    }
}