const mongoose = require('mongoose');
const url = "mongodb://ra071:Qwerty123@ac-fi4ibs3-shard-00-00.enqgiyl.mongodb.net:27017,ac-fi4ibs3-shard-00-01.enqgiyl.mongodb.net:27017,ac-fi4ibs3-shard-00-02.enqgiyl.mongodb.net:27017/?ssl=true&replicaSet=atlas-14avxt-shard-0&authSource=admin&retryWrites=true";
const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'eLearning',
}
mongoose.connect(url, connectionParams, )
    .then(() => {
        console.log('Connected to the database ')
    })
    .catch((err) => {
        console.error(`Error connecting to the database. n${err}`);
    })