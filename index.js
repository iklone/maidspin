const Discord = require('discord.js');
var fs = require('fs');
const client = new Discord.Client();

//CONFIG: change to your discord application's ID
const myID = "715582108600369253";

//CONFIG: change to how long you want between spins
//default 5
const coolDownMins = 5;

//CONFIG: change to how many spins you want 1 hearto to be worth
//1 hearto = x spins
//default 250
const heartoExchangeRate = 250;

//GIF DB
const GIFdizzy = ["https://i.imgur.com/spr5vSH.gif",    //chiyo dizzy
"https://i.imgur.com/spr5vSH.gif",
"https://i.imgur.com/spr5vSH.gif",
"https://i.imgur.com/6K8xuk1.gif"];                     //minawa dizzy

const GIFfirst = ["https://i.imgur.com/kBwlzG5.gif"];   //tohru nerd

const GIFhearto = ["https://i.imgur.com/ZsAtJ79.gif",   //illya
"https://i.imgur.com/u0THn5v.gif",                      //tohru hearto1
"https://i.imgur.com/l4adMWi.gif",                      //tohru hearto2
"https://i.imgur.com/Ulnp3Pn.gif"];                     //shomin
const GIFhearto2 = ["https://i.imgur.com/ks69ysE.gif"]; //mio
const GIFheartoB = ["https://i.imgur.com/UaRqK7T.gif"]; //bocchi

const GIFx1 = ["https://i.imgur.com/7hqhB0M.gif",       //mori
"https://i.imgur.com/7hqhB0M.gif",
"https://i.imgur.com/7hqhB0M.gif",
"https://i.imgur.com/7hqhB0M.gif",
"https://i.imgur.com/7hqhB0M.gif",
"https://i.imgur.com/7hqhB0M.gif",
"https://i.imgur.com/WxIrcsu.gif",                      //maria
"https://i.imgur.com/WxIrcsu.gif",
"https://i.imgur.com/2zr3Y66.gif",                      //shinobu
"https://i.imgur.com/rvdiMVi.gif",                      //misaki
"https://i.imgur.com/g6uPz0v.gif",                      //sun
"https://i.imgur.com/ewDf0ZS.gif",                      //siesta
"https://i.imgur.com/fnFiCSt.gif",                      //chiyo syaro
"https://i.imgur.com/zb30FvR.gif",                      //kohaku
"https://i.imgur.com/r7311cq.gif",                      //mahoro dress
"https://i.imgur.com/xmyBake.gif",                      //mahoro summer
"https://i.imgur.com/pdRg9wY.gif",                      //mayu
"https://i.imgur.com/762sNW1.gif",                      //komi1
"https://i.imgur.com/5e2WlD2.gif",                      //usada ice
"https://i.imgur.com/o6vfB2l.gif",                      //summer pockets
"https://i.imgur.com/jT1EGoz.gif"];                     //vocaloid

const GIFx2 = ["https://i.imgur.com/ESBg2pr.gif",       //aqua
"https://i.imgur.com/H6ejqG9.gif",                      //comic girls
"https://i.imgur.com/gDSmFko.gif",                      //emilyko
"https://i.imgur.com/dkZXDEJ.gif",                      //mahoro minawa
"https://i.imgur.com/wZB84I2.gif",                      //tohru kanna
"https://i.imgur.com/0axpToa.gif",                      //hotori mug
"https://i.imgur.com/KaFQkQC.gif",                      //komi2
"https://i.imgur.com/WTcm1zq.gif",                      //uchimaid
"https://i.imgur.com/pf6Hx1B.gif"];                     //akane ranma

const GIFx3 = ["https://i.imgur.com/swxzqBI.gif",       //hinako note
"https://i.imgur.com/yz6XX5b.gif",                      //hotori sing
"https://i.imgur.com/EJcsTXG.gif",                      //he is my master
"https://i.imgur.com/jiwrXYq.gif",                      //tohru old
"https://i.imgur.com/a0IkOLz.gif",                      //dragon maids
"https://i.imgur.com/DPSNmnB.gif"];                     //chiyo

const GIFx5 = ["https://i.imgur.com/o8tN0Fk.gif",       //odyk
"https://i.imgur.com/lLscYGH.gif",                      //kurumi
"https://i.imgur.com/viNIPJK.gif",                      //usada rice
"https://i.imgur.com/JJWccfF.gif"];                     //may

const GIFbirth = ["https://i.imgur.com/tBRfWSr.gif"];   //mahoro cake
const GIFxmas = ["https://i.imgur.com/N8qbwqR.gif"];    //mahoro christmas
const GIFmatic = ["https://i.imgur.com/z6sjRXh.gif"];   //maiko'matic

const GIFx10 = ["https://i.imgur.com/2Uy7EMA.gif",      //dejiko
"https://i.imgur.com/yGPPyon.gif"];                     //mahoro fast

const GIFbikini = ["https://i.imgur.com/RJCx1rX.gif"];  //bikini mori
const GIFyukata = ["https://i.imgur.com/TezaN62.gif"];  //yukata mori

//spin regex
const maidWords = "maid|meid|mori|mahoro|maria|tohru|au pair|domestic|serv|clean|nanny|facto|ancilla|tetsudai|kaseifu|jochu|メイド|メード|めいど";
const spinWords = "spin|twirl|rotat|turn|twist|gyrat|spun|span|revol|roll|spiral|whir|reel|pirouet|oscil|mawa|angular|centri|360|purl|pendu|wheel|circ|pivot|swiv|waltz|gyre|altern|round|guru|kuru|回|ぐる|グル|くる|クル|繰|スピン";

//on startup
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

//return fullData
function getFullData(data) {
    var fullData = JSON.parse(data.toString());
    return fullData;
}

//write fullData to spinData
function writeData(fullData) {
    newJSON = JSON.stringify(fullData);
    fs.writeFile('spinData.json', newJSON, function(err) {
        if (err) {
            return console.error(err);
        }
    });
}

//return server data from msg's server
function getServerData(fullData, msg, verboseKA) {
    newServer = true;
    //test for new server
    for (server in fullData["servers"]) {
        if (fullData["servers"][server]["id"] == msg.guild.id) {
            spinData = fullData["servers"][server];
            newServer = false;
            break;
        }
    }

    //if new server, return 0
    if (newServer) {
        spinData = 0;
        if (verboseKA) {
            msg.channel.send('This server has not been initialised for maid spin. Try spinning a maid to initialise. View help with *"**@Maid Spin** help"*.');
        }
    }

    return spinData;
}

//return user data from msg's user
function getUserData(spinData, msg, verboseKA) {
    //test for new user in server
    newUser = true;
    for (user in spinData["users"]) {
        if (spinData["users"][user]["id"] == msg.author.id) {
            olduser = spinData["users"][user];
            newUser = false;
            break;
        }
    }

    //if new user return 0
    if (newUser) {
        if (verboseKA) {
            msg.channel.send("You haven't spun any maids yet." + ' View help with *"**@Maid Spin** help"*.');
        }
        olduser = 0;
    }

    return olduser;
}

function getGIF(GIFDB) {
    selectedGIF = Math.floor(Math.random() * GIFDB.length); //0 - DB.len

    return GIFDB[selectedGIF];
}

function atID(id) {
    atString = "<@" + id + ">";
    return atString;
}

function printSpin(msg, spins, total, spinType, hiSpinKA, newCallKA, firstOfTheDay, heartoKA, maidDayKA, maidDayElapsedHours, maidDayMulti, overtaken) {
    //correct noun for single/plural
    if (spins == 1) {
        nounVar = "maid";
    } else {
        nounVar = "maids";
    }

    //send base message
    msg.channel.send(`${msg.author}` + " spun " + spins + " " + nounVar + "! *(" + total + " spins total)*");

    //select multiplier message
    flavourRan = Math.floor(Math.random() * 100) + 1; //1-100
    switch(spinType) {
        case 2:
            multiMessage = "The maids span extra fast today! *(x2 spins)*";
            gif = GIFx2;
            break;
        case 3:
            multiMessage = "Many maids spin better than one. *(x3 spins)*";
            gif = GIFx3;
            break;
        case 5:
            if (flavourRan < 70) { //basic x5
                multiMessage = "With maids, you're one step closer to paradise. *(x5 spins)*";
                gif = GIFx5;
            } else if (flavourRan < 80) { //birthday
                multiMessage = "With maids, every day is your birthday! *(x5 spins)*";
                gif = GIFbirth;
            } else if (flavourRan < 90) { //christmas
                multiMessage = "With maids, every day is Christmas day! *(x5 spins)*";
                gif = GIFxmas;
            } else { //spinomatic
                multiMessage = "We brought the maid-spinomatic out for this one! *(x5 spins)*";
                gif = GIFmatic;
            }
            break;
        case 10:
            multiMessage = "The maids have reached supersonic speeds! *(x10 spins)*";
            gif = GIFx10;
            break;
        case 25:
            if (flavourRan < 75) {
                multiMessage = "Wow! Today is the beach episode! *(x25 spins)*";
                gif = GIFbikini;
            } else {
                multiMessage = "Wow! Today is the summer festival episode! *(x25 spins)*";
                gif = GIFyukata;
            }
            break;
        default:
            gif = GIFx1;
    }

    //maid day handling
    if (maidDayKA) {
        //correct noun for single/plural
        if (maidDayElapsedHours == 23) {
            dayNounVar = "hour remains";
        } else {
            dayNounVar = "hours remain";
        }
        msg.channel.send("Today is maid day, time to celebrate! Under " + (24 - maidDayElapsedHours) + " " + dayNounVar + ". *(x" + maidDayMulti+ " spins)*");
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
    if (heartoKA > 0) {
        if (heartoKA == 2) {
            msg.channel.send("...Everyone's love for maids is different. Your unique love for maids has manifested into a sticky **MEIDO NO HEARTO**!");
            msg.channel.send('Check what uses you can do with it with *"**@Maid Spin** hearto"*');
            gif = GIFheartoB;
        } else if (heartoKA == 3) {
            msg.channel.send("A maid-miracle! Your unending love for maids has manifested into **TWO MEIDO NO HEARTO**!");
            msg.channel.send('Check what uses you can do with them with *"**@Maid Spin** hearto"*');
            gif = GIFhearto2;
        } else {
            msg.channel.send("What's this? Your love for maids has manifested into a legendary **MEIDO NO HEARTO**!");
            msg.channel.send('Check what uses you can do with it with *"**@Maid Spin** hearto"*');
            gif = GIFhearto;
        }
        msg.channel.send("*(Heartos are x2 as common for the remainder of maidspins run)*");
    }

    //notify overtaken users
    if (overtaken.length > 0) {
        userNoun = "user ";
        overtakenList = atID(overtaken[overtaken.length - 1]);
        overtaken.pop();

        if (overtaken.length > 0) {
            userNoun = "users ";
            overtakenList = atID(overtaken[overtaken.length - 1]) + " and " + overtakenList;
        }
        overtaken.pop();

        if (overtaken.length > 0) {
            for (user in overtaken) {
                overtakenList = atID(overtaken[user]) + ", " +  overtakenList;
            }
        }

        msg.channel.send("You have overtaken " + userNoun + overtakenList + ".");
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

//check for overtaking on rank
function checkOvertaken(spinData, oldAmount, newAmount) {
    overtaken = [];
    for (user in spinData["users"]) {
        if (spinData["users"][user]["spins"] >= oldAmount && spinData["users"][user]["spins"] < newAmount) {
            if (spinData["users"][user]["spins"] > 10) {
                overtaken.push(spinData["users"][user]["id"]);
            }
        }
    }
    return overtaken;
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
                newServerObj.hearto = Math.floor(Math.random() * 10) + 20; //ran 10-20
                newServerObj.maidDay = 0;
                newServerObj.maidDayMulti = 1;
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

        currentTime = new Date();

        //calc spin amount
        oldTime = new Date(spinData["lastSpin"]);
        elapsedMins = Math.floor((currentTime - oldTime) / 60000);
        amount = elapsedMins;

        //update data
        spinKA = true;
        hiSpinKA = false;
        newCallKA = false;
        firstOfTheDay = false;
        heartoKA = 0;
        maidDayKA = false;
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
            
            msg.channel.send(`${msg.author}` + " spun a maid! (Free spin for new user, timer not reset)");
            msg.channel.send("To read how to play use " + '*"**@Maid Spin** help"*.');
            msg.channel.send("https://i.imgur.com/7hqhB0M.gif");

            total = newUserObj.spins;
        } else { //old user, check for timeout
            if (elapsedMins >= coolDownMins) { //cooldown over, SPIN
                oldAmount = olduser["spins"];
                
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
                } else if (ran > 95) {  //96-99 10x
                    spinType = 10;
                } else if (ran > 85) {  //86-95 5x
                    spinType = 5;
                } else if (ran > 70) {  //71-85 3x
                    spinType = 3;
                } else if (ran > 50) {  //51-70 2x
                    spinType = 2;
                } else {                //1-50  1x
                    spinType = 1;
                }
                amount = amount * spinType;

                //test for new call
                if (testNewCall(msg)) {
                    amount = Math.ceil(amount * 1.5);
                    newCallKA = true;
                }

                //calc elapsed hours since maid day start
                maidDayStart = new Date(spinData["maidDay"]);
                elapsedMaidDayHours = Math.floor((currentTime - maidDayStart) / 3600000);

                //test for maid day
                maidDayMulti = spinData["maidDayMulti"];
                if (elapsedMaidDayHours < 24) {
                    maidDayKA = true;
                    amount = amount * maidDayMulti;
                }


                spinData["lastSpin"] = currentTime;
                olduser.spins = olduser.spins + amount;

                //check if overtaken anyone
                overtaken = checkOvertaken(spinData, oldAmount, olduser.spins);

                //update hispin if higher than current top
                if (!(olduser.hasOwnProperty("hiSpin") && amount <= olduser.hiSpin)) {
                    hiSpinKA = true;
                    olduser.hiSpin = amount;
                }

                console.log(currentTime.getHours() + ":" + currentTime.getMinutes() + " - " + amount + " spins (ran=" + ran + ") for " + `${olduser.name}` + " (" + `${olduser.spins}` + " total)");
                total = olduser.spins;

                //check meido no hearto
                spinData["hearto"] = spinData["hearto"] - 1;
                if (spinData["hearto"] <= 0) {
                    if (ran > 85) {
                        heartoKA = 3;
                        olduser.hearto = olduser.hearto + 2;
                    } else if (ran < 10) {
                        heartoKA = 2;
                        olduser.hearto = olduser.hearto + 1;
                    } else {
                        heartoKA = 1;
                        olduser.hearto = olduser.hearto + 1;
                    }

                    //reset hearto timer
                    spinData["hearto"] = Math.floor(Math.random() * 20) + 10; //ran 10-30
                    //hearto reset SPECIAL options
                    //spinData["hearto"] = 1;
                    //spinData["hearto"] = Math.floor(Math.random() * 5) + 5; //ran 5-15
                    console.log(currentTime.getHours() + ":" + currentTime.getMinutes() + " " + `${olduser.name}` + " found a meido no hearto");
                }

                printSpin(msg, amount, total, spinType, hiSpinKA, newCallKA, firstOfTheDay, heartoKA, maidDayKA, elapsedMaidDayHours, maidDayMulti, overtaken);
            } else { //cooldown not over, no spin, dizzy
                spinKA = false;
                msg.channel.send('The maids are too dizzy to spin. Spin again in ' + (coolDownMins - elapsedMins) + " mins.");
		        console.log(currentTime.getHours() + ":" + currentTime.getMinutes() + " " + `${olduser.name}` + " attempted to spin.");
                msg.channel.send(getGIF(GIFdizzy));
            }
        }

        //if spinKA is still true, save spin details and post spin
        if (spinKA) {
            writeData(fullData);
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
    "This bot lets you do what you've always wanted to do: **SPIN MAIDS**.\n" +
    'To spin a maid simply command her to spin by saying *"Spin the maid!"* or something similar into the chat.\n' +
    'The maids can only spin every **' + coolDownMins + " mins**, they get dizzy!\n" +
    'The maids can spin for as many minutes as have passed since they recovered. So if you spin 5 mins after they have recovered, you get 5 spin points.\n' +
    'You will get extra spins if you spin the maids using a message no one has used before, so be creative.\n' +
    'Occasionally you will find a mysterious *meido no hearto*, use *"**@Maid Spin** hearto"* to see what you can do with them.\n' +
    'To view who has spun the most maids, use *"**@Maid Spin** top"*.\n' +
    'To view who had the biggest spin, use *"**@Maid Spin** toph"*.\n' +
    'To view the list of meido no hearto found, use *"**@Maid Spin** tophearto"*.\n' +
    '*Bot built and maintained by **iklone**: http://iklone.org*');
}

//display hispin leader board
function topHiSpins(msg) {
    fs.readFile('spinData.json', function(err, data) {
        if (err) {
            return console.error(err);
        }

        //get server data
        var spinData = getServerData(getFullData(data), msg, true);
        
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
        msg.channel.send('To view the NEW global leaderboard use *"**@Maid Spin** topall"*');
    });
}

//display hearto leader board
function topHearto(msg) {
    fs.readFile('spinData.json', function(err, data) {
        if (err) {
            return console.error(err);
        }

        //get server data
        var spinData = getServerData(getFullData(data), msg, true);
        
        var parsedData = [];

        for (user in spinData["users"]) {
            if (spinData["users"][user].hasOwnProperty("hearto") && spinData["users"][user]["hearto"] > 0) { //only include those with hearto property > 0
                parsedData.push(spinData["users"][user]);
            }
        }

        parsedData.sort((a, b) => b.hearto - a.hearto);

        topstring = "***Meido no Hearto Found:***";
        rank = 0;
        for (user in parsedData) {
            rank = rank + 1;
            topstring = topstring + "\n#" + rank + " : **" + parsedData[user]["name"] + "** (" + parsedData[user]["hearto"] + " hearto)";
        }

        msg.channel.send(topstring);
        msg.channel.send('To view the NEW global leaderboard use *"**@Maid Spin** topall"*');
    });
}

//display basic leader board
function topSpins(msg) {
    fs.readFile('spinData.json', function(err, data) {
        if (err) {
            return console.error(err);
        }

        //get server data
        var spinData = getServerData(getFullData(data), msg, true);

        spinData["users"].sort((a, b) => b.spins - a.spins);

        topstring = "***Top Maid Spinners:***";
        rank = 0;
        for (user in spinData["users"]) {
            rank = rank + 1;
            topstring = topstring + "\n#" + rank + " : **" + spinData["users"][user]["name"] + "** (" + spinData["users"][user]["spins"] + " spins)";
        }

        msg.channel.send(topstring);
        msg.channel.send('To view the NEW global leaderboard use *"**@Maid Spin** topall"*');
    });
}

//display old leader board
function topOldSpins(msg) {
    fs.readFile('oldSpinData.json', function(err, data) {
        if (err) {
            msg.channel.send("This bot is not configured with data from Maid Spin v1.");
            return console.error(err);
        }

        //get server data
        var spinData = getServerData(getFullData(data), msg, false);
        if (spinData == 0) { //notify if no old data
            msg.channel.send("This server has no data from Maid Spin v1.");
            return;
        }

        spinData["users"].sort((a, b) => b.spins - a.spins);

        topstring = "***Top Maid Spinners:***";
        rank = 0;
        for (user in spinData["users"]) {
            rank = rank + 1;
            topstring = topstring + "\n#" + rank + " : **" + spinData["users"][user]["name"] + "** " + spinData["users"][user]["spins"] + " spins (highest " + spinData["users"][user]["hiSpin"] + ")";
        }

        msg.channel.send(topstring);
    });
}

//display overall leader board
async function topallSpins(msg) {
    fs.readFile('spinData.json', function(err, data) {
        if (err) {
            return console.error(err);
        }

        //get server data
        var spinData = [];
        fullData = getFullData(data);
        for (server in fullData["servers"]) {
            spinData.push.apply(spinData, fullData["servers"][server]["users"]);
        }
        spinData.sort((a, b) => b.spins - a.spins);

        //only keep top of dupes
        var topSpinData = [];
        for (user in spinData) {
            novelUser = true;
            for (addedUser in topSpinData) {
                if (topSpinData[addedUser]["id"] == spinData[user]["id"]) {
                    novelUser = false;
                }
            }
            if (novelUser) {
                topSpinData.push(spinData[user]);
                //console.log("added " + spinData[user]["name"]);
            }
        }

        topstring = "***Overall top Maid Spinners:***\n(Highest spin count in any server)";
        rank = 0;
        for (user in topSpinData) {
            rank = rank + 1;
            userTrueName = topSpinData[user]["truename"];
            if (userTrueName == undefined) {
                userTrueName = topSpinData[user]["name"];
            } else {
                userTrueName = userTrueName + ' AKA "' + topSpinData[user]["name"] + '"'
            }
            topstring = topstring + "\n#" + rank + " : **" + userTrueName + "** (" + topSpinData[user]["spins"] + " spins)";
            if (rank % 25 == 0) {
                msg.channel.send(topstring);
                topstring = "";
            }
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
        var spinData = getServerData(getFullData(data), msg, true);

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
            verbVar = "CANNOT"
            extraInfo = "The next maid can be spun in " + (coolDownMins - elapsedMins) + ' mins.\nFor more information use *"**@Maid Spin** help"*\n';
        }

        msg.channel.send("The last maid was spun " + elapsedMins + " mins ago. The cooldown is " + coolDownMins + " mins.\n" + extraInfo + "You **" + verbVar + "** spin a maid now.");
    });
}

//check your number of heartos
function heartoCheck(msg) {
    fs.readFile('spinData.json', function(err, data) {
        if (err) {
            return console.error(err);
        }

        olduser = getUserData(getServerData(getFullData(data), msg, true), msg, true);

        if (olduser) {
            msg.channel.send("You currently have **" + olduser["hearto"] + "** meido no hearto.\n" +
            'To view the list of meido no hearto found, use *"**@Maid Spin** tophearto"*.\n');

            msg.channel.send("With your meido no hearto you can either:\n" + 
            "Trade x1 for " + heartoExchangeRate + " spins with " + '*"**@Maid Spin** hearto spins"*\n' +
            "Trade any number to initiate *MAID DAY* with " + '*"**@Maid Spin** hearto maid day X"*\n' +
            "*Maid Day* is a 24 hour period where all spins will be given a multiplier." +
            "The number you specify with X will be both the cost and the multiplier for the day.\n" +
            "Multiple players' hearto can combine to create higher multipliers!");
        }
    });
}

//spend heartos, return true is successful false if not
function spendHearto(cost, msg) {
    data = fs.readFileSync('spinData.json');
    fullData = getFullData(data);
    olduser = getUserData(getServerData(fullData, msg, true), msg, true);
    if (olduser) {
        //check balance is valid
        if (olduser["hearto"] < cost) {
            msg.channel.send("You do not have enough meido no hearto. *(" + olduser["hearto"] + "/" + cost + ")*");
            return false;
        } else {
            olduser["hearto"] = olduser["hearto"] - cost;
            writeData(fullData);
            return true;
        }
    }
}

//trade hearto for spins
function heartoTrade(msg) {
    //spend heartos
    if (spendHearto(1, msg)) {
        fs.readFile('spinData.json', function(err, data) {
            data = fs.readFileSync('spinData.json');
            fullData = getFullData(data);
            olduser = getUserData(getServerData(fullData, msg, true), msg, true);
            olduser["spins"] = olduser["spins"] + heartoExchangeRate;

            msg.channel.send("One meido no hearto dissolves into " + heartoExchangeRate + " tiny maids, all spinning. *(+" + heartoExchangeRate + " spins)*");
            msg.channel.send("https://i.imgur.com/Hu6nQHB.gif");

            writeData(fullData);
        });
    }
}

//start maid day with hearto
function heartoMaidDay(msg) {
    //get final input, should be valid number value, run if valid integer
    msgArray = msg.content.split(" ");
    cost = parseInt(msgArray[msgArray.length - 1]);
    if (Number.isInteger(cost)) {
        //run if cost is 2 or more
        if (cost > 1) {
            //run if enough heartos
            if (spendHearto(cost, msg)) {
                fs.readFile('spinData.json', function(err, data) {
                    data = fs.readFileSync('spinData.json');
                    fullData = getFullData(data);
                    spinData = getServerData(fullData, msg, true);

                    msg.channel.send("The " + cost + " meido no hearto burst into flames. You have completed the maid day ritual.");

                    //check if maid day already
                    currentTime = new Date();
                    maidDayStart = new Date(spinData["maidDay"]);
                    elapsedMaidDayHours = Math.floor((currentTime - maidDayStart) / 3600000);
                    maidDayMulti = spinData["maidDayMulti"];
                    if (elapsedMaidDayHours < 24) {
                        spinData["maidDayMulti"] = spinData["maidDayMulti"] * cost;
                        msg.channel.send("Your joint love for maids have crystallised together into TRUE MAID AGAPE. Your meido no hearto contribution will be multiplied with the existing multiplier and the day reset.");
                    } else {
                        spinData["maidDayMulti"] = cost;
                    }
                    spinData["maidDay"] = new Date();

                    msg.channel.send("All spins will be worth " + spinData["maidDayMulti"] + "x more for the next 24 hours.");
        
                    if (spinData["maidDayMulti"] > 4) { //maid day flavour text differs with multiplier
                        if (spinData["maidDayMulti"] > 12) {
                            if (spinData["maidDayMulti"] > 1000) {
                                msg.channel.send("The world falls silent as the souls of a myriad spinning maids embrace the human race.");
                                msg.channel.send("**THE MAID INSTRUMENTALITY PROJECT HAS BEGUN...**");
                                msg.channel.send("https://i.imgur.com/FyU2Zrl.gif");
                            } else {
                                msg.channel.send("They burn with a rainbow of colours with the power of a maid's tears. This maid day marks a new era of maids.");
                                msg.channel.send("**MAID DAY OF HEAVEN HAS BEGUN**");
                                msg.channel.send("https://i.imgur.com/bQHwKhE.gif");
                            }
                        } else {
                            msg.channel.send("They burn pink with the power of a maid's beauty. This is a legendary maid day that will be recorded in maid history forever.");
                            msg.channel.send("**MAID DAY OF JUSTICE HAS BEGUN**");
                            msg.channel.send("https://i.imgur.com/e7CMBJM.gif");
                        }
                    } else {
                        msg.channel.send("**MAID DAY HAS BEGUN**");
                        msg.channel.send("https://i.imgur.com/fDnQnao.gif");
                    }
                    
                    writeData(fullData);
                });
            }
        } else {
            msg.channel.send("You don't want to do that, a 1x multiplier won't do anything. Use the form " + '*"**@Maid Spin** maid day X"*, where X is the multiplier you want.');
        }
    } else {
        msg.channel.send("You must use a valid number more than 1. Use the form " + '*"**@Maid Spin** maid day X"*, where X is the multiplier you want.');
    }
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
                tophRegex = new RegExp(/.*(toph|top-h|top h).*/i);
                if (n && tophRegex.test(trueContent)) {
                    n = false;
                    tophRegex = new RegExp(/.*(heart).*/i);
                    if (tophRegex.test(trueContent)) {
                        topHearto(msg);
                    } else {
                        topHiSpins(msg);
                    }
                }

                //top all
                topAllRegex = new RegExp(/.*all.*/i);
                if (n && topAllRegex.test(trueContent)) {
                    n = false;
                    topallSpins(msg);
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
            heartoRegex = new RegExp(/.*heart.*/i);
            if (n && heartoRegex.test(trueContent)) {
                //trade for spins
                heartoTradeRegex = new RegExp(/.*(trade|spin).*/i);
                if (n && heartoTradeRegex.test(trueContent)) {
                    n = false;
                    heartoTrade(msg);
                }

                //trade for maid day
                heartoMaidDayRegex = new RegExp(/.*(maid day|maidday|maiday).*/i);
                if (n && heartoMaidDayRegex.test(trueContent)) {
                    n = false;
                    heartoMaidDay(msg);
                }

                //else check hearto count and shop
                if (n) {
                    heartoCheck(msg);
                    n = false;
                }
            }

            //Else then try to spin
            if (n) {
                spinTest(msg);
            }

            //Mahoro wave easter egg
            waveRegex = new RegExp(/.*(wav|hi|hello|good|greet|hey).*/i);
            if (waveRegex.test(msg.content)) {
                msg.channel.send("Hello!");
                msg.channel.send("https://i.imgur.com/jQpZFsp.gif");
                n = false;
            }

            //Else then help
            if (n) {
                spinHelp(msg);
            }
        }

        //spin maids
        if (n) {
            spinTest(msg);
        }

        //very important functionality. DO NOT DELETE!
        jojoRegex = new RegExp(/.*(jojo).*/i);
        if (jojoRegex.test(msg.content)) {
            msg.channel.send("Jojo is bad.");
        }
    }
});

//Login to bot using password.config
fs.readFile('password.config', function(err, data) {
    botSecret = data.toString();
    botSecret = botSecret.replace(/(\r\n|\n|\r)/gm, "");
    client.login(botSecret);
});