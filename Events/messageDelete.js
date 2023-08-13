module.exports = {
    name: "messageDelete",
    once: false,
    run(client, deletedMsg, _){
        if (deletedMsg.author.bot) {
            return;
        }
    
        if (deletedMsg.embeds.size) {
            return;
        }
    
        if (deletedMsg.content === '' && !Array.from(deletedMsg.attachments, i => i[1].contentType).filter(i => i.startsWith(`image`)).length) {
            return;
        }
    
        client.snipes.set(`${deletedMsg.author.id}_${deletedMsg.createdTimestamp}`, deletedMsg);
    }
}