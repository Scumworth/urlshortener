const mongoose = require('mongoose');

const Url = mongoose.model('Url', {
    short_url: {
        type: Number
    },
    long_url: {
        type: String
    }
});

module.exports = {Url};
