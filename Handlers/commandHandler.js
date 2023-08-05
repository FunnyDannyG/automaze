const fs = require(`fs`);

module.exports = client => {
    const categoriesPath = `${process.cwd()}/Commands`
    const categoryFolders = fs.readdirSync(categoriesPath)

    for (const folder of categoryFolders) {
        const commandFiles = fs.readdirSync(`${categoriesPath}/${folder}`).filter(file => file.endsWith(`.js`));

        for (const file of commandFiles) {
            const filePath = `${categoriesPath}/${folder}/${file}`;
            const command = require(filePath);
    
            if (`name` in command && `run` in command) {
                client.commands.set(command.name, command);
            } else {
                console.log(`[WARNING] A command in ${filePath} is missing name or run property`);
            }
        }
    }

    const itemsPath = `${process.cwd()}/Commands/Game/items`;
    const itemFiles = fs.readdirSync(itemsPath).filter(file => file.endsWith(`.js`));

    for (const file of itemFiles) {
        const filePath = `${itemsPath}/${file}`;
        const item = require(filePath);

        client.use.set(item.name, item);
    }
}