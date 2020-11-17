const Discord = require('discord.js');
var fs = require('fs');

const client = new Discord.Client();
const myID = "715582108600369253";

const coolDownMins = 5;
//base 5 mins

//lowest and highest index GIF for each spinType 
const GIFlow =  [0, 7, 11, 12];
const GIFhigh = [6, 10, 11, 12];
//0: 0,1,2,3,4,5,6
//1: 7,8,9,10
//2: 11
//3: 12

//GIF DB
const dizzyGIF = "https://i.imgur.com/spr5vSH.gif";     //shows on no spin
const maidGIFs = ["https://i.imgur.com/7hqhB0M.gif",    //0 mori (multi moris to stay a common spin)
"https://i.imgur.com/7hqhB0M.gif",                      //1 mori
"https://i.imgur.com/7hqhB0M.gif",                      //2 mori
"https://i.imgur.com/WxIrcsu.gif",                      //3 maria
"https://i.imgur.com/2zr3Y66.gif",                      //4 shinobu
"https://i.imgur.com/rvdiMVi.gif",                      //5 misaki
"https://i.imgur.com/g6uPz0v.gif",                      //6 sun
"https://i.imgur.com/swxzqBI.gif",                       //7 hinako
"https://i.imgur.com/ewDf0ZS.gif",                       //8 siesta
"https://i.imgur.com/ESBg2pr.gif",                       //9 aqua
"https://i.imgur.com/0axpToa.gif",                       //10 hotori mug
"https://i.imgur.com/z6sjRXh.gif",                      //11 maika
"https://i.imgur.com/RJCx1rX.gif"];                      //12 bikini mori

//on startup
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    
    fs.readFile('spinData.json', function(err, data) {
        if (err) {
            return console.error(err);
        }

        var fullData = JSON.parse(data.toString());
        currentTime = new Date();

        for (server in fullData["servers"]) {
            fullData["servers"][server]["lastSpin"] = currentTime - (60000 * coolDownMins);
        }

        newJSON = JSON.stringify(fullData);
        fs.writeFile('spinData.json', newJSON, function(err) {
            if (err) {
                return console.error(err);
            }
        });
    });
});

function getServerData(data, msg) {
    var fullData = JSON.parse(data.toString());

    newServer = true;
    //test for new server
    for (server in fullData["servers"]) {
        if (fullData["servers"][server]["id"] == msg.guild.id) {
            spinData = fullData["servers"][server];
            newServer = false;
            break;
        }
    }

    //if new server, return -1
    if (newServer) {
        spinData = -1;
    }

    return spinData;
}

function printSpin(msg, spins, total, spinType, hiSpinKA) {
    if (spins == 1) {
        nounVar = "maid";
    } else {
        nounVar = "maids";
    }
    msg.channel.send(`${msg.author}` + " spun " + spins + " " + nounVar + "! *(" + total + " spins total)*");
    
    //if x2
    if (spinType == 1) {
        msg.channel.send("The maids span extra fast today! *(x2 spins)*");
    }
    //if x5
    if (spinType == 2) {
        msg.channel.send("We brought the maid-spinomatic out for this one! *(x5 spins)*");
    }
    //if x10
    if (spinType == 3) {
        msg.channel.send("Wow! Today is the beach episode! *(x10 spins)*");
    }

    if (hiSpinKA) {
        msg.channel.send('This is a new highest spin score for you! (Check leaderboard with *"**@Maid Spin** toph"*).');
    }

    GIFran = Math.floor(Math.random() * (GIFhigh[spinType] - GIFlow[spinType] + 1)) + GIFlow[spinType];

    msg.channel.send(maidGIFs[GIFran]);
}

function updateCount(msg) {
    fs.readFile('spinData.json', function(err, data) {
        if (err) {
            return console.error(err);
        }

        //get server data
        var fullData = JSON.parse(data.toString());

        //find current server
        newServer = true;
        while (newServer) {
            //test for new server
            for (server in fullData["servers"]) {
                if (fullData["servers"][server]["id"] == msg.guild.id) {
                    spinData = fullData["servers"][server];
                    newServer = false;
                    break;
                }
            }

            //if new server, create tag
            if (newServer) {
                var newServerObj = new Object();
                newServerObj.id = msg.guild.id;

                currentTime = new Date();
                newServerObj.lastSpin = currentTime - (60000 * coolDownMins);
                newServerObj.users = [];

                fullData["servers"].push(newServerObj);
            }
        }

        //test for new user in server
        newUser = true;
        for (user in spinData["users"]) {
            if (spinData["users"][user]["id"] == msg.author.id) {
                olduser = spinData["users"][user];
                newUser = false;
                break;
            }
        }

        //calc spin amount
        oldTime = new Date(spinData["lastSpin"]);
        currentTime = new Date();
        elapsedMins = Math.floor((currentTime - oldTime) / 60000);
        amount = (elapsedMins - coolDownMins) + 1;

        //calc special rolls
        spinType = 0;
        ran = Math.floor(Math.random() * 100) + 1; //ran = 1-100
        if (ran > 98) { //99-100, 10x
            spinType = 3;
            amount = amount * 10;
        } else if (ran > 90) { //91-98, 5x
            spinType = 2;
            amount = amount * 5;
        } else if (ran > 70) { //71-90, 2x
            spinType = 1;
            amount = amount * 2;
        } else { //1-75, 1x
            spinType = 0;
        }

        //update data
        spinKA = true;
        hiSpinKA = false;
        if (newUser) { //create new user entry
            var newUserObj = new Object();
            newUserObj.id = msg.author.id;
            newUserObj.name = msg.author.username;

            amount = 1; //only 1 for first free spin
            newUserObj.spins = amount;
            newUserObj.hiSpin = amount;

            spinData["users"].push(newUserObj);
            msg.channel.send("Free spin for new user!");
            console.log("New user " + `${newUserObj.name}` + " spun the maid. (" + `${newUserObj.spins}` + " spins)");

            total = newUserObj.spins;
        } else { //old user, check for timeout
            if (elapsedMins >= coolDownMins) { //cooldown over, spin
                spinData["lastSpin"] = currentTime;
                olduser.spins = olduser.spins + amount;
                
                //update hispin if higher than current top
                if (!(olduser.hasOwnProperty("hiSpin") && amount <= olduser.hiSpin)) {
                    hiSpinKA = true;
                    olduser.hiSpin = amount;
                }

                console.log(`${olduser.name}` + " spun " + amount + " at " + currentTime.getHours() + ":" + currentTime.getMinutes() + ". (" + `${olduser.spins}` + " spins total) ran = " + ran);

                total = olduser.spins;
            } else { //cooldown not over, no spin
                spinKA = false;
                msg.channel.send('The maids are too dizzy to spin.\nCheck the cooldown with *"**@Maid Spin** timer"*.');
		        console.log(`${olduser.name}` + " attempted to spin at " + currentTime.getHours() + ":" + currentTime.getMinutes());
                msg.channel.send(dizzyGIF);
            }
        }

        //if spinKA is still true, save spin details and post spin
        if (spinKA) {
            newJSON = JSON.stringify(fullData);
            fs.writeFile('spinData.json', newJSON, function(err) {
                if (err) {
                    return console.error(err);
                }
            });
            printSpin(msg, amount, total, spinType, hiSpinKA);
        }
    });
}

function spin(msg) {
    updateCount(msg);
}

function spinTest(msg) {
    spinRegex = new RegExp(/.*(((spin|twirl|rotat|turn|twist|gyrat|spun|span|revol).*(mahoro|made|maid|meid|mori))|((mahoro|made|maid|meid|mori).*(spin|twirl|rotat|turn|twist|gyrat|spun|span|revol))).*/i);
    if (spinRegex.test(msg.content)) {
        spin(msg);
    }
}

//print help
function spinHelp(msg) {
    msg.channel.send("***Maid Spin Help:***\n" +
    "This bot lets you do what everyone has always wanted to do: **SPIN MAIDS**.\n" +
    'To spin a maid simply command her to spin by saying *"Spin the maid!"* or something similar into the chat.\n' +
    'The maids can only spin every **' + coolDownMins + " mins**, they get dizzy!\n" +
    'The maids can spin for as many minutes as have passed since they recovered. So if you spin 5 mins after they have recovered, you get 5 spin points.\n' +
    'You can check on the maids\' dizziness in more detail using *"**@Maid Spin** timer"*\n' +
    'To view who has spun the most maids, use *"**@Maid Spin** top"*.\n' +
    'To view who had the most powerful maid spin, use *"**@Maid Spin** toph"*.');
}

//display hispin leader board
function topHiSpins(msg) {
    fs.readFile('spinData.json', function(err, data) {
        if (err) {
            return console.error(err);
        }

        //get server data
        var spinData = getServerData(data, msg);
        if (spinData == -1) { //on no server entry
            msg.channel.send('This server has not been initialised for maid spin. Try spinning a maid to initialise. View help with *"**@Maid Spin** help"*.');
            return;
        }
        
        var parsedData = [];

        for (user in spinData["users"]) {
            if (spinData["users"][user].hasOwnProperty("hiSpin")) { //only include those with hispin property
                parsedData.push(spinData["users"][user]);
            }
        }

        parsedData.sort((a, b) => b.hiSpin - a.hiSpin);

        topstring = "***Highest One-Time Spin:***";
        rank = 0;
        for (user in parsedData) {
            rank = rank + 1;
            topstring = topstring + "\n#" + rank + " : **" + parsedData[user]["name"] + "** (" + parsedData[user]["hiSpin"] + " spin)";
        }

        msg.channel.send(topstring);
    });
}

//display basic leader board
function topSpins(msg) {
    fs.readFile('spinData.json', function(err, data) {
        if (err) {
            return console.error(err);
        }

        //get server data
        var spinData = getServerData(data, msg);
        if (spinData == -1) { //on no server entry
            msg.channel.send('This server has not been initialised for maid spin. Try spinning a maid to initialise. View help with *"**@Maid Spin** help"*.');
            return;
        }

        spinData["users"].sort((a, b) => b.spins - a.spins);

        topstring = "***Top Maid Spinners:***";
        rank = 0;
        for (user in spinData["users"]) {
            rank = rank + 1;
            topstring = topstring + "\n#" + rank + " : **" + spinData["users"][user]["name"] + "** (" + spinData["users"][user]["spins"] + " spins)";
        }

        msg.channel.send(topstring);
    });
}

function timerUp(msg) {
    fs.readFile('spinData.json', function(err, data) {
        if (err) {
            return console.error(err);
        }

        //get server data
        var spinData = getServerData(data, msg);
        if (spinData == -1) { //on no server entry
            msg.channel.send('This server has not been initialised for maid spin. Try spinning a maid to initialise. View help with *"**@Maid Spin** help"*.');
            return;
        }

        //get timings
        currentTime = new Date();
        lastSpin = new Date(spinData["lastSpin"]);

        elapsedMins = Math.floor((currentTime - lastSpin) / 60000);
        if (elapsedMins >= coolDownMins) {
            verbVar = "CAN";

            spins = (elapsedMins - coolDownMins + 1);
            if (spins == 1) {
                nounVar = "maid is";
            } else {
                nounVar = "maids are";
            }

            extraInfo = spins + " " + nounVar + " waiting to be spun!\n";
        } else {
            verbVar = "cannot"
            extraInfo = "The next maid can be spun in " + (coolDownMins - elapsedMins) + ' mins.\nFor more information use *"**@Maid Spin** help"*\n';
        }

        msg.channel.send("The last maid was spun " + elapsedMins + " mins ago. The cooldown is " + coolDownMins + " mins.\n" + extraInfo + "You **" + verbVar + "** spin a maid now.");

    });
}

//on message
client.on('message', msg => {
    //stop if msg by self
    if (msg.author.id != myID) {
        //console.log(msg);
        n = true;

        //if in DM then cancel and log
        if (msg.guild === null) {
            msg.channel.send("Maid Spin cannot be played in DMs. You cheater.");
            console.log(`${msg.author.username}` + " attempted to cheat.");
            n = false;
        }

        //if @bot then command
        if (n && msg.mentions.users.array().length > 0 && msg.mentions.users.array()[0]["id"] == myID) {
            trueContent = msg.content;
            console.log(trueContent);

            //test for leaderboard
            topRegex = new RegExp(/.*(top|high|leader|score|board|ladder).*/i);
            if (n && topRegex.test(trueContent)) {
                //top hispin
                tophRegex = new RegExp(/.*(toph|top-h|top h).*/i);
                if (n && tophRegex.test(trueContent)) {
                    n = false;
                    topHiSpins(msg);
                }

                //else go basic leaderboard
                if (n) {
                    topSpins(msg);
                    n = false;
                }
            }

            //test for timer
            timerRegex = new RegExp(/.*(tim|tu|clock).*/i);
            if (n && timerRegex.test(trueContent)) {
                n = false;
                timerUp(msg);
            }

            //Else then try to spin
            if (n) {
                spinTest(msg);
            }

            //Else then help
            if (n) {
                spinHelp(msg);
            }
        }

        //spin
        if (n) {
            spinTest(msg);
        }

        jojoRegex = new RegExp(/.*(jojo).*/i);
        if (n && jojoRegex.test(msg.content)) {
            msg.channel.send("Jojo is bad.");
        }

    }
});

fs.readFile('password.config', function(err, data) {
    client.login(data.toString());
});
