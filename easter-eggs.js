var request = require("request");
var axios = require("axios");
var xml2js = require('xml2js');

var xmlParser = new xml2js.Parser();

module.exports = function(bot, taID) {
	// write your easter egg message handler function in here
	// then include it in the `return` statement below

	// IMPORTANT: always include a parameter for a callback function
	// and make sure to call the callback function at the end of your message handler
	// parameters for all message handlers should be `message` and `callback`

	// `validate` is simply a helper to make sure the message is meant for the bot
	function validate(message) {
		return message.type === "message" && message.text !== undefined && message.text.indexOf(bot.mention) > -1;
	}

	// paramify is useful if wording of the message is important
	// returns the message in an array of words without the mention at the beginning
	function paramify(message) {
		var commandString = message.text.replace(bot.mention, "").replace(/\:/g, "").toLowerCase();
		var command = commandString.split(" ");
		if (command[0] === "") {command.shift();}
		return command;
	}

	var quoteMachine = function(message, cb) {
		if (validate(message)) {
		var command = paramify(message);
		if ((command[0] === "Let's" || command[0] === "Lets" || command[0] === "let's" || command[0] === "lets" || command[0] === "take" || command[0] === "Take") && (command[1] === "go" || command[1] === "me") && command[2] === "to" && (command[3] === "Flavor" || command[3] === "flavor") && (command[4] === "Town" || command[4] === "town" || command[4] === "town!" || command[4] === "Town!")) {
		axios.get('https://4ozc0qiiec.execute-api.us-east-1.amazonaws.com/prod/quote')
			.then((res) => {
				let quote = res.data.quote;
				bot.sendMessage(message.channel, "" + quote + " - " + ":fieri:");
			})
			.catch((err) => {
				console.error(err);
			});
			}
		}
		cb(null, 'quoteMachine');
	};

	var jokester = function(message, cb) {
		if (validate(message)) {
		var command = paramify(message);
		if ((command[0] === "Tell" || command[0] === "tell") && command[1] === "us" && command[2] === "a" && (command[3] === "joke" || command[3] === "Joke")) {
		axios.get('https://08ad1pao69.execute-api.us-east-1.amazonaws.com/dev/random_joke')
			.then((res) => {
				let setup = res.data.setup;
				let punchline = res.data.punchline;
				bot.sendMessage(message.channel, "" + setup);
				setTimeout(function() {
					bot.sendMessage(message.channel, "...");
				}, 2000)
				setTimeout(function() {
					bot.sendMessage(message.channel, "" + punchline + " :badpundog:");
				}, 4000)
			})
			.catch((err) => {
				console.error(err);
			});
			}
		}
		cb(null, 'quoteMachine');
	};

  var weather = function(message, cb) {
		if (validate(message)) {
		var command = paramify(message);
		if ((command[0] === "What's" || command[0] === "what's" || command[0] === "Whats" || command[0] === "whats") && command[1] === "the" && command[2] === "weather" && command[3] === "in") {
		axios.get(`https://www.metaweather.com/api/location/search/?query=${command[4]}`)
			.then((res) => {
				console.log(res.data)
				const woeid = res.data[0].woeid;
				axios.get(`https://www.metaweather.com/api/location/${woeid}`)
				.then((res) => {
					console.log(res.data.consolidated_weather);
					const weatherState = res.data.consolidated_weather[0].weather_state_name;
					const temp = res.data.consolidated_weather[0].the_temp;
					bot.sendMessage(message.channel, "Currently in " + command[4] + ", there is " + weatherState + " and the temperature is " + temp + "c. Learn how to convert from celcius, I ain't doing that shit for you!" );
				})
			})
			.catch((err) => {
				console.error(err);
			});
			}
		}
		cb(null, 'quoteMachine');
	};


  var floorMessage = function(message, cb) {
    if (validate(message) && taID.includes(message.user)) {
      var command = paramify(message);
      if ((command[0] === "I" || command[0] === "i") && command[1] === "am" && (command[2] === "here" || command[2] === "here!")) {
        bot.api("users.info", {user: message.user}, function(data) {
          var currentTA = data.user;
          var botMessage =  currentTA.profile.real_name + " is in the SRC, located at the back of the 4th floor. Need help? Queue up! (after you Google your question first, of course) :the-more-you-know:";
          bot.sendMessage(message.channel, botMessage);
        })
      }
    }
    cb(null, 'floorMessage');
  }

  var favoriteThings = function(message, cb) {
    if (validate(message)) {
      let favoriteArray = ["And Shawshank Redemption, best movie ever!" ,"And burritos, Oxido and Dos Toros are the two best spots near campus!" ,"And outerspace, it is the great unknown and mankind's ultimate frontier!", "And video games, that new Zelda is dope!", "And Dippin' Dots, the ice cream of astronauts!", "And algorithms, I'm a genius in case you didn't know!", "And eqaulity, our similarities are more powerful than our differences!", "And black and white cookies, the embodiment of racial harmony in cookie form. Look to the cookie!"]
      var command = paramify(message);
      if ((command[0] === "What" || command[0] === "what") && command[1] === "is" && command[2] === "your" && command[3] === "favorite" && command[4] === "thing?") {
        var botMessage =  "Seeing the students faces in their profile pictures! ..." + favoriteArray[Math.floor(Math.random() * favoriteArray.length)];
      }
      bot.sendMessage(message.channel, botMessage);
    }
    cb(null, 'favoriteThings');
  }

  var doYouLike = function(message, cb) {
    if (validate(message)) {
      let answers = ["Kinda", "Of course!", "Eh", "Sometimes", "To be honest, not really", "Very much!", "You're the best!", "Oh yea! If you were a pen, you'd be FINE point", "You know it!", "If you were a contract, you'd be all FINE print", "Well, you're ok", "Depends... do YOU like ME?", "Like, more than a friend?", "Marry me!"]
      var command = paramify(message);
      if ((command[0] === "Do" || command[0] === "do") && command[1] === "you" && command[2] === "like" && command[3] === "me?") {
        var botMessage =  answers[Math.floor(Math.random() * answers.length)];
      }
      bot.sendMessage(message.channel, botMessage);
    }
    cb(null, 'doYouLike');
  }

  var thanks = function(message, cb) {
    if (validate(message)) {
      let emojis = ["programmer", "cheers", "bananadance", "cartman", "success", "mj", "sonic", "duderino", "fieri", "giggity", "bob_ross", "metal", "badger", "dancing_lisa", "ghostbusters", "scooby", "yoshi"];
      var command = paramify(message);
      if (command[0] === "Thanks!" || command[0] === "thanks!" || command[0] === "thanks" || command[0] === "Thanks") {
        var botMessage =  "No, thank you! :" + emojis[Math.floor(Math.random() * emojis.length)] + ":";
      };
      if ((command[0] === "Thank" || command[0] === "thank") && (command[1] === "you" || command[1] === "you!")) {
        var botMessage =  "No, thank you! :" + emojis[Math.floor(Math.random() * emojis.length)] + ":";
      }
      bot.sendMessage(message.channel, botMessage);
    }
    cb(null, 'thanks');
  }

  var initiate = function(message, cb) {
    if (validate(message)) {
      let emojis = ["marioandluigi", "bananadance", "goomba", "awyea", "partyparrot", "dancing_lisa", "man_dancing", "dancer", "charmander_dancing", "goth_parrot", "mj", "moonwalk", "bojack", "badger", "bob_ross", "fieri", "sonic", "megaman", "pizzaspin", "scooby", "bobba_fett", "1up", "bob", "archer", "batman"];
      var command = paramify(message);
      if (command[0] === "initiate!" || command[0] === "Initiate!" || command[0] === "initiate" || command[0] === "Initiate") {
        var botMessage =  "Freestyle or breakdance? :" + emojis[Math.floor(Math.random() * emojis.length)] + ":";
      };
      bot.sendMessage(message.channel, botMessage);
    }
    cb(null, 'initiate');
  }

  var howAwesome = function(message, cb) {
    if (validate(message)) {
      let answers = ["We killin' it in 2018!", "We got Juicy J!", "We got Uncle Andy!", "We got Matty Mare-io", "We got the original Baby Back Beyeler!", "We got Jonny Sureshot!"]
      var command = paramify(message);
      if( (command[0] === 'how' || command[0] === 'How') && command[1] === 'awesome' && command[2] === 'is' && ((command[3] === 'Growth' || command[3] === 'growth') || (command[3] === 'Spark?' || command[3] === 'spark?')) )   {
		var botMessage =  answers[Math.floor(Math.random() * answers.length)];
      }
      bot.sendMessage(message.channel, botMessage);
    }
    cb(null, 'howAwesome');
  }

	var wakeUp = function(message, cb) {
		if (validate(message)) {
			var command = paramify(message);
			if ( (command[0] === "are" || command[0] === 'Are') && (command[1] === "you" || command[1] === "You") && (command[2] === "there?" || command[2] === "There?")) {
				var botMessage =  "Yea, yea... I'm up. What do you need?"
			}
			bot.sendMessage(message.channel, botMessage);
		}
		cb(null, 'wakeUp');
	}

	const virtualDom = (message, cb) => {
		if (validate(message)) {
			var command = paramify(message);
			console.log('The Virtual Dom!', command)
			if ( (command[0] === 'Tell' || command[0] === 'tell') && command[1] === 'me' && command[2] === 'about' && command[3] === 'the' && command[4] === 'virtual' && (command[5] === 'DOM.' || command[5] === 'dom.' ) ) {
				var botMessage =  'The Virtual Dominic Object Model is an important concept in React!'
			}
			bot.sendMessage(message.channel, botMessage);
		}
		cb(null, 'virtualDom');
	}

	const heart = (message, cb) => {
			if (validate(message)) {
				var command = paramify(message);
				console.log('heart!', command)
			if (command[0] === 'heart' ) {
				var botMessage =  ':heart:';
			}
			bot.sendMessage(message.channel, botMessage);
		}
		cb(null, 'heart');
	}


	return {
		quoteMachine,
		jokester,
    	floorMessage,
	    favoriteThings,
	    doYouLike,
	    thanks,
	    initiate,
		howAwesome,
		wakeUp,
		weather,
		heart
	};

}; // module.exports
