/**
 * http://usejsdoc.org/
 */
const knex = require('knex')(require('../knexfile'))
const fs = require('fs'); //use the file system so we can save files

//TODO this can be better
function constructPathToPodcastOnFileStore(episodeName){
	return "C:/Users/Evan/workspace/PodcastDAOPlatform/uploads/" + episodeName
}

function saveFileToFileStore(file){
	let bufDataFile = new Buffer(file.data, "utf-8"); //TODO deprecated
	
	let target_path = constructPathToPodcastOnFileStore(file.name)
	fs.writeFile(target_path, bufDataFile,  function(err) {
      if (err) {
         return console.error(err);
      }
      else {
         console.log("Data written successfully !");
      }  
   })
   return target_path
}

function uploadPodcast(req, res){
	let file
	if(!req.files)
		{
			console.log("File not found");
			return;
		}
	
	file = req.files.fileUpload
	return saveFileToFileStore(file)
}

module.exports = {
	savePodcastToDB(req, res, {episode_name, description, owner_id}) {
		console.log("owner id " + owner_id)
		let path = uploadPodcast(req, res)
		return knex('podcast').insert({
			episode_name,
			description,
			path,
			owner_id
		}).then(() => {
	        return { success: true }
	      })
	},
	uploadPodcast
}