/**
 * http://usejsdoc.org/
 */
/**
 * check if a user is logged in and redirect them if they're not
 * @param req
 * @param res
 * @param next
 * @returns
 */
function requireLogin (req, res, next) {
	console.log("login required")
	  if (!req.user) {
	    res.redirect('/login');
	  } else {
	    next();
	  }
	}
module.exports = {requireLogin}