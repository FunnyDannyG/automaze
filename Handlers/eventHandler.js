const fs = require(`fs`);

module.exports = client => {
    const eventsPath = `${process.cwd()}/Events`;
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(`.js`));

    for (const file of eventFiles) {
        const filePath = `${eventsPath}/${file}`;
        const event = require(filePath);
        const eventName = file.split(`.`)[0];

        client.on(eventName, (...arg) => {
            event.run(client, ...arg);
        });
    }
}