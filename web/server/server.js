Meteor.startup(function(){
    tests();
});

Meteor.methods({
    /*login: function (email){
        Database.getUser(email);
    },*/
    createTeam: function (post) {
      console.log("create Team");
      var id = Teams.find().fetch().length+1;
      Teams.insert({'teamID':id, 'name':post.name});
      Users.findOne({email:Meteor.user().services.google.email}).team = id;
      Users.update({email:Meteor.user().services.google.email}, {$set: {team:id}});
    },
    joinTeam: function (post) {
      console.log("join Team");
    },
    leaveTeam: function (post) {
      console.log("leave Team");
    }
})
