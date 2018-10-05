var fs = require('fs'),
    path = require('path');

/**
 * This example shows how the files can be retrieved and printed
 * in sequence using lazy thunks - they do not fetch the data
 * until you pass a cb to the thunk.
 * If the thunks were active, if they fetched the file content
 * immediately and perhaps cached it for reuse, there may be no 
 * cb (yet) to pass the result to. See ex2_alt.js for a solution.
 */
function ex2() {
    // Print the content of each file as soon as received, but only
    // in index order. That is, print #1 only if #0 has already been printed.
    var objects = [
        { filename: "file0.txt" },
        { filename: "file1.txt" },
        { filename: "file2.txt" }
    ];

    // thunk for the first file
    var thunk = getFilecontent(objects[0]);
    thunk( (err, data) => {
        handleResponse(data);

        // thunk for the second file
        thunk = getFilecontent(objects[1]);
        thunk( (err, data) => {
            handleResponse(data);

            // thunk for last file
            thunk = getFilecontent(objects[2]);
            thunk( (err, data) => {
                handleResponse(data);

                showComplete();
            } );

        });

    } );
}

function getFilecontent(object) {
    var f = function (object, cb) {
        setTimeout(() => {
            fs.readFile("./" + object.filename, { encoding: 'utf-8' }, cb)
        },
            Math.floor(1000 * (Math.random() * 2))
        );
    }
    var thunk = function (cb) { f(object, cb) }
    return thunk;
}

function handleResponse(err, data) {
   if(err) {
       output(err)
   } else {
       output(data);
   }
}

function showComplete(){ 
    output("Complete!");
}

var output = function (value) {
    console.log(value);
}

ex2();