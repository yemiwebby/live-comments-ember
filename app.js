const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Pusher = require('pusher');
const Sentiment = require('sentiment');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_APP_KEY,
    secret: process.env.PUSHER_APP_SECRET,
    cluster: process.env.PUSHER_APP_CLUSTER,
    encrypted: true
});

app.set('port', process.env.PORT || 3000);

app.post('/posts', (req, res) => {
    const sentiment = new Sentiment();
    const sentimentScore = sentiment.analyze(req.body.text).score;
    const payload = {
        text: req.body.text,
        sentiment: sentimentScore
    }
    pusher.trigger('chat', 'post', payload);
    res.send(payload)
})

app.listen(app.get('port'), () => {
    console.log("Listening at " + app.get('port'));
})


