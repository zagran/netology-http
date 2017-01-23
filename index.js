'use strict';

const http = require('http');
const request = require('request');


//Lets define a port we want to listen to
const PORT = 8080;

//We need a function which handles requests and send response
function handleRequest(req, res) {

    // console.log(req);
    let body = "";
    req.on('data', function (chunk) {
        body += chunk;
    });
    req.on('end', function () {
        var valid = true;
        try {
            let jsonObj = JSON.parse(body);
            var firstname = jsonObj.firstName;
            var lastName = jsonObj.lastName;

        } catch (err) {
            valid = false;
            jsonResponse(res, {
                "success": false,
                "message": "Use POST, and set to me firstName and lastName"
            })
        }
        if (valid && firstname && lastName) {
            request({
                url: "http://netology.tomilomark.ru/api/v1/hash",
                method: "POST",
                json: true,
                headers: {
                    "firstname": firstname
                },
                body: {lastName: lastName}
            }, function (error, response, body) {
                jsonResponse(res, {
                    "firstName": firstname,
                    "lastName": lastName,
                    "secretKey": response.body.hash

                })
            });
        } else {
            jsonResponse(res, {
                "success": false,
                "message": "Use POST, and set to me firstName and lastName"

            })
        }

    });

}

function jsonResponse(response, data) {
    response.writeHead(200, {"Content-Type": "application/json"});
    response.end(JSON.stringify(data));
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start server
server.listen(PORT, function () {
    console.log("Server listening on: http://localhost:%s", PORT);
});