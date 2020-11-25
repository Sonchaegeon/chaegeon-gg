const axios = require('axios');
const cheerio = require('cheerio');
var api_key = "RGAPI-001d9b95-0b14-4ea6-bf2a-edf096caa9d3";
var jsonVersion = "10.24.1";
module.exports = {
    SummonerName: async (name) => {
        // id: 7NbCIl_c5YUSGy9VXVaNjJ6Qor9Cuggyss9YVM2kLZL9Wq0
        // acount: wX4_9rIrJy7t4WvPB1aYpJofSh49y0SracqGDFKKajJrPqE
        let summonerName = (encodeURI(name));
        let obj = {};
        const response = await axios.get(`https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${api_key}`)
        if(response.status === 404) throw error;
        obj.name = response.data.name;
        obj.level = response.data.summonerLevel;
        obj.profileId = `http://ddragon.leagueoflegends.com/cdn/${jsonVersion}/img/profileicon/${response.data.profileIconId}.png`;
        obj.id = response.data.id;
        obj.accountId = response.data.accountId;
        return obj;
    },
    Rank: async (summonerId) => {
        const response = await axios.get(`https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${api_key}`)
        /*if(response.data.length == 0) {
            let obj = {};
            obj.tier = "Unranked";
            obj.rank = null;
            obj.lp = 0;
            obj.win = 0;
            obj.lose = 0;
            return obj;
        }
        else{
            let obj = {};
            const data = response.data[0];
            obj.tier = data.tier;
            obj.rank = data.rank;
            obj.lp = data.leaguePoints;
            obj.win = data.wins;
            obj.lose = data.losses;
            return obj;
        }*/
        let obj = {};

        const resetSolo = () => {
            obj.solo.tier = "Unranked";
            obj.solo.rank = null;
            obj.solo.lp = null;
            obj.solo.win = null;
            obj.solo.lose = null;
        }

        const resetFlex = () => {
            obj.flex.tier = "Unranked";
            obj.flex.rank = null;
            obj.flex.lp = null;
            obj.flex.win = null;
            obj.flex.lose = null;
        }

        if(response.data.length != 0) {
            let soloRankIndex = null;
            let flexRankIndex = null;
            for(var i = 0; i < response.data.length; i++){
                if(response.data[i].queueType === "RANKED_SOLO_5x5"){
                    soloRankIndex = i;
                } else if (response.data[i].queueType === "RANKED_FLEX_SR"){
                    flexRankIndex = i;
                }
            }

            if(Solodata === null) {
                resetSolo();
            } else {
                const Solodata = response.data[soloRankIndex];
                obj.solo.tier = Solodata.tier;
                obj.solo.rank = Solodata.rank;
                obj.solo.lp = Solodata.leaguePoints;
                obj.solo.win = Solodata.wins;
                obj.solo.lose = Solodata.losses;
            }
            
            if(Flexdata === null) {
                resetFlex();
            } else {
                const Flexdata = response.data[flexRankIndex];
                obj.flex.tier = Flexdata.tier;
                obj.flex.rank = Flexdata.rank;
                obj.flex.lp = Flexdata.leaguePoints;
                obj.flex.win = Flexdata.wins;
                obj.flex.lose = Flexdata.losses;
            }
            return obj;
        } else{
            resetSolo();
            resetFlex();
            return obj;
        }
    },
    GetChampName: async (id) => {
        const response = await axios.get(`http://ddragon.leagueoflegends.com/cdn/${jsonVersion}/data/en_US/champion.json`)
        const championList = response.data.data;
        for(var i in championList){
            if(championList[i].key == id){
                return championList[i].name;
            }
        }
    },
    GetMatcheLists: async (summonerAccountId) => {
        //4753465962
        const response = await axios.get(`https://kr.api.riotgames.com/lol/match/v4/matchlists/by-account/${summonerAccountId}?api_key=${api_key}`)
        return response.data.matches;
    },
    GetMatches: async (matchId) => {
        const response = await axios.get(`https://kr.api.riotgames.com/lol/match/v4/matches/${matchId}?api_key=${api_key}`)
        return response.data;
    },
    GetChampIcon: async (champName) => {
        champIcon = `https://ddragon.leagueoflegends.com/cdn/${jsonVersion}/img/champion/${champName}.png`;
        return champIcon;
    },
    GetParticipants: async (participants, participantIdentities, accountId, championName) => {
        let participantId;
        let player;
        let items = [];
        let obj = {};
        for(var i = 0; i < 10; i++){
            if(participantIdentities[i].player.accountId == accountId){
                participantId = i;
                break;
            }
        }
        player = participants[participantId];
        obj.win = player.stats.win;
        obj.kill = player.stats.kills;
        obj.death = player.stats.deaths;
        obj.assist = player.stats.assists;

        for(var i = 0; i < 10; i++){
            if(participants[i].teamId != player.teamId && player.timeline.lane === participants[i].timeline.lane){
                obj.enemy = participants[i].championId;
                break;
            }
        }

        obj.champIcon = `https://ddragon.leagueoflegends.com/cdn/${jsonVersion}/img/champion/${championName}.png`;
        items.push(`https://ddragon.leagueoflegends.com/cdn/${jsonVersion}/img/item/${player.stats.item0}.png`);
        items.push(`https://ddragon.leagueoflegends.com/cdn/${jsonVersion}/img/item/${player.stats.item1}.png`);
        items.push(`https://ddragon.leagueoflegends.com/cdn/${jsonVersion}/img/item/${player.stats.item2}.png`);
        items.push(`https://ddragon.leagueoflegends.com/cdn/${jsonVersion}/img/item/${player.stats.item3}.png`);
        items.push(`https://ddragon.leagueoflegends.com/cdn/${jsonVersion}/img/item/${player.stats.item4}.png`);
        items.push(`https://ddragon.leagueoflegends.com/cdn/${jsonVersion}/img/item/${player.stats.item5}.png`);
        items.push(`https://ddragon.leagueoflegends.com/cdn/${jsonVersion}/img/item/${player.stats.item6}.png`);

        obj.items = items;
        obj.lane = player.timeline.lane;
        return obj;
    },
    GetRanking: async (name) => {
        let summonerName = (encodeURI(name));
        let obj = {};
        const response = await axios.get(`https://www.op.gg/summoner/userName=${summonerName}`)
        const $ = cheerio.load(response.data);
        const $bodyList = $("div.LadderRank a").children("span.ranking");
        obj.ranking = $bodyList.text();
        obj.percent = $("div.LadderRank a").html().match(/(\d*.\d*\%)/g);
        return obj;
    }
}