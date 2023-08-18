const Discord = require('discord.js');
const { delay } = require(process.cwd() + '/utils.js');

module.exports = {
    name: "threadCreate",
    once: false,
    async run(Client, Threader, newlyCreated){
        try{

            // Check is a Request Forum
            if(!newlyCreated) return;
            if(Threader.guildId != Client.discordIDs.Guild) return;
            if(Threader.parentId != Client.discordIDs.Forum.RequestModel.ID) return;
            if(!(Threader.appliedTags.find( Tag => Tag == Client.discordIDs.Forum.RequestModel.Tags.Paid))) return;

            // Check if exists the channel
            await delay(2000);
            if(!(await Threader.guild.channels.cache.get(Threader.id))) return;

            // Create tags message
            let MessageRoles = "(";
            for(let RolName of Client.discordIDs.Forum.RequestModel.ComissionAllow){
                MessageRoles += "<@&" + Client.discordIDs.Roles[RolName] + ">, ";
            }
            MessageRoles = MessageRoles.slice(0, -2) + ")";

            // Create message Embed
            let MessageEmbed = new Discord.EmbedBuilder()
                .setDescription(
                    "Hello! <@" + Threader.ownerId +">\n" +
                    "I've noticed that you've created a commission.\n" +
                    "**Commissions are paid**, so people will contact you to offer their services.\n" +
                    "If you believe you've made a mistake in tagging it as 'Paid', use the command **/deleteme.**\n\n" +
                    "**I'll provide you with some recommendations regarding commissions:**\n" +
                    "- Don't rush! You'll receive many requests, take your time to review the best offer. The first person who contacts you may not always be the best option.\n" +
                    "- We recommend accepting commissions from people with these roles, as they are qualified for commissions and you can avoid scams. " + MessageRoles + "\n" +
                    "- If you encounter any issues with a member related to a commission (scam, failure to fulfill terms, etc.), I recommend reporting them to the administrative team to assess whether sanctions should be applied.\n" +
                    "- **Does the bot delete your messages?** You probably don't have the necessary roles to participate in commissions."
                )
                .setColor(`Yellow`);
            await Threader.send({ embeds: [MessageEmbed] });

        } catch(e) {
        
            // Oh no, dat error.
            console.log(e);
        
        } 
    }
}