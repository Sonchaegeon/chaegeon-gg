const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/search', (req, res) => {
    var summmonerName = (encodeURI(req.query.name));
    axios.get(`https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summmonerName}?api_key=RGAPI-5e305105-c00f-4993-bb55-7e9087a05459`)
        .then(response => {
            var data = response.data;
            res.render('summoner', {
                name: data.name,
                level: data.summonerLevel 
            })
            console.log(data);
        })
        .catch(function(error){
            console.log(error);
        });
});

app.listen(3000, () => {
    console.log("server running on 3000");
});