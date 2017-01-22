/*
  Alexa MSU People Search app
  For Spartahack 2017
  Contributors:
    Adam Austad
    Brian Wang
    Koshiro Iwasaki
    Reid Wildenhaus
    Scott Swarthout
*/

const Alexa = require('alexa-sdk');
 var aws = require('aws-sdk');
//
//const APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    //alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var params;
var docClient = new aws.DynamoDB.DocumentClient();
var store = "test";

function getPhoneNumber(context, callback) {
        firstName = (context.event.request.intent.slots.FirstName.value);
        lastName = (context.event.request.intent.slots.LastName.value);

        //major = context.event.request.intent.slots.Major).toString();
        var thing = context;
        
        //var payload;
    
        /*var lambda = new aws.Lambda({
          region: 'us-east-1' //change to scotty
        });
        
        //stringify JSON for Name, call it student_name
        var student_name = JSON.stringify({firstname : firstName, lastname : lastName, major : major});
        
        var params = {
            FunctionName: "stalkerdb-dev-search",
            Payload: student_name
        };
        lambda.invoke(params, function(err, data) {
            if(err) console.log(err, err.stack);
            else {//change this to deliver payload back to alexa
                console.log(data.Payload);
                payload = data.Payload;
            }
        });*/
        
        //Implement an efficient search for the dynamodb
        //If key is based on alphabetical first name, this is easier.  But likely it's based on an arbitrary number.  So linear search it is.
        
        
        docClient = new aws.DynamoDB.DocumentClient();
        
        console.log("Searching for phone number...");
            
        params = {
                TableName: "People",//test lastname later with 'and'
                //KeyConditionExpression: "id = :id",
                FilterExpression: "#first_name = :firstname and #last_name = :lastname",
                ExpressionAttributeNames: {
                    "#first_name" : "first_name",
                    "#last_name" : "last_name"
                },
                ExpressionAttributeValues: {
                    ":firstname": firstName,
                    ":lastname": lastName
                }
        };
        
        docClient.scan(params, onScan);
        console.log(store);

}

function onScan(err, data) {
    if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
        console.log("Query succeeded.");
        console.log(data);
        if (data.Items !== []) {
            data.Items.forEach(function(item) {
                store = item.phone;
            });
        }
                console.log(store);
        //callback(data.Items);
    }
    if (typeof data.LastEvaluatedKey != "undefined") {
        console.log("Scanning for more...");
        params.ExclusiveStartKey = data.LastEvaluatedKey;
        docClient.scan(params, onScan);
    }
}

var firstName, lastName, major;

var handlers = {
    'LaunchRequest': function () {
        this.emit(':ask', 'Give me a name');
    },
    'GetPhoneNumber': function () {
        //var that = this;
       // getPhoneNumber(this);
        
        firstName = (this.event.request.intent.slots.FirstName.value);
        lastName = (this.event.request.intent.slots.LastName.value);

        //major = context.event.request.intent.slots.Major).toString();
       // var thing = context;
        
        //var payload;
    
        /*var lambda = new aws.Lambda({
          region: 'us-east-1' //change to scotty
        });
        
        //stringify JSON for Name, call it student_name
        var student_name = JSON.stringify({firstname : firstName, lastname : lastName, major : major});
        
        var params = {
            FunctionName: "stalkerdb-dev-search",
            Payload: student_name
        };
        lambda.invoke(params, function(err, data) {
            if(err) console.log(err, err.stack);
            else {//change this to deliver payload back to alexa
                console.log(data.Payload);
                payload = data.Payload;
            }
        });*/
        
        //Implement an efficient search for the dynamodb
        //If key is based on alphabetical first name, this is easier.  But likely it's based on an arbitrary number.  So linear search it is.
        
        
        docClient = new aws.DynamoDB.DocumentClient();
        
        console.log("Searching for phone number...");
            
        params = {
                TableName: "People",//test lastname later with 'and'
                //KeyConditionExpression: "id = :id",
                FilterExpression: "#first_name = :firstname and #last_name = :lastname",
                ExpressionAttributeNames: {
                    "#first_name" : "first_name",
                    "#last_name" : "last_name"
                },
                ExpressionAttributeValues: {
                    ":firstname": firstName,
                    ":lastname": lastName
                }
        };
        
        docClient.scan(params, onScan);
        console.log(store);

        
        
        
         this.emit(':tell',"The number you're looking for is " + store);
        this.emit(':ask', 'Would you like to learn how to edit your information on MSU people search?');
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


