module.exports = {
    name: 'java',
    category: 'Tags',
    description: 'STOP CALLING JAVASCRIPT "JAVA" HERES THE FUCKING DIFFERENCE',
    aliases: ['js', 'javascript'],
    syntax: `java`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: async (client, message, args, prefix) => {
        message.channel.send(`# i will not fucking repeat this so listen carefully. Key differences between Java and JavaScript: Java is an OOP programming language while Java Script is an OOP scripting language. Java creates applications that run in a virtual machine or browser while JavaScript code is run on a browser only. Java code needs to be compiled while JavaScript code are all in text. SO STOP CALLING JAVASCRIPT "JAVA" AHSDIAHIDHAOIHFOI`);
    }
}