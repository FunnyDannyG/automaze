const fs = require('fs');
const Discord = require('discord.js');
const { delay } = require(process.cwd() + '/utils.js');
const TagLists = require(process.cwd() + '/Configs/Forum/dictionaryTags.json');

class Extractor {

    static extractDownloadLinks(text) {
        if(!text) return;
        const matches = text.match(/\bhttps?:\/\/[^>\s<]+(?![^<]*<>)/gim);
        if(matches){
            return matches.filter(url => ['huggingface.co', 'drive.google.com', 'mega.nz', 'pixeldrain.com', 'www.huggingface.co'].includes(new URL(url).host));
        } else {
            return 'N/A';
        };
    }

    static extractAttachmentLinks(msg) {
        if(!msg?.content) return;
        const matches = msg.content.match(/\bhttps?:\/\/[^>\s<]+(?![^<]*<>)/gim);
        if(matches){
            if (matches.filter(url => ['tenor.com', 'giphy.com'].includes(new URL(url).host)).length) {
                return matches.filter(url => ['tenor.com', 'giphy.com'].includes(new URL(url).host));
            }
            if (msg.attachments && msg.attachments.map(i => i).filter(i => i.contentType?.startsWith(`image`))) {
                return msg.attachments.map(i => i).filter(i => i.contentType.startsWith(`image`))[0]?.url;
            }
        } else {
            return 'N/A';
        }
    }

    static snowflakeToName(listTag) {
        let tagList = [];
        for (const tag of listTag) {
            let tagName = TagLists.find(entry => entry.snowflake === tag);
            if(tagName){
                tagList.push(tagName);
            }
        }
        return tagList;
    }

}

module.exports = {
    name: "threadCreate",
    once: false,
    async run(Client, Threader, newlyCreated){
        try{

            // Check is a Voice Models Forum
            if(!newlyCreated) return;
            if(Threader.guildId != Client.discordIDs.Guild) return;
            if(Threader.parentId != Client.discordIDs.Forum.VoiceModel) return;

            // Check if exists the channel
            await delay(2000);
            if(!(await Threader.guild.channels.cache.get(Threader.id))) return;

            // Get Threader Message 
            let ThreaderContent = await Threader.fetchStarterMessage();
            let ThreaderOwner = await Threader.fetchOwner();
            if(ThreaderOwner) ThreaderOwner = ThreaderOwner.user;
            
            // Check if not exists link of model
            const regexHug = new RegExp('huggingface.co', 'g', 'i', 'm');
            const regexKits = new RegExp('app.kits.ai', 'g', 'i', 'm');
            if (!regexHug.test(ThreaderContent.content) && !regexKits.test(ThreaderContent.content) && !ThreaderContent.member.permissions.has(Discord.PermissionFlagsBits.ManageThreads)){
                const embed = new Discord.EmbedBuilder()
                    .setTitle(`Your thread was deleted because you didn't attach a valid huggingface.co link nor a kits link!`)
                    .setDescription(Discord.hyperlink(`Don't know how to upload your voice model to Hugging Face?`, `https://rentry.org/FunnyDannyG_Guide`))
                    .setColor(0xFF0000);
                await ThreaderOwner.send({ embeds: [embed] })
                    .catch( (_) => {
                        console.log("Could not send a message to the user (" + ThreaderOwner.user.username  + ").")
                    });
                return await Threader.delete();
            }

            // Creation of Metadata
            let parsedArray = require(process.cwd() + `/JSON/_models.json`);
            const lastIndex = parsedArray.at(-1).id;
            const threadMetadata = {
                id: lastIndex + 1,
                title: Threader.name,
                starterMessage: ThreaderContent.content,
                creator: ThreaderOwner.username,
                creatorID: ThreaderOwner.id,
                creationTimestamp: Threader.createdTimestamp,
                downloadURL: Extractor.extractDownloadLinks(ThreaderContent.content),
                illustrationURL: Extractor.extractAttachmentLinks(ThreaderContent),
                tags: Extractor.snowflakeToName(Threader.appliedTags)
            }
    
            parsedArray.push(threadMetadata);
            fs.writeFileSync(`${process.cwd()}/JSON/models.json`, JSON.stringify(parsedArray));
            Client.modelSearchEngine.add(threadMetadata);
    
            // Sucess embed send to Threader
            const successEmbed = new Discord.EmbedBuilder()
                .setTitle(`Model indexed~`)
                .setDescription(`Model's metadata\n\`\`\`\n${JSON.stringify(threadMetadata, null, 2)}\n\`\`\``)
                .setColor(`Green`);
            Threader.send({embeds: [successEmbed]});

        } catch(e) {
        
            // Oh no, dat error.
            console.log(e);
        
        } 
    }
}