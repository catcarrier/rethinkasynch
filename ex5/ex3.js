var fs = require('fs');
//path = require('path');

/**
 * This example shows how the files can be retrieved and printed
 * in sequence using active thunks.
 */
function ex() {
    // Print the content of each file as soon as received, but only
    // in index order. That is, print #1 only if #0 has already been printed.
    var objects = [
        { filename: "file0.txt" },
        { filename: "file1.txt" },
        { filename: "file2.txt" }
    ];

    // getFilecontent(objects[0])
    //     .then( (data) => {
    //         output(data);
    //         return getFilecontent(objects[1])
    //     })
    //     .then( (data) => {
    //         output(data);
    //         return getFilecontent(objects[2])
    //     })
    //     .then( (data) => {
    //         output(data);
    //         showComplete();
    //         }
    //     )
    //     .catch((err) => output(err));

    // alternate syntax with one promise per operation
    getFilecontent(objects[0])
        .then( output )
        .then( function(){ return getFilecontent(objects[1]) } )
        .then( output )
        .then( function(){ return getFilecontent(objects[2]) } )
        .then( output )
        .then( showComplete )
        .catch((err) => output(err));

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
            Math.floor(1000 * (Math.random() * 2))
        );
    });
}

// function handleResponse(err, data) {
//     if (err) {
//         output(err)
//     } else {
//         output(data);
//     }
// }

function showComplete() {
    output("Complete!");
}

var output = function (value) {
    console.log(value);
}

ex();