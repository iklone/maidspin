const Discord = require('discord.js');
var fs = require('fs');

const client = new Discord.Client();
const myID = "776090583362043906";

const coolDownMins = 0;
//base 5 mins

//GIF DB
const GIFdizzy = ["https://i.imgur.com/spr5vSH.gif",    //chiyo dizzy
"https://i.imgur.com/6K8xuk1.gif"];                     //minawa dizzy
const GIFfirst = ["https://i.imgur.com/kBwlzG5.gif"];   //tohru nerd
const GIFhearto = ["https://i.imgur.com/ks69ysE.gif"];  //mio
const GIFx1 = ["https://i.imgur.com/7hqhB0M.gif"];      //mori
const GIFx2 = ["https://i.imgur.com/WxIrcsu.gif"];      //maria
const GIFx3 = ["https://i.imgur.com/rvdiMVi.gif"];      //misaki
const GIFx5 = ["https://i.imgur.com/z6sjRXh.gif"];      //maika
const GIFx10 = ["https://i.imgur.com/swxzqBI.gif"];     //hinako
const GIFx25 = ["https://i.imgur.com/RJCx1rX.gif"];     //bikini mori

const GIFold = ["https://i.imgur.com/7hqhB0M.gif",    //0 mori (multi moris to stay a common spin)
"https://i.imgur.com/7hqhB0M.gif",                      //1 mori
"https://i.imgur.com/7hqhB0M.gif",                      //2 mori
"https://i.imgur.com/WxIrcsu.gif",                      //3 maria
"https://i.imgur.com/2zr3Y66.gif",                      //4 shinobu
"https://i.imgur.com/rvdiMVi.gif",                      //5 misaki
"https://i.imgur.com/g6uPz0v.gif",                      //6 sun
"https://i.imgur.com/swxzqBI.gif",                      //7 hinako
"https://i.imgur.com/ewDf0ZS.gif",                      //8 siesta
"https://i.imgur.com/ESBg2pr.gif",                      //9 aqua
"https://i.imgur.com/0axpToa.gif",                      //10 hotori mug
"https://i.imgur.com/z6sjRXh.gif",                      //11 maika
"https://i.imgur.com/RJCx1rX.gif"];                     //12 bikini mori

//spin regex
const maidWords = "maid|meid|mori|mahoro|maria|tohru";
const spinWords = "spin|twirl|rotat|turn|twist|gyrat|spun|span|revol|roll|spiral|whir|reel|pirouet|oscil|mawar";

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

function getGIF(GIFDB) {
    selectedGIF = Math.floor(Math.random() * GIFDB.length); //0 - DB.len

    return GIFDB[selectedGIF];
}

function printSpin(msg, spins, total, spinType, hiSpinKA, newCallKA, firstOfTheDay, heartoKA) {
    //correct noun for single/plural
    if (spins == 1) {
        nounVar = "maid";
    } else {
        nounVar = "maids";
    }

    //send base message
    msg.channel.send(`${msg.author}` + " spun " + spins + " " + nounVar + "! *(" + total + " spins total)*");

    //select multiplier message
    switch(spinType) {
        case 2:
            multiMessage = "The maids span extra fast today! *(x2 spins)*";
            gif = GIFx2;
            break;
        case 3:
            multiMessage = "The maids span extra-extra fast today! *(x3 spins)*";
            gif = GIFx3;
            break;
        case 5:
            multiMessage = "We brought the maid-spinomatic out for this one! *(x5 spins)*";
            gif = GIFx5;
            break;
        case 10:
            multiMessage = "Supersonic spinning! *(x10 spins)*";
            gif = GIFx10;
            break;
        case 25:
            multiMessage = "Wow! Today is the beach episode! *(x25 spins)*";
            gif = GIFx25;
            break;
        default:
            gif = GIFx1;
    }

    //firstOfTheDay handling
    if (firstOfTheDay) {
        msg.channel.send("You got the first spin of the day! Well done. *(+100 free spins)*");
        gif = GIFfirst;
    }

    //send multiplier message
    if (spinType > 1) {
        msg.channel.send(multiMessage);
    }

    //if newCall then send hispin message
    if (newCallKA) {
        msg.channel.send('No one has ever used that call before! *(x1½ spins)*');
    }

    //if hispin then send hispin message
    if (hiSpinKA) {
        msg.channel.send('This is a new highest spin score for you! (Check leaderboard with *"**@Maid Spin** toph"*).');
    }

    //if hearto notify
    if (heartoKA) {
        msg.channel.send("What's this? Your love for maids has manifested into a legendary **MEIDO NO HEARTO**!");
        msg.channel.send('Check what uses you can do with it with *"**@Maid Spin** hearto"*');
        gif = GIFhearto;
    }

    //send GIF
    msg.channel.send(getGIF(gif));
}

//test if call is new on current server
function testNewCall(msg) {
    data = fs.readFileSync('callData.json');
    //get server data
    var fullData = JSON.parse(data.toString());

    //find current server
    newServer = true;
    while (newServer) {
        //test for new server
        for (server in fullData["servers"]) {
            if (fullData["servers"][server]["id"] == msg.guild.id) {
                callData = fullData["servers"][server];
                newServer = false;
                break;
            }
        }

        //if new server, create tag
        if (newServer) {
            var newServerObj = new Object();
            newServerObj.id = msg.guild.id;

            newServerObj.calls = [];

            fullData["servers"].push(newServerObj);
        }
    }

    //loop through calls to find duplicates
    newCallKA = true;
    currentCall = msg.content;
    for (call in callData["calls"]) {
        if (callData["calls"][call] == currentCall) {
            newCallKA = false;
            break;
        }
    }

    //if new then append to file
    if (newCallKA) {
        callData["calls"].push(currentCall);
        newJSON = JSON.stringify(fullData);
        fs.writeFile('callData.json', newJSON, function(err) {
            if (err) {
                return console.error(err);
            }
        });
    }

    return newCallKA;
}

//calculate spins and update data files
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
                newServerObj.hearto = Math.floor(Math.random() * 20) + 20; //ran 20-40
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

        //update data
        spinKA = true;
        hiSpinKA = false;
        newCallKA = false;
        firstOfTheDay = false;
        heartoKA = false;
        if (newUser) { //create new user entry
            var newUserObj = new Object();
            newUserObj.id = msg.author.id;
            newUserObj.name = msg.author.username;

            amount = 1; //only 1 for first free spin
            newUserObj.spins = amount;
            newUserObj.hiSpin = amount;
            newUserObj.hearto = 0;

            spinData["users"].push(newUserObj);
            console.log("New user " + `${newUserObj.name}` + " spun the maid. (" + `${newUserObj.spins}` + " spins).");
            
            msg.channel.send(`${msg.author}` + " spun a maid! (Free spin for new user)");
            msg.channel.send("To read how to play use " + '*"**@Maid Spin** help"*.');
            msg.channel.send("https://i.imgur.com/7hqhB0M.gif");

            total = newUserObj.spins;
        } else { //old user, check for timeout
            if (elapsedMins >= coolDownMins) { //cooldown over, SPIN
                
                //check for firstOfTheDay
                if (oldTime.getDate() != currentTime.getDate()) {
                    firstOfTheDay = true;
                    amount = amount + 100;
                }

                //calc roll multiplier
                spinType = 0;
                ran = Math.floor(Math.random() * 100) + 1; //ran = 1-100
                if (ran > 99) {         //100   25x
                    spinType = 25;
                } else if (ran > 96) {  //97-99 10x
                    spinType = 10;
                } else if (ran > 90) {  //91-96 5x
                    spinType = 5;
                } else if (ran > 77) {  //78-91 3x
                    spinType = 3;
                } else if (ran > 57) {  //58-77 2x
                    spinType = 2;
                } else {                //1-57  1x
                    spinType = 1;
                }
                amount = amount * spinType;

                //test for new call
                if (testNewCall(msg)) {
                    amount = Math.ceil(amount * 1.5);
                    newCallKA = true;
                }

                spinData["lastSpin"] = currentTime;
                olduser.spins = olduser.spins + amount;
                
                //update hispin if higher than current top
                if (!(olduser.hasOwnProperty("hiSpin") && amount <= olduser.hiSpin)) {
                    hiSpinKA = true;
                    olduser.hiSpin = amount;
                }

                console.log(currentTime.getHours() + ":" + currentTime.getMinutes() + " " + amount + " spins (ran=" + ran + ") for " + `${olduser.name}` + "(" + `${olduser.spins}` + " total)");
                total = olduser.spins;

                //check meido no hearto
                spinData["hearto"] = spinData["hearto"] - 1;
                if (spinData["hearto"] == 0) {
                    heartoKA = true;
                    spinData["hearto"] = Math.floor(Math.random() * 20) + 20; //ran 20-40
                    olduser.hearto = olduser.hearto + 1;
                    console.log(currentTime.getHours() + ":" + currentTime.getMinutes() + " " + `${olduser.name}` + "found a meido no hearto");
                }

                printSpin(msg, amount, total, spinType, hiSpinKA, newCallKA, firstOfTheDay, heartoKA);
            } else { //cooldown not over, no spin, dizzy
                spinKA = false;
                msg.channel.send('The maids are too dizzy to spin.\nCheck the cooldown with *"**@Maid Spin** timer"*.');
		        console.log(currentTime.getHours() + ":" + currentTime.getMinutes() + " " + `${olduser.name}` + " attempted to spin.");
                msg.channel.send(getGIF(GIFdizzy));
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
        }
    });
}

function spin(msg) {
    updateCount(msg);
}

function spinTest(msg) {
    regexString = ".*(((" + spinWords + ").*(" + maidWords + "))|((" + maidWords + ").*(" + spinWords + "))).*";
    spinRegex = new RegExp(regexString, "i");
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
    'To view who had the strongest maid spin, use *"**@Maid Spin** tops"*.\n' +
    '*Bot built and maintained by **iklone**: http://iklone.org*');
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

function heartoCheck(msg) {
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

        //test for new user in server
        newUser = true;
        for (user in spinData["users"]) {
            if (spinData["users"][user]["id"] == msg.author.id) {
                olduser = spinData["users"][user];
                newUser = false;
                break;
            }
        }

        //if new user error
        if (newUser) {
            msg.channel.send("You haven't spun any maids yet." + 'View help with *"**@Maid Spin** help"*.');
        } else {
            msg.channel.send("You currently have **" + olduser["hearto"] + "** meido no hearto.");

            /*msg.channel.send("Trade x1 for 250 spins with " + '*"**@Maid Spin** hearto spins"*\n' +
            "Trade x3 to initiate *MAID DAY* with " + '*"**@Maid Spin** hearto maid day"*\n' +
            "*(Maid Day is a 24 hour period where **all** spins will be multiplied by 2)*");*/
        }
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
            msg.channel.send("https://i.imgur.com/rjm5m8y.jpg");
            console.log(`${msg.author.username}` + " attempted to cheat.");
            n = false;
        }

        //if @bot then command
        if (n && msg.mentions.users.array().length > 0 && msg.mentions.users.array()[0]["id"] == myID) {
            trueContent = msg.content;
            console.log(trueContent);

            //test for leaderboard
            topRegex = new RegExp(/.*top.*/i);
            if (n && topRegex.test(trueContent)) {
                //top hispin
                tophRegex = new RegExp(/.*(tops|top-s|top s).*/i);
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

            //test for hearto
            heartoRegex = new RegExp(/.*(heart|kokoro|soul).*/i)
            if (n && heartoRegex.test(trueContent)) {
                n = false;
                heartoCheck(msg);
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
        if (jojoRegex.test(msg.content)) {
            msg.channel.send("Jojo is bad.");
        }

    }
});

fs.readFile('password.config', function(err, data) {
    client.login(data.toString());
});