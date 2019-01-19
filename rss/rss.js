/**
 * http://usejsdoc.org/
 */
const fs = require('fs')

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

module.exports = {
		appendToRSS: appendToRSS
}