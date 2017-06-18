const express = require('express');
const path = require('path');
const validUrl = require('valid-url');

const {mongoose} = require('./db/mongoose');
const {Url} = require('./models/url');
const {strictTest} = require('./utils/utils');

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});


app.get('/:entry', (req, res) => {
    const entry = req.params.entry
    Url.findOne({short_url: entry}).then((match) => {
        if(!match) {
            return res.send('No matching shortened URL in database');
        }
        else {
            res.redirect(match.long_url);    
        }
    }).catch((e) => {
        res.send(e);
    })
});

app.get('/new/*', (req, res) => { 

    const entry = req.params[0];    
    //if entry is valid URL
    
    if(validUrl.isUri(entry) && strictTest(entry)) {
        Url.findOne({long_url: entry}).then((match) => {
            if(!match){
                console.log('no match found to valid URL, creating one');
                Url.count({}, function(err, count) {
                    const url = new Url({
                        short_url: count + 1,
                        long_url: entry
                    });
                    url.save().then((doc) => {
                        const urlObj = {
                            short_url: `https://powerful-caverns-13413.herokuapp.com/${doc.short_url}`,
                            long_url: doc.long_url
                        };
                    return res.send(urlObj);
                    });
                }, (e) => {
                    res.status(400).send(e)
                });
            }
            else {
                const matchedObj = {
                    short_url: `https://powerful-caverns-13413.herokuapp.com/${match.short_url}`,
                    long_url: match.long_url
                };
                return res.send(matchedObj);
            }
        }).catch((e) => {
            res.status(400).send(e);
        });
    }
    
    //if entry is invalid URL

    else {
        res.send('That is not a valid url');   
    }
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});
