var fs = require('fs');

function ex() {
    // Print the content of each file, in order, when all have been received.
    var objects = [
        { filename: "file0.txt" },
        { filename: "file1.txt" },
        { filename: "file2.txt" }
    ];

    var promises = objects.map(getFilecontent);

    Promise.all(promises)
        .then( (values) => { values.forEach(output) } )
        .then( showComplete )
        .catch( (err) => output );

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