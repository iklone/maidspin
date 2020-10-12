const Discord = require('discord.js');
var fs = require('fs');

const client = new Discord.Client();

const myID = "715582108600369253";

//on startup
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

function printSpin(msg, spins) {
    console.log(`${msg.author.username}` + " spun the maid. *(" + spins + " spins)*");
    msg.channel.send(`${msg.author}` + " spun the maid. *(" + spins + " spins)*");
    msg.channel.send("https://i.imgur.com/7hqhB0M.gif");
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

        if (newUser) {
            var newUserObj = new Object();
            newUserObj.id = msg.author.id;
            newUserObj.name = msg.author.username;
            newUserObj.spins = 1;
            spinData["users"].push(newUserObj);

            spins = newUserObj.spins;
        } else {
            olduser.spins = olduser.spins + 1;
            spins = olduser.spins;
        }

        newJSON = JSON.stringify(spinData);
        fs.writeFile('spinData.json', newJSON, function(err) {
            if (err) {
                return console.error(err);
            }
        });

        printSpin(msg, spins);
    });
}

function spin(msg) {
    updateCount(msg);
}

function spinTest(msg) {
    spinRegex = new RegExp(/.*(((spin|twirl|rotat|turn|twist).*(maid|meido|mori))|((maid|meido|mori).*(spin|twirl|rotat|turn|twist))).*/i);
    if (spinRegex.test(msg.content)) {
        spin(msg);
    }
}

//print help
function spinHelp(msg) {
    msg.channel.send("***Maid Spin Help:***\n" +
    "This bot lets you do what everyone has always wanted to do: **spin maids**.\n" +
    'To spin a maid simply command her to spin by saying *"Spin the maid!"* or something similar into the chat.\n' +
    "The amount of maids you have spun will show up whenever you spin.\n" +
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

//on message
client.on('message', msg => {
    //stop if msg by self
    if (msg.author.id != myID) {
        //console.log(msg);
        n = true;

        //if @bot then command
        if (n && msg.content.substr(0, 22) == "<@!" + myID + ">") {
            trueContent = msg.content.substr(23);
            console.log(trueContent);

            //if contains an @, view spin count
            atRegex = new RegExp(/.*<@!.*>.*/i);
            if (n && atRegex.test(trueContent)) {
                n = false;

                atID = trueContent.split('<@!')[1];
                atID = atID.split('>')[0];

                //if @ed the bot itself, else send to spin check func
                if (atID == myID) {
                    msg.channel.send("<@!" + myID + "> has spun the maid :infinity: times.");
                } else {
                    spinCheck(msg, atID);
                }
            }

            //test for leaderboard
            topRegex = new RegExp(/.*(top|high|leader|score|board).*/i);
            if (n && topRegex.test(trueContent)) {
                n = false;
                topSpins(msg);
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
        }
    }
});


fs.readFile('password.config', function(err, data) {
    client.login(data.toString());
});