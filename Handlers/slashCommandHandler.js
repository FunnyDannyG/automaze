/* damn, big file name */

const fs = require(`fs`);

module.exports = client => {
    const categoriesPath = `${process.cwd()}/CommandsSlash`
    const categoryFolders = fs.readdirSync(categoriesPath)

    for (const folder of categoryFolders) {
        const commandFiles = fs.readdirSync(`${categoriesPath}/${folder}`).filter(file => file.endsWith(`.js`));

        for (const file of commandFiles) {
            const filePath = `${categoriesPath}/${folder}/${file}`;
            const command = require(filePath);
    
            if (`data` in command && `execute` in command) {
                client.slashCommands.set(command.data.name, command);
            } else {
                console.log(`[WARNING] A slash command in ${filePath} is missing name or run property`);
            }
        }
    }

    // The code below is not used at the moment

    /*
    const itemsPath = `${process.cwd()}/Commands/Game/items`;
    const itemFiles = fs.readdirSync(itemsPath).filter(file => file.endsWith(`.js`));

    for (const file of itemFiles) {
        const filePath = `${itemsPath}/${file}`;
        const item = require(filePath);

        client.use.set(item.name, item);
    }
    */
}