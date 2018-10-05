var fs = require('fs'),
    path = require('path');

// Print the content of each file as soon as received, but only
// in index order. That is, print #1 only if #0 has already been printed.
var objects = [
    { filename: "file0.txt", content: null, index: 0, received: false, printed: false },
    { filename: "file1.txt", content: null, index: 1, received: false, printed: false },
    { filename: "file2.txt", content: null, index: 2, received: false, printed: false }
];

function ex1() {
    for (var f = 0; f < objects.length; f++) {
        getFilecontent(objects[f]);
    };
}

function getFilecontent(object) {
    // curry the callback to get the object in there
    var hr = handleResponse(object);

    // insert a bit of delay to increase the variability above that from the fs callback
    setTimeout(() => {
        fs.readFile("./" + object.filename, { encoding: 'utf-8' }, hr)
    },
        Math.floor(1000 * (Math.random() * 2))
    );
}

function handleResponse(object) {
    return function (err, data) {
        // populate the file content
        object.content = data;
        object.received = true;

        console.log("received index " + object.index);

        // if (object.index > highestIndexResponse) {
        //     highestIndexResponse = object.index;
        // }

        //console.log("highestIndexResponse is " + highestIndexResponse);

        // iterate all objects until we find one not yet received.
        for (var i = 0; i < objects.length; i++) {
            var o = objects[i];

            console.log(o.filename + " received: " + o.received + ", printed: " + o.printed);

            if( o.received == false ) { 
                console.log("breaking...");
                break; 
            }

            // If we have received a response but not yet printed the content,
            // print it now
            if (!(o.printed)) {
                console.log("printing " + o.index + " " + o.filename);
                output(o);
                o.printed = true;
            } else {
                console.log("skipping " + o.index + " "  + o.filename + ", already printed");
            }
        }

        // Have we received a response for all our requests?
        var filtered = objects.filter(e => e.printed == true);
        if (filtered.length == objects.length) {
            console.log("Complete!");
        }
    }

}

var output = function (obj) {
    //console.log(obj.index + " " + obj.filename + ":");
    //console.log(obj.content);
}

ex1();