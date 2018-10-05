var fs = require('fs'),
    path = require('path');

/**
 * This example shows how the files can be retrieved and printed
 * in sequence using active thunks.
 */
function ex2() {
    // Print the content of each file as soon as received, but only
    // in index order. That is, print #1 only if #0 has already been printed.
    var objects = [
        { filename: "file0.txt" },
        { filename: "file1.txt" },
        { filename: "file2.txt" }
    ];

    var thunk = getFilecontent(objects[0]);
    thunk((data) => {
        output(data);
        thunk = getFilecontent(objects[1]);
        thunk((data) => {
            output(data);
            thunk = getFilecontent(objects[2]);
            thunk((data) => {
                output(data);
                showComplete();
            });
        })
    });

}

function getFilecontent(object) {
    var text;
    var f;

    setTimeout(() => {
        fs.readFile("./" + object.filename, { encoding: 'utf-8' }, function (err, data) {
            if (f) {
                f(err || data); // if the callback was passed in before our response was ready, it will be in f(); invoke it now.
            } else {
                text = err || data; // but if the cb has not been passed in yet, store our response until it arrives.
            }
        })
    },
        Math.floor(1000 * (Math.random() * 2))
    );

    return function (cb) {
        if (text) {
            cb(text); // if we have a response ready when the cb is passed in, invoke it now
        } else {
            f = cb; // otherwise hang onto the cb until we have a response for it
        }
    }
}

function handleResponse(err, data) {
    if (err) {
        output(err)
    } else {
        output(data);
    }
}

function showComplete() {
    output("Complete!");
}

var output = function (value) {
    console.log(value);
}

ex2();