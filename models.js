var mongoose = require('mongoose');

mongoose.model('User', new mongoose.Schema({
    email: String,
    passwordHash: String,
    // bookmarks: [{name: String, url: String}],
    folders: [{
        name: String,
        bookmarks:[{name: String, url: String}]
    }],
    subscriptionActive: {type: Boolean, default: false},
    customerId: String,
    subscriptionId: String
}));

mongoose.model('Bookmarks', new mongoose.Schema({
    email: String,
    bookmarks: [{name: String, url: String}]
}))

// mongoose.model('Bookmarks', new mongoose.Schema({
//     bookmarks: [{name: String, url: String}]
// }))