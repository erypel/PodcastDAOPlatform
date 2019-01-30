/**
 * http://usejsdoc.org/
 */
const knex = require('knex')(require('../knexfile'))
const fs = require('fs'); //use the file system so we can save files
const rss = require('../rss/rss')
const utils = require('../utils/utils')

// BEGIN UTILITY FUNCTIONS FOR CREATING PATH
function constructPathToPodcastOnFileStore(userID){
	// each user will have a folder in the filestore to store their files
	return userID + '/' 
}

function createFileName(episodeName, mimetype){
	let extension = '.error'
	if(mimetype === 'audio/wav')
		extension = '.wav'
	else if(mimetype === 'audio/mp3')
		extension = '.mp3'
	return episodeName + extension
}
// END UTILITY FUNCTIONS

function saveFileToFileStore(file, userID, episodeName){
	let bufDataFile = Buffer.from(file.data, "utf-8");
	let pathInFileStore = constructPathToPodcastOnFileStore(userID)
	let fileName = createFileName(episodeName, file.mimetype)
	let target_path = utils.getPathToFileStore() + pathInFileStore
	
	// create the directory if it doesn't exist
	fs.mkdir(target_path, function(err){
		if(!err || err && err.code === 'EEXIST') {} //ignore, directory exists alread
		else console.log(err)
	})
	// append file name to path
	target_path += fileName
	
	fs.writeFile(target_path, bufDataFile,  function(err) {
		if (err) {
			return console.error(err);
		}
		else {
			console.log("Data written successfully !");
		}  
   })
   // return the path to the file in the filestore
   return pathInFileStore + fileName
}

function uploadPodcast(req, res){
	let file
	if(!req.files){
		console.log("File not found");
		return;
	}
	
	file = req.files.fileUpload
	let userID = req.user.id
	let episodeName = req.body.episodeName
	
	return saveFileToFileStore(file, userID, episodeName)
}

function getAllPodcasts(callback){
	selectAllPodcasts(function(podcasts){
		callback(podcasts);
	})
}

/**
 * makes call to the DB to retrieve the podcasts
 * @returns
 */
function selectAllPodcasts(callback){
	let podcasts = []
	knex.select().table('podcast').then(function(rowDataPacket){
		rowDataPacket.forEach(function(podcast){
			podcasts.push(podcast)
		})
		callback(podcasts)
	})
}

function getPodcastsForUserID(userID){
	return new Promise(function(resolve, reject) {
		let podcasts = []
		return knex.select().table('podcast').where({owner_id: userID}).then(function(rowDataPacket){
			rowDataPacket.forEach(function(podcast){
				console.log("pushing", podcast)
				podcasts.push(podcast)
			})
		}).then(()=> {
			console.log('returning', podcasts)
			resolve(podcasts)
		})
	})
}

function appendToRSS(podcast){
	rss.appendToRSS(podcast)
}

function getUploaderID(podcastID){
	return knex('podcast').select('owner_id').where({id: podcastID})
}

function savePodcastToDB(req, res, {episode_name, description, owner_id}) {
	console.log(rss)
	appendToRSS({episode_name, description, owner_id})
	let path = uploadPodcast(req, res)
	return knex('podcast').insert({
		episode_name,
		description,
		path,
		owner_id
	}, 'id').then((result) => {
        return { success: true, id: result[0], path: path }
      })
}

module.exports = {
	savePodcastToDB,
	uploadPodcast,
	getAllPodcasts,
	getPodcastsForUserID,
	getUploaderID
}