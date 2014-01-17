// import the mongo driver that help connect to mongo
var MongoClient = require('mongodb').MongoClient

MongoClient.connect('mongodb://localhost', function(err, db) {
	// if we didn't connect, throw the error
	if (err) throw err;

	// in mongo, documents are grouped in collection (like a table)
	// make one
	var simpleUser = db.collection("simple");

	// inserting a new document of easy json
	simpleUser.insert({name: 'ccppjava', role: 'admin'}, function(err, result) {
		if (err) throw err;

		// all documents in mongo get assigned a unique id, _id
		// we use this to find the document we just inserted
		var _id = result[0]._id

		// to update, we write a 'selector', and then the update
		// notice the use of $set, it is a special operator that
		// sets the fields in the document, otherwise, we would
		// wipe out the exisitng document
		simpleUser.update({_id: _id}, {$set: {role: 'user'}},	function(err){
			if (err) throw err;

			// finding a documents needs a selector like above
			simpleUser.findOne({_id: _id}, function(err, doc) {
				if (err) throw err;

				console.log(doc.name + " has the role of " + doc.role);
				// close our database so the process will die
				db.close();
			});
		});
	});
});
