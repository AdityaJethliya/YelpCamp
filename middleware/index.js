var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","You need to be logged in to do that");
	res.redirect("/login");
}

middlewareObj.checkCommentOwnership = function(req,res,next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err,foundComment){
			if(err){
				req.flash("error","Campground not found");
				res.redirect("back");
			}
			else{
				if (!foundComment) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
				if(foundComment.author.id.equals(req.user._id)){
					return next();
				}
				else{
					req.flash("error","You dont have permission to do that");
					res.redirect("back");
				}
			}
		});
	}
	else{
		req.flash("error","You need to be logged in to do that");
	}
}

middlewareObj.checkCampgroundOwnership = function(req,res,next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err,foundCampground){
			if(err){
				res.redirect("back");
			}
			else{
				if (!foundCampground) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
				if(foundCampground.author.id.equals(req.user._id)){
					return next();
				}
				else{
					res.redirect("back")
				}
			}
		});
	}
	else{
		res.redirect("back");
	}
	
}

module.exports = middlewareObj;