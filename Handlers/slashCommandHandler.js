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

            if (`data` in command && `execute` in command && ['slash', 'context-menu'].includes(command.type)) {
                if (command.type === 'slash') {
                    client.slashCommands.set(command.data.name, command);
                }

                if (command.type === 'context-menu') {
                    client.contextMenuCommands.set(command.data.name, command);
                }

            } else {
                console.log(`[WARNING] A slash command in ${filePath} is missing data or execute property, or is having incorrect type!`);
            }
        }
    }
}