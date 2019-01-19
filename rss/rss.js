/**
 * http://usejsdoc.org/
 */
const fs = require('fs')
const Feed = require('feed').Feed
const js2xmlparser = require('js2xmlparser');
const xml2js = require('xml2js').parseString;

//this is a mess. too tired to figure out now
function appendToRSS(podcast){
	//get rss feed from userID
	//read in rss feed and create a string
	let rssLocation = getFilename(podcast.owner_id, podcast)
	
	console.log("RSS2 " + rssLocation)
	
	/*
	let feed = new Feed(rssString)
	
	//call rss2() on string to create rss obj
	//create an Item out of a podcast
	//add item to db
	//rss.addItem(item)
	feed.addItem()
	
	//write back to file
	let rssdoc = feed.rss2()
	fs.writeFile(getFilename(userID), rssdoc, function(err) {
		if(err) return console.log(err)
	})*/
}

function getFilename(userID, podcast)
{
	let rssLocation = './rssfeedxml/' + userID + '.xml'
	console.log("RSS " + rssLocation)
	fs.readFile('./rssfeedxml/' + userID + '.xml', "utf-8", function(err, data) {
		console.log("Data " + data)
		xml2js(data, function(err, result) {
			console.log("result: " + result)
			addPodcastToResult(result, podcast)
			return result
		})
	})
}

function addPodcastToResult(result, podcast){
	console.log(result.rss.channel)
	console.log(podcast)
	let item = {title:podcast.episode_name, description:podcast.description, link:"/"}
	result.rss.channel.push(item)
	console.log(result.rss.channel)
}

function getRSSFeedFromUserID(userID, callback)
{
	let filename = getFilename(userID)
	fs.readFile(filename, 'utf8', function(err, data) {
		if(err) console.log(err)
		console.log('OK: ' + filename)
		console.log(data)
		return data
	})
}

module.exports = {
		appendToRSS: appendToRSS
}