# Maid Spin Discord Bot

A bot for Discord that lets you spin maids.
 
Live version coming soon.
 
#### Commands:
- To spin a maid simply command her to spin by saying *"Spin the maid!"* or something similar into the chat.
- The amount of maids you have spun will show up whenever you spin.
- To view how many maids another user has spun, use *"**@Maid Spin** **@username**"*.
- To view who has spun the most maids, use *"**@Maid Spin** top"*.

### Set Up:
- To set up your own instance of this bot, first create a Discord application and bot on "https://discord.com/developers/applications".
- Move the files in /default into the root (password.config and spinData.json).
- In password.config, paste your bot's "secret" (not the application's secret). This will link your bot to the code.
- Install the discord.js module with npm (npm install discord.js).
- Invite the bot to your server by going to "https://discordapp.com/oauth2/authorize?client_id=CLIENTID&scope=bot", replacing CLIENT_ID with your application's client ID.
- Run the application with "node index.js".

The gif used is Mori-san the maid from the anime GJ-bu.
