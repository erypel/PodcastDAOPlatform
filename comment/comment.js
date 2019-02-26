const userStore = require('../authentication/userStore')

function buildCommentSectionDataObject(comments){
	return new Promise(function(resolve, reject){
		if(comments.length === 0){
			resolve([])
		}
		let commentSectionDataObject = []
		let promiseChain = Promise.resolve()
		let currentComment;
		for(let i = 0; i < comments.length; i++){
			let commentObj = {}
			currentComment = comments[i]
			let userID = currentComment.commenter_id
			//TODO could use a hashtable here to prevent repeat lookups on repeat commenters
			const makeNextPromise = (currentComment) => () => {
				let username = ''
					userStore.getUsername(userID).then(result => {
						username = result[0].username
						commentObj.commenter = username
						commentObj.message = currentComment.comment
						commentObj.id = currentComment.id
						commentSectionDataObject.push(commentObj)
						if(i === comments.length - 1){
							//TODO commentSectionDataObject will eventually need to be sorted
							console.log('commentSectionDataObject', commentSectionDataObject)
							resolve(commentSectionDataObject)
						}
					})
			}
			promiseChain = promiseChain.then(makeNextPromise(currentComment))
		}
	})
}

module.exports = {
		buildCommentSectionDataObject
}
