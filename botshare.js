
const axios = require('axios');
var mysql = require('mysql');

console.log('shared')

// database



const time_signal = 0; // quantidade de tempo para enviar os sinais


var conn = mysql.createConnection({
    host:"blaze-app.mysql.database.azure.com",
    user:"blazebot",
    password:"Maicon2018$",
    database: 'blazebot',
    port:3306,
});

conn.connect(err => {
    if (!err) {
        console.log('connected')
    }
})



var havZero = false
var usersBuyAll = []

// patterns  and datas
var pattern_now = []
var bet = []

// data bet

var hist = null


var gale = 0


var dia = null
var hora = null

var green = 0
var loss = 0





function Color(text) {
    let _text = String(text) 
    let t = _text.replace('1', '(🔴 + ⚪)').replace('2', '(⚫ + ⚪)')
    return t
}




async function sendAll(bot_id, text) {
    try {
    await axios.post('https://api.telegram.org/bot5596332218:AAFCwtSFnajdjPlsnHyH5Cs3d7PHaBE3szI/sendMessage', {
        chat_id: bot_id,
        text: text
    })
}catch (e){
}
}

async function sendMesageTelegram(text) {
    for (c of usersBuyAll) {
        sendAll(c.bot_id, text)
    }
}




var isReverse = false 
var isgame = false

var istime = true

function verifyGain() {
    if (!istime) {
        return true
    }
    var text = `
    ` 

    let pattern = ''
    let last_view_pattern = 0
    let d = new Date()
    day = d.getDate()
    hour = d.getHours()
    mes = d.getMonth()
    min = d.getMinutes();

/*
    for (c of [...Array(3).keys()]){
        let msg_w = '!Danger - area de risco\n'
        let max = min + c;
        let mini = min - c;
        if( (max == 0) || (max == 10) || (max == 20) || (max == 30) || (max == 40) || (max == 50)){
            text += msg_w;
        }
        if( (mini == 0) || (mini == 10) || (mini == 20) || (mini == 30) || (mini == 40) || (mini == 50)){
            text += msg_w;
        }
 
    }*/
 


         
    _hour2 = d.setHours(hour - 5)
    _hour2 = d.getHours()
    let data = pattern_now
    for (c of data){
        pattern += c['color']
    }

    conn.query(`select * from data where pattern = ${pattern.slice(0, -1)} AND day = ${day}`, function (err, result, fields) { 

        /*
        // verificandor de inversão
        if (result.length && havZero) {
            if (result[result.length -1]['wnext'] == '1') {
                result[result.length -1]['wnext'] = '2'
            }else {
                result[result.length -1]['wnext'] = '1'
            }
        }*/


        if (result.length) {
            let h1 = new Date()
        
            let h2 = new Date()
            h2.setHours(result[result.length -1]['hour'])
    
            h2.setHours(h2.getHours())
            let dif = (h1 - h2 ) / 3600000
            last_view_pattern = dif
            if (false) { // so de teste (dif > 5 && dif < 0)
                result = []
            } 
            console.log(dif)
        }

        if (bet.length){

            if (bet[bet.length -1]['wnext'] == pattern[0]){
                sendMesageTelegram('✅✅✅ green!!')

                istime = false;
                setTimeout (()=>{
                    istime = true;
                }, (1000 * 60) * time_signal)

                hist = 1
                green++
                gale = 0

                bet = []
                result = []
                
                //bet = result
                if (result.length && gale <= 0) {



                    text += `
🤔 Entrada confirmada 
👉 Entrar no ${Color(result[result.length-1]['wnext'])}
✊ proteger no branco
👁 apos o: ${pattern_now[0]['roll']}
visto a: ${last_view_pattern} horas \n
` 
                    
                    setTimeout(() => {
                        sendMesageTelegram(text)
                    }, 500);
                }
            }else if (pattern[0] == '0' && (gale == 0 || gale == 1)){
                sendMesageTelegram('✅✅✅ green!! - Branco*')

                istime = false;
                setTimeout (()=>{
                    istime = true;
                }, (1000 * 60) * time_signal)

                hist = 1
                green++
                gale = 0
                
                bet = []
                result = []

                //bet = result
                if (result.length && gale <= 0) {

                    text += `
🤔 Entrada confirmada 
👉 Entrar no ${Color(result[result.length-1]['wnext'])}
✊ proteger no branco
👁 apos o: ${pattern_now[0]['roll']}
visto a: ${last_view_pattern} horas \n
` 
                    sendMesageTelegram(text)
                }
            }else {
                gale++;
                if (gale >= 3) {
                    sendMesageTelegram('✖️ Loss')   


                istime = false;
                setTimeout (()=>{
                    istime = true;
                }, (1000 * 60) * time_signal)


                    //addHist(0)
                    hist = 0
                    loss++
                    gale = 0
                   
                    
                    bet = []
                    result = []
                    //bet = result
                }else if (gale > 0 && gale <= 2) {
                    sendMesageTelegram('🔁 start martingGale ' + gale)
                }
            }

        }else {
            bet = result
            if (result.length && gale <= 0) {
                

        text += `
🤔 Entrada confirmada
👉 Entrar no ${Color(result[result.length -1]['wnext'])}
✊ proteger no branco
👁 apos o: ${pattern_now[0]['roll']}
visto a: ${last_view_pattern} horas \n
                ` 
                sendMesageTelegram(text)
            }
        }
    })
}


var lastPattern = ''
var is_placar_sended = false
async function getData(){


    try{
        let pattern = ''
        let d = new Date()
        day = d.getDate()
        hour = d.getHours()
        min = d.getMinutes()
        mes = d.getMonth()

        if ((hour) == 12 && !is_placar_sended) {
            is_placar_sended = true
            sendMesageTelegram(`
            ----- Placar hoje -----\nData: ${mes}/${day} \nVitórias: ${green} \nDerrotas: ${loss}
            
            `)
            green = 0
            loss = 0
        }
        if (hour >= 1 && hour <= 11) {
            is_placar_sended = false
        }
    
        axios.get('https://blaze.com/api/roulette_games/recent/')
            .then(data => {
                if (data.data) {
                    let dados = data.data
                    let bighs = []
                    for (c of dados) {
                        if (c["roll"] == 0){
                            bighs.push(c['roll'])
                        }
                    }
                    havZero = bighs.length % 2 != 0
                }

            })
            .catch((e) => {
                console.log('erro')
            })

try {
        data = await axios.get('https://blaze.com/api/roulette_games/recent/history?page=1')
        _data = data.data["records"]
        pattern_now = _data
}catch (e){}
        var stringData = _data[0]["created_at"]
    
        for (c of _data){
            pattern += c['color']
        }
        

        if(pattern != lastPattern) {
            verifyGain()
            lastPattern = pattern
        }
    
    }catch(e){
        console.log('erro erro', e)
    }
try {
    let usersBuy = await axios.get('https://blaze-app.azurewebsites.net/c/get/admin')
    usersBuyAll = usersBuy.data
}catch (e){}
}


function createUserBuy() {
    conn.query(`create table if not exists clientes1 (
        ID INTEGER AUTO_INCREMENT PRIMARY KEY,
        name varchar(120) not null,
        created_at varchar(120) not null,
        bot_id varchar(120) unique not null)`.trim())
}



function dropTable() {
    conn.query('drop table clientes1')
    conn.commit()
}



//dropTable()
createUserBuy()

setInterval(() => {
    getData()
}, 2 * 1000);


