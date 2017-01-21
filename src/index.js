const Alexa = require('alexa-sdk');

const APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit(':ask', 'Let me know who you want to stalk');
    },
    'GetPhoneNumber': function () {
        if(this.event.request.intent.slots.FirstName) {
        var firstName = this.event.request.intent.slots.FirstName;
        var lastName = this.event.request.intent.slots.LastName;
       this.emit(':tell', 'You have said:' + firstName.value + ', ' + lastName.value);
        }
        else {
            this.emit(':tell', "Welcome to the skill, please ask for a number");
        }
    }//add option for just using first name later
};


/*var aws = require('aws-sdk');
var lambda = new aws.Lambda({
  region: 'us-east-1' //change to scotty
});

//stringify JSON for Name, call it student_name

var params = {
    FunctionName: "",
    Payload: student_name
};
lambda.invoke(params, function(err, data) {
    if(err) console.log(err, err.stack);
    else {//change this to deliver payload back to alexa
        console.log(data.Payload);
    }
});*/