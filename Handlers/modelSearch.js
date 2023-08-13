const documents = require(`../JSON/_models.json`);
const miniSearch = require('minisearch');

module.exports = client => {
    client.modelSearchEngine = new miniSearch({
        fields: ['title', 'creator', 'downloadURL'],
        storeFields: ['title', 'creator', 'downloadURL', 'tags', 'creationTimestamp']
    });
    client.modelSearchEngine.addAll(documents);
}