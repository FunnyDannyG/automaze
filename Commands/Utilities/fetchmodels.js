const { EmbedBuilder } = require("discord.js");
const fs = require(`fs`);
const ms = require('pretty-ms')

module.exports = {
    name: 'fetchmodels',
    category: 'Utilities',
    description: 'basically fetchthreads but for modelfind',
    aliases: [],
    syntax: `fetchmodels <channelId>`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: async (client, message, args, prefix) => {
        if (message.author.id !== '707400633451282493') {
          return;
        }
      
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
            }
        ];

        function snowflakeToName(tags) { // tags is an array of snowflakes
            let output = [];

            for (const tag of tags) {
                output.push(dict.find(entry => entry.snowflake === tag));
            }

            return output;
        }

        if (!args[0]) {
            return void message.reply(`dumbass no id lol!!!!!!!!!!!!!`);
        }

        const startTimestamp = Date.now();

        const fetchingEmbed = new EmbedBuilder()
        .setTitle(`♻ Enumerating...`)
        .setDescription(`Enumerating through <#${args[0]}>`)
        .setColor(`Purple`);

        let msg = await message.reply({embeds: [fetchingEmbed]})

        const forum = client.channels.cache.get(args[0]);
        const forumThreadsActive = await forum.threads.fetchActive();
        let forumThreadsArchived = await forum.threads.fetchArchived({limit: 100});

        while (forumThreadsArchived.hasMore) {
            console.log(`original: `, forumThreadsArchived.threads.size);

            const lastThread = forumThreadsArchived.threads.last();
            console.log(lastThread.name);
            const additionalThreads = await forum.threads.fetchArchived({before: lastThread, limit: 100});

            forumThreadsArchived.threads = forumThreadsArchived.threads.concat(additionalThreads.threads)

            forumThreadsArchived.hasMore = additionalThreads.hasMore
            console.log(`added: `, additionalThreads.threads.size)
            console.log(`total now: `, forumThreadsArchived.threads.size)
            console.log(`hasmore?: `, additionalThreads.hasMore)
        }

        const result = [];
        let iteration = 0;
        let totalProcessed = 0;
        let total = forumThreadsActive.threads.filter(c => c.parentId == args[0]).size  + forumThreadsArchived.threads.filter(c => c.parentId == args[0]).size 
        let unintended = 0
        let errored = 0
        let fetchTimestamp = Date.now();

        const loadingEmbed = new EmbedBuilder()
        .setTitle(`⏳ Loading... (no skipping svc because ily :3)`)
        .setDescription(`## Processed ${totalProcessed}/${total} threads\n- ${iteration} threads successfully saved\n- ${unintended} threads skipped\n- ${errored} threads failed\n- Time elapsed: ${ms(Date.now() - startTimestamp, {verbose: true})}\n- Current fetching speed: 0 threads/s\n- Estimated time left: ∞ centuries`)
        .setColor(`Yellow`)
        .setFooter({text: `Fetching ${total} threads, ${forumThreadsActive.threads.filter(c => c.parentId == args[0]).size} of which are currently unarchived.`});

        const failedEmbed = new EmbedBuilder()
        .setTitle(`❌ Error`)
        .setColor(`Red`);

        await msg.edit({embeds: [loadingEmbed]})

        try {
            activeLoop: for (const i of forumThreadsActive.threads.filter(c => c.parentId == args[0])) {
                if ((totalProcessed) % 50 === 0 && totalProcessed !== 0) {
                    await msg.edit({embeds: [EmbedBuilder.from(loadingEmbed).setDescription(`## Processed ${totalProcessed}/${total} threads\n- ${iteration} threads successfully saved\n- ${unintended} threads skipped\n- ${errored} threads failed\n- Time elapsed: ${ms(Date.now() - startTimestamp, {verbose: true})}\n- Current fetching speed: ${(totalProcessed / ((Date.now() - fetchTimestamp) / 1000)).toFixed(3)} threads/s\n- Estimated time left: ${(Math.round(totalProcessed / ((Date.now() - fetchTimestamp) / 1000))) * 1000 !== 0 ? ms(Math.round((total - totalProcessed) / (Math.round(totalProcessed / ((Date.now() - fetchTimestamp) / 1000))) * 1000), {verbose: true}) : `∞ centuries`}`)]})
                }

                totalProcessed++;

                try {
                    let starterMessage = await i[1].fetchStarterMessage().catch(err => {
                        console.log(`unsuccessfully fetched starter message at iteration ${iteration + 1}: ${err.toString()}`)
                    })

                    if (Extractor.extractDownloadLinks(starterMessage?.content)?.length) {
                        let owner = await i[1].fetchOwner().catch(err => {
                            console.log(`unsuccessfully fetched owner at iteration ${iteration + 1}: ${err.toString()}`)
                        })
                        let user = owner?.user;

                        result.push({
                            id: iteration + 1,
                            title: i[1].name,
                            starterMessage: starterMessage?.content,
                            creator: user?.username,
                            creatorID: user?.id,
                            creationTimestamp: i[1].createdTimestamp,
                            downloadURL: Extractor.extractDownloadLinks(starterMessage?.content),
                            illustrationURL: Extractor.extractAttachmentLinks(starterMessage),
                            tags: snowflakeToName(i[1].appliedTags)
                        });
                    } else {
                        const fetchedMsgs = await i[1].messages.fetch({limit: 10});

                        innerActive: for (const fetchedMsg of fetchedMsgs.filter(mes => mes.author.id === i[1].ownerId)) {
                            if (Extractor.extractDownloadLinks(fetchedMsg[1].content)?.length) {
                                let owner = await i[1].fetchOwner().catch(err => {
                                    console.log(`unsuccessfully fetched owner at iteration ${iteration + 1}: ${err.toString()}`)
                                })
                                let user = owner?.user;
    
                                result.push({
                                    id: iteration + 1,
                                    title: i[1].name,
                                    starterMessage: starterMessage?.content,
                                    creator: user?.username,
                                    creatorID: user?.id,
                                    creationTimestamp: i[1].createdTimestamp,
                                    downloadURL: Extractor.extractDownloadLinks(fetchedMsg[1]?.content),
                                    illustrationURL: Extractor.extractAttachmentLinks(fetchedMsg[1]),
                                    tags: snowflakeToName(i[1].appliedTags)
                                });

                                break innerActive;
                            }
                        }
                    }
                    if (!result.find(entry => entry.id === iteration + 1)) {
                        throw new Error();
                    }

                    iteration++;
                } catch (err) {
                    console.log(`Unable to find any links in thread named ${i[1].name}, moving to next thread...`);
                    errored++;
                    continue activeLoop;
                }
            }

            
            archivedLoop: for (const i of forumThreadsArchived.threads.filter(c => c.parentId == args[0])) {
                if ((totalProcessed) % 50 === 0 && totalProcessed !== 0) {
                    await msg.edit({embeds: [EmbedBuilder.from(loadingEmbed).setDescription(`## Processed ${totalProcessed}/${total} threads\n- ${iteration} threads successfully saved\n- ${unintended} threads skipped\n- ${errored} threads failed\n- Time elapsed: ${ms(Date.now() - startTimestamp, {verbose: true})}\n- Current fetching speed: ${(totalProcessed / ((Date.now() - fetchTimestamp) / 1000)).toFixed(3)} threads/s\n- Estimated time left: ${(Math.round(totalProcessed / ((Date.now() - fetchTimestamp) / 1000))) * 1000 !== 0 ? ms(Math.round((total - totalProcessed) / (Math.round(totalProcessed / ((Date.now() - fetchTimestamp) / 1000))) * 1000), {verbose: true}) : `∞ centuries`}`)]})
                }

                totalProcessed++;

                try {
                    let starterMessage = await i[1].fetchStarterMessage().catch(err => {
                        console.log(`unsuccessfully fetched starter message at iteration ${iteration}: ${err.toString()}`)
                    })

                    if (Extractor.extractDownloadLinks(starterMessage?.content)?.length) {
                        let owner = await i[1].fetchOwner().catch(err => {
                            console.log(`unsuccessfully fetched owner at iteration ${iteration}: ${err.toString()}`)
                        })
                        let user = owner?.user;

                        result.push({
                            id: iteration + 1,
                            title: i[1].name,
                            starterMessage: starterMessage?.content,
                            creator: user?.username,
                            creatorID: user?.id,
                            creationTimestamp: i[1].createdTimestamp,
                            downloadURL: Extractor.extractDownloadLinks(starterMessage?.content),
                            illustrationURL: Extractor.extractAttachmentLinks(starterMessage),
                            tags: snowflakeToName(i[1].appliedTags)
                        });
                    } else {
                        const fetchedMsgs = await i[1].messages.fetch({limit: 10});

                        innerArchived: for (const fetchedMsg of fetchedMsgs.filter(mes => mes.author.id === i[1].ownerId)) {
                            if (Extractor.extractDownloadLinks(fetchedMsg[1].content)?.length) {
                                let owner = await i[1].fetchOwner().catch(err => {
                                    console.log(`unsuccessfully fetched owner at iteration ${iteration}: ${err.toString()}`)
                                })
                                let user = owner?.user;
    
                                result.push({
                                    id: iteration + 1,
                                    title: i[1].name,
                                    starterMessage: starterMessage?.content,
                                    creator: user?.username,
                                    creatorID: user?.id,
                                    creationTimestamp: i[1].createdTimestamp,
                                    downloadURL: Extractor.extractDownloadLinks(fetchedMsg[1]?.content),
                                    illustrationURL: Extractor.extractAttachmentLinks(fetchedMsg[1]),
                                    tags: snowflakeToName(i[1].appliedTags)
                                });

                                break innerArchived;
                            }
                        }
                    }
                    if (!result.find(entry => entry.id === iteration + 1)) {
                        throw new Error();
                    }

                    iteration++
                } catch (err) {
                    console.log(`Unable to find any links in thread named ${i[1].name}, moving to next thread...`);
                    errored++;
                    continue archivedLoop;
                }
            }
            

            const successEmbed = new EmbedBuilder()
            .setTitle(`✔ Success!`)
            .setDescription(`- All threads are fetched and saved to local JSON file!\n- ${totalProcessed} threads have been processed, in which ${iteration} threads successfully fetched, ${unintended} skipped and ${errored} errored out.\n- The process took a total of ${ms(Date.now() - startTimestamp, {verbose: true})}.`)
            .setColor(`Green`);

            msg.edit({embeds: [successEmbed]});
        } catch (err) {
            console.error(err)
            msg.edit({embeds: [failedEmbed.setDescription(`The process ran into an unexpected error!\n\`\`\`\n${err.toString()}\n\`\`\`\nA total of ${iteration} processed threads are saved anyway.`)]})
        } finally {
            fs.writeFileSync(`./JSON/result.json`, JSON.stringify(result, null, 2))
            message.author.send({content: `Fetching completed. Output:`, files: [`./JSON/result.json`]})
        }
    }
}