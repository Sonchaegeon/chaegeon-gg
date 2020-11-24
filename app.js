const express = require('express');
const bodyParser = require('body-parser');
const api = require('./models/league');

const app = express();

const port = process.env.PORT || 3000;
const analytics = `
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-LYFVG3S0GM"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-LYFVG3S0GM');
</script>`;

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use('/static', express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', async (req, res) => {
    res.render('index', {analytics: analytics});
});

app.get('/multi', (req, res) => {
    if(req.query.name) {
        let names = req.query.name;

        names = names.split(/\s님이 방에 참가했습니다./g);
        for(let i = 0; i < 5; i++){
            names[i] = names[i].replace("\r\n    ", "");
            names[i] = names[i].replace("\r\n", "");
        }
        res.json(names);
    } else{
        res.render('multi');
    }
})

app.get('/riot.txt', (req, res) => {
    res.send("53dc0829-23b4-49e7-862b-c882e1b5a370");
});

app.get('/search', async (req, res, next) => {
    try{
        const summoner = await api.SummonerName(req.query.name);
        const ranking = await api.GetRanking(req.query.name);
        const rank = await api.Rank(summoner.id);
        const matchLists = await api.GetMatcheLists(summoner.accountId);
        const matches = await api.GetMatches(matchLists[17].gameId);
        const champName = await api.GetChampName(matchLists[17].champion);
        const participant = await api.GetParticipants(matches.participants, matches.participantIdentities, summoner.accountId);
        res.render('summoner', {
            //Analytics
            analytics: analytics,

            //Summoner
            name: summoner.name,
            level: summoner.level,
            profileId: summoner.profileId,

            //Rank
            tier: rank.tier,
            rank: rank.rank,
            lp: rank.lp,
            win: rank.win,
            lose: rank.lose,
            ranking: ranking.ranking,
            percent: ranking.percent,

            //Matches
            champion: champName,
            gameWin: participant.win,
            kill: participant.kill,
            death: participant.death,
            assist: participant.assist,
            lane: participant.lane,
            items: participant.items,
        });
    } catch (e){
        console.log(e);
        if(e.response.status === 404) next(new Error("소환사를 찾을 수 없습니다"));
        else next(new Error("ERROR"));
    }
});

app.use(function (error, req, res, next) {
    res.render('error', { error: error.message });
})

app.listen(port, () => {
    console.log("server running on 80");
});