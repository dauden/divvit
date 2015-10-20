var state = [];
db.orders.find({ },{ "orderDate": 1, customerId: 1 }).forEach(function(doc){
	    var splitDate = doc.orderDate.split("/");
	    var month = parseInt(splitDate[0]);
	    var year = parseInt(splitDate[2]);
	    
	    var id = doc.customerId;
	    var group = state[id] ? state[id] : month;
		state[id] = group;
	    var newDate = new Date( splitDate[2] + "-" + month + "-" + splitDate[1] );
	    
	    db.orders.update(
	        { _id: doc._id },
	        { "$set": { "orderDate": newDate, 'orderMonth' : month, 'orderYear' : year, orderGroup: group } }
	    );
	})

db.orders.createIndex( { orderMonth: 1,orderYear: 1,orderGroup: 1 } )