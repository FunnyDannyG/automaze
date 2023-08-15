const Discord = require(`discord.js`);
const fs = require('fs');

class Extractor {

    static extractDownloadLinks(text) {
        if (!text) {
            return;
        }

        const matches = text.match(/\bhttps?:\/\/[^>\s<]+(?![^<]*<>)/gim);

        if (!matches) {
            return;
        }

        return matches.filter(url => ['huggingface.co', 'drive.google.com', 'mega.nz', 'pixeldrain.com', 'www.huggingface.co'].includes(new URL(url).host));
    }

    static extractAttachmentLinks(msg) {
        if (!msg?.content) {
            return;
        }

        const text = msg.content;

        const matches = text.match(/\bhttps?:\/\/[^>\s<]+(?![^<]*<>)/gim);

        if (!matches) {
            return;
        }
      
        if (matches.filter(url => ['tenor.com', 'giphy.com'].includes(new URL(url).host)).length) {
            return matches.filter(url => ['tenor.com', 'giphy.com'].includes(new URL(url).host));
        }

        if (msg.attachments && msg.attachments.map(i => i).filter(i => i.contentType?.startsWith(`image`))) {
            return msg.attachments.map(i => i).filter(i => i.contentType.startsWith(`image`))[0]?.url;
        }

        return;
    }
}

function snowflakeToName(tags) { // tags is an array of snowflakes
    let output = [];

    for (const tag of tags) {
        output.push(require('../Configs/Forum/dictionaryTags.json').find(entry => entry.snowflake === tag));
    }

    return output;
}

module.exports = {
    name: "threadCreate",
    once: false,
    async run(Client, thread, newlyCreated){

        if (!newlyCreated) return;
    
        if (thread.parentId === Client.discordIDs.Forum.Suggestions) {
            const voteEmbed = new Discord.EmbedBuilder()
                .setTitle(`Vote for this suggestion!`)
                .setColor(`Yellow`);
    
            const msg = await thread.send({ embeds: [voteEmbed] })
    
            await Promise.all([
                msg.react(`🔼`),
                msg.react(`🔽`)
            ]);
        }
    
        async function fetchStarter() {
            let msg;
            let iteration = 1
    
            while (iteration <= 5) {
                try {
                    msg = await thread.fetchStarterMessage();
                    break;
                } catch {
                    iteration++;
                }
            }
    
            return msg;
        }
      
        const msg = await fetchStarter();
        const threadMember = await thread.fetchOwner();
        const user = threadMember.user;
        
        const validation = async () => {
            // Only allows threads created from forum
            if (thread.parent.type !== Discord.ChannelType.GuildForum) {
                return;
            }
    
            if (thread.parentId !== Client.discordIDs.Forum.VoiceModel) {
                return;
            }
    
            const regexHug = new RegExp('huggingface.co', 'g', 'i', 'm');
            const regexKits = new RegExp('app.kits.ai', 'g', 'i', 'm');
    
            if (!regexHug.test(msg.content) && !regexKits.test(msg.content) && !msg.member.permissions.has(Discord.PermissionFlagsBits.ManageThreads)) {
                const embed = new Discord.EmbedBuilder()
                    .setTitle(`Your thread was deleted because you didn't attach a valid huggingface.co link nor a kits link!`)
                    .setDescription(Discord.hyperlink(`Don't know how to upload your voice model to Hugging Face?`, `https://rentry.org/FunnyDannyG_Guide`))
                    .setColor(0xFF0000);
    
                await user.send({ embeds: [embed] });
                await thread.delete();
                return 'invalid';
            }
    
            return 'valid';
        }
    
        const status = await validation();
    
        if (status === 'valid') {
            let parsedArray = require(`../JSON/_models.json`);
            const lastIndex = parsedArray.at(-1).id;
    
            const threadMetadata = {
                id: lastIndex + 1,
                title: thread.name,
                starterMessage: msg.content,
                creator: user.username,
                creatorID: user.id,
                creationTimestamp: thread.createdTimestamp,
                downloadURL: Extractor.extractDownloadLinks(msg.content),
                illustrationURL: Extractor.extractAttachmentLinks(msg),
                tags: snowflakeToName(thread.appliedTags)
            }
    
            parsedArray.push(threadMetadata);
            fs.writeFileSync(`${process.cwd()}/JSON/models.json`, JSON.stringify(parsedArray));
            Client.modelSearchEngine.add(threadMetadata);
    
            const successEmbed = new Discord.EmbedBuilder()
            .setTitle(`Model indexed~`)
            .setDescription(`Model's metadata\n\`\`\`\n${JSON.stringify(threadMetadata, null, 2)}\n\`\`\``)
            .setColor(`Green`);
    
            thread.send({embeds: [successEmbed]});
        }
        
    }
}