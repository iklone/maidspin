const Discord = require('discord.js');
var fs = require('fs');

const client = new Discord.Client();
const myID = "715582108600369253";

const coolDownMins = 5;
//base 5 mins

const dizzyGIF = "https://i.imgur.com/spr5vSH.gif"; //shows on no spin
const maidGIFs = ["https://i.imgur.com/7hqhB0M.gif", "https://i.imgur.com/WxIrcsu.gif", "https://i.imgur.com/2zr3Y66.gif", "https://i.imgur.com/rvdiMVi.gif", "https://i.imgur.com/ewDf0ZS.gif", "https://i.imgur.com/z6sjRXh.gif", "https://i.imgur.com/RJCx1rX.gif"];
//[mori, maria, shinobu, misaki, siesta, maika, bikiniMori]
// 0     1      2        3       4       5      6

//on startup
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    
    fs.readFile('spinData.json', function(err, data) {
        if (err) {
            return console.error(err);
        }

        var spinData = JSON.parse(data.toString());
        currentTime = new Date();
        spinData["lastSpin"] = currentTime - (60000 * coolDownMins);

        newJSON = JSON.stringify(spinData);
        fs.writeFile('spinData.json', newJSON, function(err) {
            if (err) {
                return console.error(err);
            }
        });
    });
});

function printSpin(msg, spins, total, spinType) {
    if (spins == 1) {
        nounVar = "maid";
    } else {
        nounVar = "maids";
    }
    msg.channel.send(`${msg.author}` + " spun " + spins + " " + nounVar + "! *(" + total + " spins total)*");
    
    //if x2
    if (spinType == 3 || spinType == 4) {
        msg.channel.send("The maids span extra fast today! *(x2 spins)*");
    }

    //if x5
    if (spinType == 5) {
        msg.channel.send("We brought the maid-spinomatic out for this one! *(x5 spins)*");
    }

    //if x10
    if (spinType == 6) {
        msg.channel.send("Wow! Today is the beach episode! *(x10 spins)*");
    }

    msg.channel.send(maidGIFs[spinType]);
}

function updateCount(msg) {
    fs.readFile('spinData.json', function(err, data) {
        if (err) {
            return console.error(err);
        }

        var spinData = JSON.parse(data.toString());

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
        ran = Math.floor(Math.random() * 100); //ran = 0-99
        if (ran > 35) { //36% chance
            if (ran > 55) { // 20% chance
                if (ran > 75) { // 20% chance
                    if (ran > 85) { // 10% chance
                        if (ran > 90) { // 7% chance
                            if (ran > 97) { // 2% chance
                                //bikinimori x10
                                spinType = 6;
                                amount = amount * 10;
                            } else {
                                //maika x5
                                spinType = 5;
                                amount = amount * 5;
                            }
                        } else {
                            //siesta x2
                            spinType = 4;
                            amount = amount * 2;
                        }
                    } else {
                        //misaki x2
                        spinType = 3;
                        amount = amount * 2;
                    }
                } else {
                    //shinobu
                    spinType = 2;
                }
            } else {
                //maria
                spinType = 1;
            }
        } //else mori

        spinKA = true;
        if (newUser) { //create new user entry
            var newUserObj = new Object();
            newUserObj.id = msg.author.id;
            newUserObj.name = msg.author.username;

            amount = 1; //only 1 for first free spin
            newUserObj.spins = amount;

            spinData["users"].push(newUserObj);
            msg.channel.send("Free spin for new user!");
            console.log("New user " + `${newUserObj.name}` + " spun the maid. (" + `${newUserObj.spins}` + " spins)");

            total = newUserObj.spins;
        } else { //old user, check for timeout
            if (elapsedMins >= coolDownMins) { //cooldown over, spin
                spinData["lastSpin"] = currentTime;
                olduser.spins = olduser.spins + amount;
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
            newJSON = JSON.stringify(spinData);
            fs.writeFile('spinData.json', newJSON, function(err) {
                if (err) {
                    return console.error(err);
                }
            });
            printSpin(msg, amount, total, spinType);
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
    'To view how many maids another user has spun, use *"**@Maid Spin** **@username**"*.\n' +
    'To view who has spun the most maids, use *"**@Maid Spin** top"*.');
}

//check a user's spin count
function spinCheck(msg, atID) {
    fs.readFile('spinData.json', function(err, data) {
        if (err) {
            return console.error(err);
        }

        var spinData = JSON.parse(data.toString());

        newUser = true;
        for (user in spinData["users"]) {
            if (spinData["users"][user]["id"] == atID) {
                spins = spinData["users"][user]["spins"];
                newUser = false;
                break;
            }
        }

        if (newUser) { //if no spin user
            msg.channel.send("<@!" + atID + "> has never spun the maid.");
        } else { //if spin user
            msg.channel.send("<@!" + atID + "> has spun the maid " + spins + " times.");
        }
    });
}

//display leader board
function topSpins(msg) {
    fs.readFile('spinData.json', function(err, data) {
        if (err) {
            return console.error(err);
        }

        var spinData = JSON.parse(data.toString());

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

        var spinData = JSON.parse(data.toString());
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

        //if @bot then command
        if (n && msg.mentions.users.array().length > 0 && msg.mentions.users.array()[0]["id"] == myID) {
            trueContent = msg.content.substr(23);
            console.log(trueContent);

            //if contains another @, view spin count
            if (n && msg.mentions.users.array().length > 1) {
                n = false;

                atID = msg.mentions.users.array()[1]["id"];

                //if @ed the bot itself, else send to spin check func
                if (atID == myID) {
                    msg.channel.send("<@!" + myID + "> has spun the maid :infinity: times.");
                } else {
                    spinCheck(msg, atID);
                }
            }

            //test for leaderboard
            topRegex = new RegExp(/.*(top|high|leader|score|board|ladder).*/i);
            if (n && topRegex.test(trueContent)) {
                n = false;
                topSpins(msg);
            }

            //test for leaderboard
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
        } else {
            //spin
            spinTest(msg);

	    //test for leaderboard
            jojoRegex = new RegExp(/.*(jojo).*/i);
            if (n && jojoRegex.test(msg.content)) {
                msg.channel.send("Jojo is bad.");
            }
        }
    }
});

fs.readFile('password.config', function(err, data) {
    client.login(data.toString());
});
