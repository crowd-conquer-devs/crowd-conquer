Router.route('/world', function () {
  this.render('map', { });
});

Router.route('/', function () {
  this.render('welcome', { });
});

Tracker.autorun(function() {
    if (Meteor.user()){
        email = Meteor.user().services.google.email;
        //console.log(email);
        if(!Users.findOne({email: email}))
            Users.insert({email: email});
    }
});
