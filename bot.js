
/* Configure the Twitter API */
var TWITTER_CONSUMER_KEY = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxx';
var TWITTER_CONSUMER_SECRET = 'xxxxxxxxxxxxxxxxxxxxxxxx';
var TWITTER_ACCESS_TOKEN = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxx';
var TWITTER_ACCESS_TOKEN_SECRET = 'xxxxxxxxxxxxxxxxxxxxxxxx';

/* Set Twitter search phrase */
var TWITTER_SEARCH_PHRASE = '#DevDiscuss OR #100DaysOfCode OR #CodeNewbie OR  #freeCodeCamp';

var Twit = require('twit');

var Bot = new Twit({
	consumer_key: TWITTER_CONSUMER_KEY,
	consumer_secret: TWITTER_CONSUMER_SECRET,
	access_token: TWITTER_ACCESS_TOKEN,
	access_token_secret: TWITTER_ACCESS_TOKEN_SECRET
});

console.log('The bot is running...');

/* BotInit() : To initiate the bot */
function BotInit() {
	Bot.post('statuses/retweet/:id', { id: '978536755119837184' }, BotInitiated);

	function BotInitiated (error, data, response) {
		if (error) {
			console.log('Bot could not be initiated, : ' + error);
		}
		else {
  			console.log('Bot initiated : 978536755119837184');
		}
	}

	BotRetweet();
}

/* BotRetweet() : To retweet the matching recent tweet */
function BotRetweet() {

	var query = {
		q: TWITTER_SEARCH_PHRASE,
		result_type: "recent"
	}

	Bot.get('search/tweets', query, BotGotLatestTweet);

	function BotGotLatestTweet (error, data, response) {
		if (error) {
			console.log('Bot could not find latest tweet, : ' + error);
		}
		else {
			var id = {
				id : data.statuses[0].id_str
			}

			Bot.post('statuses/retweet/:id', id, BotRetweeted);

			function BotRetweeted(error, response) {
				if (error) {
					console.log('Bot could not retweet, : ' + error);
				}
				else {
					console.log('Bot retweeted : ' + id.id);
				}
			}
		}
	}
	favoriteTweet();
}

// FAVORITE BOT====================

// find a random tweet and 'favorite' it
var favoriteTweet = function(){
	var items = ['#DevDiscuss', '#100DaysOfCode', '#CodeNewbie', '#freeCodeCamp'];
	var params = {
		q: items[Math.floor(Math.random()*items.length)],  // REQUIRED
		result_type: 'recent',
		lang: 'en',
		// count: 10
	}
	// for more parametes, see: https://dev.twitter.com/rest/reference

	// find the tweet
	Bot.get('search/tweets', params, function(err,data){

	  // find tweets
	  var tweet = data.statuses;
		var randomTweet = undefined;
		tweet ? (randomTweet = ranDom(tweet)) : console.log('Not running fav function.');   // pick a random tweet

	  // if random tweet exists
	  if(typeof randomTweet != 'undefined'){
		// Tell TWITTER to 'favorite'
		Bot.post('favorites/create', {id: randomTweet.id_str}, function(err, response){
		  // if there was an error while 'favorite'
		  if(err){
			console.log('CANNOT BE FAVORITE... Error');
		  }
		  else{
			console.log('FAVORITED... Success!!!');
		  }
		});
	  }
	});
  }
  // grab & 'favorite' as soon as program is running...
  favoriteTweet();
  // 'favorite' a tweet in every 60 minutes
  // setInterval(favoriteTweet, 30*60*1000);

  // function to generate a random tweet tweet
  function ranDom (arr) {
	var index = Math.floor(Math.random()*arr.length);
	return arr[index];
  };

/* Set an interval of 30 minutes (in microsecondes) */
setInterval(BotRetweet, 30*60*1000);

/* Initiate the Bot */
BotInit();