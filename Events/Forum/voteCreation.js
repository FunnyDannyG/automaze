const Discord = require('discord.js');
const { delay } = require(process.cwd() + '/utils.js');

module.exports = {
    name: "threadCreate",
    once: false,
    async run(Client, Threader, newlyCreated){
        try{

            // Channels needed
            let Forums = {
                [Client.discordIDs.Forum.Suggestions] : "Vote for this suggestion!",
                [Client.discordIDs.Forum.TaskSTAFF] : "Vote for this Task!"
            }

            // Check is a Request Forum
            if(!newlyCreated) return;
            if(Threader.guildId != Client.discordIDs.Guild) return;
            if(!Forums[Threader.parentId]) return;

            // Votation Embed
            const voteEmbed = new Discord.EmbedBuilder()
                .setTitle(Forums[Threader.parentId])
                .setColor(`Yellow`);

            // Check if exists the channel
            await delay(2000);
            if(!(await Threader.guild.channels.cache.get(Threader.id))) return;

            // Create reactions
            const Message = await Threader.send({ embeds: [voteEmbed] })
            await Promise.all([
                Message.react(`🔼`),
                Message.react(`🔽`)
            ]);

        } catch(e) {
        
            // Oh no, dat error.
            console.log(e);
        
        } 
    }
}