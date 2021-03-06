/*
  Alexa MSU People Search app
  For Spartahack 2017
  Contributors:
    Brian Wang
    Koshiro Iwasaki
    Reid Wildenhaus
    Scott Swarthout
*/

const Alexa = require('alexa-sdk');
var aws = require('aws-sdk');
var params;
var docClient = new aws.DynamoDB.DocumentClient();
var store = "Not Found";
var c;
var firstName, lastName, major;
//const APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    //alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.registerHandlers(handlers);
    alexa.execute();
};

function getPhoneNumber(context) {
    firstName = (context.event.request.intent.slots.FirstName.value);
    lastName = (context.event.request.intent.slots.LastName.value);
    //major = context.event.request.intent.slots.Major).toString();

    docClient = new aws.DynamoDB.DocumentClient();
    
	console.log(firstName + " " + lastName);
    console.log("Searching for phone number...");
        
    //Sanitize Name Input
    var sanitizedFirstName = firstName.substring(0,1).toUpperCase() + firstName.substring(1,firstName.length);
    var sanitizedLastName = lastName.substring(0,1).toUpperCase() + lastName.substring(1,lastName.length);
	sanitizedLastName = sanitizedLastName.substring(0,3); //Search for substring of last name to improve accuracy
    console.log("Sanitized Name: " + sanitizedFirstName + " " + sanitizedLastName);

    params = {
        TableName: "People",//test lastname later with 'and'
        //KeyConditionExpression: "id = :id",
        FilterExpression: "contains(#first_name, :firstname) and contains(#last_name, :lastname) and #phone <> :space",
        ExpressionAttributeNames: {
            "#first_name" : "first_name",
            "#last_name" : "last_name",
            "#phone": "phone"
        },
        ExpressionAttributeValues: {
            ":firstname": sanitizedFirstName,
            ":lastname": sanitizedLastName,
            ":space": " "
        }
    };

    docClient.scan(params, onScan);
    console.log(store);
    //callback();
}

function onScan(err, data) {
    if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
        console.log("Query succeeded.");
        console.log(data);
        if (data.Items !== []) {
            data.Items.forEach(function(item) {
				if (store == "Not Found")
					store = item.phone;
            });
        }
        console.log(store);
    }

    if (typeof data.LastEvaluatedKey != "undefined") {
        console.log("Scanning for more...");
        params.ExclusiveStartKey = data.LastEvaluatedKey;
        docClient.scan(params, onScan);
    } else {
        c.emit(':tell',"The number you're looking for is " + store 
			 + ". To remove your information from MSU People Search, go to your stew info account, and access your directory restrictions.  Hope this helps!");
        //c.emit(':ask', 'Would you like to learn how to edit your information on MSU people search?');
    }
}

var handlers = {
    'LaunchRequest': function () {
        this.emit(':ask', 'Give me a name');
    },
    'GetPhoneNumber': function () {
        c = this;
        getPhoneNumber(this);
    },
    'RemoveData' : function () {
        var answer = this.event.request.intent.slots.Answer;
        if(answer) {
            if(answer.value == "yes") {
                 this.emit(':tell', "To edit your information, go to your STUINFO account, and access your directory restrictions.  Hope this helps!");
            }
            else {
                this.emit(':tell', "Goodbye");
            }
        }
    }
};
