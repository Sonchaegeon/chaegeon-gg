const express = require('express');
const bodyParser = require('body-parser');
const async = require('async');
const api = require('./models/league');

const app = express();

const port = process.env.PORT || 3000;
const analytics = `
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-DNBBZ7GJ99"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-DNBBZ7GJ99');
</script>`;

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('index', {analytics: analytics});
});

app.get('/search', async (req, res) => {
    const summoner = await api.SummonerName(req);
    const rank = await api.Rank(summoner.id);
    const champName = await api.GetChampName(39);
    res.render('summoner', {
        analytics: analytics,

        //Summoner
        name: summoner.name,
        level: summoner.summonerLevel,

        //Rank
        tier: rank[0].tier,
        rank: rank[0].rank,
        lp: rank[0].leaguePoints,
        win: rank[0].wins,
        lose: rank[0].losses
    });
});

app.listen(port, () => {
    console.log("server running on 80");
});