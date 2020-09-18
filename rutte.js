const discord = require('discord.js');
const botConfig = require('./conf.json');
const mysql = require('mysql');

const bot = new discord.Client({
	ws: {
		intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_WEBHOOKS"]
	}
});
bot.commands = new discord.Collection();

// if the bot is ready say it is online and fill in the little playing
// thingy you have on discord when you are playing an game
bot.on('ready', async () => {
	console.log(`${bot.user.username} is online`);

	bot.user.setActivity('you ;) (also *help)', { type: 'LISTENING' });
});

// if a message is sent
bot.on('message', async message => {

	// if bot sends a message return
	if (message.author.bot) return;

	var five = ["rutte", "Rutte", "RUTTE", "mark", "Mark", "MARK", "markie", "Markie", "MARKIE", "markje", "Markje", "MARKJE", "daddy", "Daddy", "DADDY", "gekoloniseerd", "Gekoloniseerd", "GEKOLONISEERD", "papa", "Papa", "PAPA", "vader", "Vader", "VADER"];

	var hundred = ["caroliene", "Caroliene", "CAROLIENE"];


	if (message.content === '*help') {
		var sending = 'help';
	}

	for (var i = 0; i < five.length; i++) {
		if (message.content.includes(five[i])) {
			var sending = '5';
		}
	}

	for (var i = 0; i < hundred.length; i++) {
		if (message.content.includes(hundred[i])) {
			var sending = '100';
		}
	}

	switch (sending) {
		case 'help':
			rutteHelp()
			break;
		case '5':
			rutteFive();
			break;
		case "100":
			rutteHundred();
			break;
		default:
			rutteTen();
			break
	}

	function rutteHelp() {
		return message.channel.send(
			"The bot is simple. For every message you sent there is a 1/10 chance you get a random (and publicly available) picture from the prime minister of the Netherlands: Mark Rutte. \nIf you either use: Rutte, Mark, Markie or one of the secret words in your message the chances will go up to 1/5. \nThe bot draws from a database of 250+ pictures that it randomly chooses from every time it gets a chance to react to you. \nIt's a silly bot for good reaction images that you can have fun with. \nWant more Rutte in your server? Use this link to invite him: https://discord.com/oauth2/authorize?client_id=692139313848254564&scope=bot."
		);
	}

	function rutteFive(){
		var randomRutte = Math.floor(Math.random() * 5) + 1;

		if (randomRutte === 1) {
			sendRutte()
		}
	}

	function rutteHundred() {
		sendRutte()
	}

	function rutteTen() {
		var random = Math.floor(Math.random() * 10) + 1;

		if (random == 1) {
			sendRutte()
		}
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
});

bot.login(botConfig.token);
