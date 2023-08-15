const Discord = require('discord.js');
const { delay } = require(process.cwd() + '/utils.js');

module.exports = {
    name: "messageCreate",
    once: false,
    async run(Client, Message){
        try{

            // Check Message
            if(Message.author.bot) return;
            if(Message.guildId != Client.discordIDs.Guild) return;

            // Check the cannal is a commision
            let Server = Client.guilds.cache.get(Message.guildId);
            let Channel = Server.channels.cache.get(Message.channelId);
            if(!Channel.isThread()) return;
            if(Channel.parentId != Client.discordIDs.Forum.RequestModel.ID) return;
            if(!(Channel.appliedTags.find( Tag => Tag == Client.discordIDs.Forum.RequestModel.Tags.Paid))) return;
            if(Channel.ownerId == Message.author.id) return;

            // Check if have permission to write
            let isAllow = false;
            let Roles = Server.members.cache.get(Message.author.id).roles.cache;
            let RolesAllow = Client.discordIDs.Forum.RequestModel.ComissionAllow;
            for(let Allow of RolesAllow){
                if(Roles.find(Rol => Rol == Client.discordIDs.Roles[Allow])){
                    isAllow = true;
                    break;
                }
            }

            // Destroy message if not allow
            if(!isAllow) Message.delete();

        } catch(e) {
        
            // Oh no, dat error.
            console.log(e);
        
        } 
    }
}