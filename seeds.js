const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment   = require("./models/comment");
 
const data = [
    {
        name: "Delphino Plaza",
        image: "https://files.gamebanana.com/img/ss/maps/5a2f1eb9872dd.jpg",
        description: "Delfino Plaza is the main hub of Isle Delfino, lying at the nose of the dolphin-shaped island, first appearing in Super Mario Sunshine. It is located at the foot of Corona Mountain and is named for the island it is located on. It is inhabited solely by Piantas. "
    },
    {
        name: "Seaside Hill",
        image: "https://vignette.wikia.nocookie.net/sonic/images/d/d0/Loading_Screen_-_Seaside_Hill_-_Ocean_Ruin.png/revision/latest?cb=20160721194635",
        description: "Seaside Hill is the first stage of Sonic Heroes, and a recurring location in the Sonic the Hedgehog series. The place is very tropical and takes place on grassy cliffsides and beaches and it has one of the best bgm's in video game history ever"
    },
    {
        name: "Ocean Palace",
        image: "https://www.sonicstadium.org/wp-content/uploads/2011/10/Sonic-Generations-PS3-and-Xbox-360-Seaside-Hill-Screenshots-3.jpg",
        description: "Ocean Palace, as the name says, is a palace in the middle of the ocean. It is similar to Seaside Hill and has the same platforms, robots and everything except the palace-like ruins. This map includes yet another stunning ost"
    }
]
 
function seedDB(){
   //Remove all campgrounds
   Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed campgrounds!");
        Comment.remove({}, function(err) {
            if(err){
                console.log(err);
            }
            console.log("removed comments!");
             //add a few campgrounds
            data.forEach(function(seed){
                Campground.create(seed, function(err, campground){
                    if(err){
                        console.log(err)
                    } else {
                        console.log("added a campground");
                        //create a comment
                        Comment.create(
                            {
                                text: "This place is great, but I wish there was internet",
                                author: "Homer"
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                    campground.comments.push(comment);
                                    campground.save();
                                    console.log("Created new comment");
                                }
                            });
                    }
                });
            });
        });
    }); 
    //add a few comments
};
 
module.exports = seedDB;