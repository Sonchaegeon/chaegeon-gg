const axios = require('axios');
var api_key = "RGAPI-0018afa1-b0b6-4e57-9a93-b4c7f6d33d00";
module.exports = {
    SummonerName: async (req) => {
        var summonerName = (encodeURI(req.query.name));
        const response = await axios.get(`https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${api_key}`)
        return response.data;
    },
    Rank: async (summonerId) => {
        const response = await axios.get(`https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${api_key}`)
        return response.data;
    }
}