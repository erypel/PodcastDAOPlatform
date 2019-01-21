/**
 * http://usejsdoc.org/
 */
const fs = require('fs')
const Feed = require('feed').Feed

function appendToRSS(podcast){
	let itemXML = '\t\t<item>\n\t\t\t<title>' + podcast.episode_name + '</title>\n\t\t\t<description>'+podcast.description+'</description>\n\t\t\t<link>/</link>\n\t\t</item>'
	let filename = './rssfeedxml/' + podcast.owner_id + '.xml', buffer = new Buffer(itemXML+'\n\t</channel>\n</rss>'), fileSize = fs.statSync(filename)['size']
	fs.open(filename, 'r+', function(err, fd) {
		fs.write(fd, buffer, 0, buffer.length, fileSize-18, function(err){
			if(err) console.log(err)
			console.log('done')
		})
	})
}

function generateXML(data)
{
	//This is the minimum required amount of data for an RSS field
	//TODO may consider adding additional fields
	let feed = new Feed({
		title: data.title,
		link: data.path, //TODO need to think about this
		description: data.description
	})
	
	let rssdoc = feed.rss2()
	fs.writeFile(data.path, rssdoc, function(err) {
		if(err) return console.log(err)
	})
}

function generatePath(userID, title){
	return './rssfeedxml/' + userID + '.xml'
}

module.exports = {
		appendToRSS: appendToRSS,
		generateXML: generateXML,
		generatePath: generatePath
}