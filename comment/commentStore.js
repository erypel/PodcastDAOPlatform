/**
 * The Data Access Object for comments on podcasts
 */
const knex = require('knex')(require('../knexfile'))

/**
 * Inserts a comment into the Comment table
 * @param comment {commentText, respondingToCommentID, userID, podcastID}
 * @returns
 */
function insertComment(comment){
	return knex('comment').insert({
		comment: comment.comment,
		comment_id: comment.respondingTo,
		podcast_id: comment.podcastID,
		commenter_id: comment.userID,
		depth: comment.depth
	})
}

function getCommentsForPodcast(podcastID){
	return knex('comment').where({podcast_id: podcastID})
}

module.exports = {
	insertComment,
	getCommentsForPodcast
}