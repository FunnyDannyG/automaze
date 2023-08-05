const { EmbedBuilder } = require("discord.js");
const fs = require(`fs`);
const ms = require('pretty-ms')

module.exports = {
    name: 'fetchthreads',
    category: 'Utilities',
    description: 'Fetch all threads of a channel and send the output in DMs',
    aliases: [],
    syntax: `fetchthreads <channelId>`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: async (client, message, args, prefix) => {
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

        const dict = {
            '1099149952652947456': 'RVC',
            '1111460697482723388': 'RVC v2',
            '1110363117415825569': 'Fictional Character',
            '1110364355700199464': 'Anime Character',
            '1108324682735820862': 'Espanol',
            '1121324803773702196': 'Japanese',
            '1099150044785021019': 'Artist',
            '1099150093254414358': 'Rapper',
            '1108324567069495326': 'English',
            '1114434339397177374': 'E-Celeb',
            '1119718145247166504': 'TTS',
            '1123794615502377090': 'Other Languages',
            '1107670309198372916': 'Korean',
            '1117999278745473104': 'Non-Voice / Other',
            '1122951427522834502': 'Original Character',
        }

        function snowflakeToName(tags) {
            let output = [];

            for (const tag of tags) {
                output.push(dict[tag]);
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

        const result = {};
        let iteration = 0;
        let totalProcessed = 0;
        let total = forumThreadsActive.threads.filter(c => c.parentId == args[0]).size + forumThreadsArchived.threads.filter(c => c.parentId == args[0]).size
        let unintended = 0
        let errored = 0
        let fetchTimestamp = Date.now();

        const loadingEmbed = new EmbedBuilder()
        .setTitle(`⏳ Loading... (SKIPPING SVC BECAUSE WHO THE HELL USE IT LMFAO)`)
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
                    if (i[1].appliedTags.some(element => [ '1099153018504613988', '1099150976524488724', '1099149902346473566', '1124122323365154917' ].includes(element))) {
                        unintended++;
                        continue activeLoop;
                    }

                    let starterMessage = await i[1].fetchStarterMessage().catch(err => {
                        console.log(`unsuccessfully fetched starter message at iteration ${iteration + 1}: ${err.toString()}`)
                    })

                    if (Extractor.extractDownloadLinks(starterMessage?.content)?.length) {
                        let owner = await i[1].fetchOwner().catch(err => {
                            console.log(`unsuccessfully fetched owner at iteration ${iteration + 1}: ${err.toString()}`)
                        })
                        let user = owner?.user;

                        result[`thread_${iteration + 1}`] = {
                            title: i[1].name,
                            starterMessage: starterMessage?.content,
                            creator: user?.username,
                            creatorID: user?.id,
                            creationTimestamp: i[1].createdTimestamp,
                            downloadURL: Extractor.extractDownloadLinks(starterMessage?.content),
                            illustrationURL: Extractor.extractAttachmentLinks(starterMessage),
                            tags: snowflakeToName(i[1].appliedTags)
                        };
                    } else {
                        const fetchedMsgs = await i[1].messages.fetch({limit: 10});

                        innerActive: for (const fetchedMsg of fetchedMsgs.filter(mes => mes.author.id === i[1].ownerId)) {
                            if (Extractor.extractDownloadLinks(fetchedMsg[1].content)?.length) {
                                let owner = await i[1].fetchOwner().catch(err => {
                                    console.log(`unsuccessfully fetched owner at iteration ${iteration + 1}: ${err.toString()}`)
                                })
                                let user = owner?.user;
    
                                result[`thread_${iteration + 1}`] = {
                                    title: i[1].name,
                                    starterMessage: starterMessage?.content,
                                    creator: user?.username,
                                    creatorID: user?.id,
                                    creationTimestamp: i[1].createdTimestamp,
                                    downloadURL: Extractor.extractDownloadLinks(fetchedMsg[1]?.content),
                                    illustrationURL: Extractor.extractAttachmentLinks(fetchedMsg[1]),
                                    tags: snowflakeToName(i[1].appliedTags)
                                };

                                break innerActive;
                            }
                        }
                    }
                    if (!result[`thread_${iteration + 1}`]) {
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
                    if (i[1].appliedTags.some(element => [ '1099153018504613988', '1099150976524488724', '1099149902346473566', '1124122323365154917' ].includes(element))) {
                        unintended++;
                        continue archivedLoop;
                    }

                    let starterMessage = await i[1].fetchStarterMessage().catch(err => {
                        console.log(`unsuccessfully fetched starter message at iteration ${iteration}: ${err.toString()}`)
                    })

                    if (Extractor.extractDownloadLinks(starterMessage?.content)?.length) {
                        let owner = await i[1].fetchOwner().catch(err => {
                            console.log(`unsuccessfully fetched owner at iteration ${iteration}: ${err.toString()}`)
                        })
                        let user = owner?.user;

                        result[`thread_${iteration + 1}`] = {
                            title: i[1].name,
                            starterMessage: starterMessage?.content,
                            creator: user?.username,
                            creatorID: user?.id,
                            creationTimestamp: i[1].createdTimestamp,
                            downloadURL: Extractor.extractDownloadLinks(starterMessage?.content),
                            illustrationURL: Extractor.extractAttachmentLinks(starterMessage),
                            tags: snowflakeToName(i[1].appliedTags)
                        };
                    } else {
                        const fetchedMsgs = await i[1].messages.fetch({limit: 10});

                        innerArchived: for (const fetchedMsg of fetchedMsgs.filter(mes => mes.author.id === i[1].ownerId)) {
                            if (Extractor.extractDownloadLinks(fetchedMsg[1].content)?.length) {
                                let owner = await i[1].fetchOwner().catch(err => {
                                    console.log(`unsuccessfully fetched owner at iteration ${iteration}: ${err.toString()}`)
                                })
                                let user = owner?.user;
    
                                result[`thread_${iteration + 1}`] = {
                                    title: i[1].name,
                                    starterMessage: starterMessage?.content,
                                    creator: user?.username,
                                    creatorID: user?.id,
                                    creationTimestamp: i[1].createdTimestamp,
                                    downloadURL: Extractor.extractDownloadLinks(fetchedMsg[1]?.content),
                                    illustrationURL: Extractor.extractAttachmentLinks(fetchedMsg[1]),
                                    tags: snowflakeToName(i[1].appliedTags)
                                };

                                break innerArchived;
                            }
                        }
                    }
                    if (!result[`thread_${iteration + 1}`]) {
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
            fs.writeFileSync(`./result.json`, JSON.stringify(result, null, 2))
            message.author.send({content: `Fetching completed. Output:`, files: [`./result.json`]})
        }
    }
}