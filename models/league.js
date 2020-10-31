const axios = require('axios');
var api_key = "RGAPI-0018afa1-b0b6-4e57-9a93-b4c7f6d33d00";
var champJsonVersion = "10.22.1";
module.exports = {
    SummonerName: async (req) => {
        var summonerName = (encodeURI(req.query.name));
        const response = await axios.get(`https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${api_key}`)
        return response.data;
    },
    Rank: async (summonerId) => {
        const response = await axios.get(`https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${api_key}`)
        return response.data;
    },
    GetChampName: async (id) => {
        const response = await axios.get(`http://ddragon.leagueoflegends.com/cdn/${champJsonVersion}/data/ko_KR/champion.json`)
        const championList = response.data.data;
        for(var i in championList){
            if(championList[i].key == id){
                return championList[i].name;
            }
        }
    },
    GetMatcheLists: async (summonerAccountId) => {
        const response = await axios.get(`https://kr.api.riotgames.com/lol/match/v4/matchlists/by-account/${summonerAccountId}?api_key=${api_key}`)
        return response.data.matches;
    },
    GetMatches: async (matchId) => {
        const response = await axios.get(`https://kr.api.riotgames.com/lol/match/v4/matches/${matchId}?api_key=${api_key}`)
        return response.data;
    },
    GetParticipants: async (participants, championId) => {
        let participantId;
        const obj = {};
        for(var i = 0; i < 10; i++){
            if(participants[i].championId == championId){
                participantId = i;
            }
        }
        obj.win = participants[participantId].stats.win;
        return obj;
    },
}