const Discord = require(`discord.js`);
const fs = require('fs');

module.exports.run = async (client, deletedThread) => {
    const validation = () => {
        if (deletedThread.parentId !== '1099149801054019604' || deletedThread.parent.type !== Discord.ChannelType.GuildForum) {
            return 'invalid';
        }

        return 'valid';
    }

    const status = validation();

    if (status === 'valid') {
        let parsedArray = require(`../JSON/models.json`);

        if (parsedArray.filter(i => i.title === deletedThread.name).length) { 
            parsedArray = parsedArray.filter(i => i.title !== deletedThread.name);
            fs.writeFileSync(`${process.cwd()}/JSON/models.json`, JSON.stringify(parsedArray));
            client.modelSearchEngine.discard(parsedArray.filter(i => i.title === deletedThread.name)[0]);
        }
    }
}