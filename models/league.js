const axios = require('axios');
var api_key = "RGAPI-52f2327e-972f-4d74-910a-f5ebf91d21e3";
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