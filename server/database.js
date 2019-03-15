const mongoose = require('mongoose');

const URI = 'mongodb+srv://MaoParadise:AA57145894broodwar--@cluster0-fib7v.mongodb.net/test?retryWrites=true'

mongoose.connect(URI, { useNewUrlParser: true })
    .then(db => console.log('DB is connected'))
    .catch(err => console.error(err));

module.exports = mongoose;