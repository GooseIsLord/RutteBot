const { Client, Intents } = require('discord.js');
const botConfig = require('./conf.json');
const mysql = require('mysql');

const bot = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES
	]
});

const cheweyBotAnalyticsAPI = require("discord-bot-analytics")
const customAnalytics = new cheweyBotAnalyticsAPI(botConfig.trackingToken, bot)


// if the bot is ready say it is online and fill in the little playing
// thingy you have on discord when you are playing an game
bot.once('ready',  () => {
	console.log(`${bot.user.username} is online`);

	bot.user.setActivity('you ;)', { type: 'LISTENING' });
});

// if a message is sent
bot.on('messageCreate', (message) => {
	// random chance: 1/20 chance that a Rutte picture is shown
	var random = Math.floor(Math.random() * 20) + 1;
	if (random == 1) {
		sendRutte()
	}

	function sendRutte() {
		var con = mysql.createConnection({
			host: botConfig.host,
			user: botConfig.user,
			password: botConfig.password,
			database: botConfig.database,
		});

		con.query(`SELECT * FROM mark`, function (err, rows) {
			// if there is a error, throw it my way
			if (err) {
				throw err;
			}

			var rand = Math.floor(Math.random() * rows.length);

			return message.channel.send({
				files: [rows[rand].link],
			});
		});
	}

	const guild = bot.guilds.cache.get("579722948760567831");

	let commands;

	if (!guild){
		commands = bot.application.commands
	}else{
		commands = guild.commands
	}

	commands.create({
		name: "help",
		description: ":)"
	})

	commands.create({
		name: "invite",
		description: ";)"
	})

});

bot.on('interactionCreate', async (interaction) => {
	if (!interaction.isCommand()){
		return;
	}

	const { commandName, options } = interaction;
	if (commandName === 'help'){
		interaction.reply({
			content: 'The bot is simple. For every message you sent there is a 1/20 chance you get a random (and publicly available) picture from the prime minister of the Netherlands: Mark Rutte.'
		})
	}else if (commandName === 'invite'){
		interaction.reply({
			content: 'https://discord.com/api/oauth2/authorize?client_id=692139313848254564&permissions=274877910016&scope=bot%20applications.commands',
			ephemeral: true
		})
	}
})

bot.login(botConfig.token);
