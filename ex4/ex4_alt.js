var fs = require('fs');

function ex() {
    // Convert the array into a promise chain that prints the content
    // of each, in order, as they are received.
    var objects = [
        { filename: "file0.txt" },
        { filename: "file1.txt" },
        { filename: "file2.txt" }
    ];

    // Call [].map to return an array of Promises.
    // Pass the array to a reducer that attaches the next promise to the then()
    // of the previous one.
    // The second param to reduce(), the 'current value', is an already-resolved Promise
    // that kicks off the chain.
    // When the reducer returns the chain, add another then() for our
    // completion message.
    objects.map(getFilecontent)
        .reduce(function combine(chain, p){
            return chain.then( function() {
                return p;
            }).then( output )
        }, Promise.resolve())
        .then( function(){ showComplete } )
}


function getFilecontent(object) {
    return new Promise( (resolve, reject) => {
        setTimeout(() => {
            fs.readFile("./" + object.filename, { encoding: 'utf-8' }, function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            })
        },
            Math.floor(1000 * (Math.random() * 3))
        );
    });
}

function showComplete() {
    output("Complete!");
}

var output = function (value) {
    console.log(value);
}

ex();