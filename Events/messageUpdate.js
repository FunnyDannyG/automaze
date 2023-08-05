module.exports.run = (client, oldMsg, newMsg) => {
    if (oldMsg.author.bot) {
        return;
    }

    if (oldMsg.embeds.size) {
        return;
    }

    if (oldMsg.content === newMsg.content) {
        return;
    }

    client.esnipes.set(`${oldMsg.author.id}_${oldMsg.createdTimestamp}`, {
        oldMsg: oldMsg,
        newMsg: newMsg
    })
}