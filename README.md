# Maid Spin Discord Bot

A bot for Discord that lets you spin maids.

![Maid Spinning](https://i.imgur.com/WxIrcsu.gif)
 
**The most *revolutionary* discord game ever created!**

You can either add the public instance to your server [here](https://discord.com/oauth2/authorize?client_id=715582108600369253&scope=bot), or see below on how to set-up your own instance.

*The bot requires the **embed links** permission to work.*

### Rules:
- To spin a maid simply command her to spin by saying *"Spin the maid!"* or something similar into the chat.
- The maids can only spin every 5 mins, they get dizzy!
- The maids can spin for as many minutes as have passed since they recovered. So if you spin 5 mins after they have recovered, you get 5 spin points.
- When you spin, there is a random chance that you will get a special multiplier and different gif.
- You will get extra spins if you spin the maids using a message no one has used before, so be creative.
- Occasionally you will find a mysterious *meido no hearto*, you can trade these for spins or multipliers.
- There are a few other ways to get spins which wou'll find out as you play.

### Commands:
- View help with *"**@Maid Spin** help"*.
- You can check on the maids' dizziness in more detail using *"**@Maid Spin** timer"*.
- To view who has spun the most maids, use *"**@Maid Spin** top"*.
- To view who has had the biggest maid spin, use *"**@Maid Spin** toph"*.
- To view the scoreboard from v1 (defunct), use *"**@Maid Spin** topold"*.
- To view your current meido no hearto, and meido no hearto help, use *"**@Maid Spin** hearto"*.
- To trade a meido no hearto for some spins, use *"**@Maid Spin** hearto spins"*.
- To trade some meido no hearto to start a maid day, use *"**@Maid Spin** hearto maid day X"*, where X is the number you want to use.
- To wave at Mahoro, use *"**@Maid Spin** wave"*.

### Set Up:
- To set up your own instance of this bot, first create a Discord application and bot on "https://discord.com/developers/applications".
- Move the files in /default into the root (password.config and spinData.json).
- In password.config, paste your bot's "secret" (not the application's secret). This will link your bot to the code.
- Install the discord.js module with npm (npm install discord.js).
- Invite the bot to your server by going to "https://discordapp.com/oauth2/authorize?client_id=CLIENTID&scope=bot", replacing CLIENT_ID with your application's client ID.
- The bot requires a few permissions to function. It must be able to: **view/send messages** in at least one channel and **embed links**.
- Run the application with "node index.js".
- Spin maids!

### GIF Sources:
For more details see the notes for each GIF within the source code (at the top of index.js).
The anime used are:
- Mahoromatic
- GJ-bu
- Kiniro Mosaic
- Kaichou wa Maid-sama
- Seto no Hanayome
- Familiar of Zero
- Gochiusa
- Tsukihime
- Hinako Note
- Digi Charat
- Hayate no Gotoku
- Konosuba
- Comic Girls
- Shadows House
- Kobayashi-san's Maid Dragon
- Uzamaid!
- Soredemo Machi wa Mawatteiru
- He is my Master
- Steel Angel Kurumi
- Hand Maid May
- A Certain Magical Index
- Prisma Illya
- Keion!
- Shomin Sample
- Blend S
- Futari wa Precure
