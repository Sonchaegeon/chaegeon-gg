const express = require('express');
const bodyParser = require('body-parser');
const async = require('async');
const api = require('./models/league');

const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/search', async (req, res) => {
    const summoner = await api.SummonerName(req);
    const rank = await api.Rank(summoner.id);

    res.render('summoner', {
        //Summoner
        name: summoner.name,
        level: summoner.summonerLevel,

        //Rank
        tier: rank[0].tier,
        rank: rank[0].rank,
        lp: rank[0].leaguePoints
    });
});

app.listen(3000, () => {
    console.log("server running on 3000");
});