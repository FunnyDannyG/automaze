const { getAllFiles } = require('../utils');

module.exports = Client => {
    const eventsPath = `${process.cwd()}/Events`;
    const eventFiles = getAllFiles(eventsPath).filter(file => file.endsWith(`.js`));
    for(const fileEvent of eventFiles){
        const Event = require(fileEvent);
        if (Event.once) {
            Client.once(Event.name, async (...args) => await Event.run(Client, ...args));
        } else {
            Client.on(Event.name, async (...args) => await Event.run(Client, ...args));
        }
    }
}