# Maid Spin Discord Bot

A bot for Discord that lets you spin maids.

![Maid Spinning](https://i.imgur.com/WxIrcsu.gif)
 
Live version coming soon.
 
### Rules:
- To spin a maid simply command her to spin by saying *"Spin the maid!"* or something similar into the chat.
- The maids can only spin every 5 mins, they get dizzy!
- The maids can spin for as many minutes as have passed since they recovered. So if you spin 5 mins after they have recovered, you get 5 spin points.
- When you spin, there is a random chance that you will get a special multiplier and different gif.

### Commands:
- View help with *"**@Maid Spin** help"*.
- You can check on the maids' dizziness in more detail using *"**@Maid Spin** timer"*.
- To view how many maids another user has spun, use *"**@Maid Spin** **@username**"*.
- To view who has spun the most maids, use *"**@Maid Spin** top"*.

### Set Up:
- To set up your own instance of this bot, first create a Discord application and bot on "https://discord.com/developers/applications".
- Move the files in /default into the root (password.config and spinData.json).
- In password.config, paste your bot's "secret" (not the application's secret). This will link your bot to the code.
- Install the discord.js module with npm (npm install discord.js).
- Invite the bot to your server by going to "https://discordapp.com/oauth2/authorize?client_id=CLIENTID&scope=bot", replacing CLIENT_ID with your application's client ID.
- Run the application with "node index.js".

### GIF Sources:
- https://i.imgur.com/7hqhB0M.gif: Mori from "GJ-bu".
- https://i.imgur.com/spr5vSH.gif: Chiya Ujimatsu from "Is the Order a Rabbit?".
- https://i.imgur.com/WxIrcsu.gif: Maria from "Hayate no Gotoku".
- https://i.imgur.com/RJCx1rX.gif: Also Mori from "GJ-bu".
