const Discord = require('discord.js');

module.exports = {
    name: "threadCreate",
    once: false,
    async run(Client, Threader, newlyCreated){
        try{

            // Configurations
            let SpamTime = 3*60*1000;
            let Forums = [
                Client.discordIDs.Forum.Suggestions,
                Client.discordIDs.Forum.VoiceModel,
                Client.discordIDs.Forum.RequestModel.ID
            ];

            // Check is a Request Forum
            if(!newlyCreated) return;
            if(Threader.guildId != Client.discordIDs.Guild) return;
            if(!(Forums.find( ForumID => ForumID == Threader.parentId ))) return;

            // Check if have anti-spammer request
            if(Client.forumSpammer[Threader.ownerId]){
                await Threader.delete();
                if(!Client.forumSpammer[Threader.ownerId].dm){
                    Client.forumSpammer[Threader.ownerId].dm = true;
                    let Owner = await Client.forumSpammer[Threader.ownerId].threader.fetchOwner();
                    if(Owner){
                        let MessageEmbed = new Discord.EmbedBuilder()
                            .setDescription(
                                "Hello! I deleted your publication because the timeout for publication has not passed. " +
                                "_(Last Post <#" + Client.forumSpammer[Threader.ownerId].threader.id + ">)_\n" +
                                "**Please wait 3 minutes for each post.**"
                            )
                            .setTitle(`Your post has been deleted`)
                            .setColor(`Yellow`);
                        Owner.user.send({ embeds: [MessageEmbed] })
                            .catch( (_) => {
                                console.log("Could not send a message to the user (" + ThreaderOwner.user.username  + ").")
                            });
                    }
                }
            } else {
                Client.forumSpammer[Threader.ownerId] = {
                    threader: Threader,
                    dm: false
                };
                setTimeout( () => {
                    if(Client.forumSpammer[Threader.ownerId]){
                        delete Client.forumSpammer[Threader.ownerId];
                    }
                }, SpamTime);
            }

        } catch(e) {
        
            // Oh no, dat error.
            console.log(e);
        
        } 
    }
}