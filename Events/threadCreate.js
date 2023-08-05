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

const dict = [
    {
        snowflake: '1099149952652947456',
        name: 'RVC',
        icon: '<a:fire1:1104783491842977943>'
    },
    {
        snowflake: '1111460697482723388',
        name: 'RVC v2',
        icon: '<a:purplefire:1093313432889085952>'
    },
    {
        snowflake: '1099150044785021019',
        name: 'Artist',
        icon: '🎹'
    },
    {
        snowflake: '1099150093254414358',
        name: 'Rapper',
        icon: '🥶'
    },
    {
        snowflake: '1110363117415825569',
        name: 'Fictional Character',
        icon: '<:vibe:1093342228149190737>'
    },
    {
        snowflake: '1110364355700199464',
        name: 'Anime Character',
        icon: '<:AnimeTagIcon:1110364151357898762>'
    },
    {
        snowflake: '1122951427522834502',
        name: 'OG Character/Self',
        icon: '🙂'
    },
    {
        snowflake: '1117999278745473104',
        name: 'non-Voice/Other',
        icon: '<:skull5:1093358438878285894>'
    },
    {
        snowflake: '1119718145247166504',
        name: 'TTS/Realtime',
        icon: '🗣'
    },
    {
        snowflake: '1114434339397177374',
        name: 'e-Celebs',
        icon: '🖥'
    },
    {
        snowflake: '1123794615502377090',
        name: 'Other Languages',
        icon: '🌐'
    },
    {
        snowflake: '1108324567069495326',
        name: 'English',
        icon: '🍵'
    },
    {
        snowflake: '1108324682735820862',
        name: 'Espanol',
        icon: '🌮'
    },
    {
        snowflake: '1121324803773702196',
        name: 'Japanese',
        icon: '<:miku47:1135044469616545822>'
    },
    {
        snowflake: '1107670309198372916',
        name: 'Korean',
        icon: '<:drake97:1093604726836318249>'
    },
    {
      snowflake: '1099149902346473566',
      name: 'so-vits-svc 4.0',
      icon: '☠'
    },
    {
      snowflake: '1124122323365154917',
      name: 'kits.ai',
      icon: '<:laptop:1093340622884188211>'
    }
];

function snowflakeToName(tags) { // tags is an array of snowflakes
    let output = [];

    for (const tag of tags) {
        output.push(dict.find(entry => entry.snowflake === tag));
    }

    return output;
}

module.exports.run = async (client, thread, newlyCreated) => {
    if (!newlyCreated) {
        return;
    }

    if (thread.parentId === '1127426867767562270') {
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

        if (thread.parentId !== '1099149801054019604') {
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
        let parsedArray = require(`../JSON/models.json`);
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
        client.modelSearchEngine.add(threadMetadata);

        const successEmbed = new Discord.EmbedBuilder()
        .setTitle(`Model indexed~`)
        .setDescription(`Model's metadata\n\`\`\`\n${JSON.stringify(threadMetadata, null, 2)}\n\`\`\``)
        .setColor(`Green`);

        thread.send({embeds: [successEmbed]});
    }
}