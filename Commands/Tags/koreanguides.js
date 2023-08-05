module.exports = {
    name: 'koreanguides',
    category: 'Tags',
    description: 'RVC 가이드 한국어 번역본 (KJAV 譯) 가이드 링크',
    aliases: ['kr_guides', 'kr_g'],
    syntax: `koreanguides`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: async (client, message, args, prefix) => {
        const embed = new EmbedBuilder()
        .setTitle(`가이드 링크`)
        .setDescription(`## • RVC 가이드 한국어 번역본 (KJAV 譯)\nhttps://docs.google.com/document/d/1EeOBSJx7dm_amysCRPq9qRf2Q3RIZc9KUoUynQgauBo/edit?usp=sharing\n## • Mangio RVC Fork WebUI 한국어 번역본 (KJAV 譯, 설치 권장)\nhttps://drive.google.com/drive/folders/1-GamZ6opREYX0lMZLoWThJUFkS2o52X9?usp=sharing`)
        .setColor(`Yellow`);

        message.channel.send({embeds: [embed]});
    }
}