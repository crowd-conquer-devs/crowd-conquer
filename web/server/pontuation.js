
Pontuation = {
	cells: {}
}

Pontuation.cell = function(lon, lat){
	var cell = Database.getCell(lon, lat);
	lon = cell.lon;
	lat = cell.lat;
	if(!this.cells[lon])
		this.cells[lon] = {};
	if(!this.cells[lon][lat]){
		this.cells[lon][lat] = Cell(cell);
	}
	return this.cells[lon][lat];
}


Pontuation.updateUsers = function(){
	var p = Pontuation;
	for(var row in p.cells){
		for(var col in p.cells[row]){
			var users = p.cells[row][col].users;
			for(var email in users){
					var user = users[email];
				if(user){
					user.time--;
					if(user.time <= 0){
						p.cells[row][col].teams[user.team]--;
						delete users[email];
					}
				}
			}
		}
	}
}
Meteor.setInterval(Pontuation.updateUsers, 1000);

/*Meteor.setInterval(function(){
	Pontuation.cell(-8.415008, 40.18662).userKeepAlive("a@m");
}, 10000);*/

Pontuation.updateCells = function(){
	var p = Pontuation;
	var C=5;

	for(var row in p.cells){
		for(var col in p.cells[row]){
			var cell = p.cells[row][col];
				console.log(cell.owner);
			if(cell.owner == 0){
				if(!cell.hasOwnProperty("avail"))
					cell.avail = cell.value;
				for(var t in cell.teams){
					console.log(t, cell.ownership[t]);
					console.log(cell.avail);
					cell.avail -= cell.teams[t] * C;
					if(cell.avail < 0){
						cell.ownership[t] += cell.avail;
						cell.avail = 0;
						break;
					}
					if(!cell.ownership.hasOwnProperty(t) )
						cell.ownership[t] = 0;
					cell.ownership[t] += cell.teams[t] * C;
				}
				if(cell.avail == 0){
					var m = 0, mi;
					for(var t in cell.ownership){
						if(cell.ownership[t] > m){
							m = cell.ownership[t];
							mi = t;
						}
					}
					cell.owner = mi;
					cell.ownership = {};
					Cells.update({_id: cell._id}, {$set: {owner: cell.owner} })
					delete cell.avail;
					cell.value *= 2;

					console.log('conquered by team ' + cell.owner);
				}
			}else{
				console.log(cell.teams);
				if(!cell.hasOwnProperty("avail"))
					cell.avail = cell.value;
				for(var t in cell.teams){
					if(cell.teams[t] > 0){
						console.log(t, cell.ownership[t]);
						console.log(cell.avail);
						console.log('owner ' + cell.owner)
						var v = 0;
						if(cell.teams.hasOwnProperty(cell.owner))
							var v = cell.teams[cell.owner];
						cell.avail -= (cell.teams[t] - v) * C;
						if(cell.avail < 0){
							cell.ownership[t] += cell.avail;
							cell.avail = 0;
							break;
						}
						if(!cell.ownership.hasOwnProperty(t) )
							cell.ownership[t] = 0;
						cell.ownership[t] += (cell.teams[t] - v) * C;
					}else{
						if(!cell.ownership.hasOwnProperty(t) )
							cell.ownership[t] = 0;
					}
				}
				if(cell.avail == 0){
					var m = 0, mi;
					for(var t in cell.ownership){
						if(cell.ownership[t] > m){
							m = cell.ownership[t];
							mi = t;
						}
					}
					cell.owner = mi;
					cell.ownership = {};
					Cells.update({_id: cell._id}, {$set:{owner: cell.owner} })
					delete cell.avail;
					cell.value *= 2;

					console.log('New owner is team ' + cell.owner);
				}
			}
			/*for(var t in cell.teams){
				if(t != owner)
			}*/
		}
	}

}


Meteor.setInterval(Pontuation.updateCells, 1000);

User = function(data){
	var user = {};
	//console.log(data);
	user.email = data.email;
	user.team = data.team;
	user.time = 30;
	return user;
}

Cell = function(data){
	var cell = {};
	cell._id = data._id;
	cell.value = data.value;
	cell.owner = data.owner;
	cell.lon = data.lon;
	cell.lat = data.lat;
	cell.users = {}; // current users: maps email to User
	cell.teams = {}; // number of elements of each team in this cell
	cell.ownership = {}; // empty ownership means that no one owns the cell
	cell.userKeepAlive = function(email){
		var user = this.users[email];
		if(user){
			user.time = 30;
		}else{
			this.users[email] = User(Database.getUser(email));
			var user = this.users[email];
			if(!this.teams[user.team])
				this.teams[user.team] = 0
			this.teams[user.team]++;
			console.log(this.teams[user.team]);
		}
	}

	return cell;
}

//var cell = Pontuation.cell(35.62, 46.34);
//Users.remove({});



//console.log(Users.find({}).fetch());

//console.log(user);

//console.log(cell);

//console.log(Cells.find().fetch());

tests = function(){
	Users.remove({});
	var user = User(Database.getUser("a@m"));
	var user = User(Database.getUser("b@m"));
	var user = User(Database.getUser("a@m"));
	var user = User(Database.getUser("e@m"));

	Cells.remove({});
	var cell = Pontuation.cell(-8.415008, 40.18662);
	Cells.update({_id: cell._id}, {$set:{owner: 3} });
	cell.owner = 3;
	Pontuation.cell(-8.415008, 40.18662).userKeepAlive("e@m");


}
