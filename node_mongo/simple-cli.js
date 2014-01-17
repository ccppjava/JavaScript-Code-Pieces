var MongoClient = require('mongodb').MongoClient

// move connecting into a function to avoid the 'pyramid of doom'
function getConnection(cb) {
	MongoClient.connect('mongodb://localhost', function(err, db) {
		if (err) return cb(err);

		var simpleUser = db.collection('simple');

		// to search by name, index is need to get speed
		// ref: http://docs.mongodb.org/manual/core/indexes-introduction/
		simpleUser.ensureIndex({name: true}, function(err) {
			if (err) return cb(err);
			cb(null, simpleUser);
		});
	});
}

// an upsert will create a new record OR update an existing record
// which makes things easier, in mongo, we can do this with a 
// findAndModify and passing the upsert option to have the update 
// document returned, we pass the new option as well
function upsertUser(collection, name, role, cb) {
	collection.findAndModify({name: name}, {}, {$set: {role: role}},
		{upsert: true, new: true}, cb);
}

// instead of finding just one user, we can list all of the documents
// by passing an empty selector. This returns a 'cursor', which allows
// us to walk through the documents look at how we do this in process
function readAll(collection, cb) {
	collection.find({}, cb);
}

function readRole(collection, name, cb) {
	collection.findOne({name: name}, cb);
}

function printUser(user) {
	// make sure that we found our user
	if (!user) {
		console.log("Couldn't find the user you asked for!")
	}

	console.log(user.name + ' has the role of ' + user.role);
}

// the each method allows us to walk through the result set, notice
// the callback, as every time the callback is called, there is 
// another chance of an error
function printUsers(users, cb) {
	users.each(function(err, user) {
		if (err) return cb(err);
		printUser(user);
	});
}

function simpleCli(operation, name, role, cb) {
	getConnection(function(err, collection) {
		if (err) return cb(err);

		// we need to make sure to close the database, otherwise
		// the process won't stop
		function processUser(err, user) {
			if (err) return cb(user);
			printUser(user);
			collection.db.close();
			cb();
		}

		// use this function when dealing with lots of users
		function processUsers(err, users) {
			if (err) return cb(err);
			// the callback to each is called for every result
			// once it returns a null, we know the result is done
			users.each(function(err, user) {
				if (err) return cb(err);
				if (user) {
					printUser(user);
				} else {
					collection.db.close();
					cb();
				}
			});
		}

		if (operation === 'list') {
			readAll(collection, processUsers);
		} else if (operation === 'update') {
			upsertUser(collection, name, role, processUser);
		} else if (operation === 'read') {
			readRole(collection, name, processUser);
		} else {
			return cb(new Error('unknown operation!'));
		}
	});
}

var operation = process.argv[2];
var name = process.argv[3];
var role = process.argv[4];

simpleCli(operation, name, role, function(err) {
	if (err) {
		console.log("Had an error!", err);
		process.exit(1);
	}
});