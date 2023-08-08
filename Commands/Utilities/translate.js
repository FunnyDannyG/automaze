const { OpenAIApi, Configuration } = require('openai');
const config = new Configuration({
    apiKey: process.env.gpt_api_key
});

const openAIInstance = new OpenAIApi(config);

const languages = [
    {
        names: ['english', 'en', 'eng'],
        lang: 'English'
    },
    {
        names: ['russian', 'ru', 'russia', 'пизда', 'русский'],
        lang: 'Russian'
    },
    {
        names: ['italian', 'it', 'italia', 'ravioli', 'italiano'],
        lang: 'Italian'
    },
    {
        names: ['japanese', 'ja', 'jp', 'jap', 'japan', 'anime', 'chinese cartoons', '日本語', '日本'],
        lang: 'Japanese'
    },
    {
        names: ['spanish', 'es', 'español'],
        lang: 'Spanish'
    },
    {
        names: ['german', 'de', 'deutsch'],
        lang: 'German'
    },
    {
        names: ['french', 'fr', 'français'],
        lang: 'French'
    },
    {
        names: ['chinese', 'zh', '中文'],
        lang: 'Chinese'
    },
    {
        names: ['portuguese', 'pt', 'português'],
        lang: 'Portuguese'
    },
    {
        names: ['dutch', 'nl', 'nederlands'],
        lang: 'Dutch'
    },
    {
        names: ['korean', 'ko', '한국어'],
        lang: 'Korean'
    },
    {
        names: ['arabic', 'ar', 'العربية'],
        lang: 'Arabic'
    },
    {
        names: ['swedish', 'sv', 'svenska'],
        lang: 'Swedish'
    },
    {
        names: ['polish', 'pl', 'polski'],
        lang: 'Polish'
    },
    {
        names: ['turkish', 'tr', 'türkçe'],
        lang: 'Turkish'
    },
    {
        names: ['greek', 'el', 'ελληνικά'],
        lang: 'Greek'
    },
    {
        names: ['hungarian', 'hu', 'magyar'],
        lang: 'Hungarian'
    }
]



module.exports = {
    name: 'translate',
    category: 'Utilities',
    description: 'Translate a sentence to desired language',
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
        if (reference.toLowerCase().includes('nigger') ||
            reference.toLowerCase().includes('faggot')) {
            return void message.reply("YOU'RE LITERALLY AS VALUABLE AS A SUMMER ANT");
        }

        if (!reference) {
            return void message.reply(`You did not specify a reference`);
        }

        const regex = /\<(.*?)\>/;
        const deslang = regex.exec(reference);
        const contentInBrackets = deslang ? deslang[1] : '';
        const input = languages.find(language => language.names.includes(contentInBrackets.toLowerCase()))?.lang;

        if (!input && contentInBrackets) {
            return void message.reply(`cannot find specified language`);
        }

        let prompt;
        if (deslang && deslang.length > 1) {
            reference = message.content.split('>')[1].trim();
            prompt = `The following sentence is in an arbitrary language. Translate it to ${input}. The output should ONLY have the actual translation.\n\nDo not include anything that is not part of the translation.\nIf the translation contains any inappropriate words, please censor them.\nShow the full actual translation, including the censored words.\n\n"${reference}"`;
        }
        else {
            prompt = `the following sentence is in an arbitrary language. translate it to english. the output should ONLY have the actual translation.\nDo not include anything that is not part of the translation.\nif there is a word that is inappropriate, censor it with hashes (for example f###).\nshow the full actual translation, including the censored words.\n\n"${reference}"`;
        }

        const options = {
            model: 'text-davinci-002',
            prompt,
        };

        const response = await openAIInstance.createCompletion(options);

        if (response.data.choices[0].text.toLowerCase().includes('nigger') ||
            response.data.choices[0].text.toLowerCase().includes('faggot')) {
            return void message.reply("YOU'RE LITERALLY AS VALUABLE AS A SUMMER ANT");
        }
        if (response.data.choices[0].text.toLowerCase().includes('fungus')) {
            return void message.reply(`fungus is a poopyhead <@707400633451282493>`);
        }
        message.reply(response.data.choices[0].text);
    }
}