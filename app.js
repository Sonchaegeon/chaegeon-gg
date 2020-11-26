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

app.get('/multi', async (req, res) => {
    if(req.query.name) {
        let names = req.query.name;
        let teamScore = 100;
        names = names.split(/\s님이 방에 참가했습니다./g);
        for(let i = 0; i < 5; i++){
            names[i] = names[i].replace("\r\n", "");
        }
        console.log(names);
        
        for(let i = 0; i < 5; i++){
            const summoner = await api.SummonerName(names[i]);
            const rank = await api.Rank(summoner.id);
            const winrate = parseInt(rank.solo.win / (rank.solo.win + rank.solo.lose) * 100);

            console.log(winrate);
            // 랭크 승률
            if(winrate >= 66) teamScore += 25;
            else if(winrate <= 65 && winrate >= 61) teamScore += 20;
            else if(winrate <= 60 && winrate >= 56) teamScore += 15;
            else if(winrate <= 55 && winrate >= 51) teamScore += 10;
            else if(winrate <= 50 && winrate >= 46) teamScore -= 10;
            else if(winrate <= 45 && winrate >= 41) teamScore -= 15;
            else if(winrate <= 40 && winrate >= 36) teamScore -= 25;
            else teamScore -= 100;
        }
        res.json(teamScore);
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

        let champion = [], gameWin = [], kill = [], death = [], assist = [], lane = [], items = [], champIcon = [], enemy = [], enemyChampName = [], enemyChampIcon = [], gameMode = [];

        for(var i = 0; i < 10; i++){
            const matches = await api.GetMatches(matchLists[i].gameId);
            const champName = await api.GetChampName(matchLists[i].champion);
            const participant = await api.GetParticipants(matches.participants, matches.participantIdentities, summoner.accountId, champName);
            const getEnemyChampName = await api.GetChampName(participant.enemy);
            let getEnemyChampIcon;
            if(getEnemyChampName){
                getEnemyChampIcon = await api.GetChampIcon(getEnemyChampName);
            }

            //Matches
            champion[i] = champName;
            gameWin[i] = participant.win;
            kill[i] = participant.kill;
            death[i] = participant.death;
            assist[i] = participant.assist;
            lane[i] = participant.lane;
            items[i] = participant.items;
            champIcon[i] = participant.champIcon;
            enemy[i] = participant.enemy;
            enemyChampName[i] = getEnemyChampName;
            enemyChampIcon[i] = getEnemyChampIcon;
            gameMode[i] = matches.gameMode;

        }

        res.render('summoner', {
            //Analytics
            analytics: analytics,

            //Summoner
            name: summoner.name,
            level: summoner.level,
            profileId: summoner.profileId,

            //Rank
            soloTier: rank.solo.tier,
            soloRank: rank.solo.rank,
            soloLp: rank.solo.lp,
            soloWin: rank.solo.win,
            soloLose: rank.solo.lose,

            flexTier: rank.flex.tier,
            flexRank: rank.flex.rank,
            flexLp: rank.flex.lp,
            flexWin: rank.flex.win,
            flexLose: rank.flex.lose,

            ranking: ranking.ranking,
            percent: ranking.percent,

            champion: champion,
            gameWin: gameWin,
            kill: kill,
            death: death,
            assist: assist,
            lane: lane,
            items: items,
            champIcon: champIcon,
            enemy: enemy,
            enemyChampName: enemyChampName,
            enemyChampIcon: enemyChampIcon,
            gameMode: gameMode,
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