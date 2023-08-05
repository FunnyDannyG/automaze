const { OpenAIApi, Configuration } = require('openai');
const config = new Configuration({
    apiKey: process.env.gpt_api_key
});

const openAIInstance = new OpenAIApi(config);

module.exports = {
    name: 'translate',
    category: 'Utilities',
    description: 'Translate a sentence to english',
    aliases: [],
    syntax: 'translate',
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: async (client, message, args, prefix) => {
        let reference;
        try {
            reference = await message.fetchReference();
        } catch {
            reference = message.content.split(' ').slice(1).join(' ');
        }

        if (!reference) {
            return void message.reply(`you did not specify a reference`);
        }

        const options = {
            model: 'text-davinci-002',
            prompt: `the following sentence is in an arbitrary language. translate it to english. the output should ONLY has the actual translation. do not include anything that is not part of the translation. if there is a word that is inappropriate, censor it with hashes (for example f###). show the full actual translation, including the censored words.\n\n"${reference}"`
        }

        const response = await openAIInstance.createCompletion(options);
        if (response.data.choices[0].text.toLowerCase().includes('nigger')) {
            return void message.reply(`SHUT THE FUCK UP STOP MAKING ME SAY HARD R`);
        }

        message.reply(response.data.choices[0].text);
    }
}