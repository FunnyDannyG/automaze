const { EmbedBuilder } = require(`discord.js`);

module.exports = {
    name: 'compactfind',
    category: 'Utilities',
    description: 'Find posts in #voice-models forum, but return a compact embed to avoid flood',
    aliases: ['cfind'],
    syntax: `compactfind <query>`,
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

        let allResults = client.modelSearchEngine.search(query, { fuzzy: 0.2 });

        allResults.sort((a, b) => b.score - a.score); // GPT-generated code, sort the results in descending order

        let results;
        let resultsLeft;

        if (!allResults.length) {
            return void message.channel.send({ embeds: [new EmbedBuilder().setTitle('No result found.').setColor(`Red`)] });
        }

        if (allResults.length > 3) {
            results = allResults.slice(0, 3);
            resultsLeft = allResults.length - 3;
        } else {
            results = allResults;
        }

        const resultEmbed = new EmbedBuilder()
            .setTitle(`${allResults.length} results found - Search mode: R-D, fuzzy: 0.2, compact`)
            .setDescription(results.filter(result => result.downloadURL?.length).map(result => `- [${result.title}](${result.downloadURL[0]}) ${result.tags.map(tag => `${tag ? tag.icon : `Deleted Icon`}`).join(``)} - ${result.creator}`).join(`\n`))
            .setColor(`Green`);

        if (resultsLeft) {
            resultEmbed.setFooter({ text: `And ${resultsLeft} more results...` })
        }

        message.channel.send({ embeds: [resultEmbed] });
    }
}