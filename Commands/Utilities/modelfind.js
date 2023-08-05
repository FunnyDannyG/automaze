const { EmbedBuilder, StringSelectMenuBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, ChannelSelectMenuInteraction } = require('discord.js');

module.exports = {
    name: 'modelfind',
    category: 'Utilities',
    description: 'Find a voice model in the #voice-model forum',
    aliases: ['find'],
    syntax: `modelfind <query>`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: async (client, message, args, prefix) => {
        const query = message.content.split(' ').slice(1).join(' ');

        if (!query) {
            return void message.reply(`no query provided`);
        }

        if (message.channel.id !== '1135953335388733502') {
            return void message.reply(`you cannot use this command, please move to its dedicated channel or use \`${prefix}cfind\` instead`);
        }
        let fuzzyValue = 0;
        
        let allResults = client.modelSearchEngine.search(query, { fuzzy: fuzzyValue });

        allResults.sort((a, b) => b.score - a.score); // GPT-generated code, sort the results in descending order

        let results;
        let resultsLeft;
        let page = 1;
        let order = 'descending'
        let possiblePages = Math.ceil(allResults.length / 3);
        let attributeToSortBy = { attribute: 'score', type: 'number' };

        let displayOrder = 'D';
        let displayAttribute = 'R'

        const availableSuggestions = client.modelSearchEngine.autoSuggest(query, {fuzzy: 0.2});

        if (!allResults.length) {
            return void message.channel.send({ embeds: [new EmbedBuilder().setTitle('No result found.').setDescription(availableSuggestions.length ? `## Did you mean...?\n${availableSuggestions.map(sugg => `### ‣ \`${sugg.suggestion}\` - ${Math.round(sugg.score * 10)}% match`).join(`\n`)}` : `No available suggestions for this query.`).setColor(`Red`)] });
        }

        function getSubarrayByPage(arr, page) {
            const itemsPerPage = 3;
            const startIndex = (page - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            return arr.slice(startIndex, endIndex);
        } // GPT

        function changeSortOrder(arr, option, attr) {
            if (option === 'descending') {
                if (attr.type === 'number') {
                    arr.sort((a, b) => b[attr.attribute] - a[attr.attribute]);
                }

                if (attr.type === 'string') {
                    arr.sort((a, b) => b[attr.attribute].localeCompare(a[attr.attribute]));
                }
            }

            if (option === 'ascending') {
                if (attr.type === 'number') {
                    arr.sort((a, b) => a[attr.attribute] - b[attr.attribute]);
                }

                if (attr.type === 'string') {
                    arr.sort((a, b) => a[attr.attribute].localeCompare(b[attr.attribute]));
                }
            }
        }

        results = getSubarrayByPage(allResults, page);
        resultsLeft = allResults.length - 3;

        let resultEmbed = new EmbedBuilder()
            .setTitle(`${allResults.length} results found - Search mode: ${displayAttribute}-${displayOrder}, fuzzy: ${fuzzyValue}`)
            .setDescription(results.filter(result => result.downloadURL?.length).map(result => `### ‣ ${result.title}\n**Creator**: ${result.creator}\n**Download URLs**: ${result.downloadURL.map(url => `[${new URL(url).host}](${url})`).join(', ')}\n**Tags**: ${result.tags.map(tag => `${tag ? tag.name : `Deleted Tag`} ${tag ? tag.icon : `Deleted Icon`}`).join(`, `)}\n**Created**: <t:${Math.round(result.creationTimestamp / 1000)}:R>`).join(`\n\n`))
            .setColor(`Green`);

        if (resultsLeft) {
            resultEmbed.setFooter({ text: `Page ${page}/${possiblePages}` })
        }

        const scrollLeftButton = new ButtonBuilder()
            .setCustomId(`left`)
            .setStyle(ButtonStyle.Primary)
            .setDisabled()
            .setEmoji(`👈`);

        const scrollRightButton = new ButtonBuilder()
            .setCustomId(`right`)
            .setStyle(ButtonStyle.Primary)
            .setEmoji(`👉`);

        const changeSortOrderButton = new ButtonBuilder()
            .setCustomId(`order`)
            .setStyle(ButtonStyle.Primary)
            .setEmoji(`🔃`);

        const settingsButton = new ButtonBuilder()
            .setCustomId(`settings`)
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(`⚙`);

        if (allResults.length <= 3) {
            scrollRightButton.setDisabled();
        }

        function updateScroll() {
            if (page === 1) {
                scrollLeftButton.setDisabled();
            } else {
                scrollLeftButton.setDisabled(false);
            }

            if (page === possiblePages) {
                scrollRightButton.setDisabled();
            } else {
                scrollRightButton.setDisabled(false);
            }
        }

        function updatedEmbed(embed) {
            return EmbedBuilder.from(embed).setTitle(`${allResults.length} results found - Search mode: ${displayAttribute}-${displayOrder}, fuzzy: ${fuzzyValue}`).setDescription(results.filter(result => result.downloadURL?.length).map(result => `### ‣ ${result.title}\n**Creator**: ${result.creator}\n**Download URLs**: ${result.downloadURL.map(url => `[${new URL(url).host}](${url})`).join(', ')}\n**Tags**: ${result.tags.map(tag => `${tag ? tag.name : `Deleted Tag`} ${tag ? tag.icon : `Deleted Icon`}`).join(`, `)}\n**Created**: <t:${Math.round(result.creationTimestamp / 1000)}:R>`).join(`\n\n`)).setFooter({ text: `Page ${page}/${possiblePages}` }).setColor(`Green`);
        }

        const sortDropdown = new StringSelectMenuBuilder()
            .setCustomId('sortDropdown')
            .setPlaceholder(`Sort by...`)

        sortDropdown
            .addOptions(
                {
                    label: '🔗 Relevance',
                    description: 'Sort by how close the results match with the query',
                    value: 'relevance'
                },
                {
                    label: '📅 Date',
                    description: 'Sort by model\'s creation date',
                    value: 'date'
                },
                {
                    label: '🔤 Alphabet',
                    description: 'Sort in alphabetical order',
                    value: 'alphabet'
                }
            );

        const GUI = new ActionRowBuilder().addComponents([scrollLeftButton, scrollRightButton, changeSortOrderButton, settingsButton]);
        const sortDropdownGUI = new ActionRowBuilder().addComponents([sortDropdown]);

        const msg = await message.channel.send({ embeds: [resultEmbed], components: [GUI, sortDropdownGUI] });

        const filter = i => i.user.id === message.author.id;
        const collector = msg.createMessageComponentCollector({ filter, idle: 60000, time: 300000 });

        collector.on('collect', async i => {
            if (i.customId === 'left') {
                page--;
                results = getSubarrayByPage(allResults, page);

                updateScroll();

                i.update({ embeds: [updatedEmbed(allResults)], components: [GUI, sortDropdownGUI] });
            }

            if (i.customId === 'right') {
                page++;
                results = getSubarrayByPage(allResults, page);

                updateScroll();

                i.update({ embeds: [updatedEmbed(allResults)], components: [GUI, sortDropdownGUI] });
            }

            if (i.customId === 'order') {
                const switched = ['ascending', 'descending'].filter(h => h !== order)[0];
                order = switched;
                displayOrder = switched.charAt(0).toUpperCase();

                changeSortOrder(allResults, order, attributeToSortBy);
                results = getSubarrayByPage(allResults, page);

                i.update({ embeds: [updatedEmbed(allResults)], components: [GUI, sortDropdownGUI] });
            }

            if (i.customId === 'settings') {
                const settingsModal = new ModalBuilder()
                    .setCustomId(`settingsModal`)
                    .setTitle(`Models search settings`);

                const fuzzyValueInput = new TextInputBuilder()
                    .setCustomId(`fuzzy`)
                    .setLabel(`Fuzzy value`)
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder(`0 - 0.2`)
                    .setRequired();

                const strictSearchValueInput = new TextInputBuilder()
                    .setCustomId(`strictSearch`)
                    .setLabel(`Strictly search only one property`)
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder(`Leave blank to search all (title, creator, downloadURL)`)
                    .setRequired(false);

                const fuzzyActionRow = new ActionRowBuilder().addComponents(fuzzyValueInput);
                const strictSearchActionRow = new ActionRowBuilder().addComponents(strictSearchValueInput);

                settingsModal.addComponents([fuzzyActionRow, strictSearchActionRow]);

                await i.showModal(settingsModal);

                const modalFilter = interaction => interaction.customId === 'settingsModal';
                const submission = await i.awaitModalSubmit({ filter: modalFilter, time: 60000 }).catch(m => {
                    return;
                });

                if (!submission) {
                    return;
                }

                let fuzzyInputValue = !Number.isNaN(+submission.fields.getTextInputValue(`fuzzy`)) ? +submission.fields.getTextInputValue(`fuzzy`) : 0;
                let strictSearchInputValue = submission.fields.getTextInputValue(`strictSearch`);

                if (fuzzyInputValue > 0.2 || fuzzyInputValue < 0) {
                    return void submission.reply({ content: `Fuzzy value must be in 0 - 0.2 range.`, ephemeral: true })
                }

                if (!['title', 'creator', 'downloadURL'].includes(strictSearchInputValue) && strictSearchInputValue !== '') {
                    return void submission.reply({ content: `Specified strict search parameter is invalid.`, ephemeral: true })
                }

                if (strictSearchInputValue === '') {
                    strictSearchInputValue = ['title', 'creator', 'downloadURL'];
                } else {
                    strictSearchInputValue = [strictSearchInputValue]
                }

                fuzzyValue = fuzzyInputValue;

                allResults = client.modelSearchEngine.search(query, { fuzzy: fuzzyValue, fields: strictSearchInputValue });

                if (!allResults.length) {
                    return await submission.update({ embeds: [new EmbedBuilder().setTitle('No result found.').setDescription(availableSuggestions.length ? `## Did you mean...?\n${availableSuggestions.map(sugg => `### ‣ \`${sugg.suggestion}\` - ${Math.round(sugg.score * 10)}% match`).join(`\n`)}` : `No available suggestions for this query.`).setColor(`Red`)] });
                }

                allResults.sort((a, b) => b.score - a.score); // GPT-generated code, sort the results in descending order

                page = 1;
                order = 'descending';
                possiblePages = Math.ceil(allResults.length / 3);
                attributeToSortBy = { attribute: 'score', type: 'number' };

                displayOrder = 'D';
                displayAttribute = 'R';

                results = getSubarrayByPage(allResults, page);
                resultsLeft = allResults.length - 3;

                await submission.update({ embeds: [updatedEmbed(allResults)], components: [GUI, sortDropdownGUI] });
            }

            if (i.customId === 'sortDropdown') {
                if (i.values[0] === 'relevance') {
                    attributeToSortBy.attribute = 'score';
                    attributeToSortBy.type = 'number';

                    changeSortOrder(allResults, order, attributeToSortBy);
                    results = getSubarrayByPage(allResults, page);

                    displayAttribute = 'R';

                    i.update({ embeds: [updatedEmbed(resultEmbed)], components: [GUI, sortDropdownGUI] });
                }

                if (i.values[0] === 'date') {
                    attributeToSortBy.attribute = 'creationTimestamp';
                    attributeToSortBy.type = 'number';

                    changeSortOrder(allResults, order, attributeToSortBy);
                    results = getSubarrayByPage(allResults, page);

                    displayAttribute = 'D';

                    i.update({ embeds: [updatedEmbed(resultEmbed)], components: [GUI, sortDropdownGUI] });
                }

                if (i.values[0] === 'alphabet') {
                    attributeToSortBy.attribute = 'title';
                    attributeToSortBy.type = 'string';

                    changeSortOrder(allResults, order, attributeToSortBy);
                    results = getSubarrayByPage(allResults, page);

                    displayAttribute = 'A';

                    i.update({ embeds: [updatedEmbed(resultEmbed)], components: [GUI, sortDropdownGUI] });
                }
            }
        });
    }
}