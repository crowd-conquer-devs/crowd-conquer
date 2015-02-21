Router.onBeforeAction(Iron.Router.bodyParser.urlencoded({
        extended: false
    }));

function response(post, message){
	post.response.writeHead(400, {'Content-Type': 'application/json'});
  post.response.end(JSON.stringify({'message': message}) );
}

Router.route('/api/location', {where: 'server'})
	.post(function(){
    console.log("REKT");
    if(!this.request.body.args){
      response(this, 'No args parameter found');
      return;
    }

		var json = this.request.body.args;
        console.log(json);
		try{
			json = JSON.parse(json);
		}catch(err){
			response(this, 'Json could not be parsed');
			return;
		}

		this.response.writeHead(200, {'Content-Type': 'application/json'});
    this.response.end(JSON.stringify({'time': 60}));
	});

Router.route('/api/:others', {where: 'server'})
  .post(function(){
    response(this, 'No api function here');
  })
