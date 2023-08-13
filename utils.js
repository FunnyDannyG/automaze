// Libraries neccesaries
const fs = require('fs');

// Will give you all the files in a folder recursively
function getAllFiles(currentPath){
    let currentFiles = [];
    for(const thatFile of fs.readdirSync(currentPath)){
        let filePath = currentPath + '/' + thatFile;
        if(fs.lstatSync(filePath).isDirectory()){
            currentFiles = currentFiles.concat(currentFiles, getAllFiles(filePath));
        } else {
            currentFiles.push(filePath);
        }
    }
    return currentFiles;
}
exports.getAllFiles = getAllFiles;