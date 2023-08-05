const fs = require(`fs`);

module.exports = () => {
    const processesPath = `${process.cwd()}/Processes`;
    const processFiles = fs.readdirSync(processesPath).filter(file => file.endsWith(`.js`));

    for (const file of processFiles) { 
        const filePath = `${processesPath}/${file}`;
        const _process = require(filePath);
        const processName = file.split(`.`)[0];

        process.on(processName, (arg) => {
            _process.run(arg);
        });
    }
}