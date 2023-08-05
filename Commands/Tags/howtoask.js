module.exports = {
    name: 'howtoask',
    category: 'Tags',
    description: 'How to ask for help properly.',
    aliases: ['ask', 'hta'],
    syntax: `howtoask`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: async (client, message, args, prefix) => {
        message.channel.send(`# How to troubleshoot\n- **Give context**: Throwing your error/issue alone will not help. Tell what step are you on, what were you doing before issue, your settings, your terminal, et cetera.\n- **Be relevant**: You come to ask for help, not to complain. You can't ask for RVC help in voice changer help and vice versa.\n- **Be polite**: DONT DEMAND FOR HELP OR I WILL FUCKING MURDER YOU. Ask politely, the server was not made for you.\n- **Don't be an attention whore**: If people are ignoring your help, kindly ping them. If they are ignoring you, either they don't know how to solve it, they are busy, or you are an asshole.\n> WITH ALL DUE RESPECT, DO NOT BE AN ASSHOLE AND HAVE COMMON SENSE.`);
    }
}