'use strict';

// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: 'PlainText',
            text: output,
        },
        card: {
            type: 'Simple',
            title: `SessionSpeechlet - ${title}`,
            content: `SessionSpeechlet - ${output}`,
        },
        reprompt: {
            outputSpeech: {
                type: 'PlainText',
                text: repromptText,
            },
        },
        shouldEndSession,
    };
}

// This is what is re-played on Alexa device.
function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: '1.0',
        sessionAttributes,
        response: speechletResponse,
    };
}


// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    const sessionAttributes = {};
    const cardTitle = 'Welcome';
    const speechOutput = 'Welcome to agile times. ' +
        'Please add new timesheet by saying, add timesheet to Project name and category.';
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    const repromptText = 'Please add new timesheet by saying, ' +
        'add time to Project name.';
    const shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function handleSessionEndRequest(callback) {
    const cardTitle = 'Session Ended';
    const speechOutput = 'Thank you for using agile times. Have a nice day!';
    // Setting this to true ends the session and exits the skill.
    const shouldEndSession = true;

    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}

function createAttributes(Project, Category) {
    return {
        Project,
        Category
    };
}

/**
 * Adds new timesheet to a project.
 */
function addTimesheet(intent, session, callback) {
    const cardTitle = intent.name;
    const projectSlot = intent.slots.Project;
    const categorySlot = intent.slots.Category;
    let repromptText = null;
    let sessionAttributes = {};
    const shouldEndSession = true;
    let speechOutput = '';

    if (projectSlot && typeof (projectSlot.value) !== 'undefined') {
        const project = projectSlot.value;
        const category = categorySlot.value;
        sessionAttributes = createAttributes(project, category);
        speechOutput = categorySlot && typeof (categorySlot.value) !== 'undefined' ? `Got it. Adding new timesheet to ${project} project, ${category} category.` : `Got it. Adding new timesheet to ${project} project.`;

        createNewTimeSheet(project, category);

    } else {
        speechOutput = "I couldn't find that project name. Please try again.";
    }

    // Setting repromptText to null signifies that we do not want to reprompt the user.
    // If the user does not respond or says something that is not understood, the session
    // will end.
    callback(sessionAttributes,
        buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
}

/**
 * Deletes timesheet from the project
 */
function deleteTimesheet(intent, session, callback) {
    const cardTitle = intent.name;
    const projectSlot = intent.slots.Project;
    const categorySlot = intent.slots.Category;
    let repromptText = null;
    let sessionAttributes = {};
    const shouldEndSession = true;
    let speechOutput = '';

    if (projectSlot && typeof (projectSlot.value) !== 'undefined') {
        const project = projectSlot.value;
        const category = categorySlot.value;
        sessionAttributes = createAttributes(project, category);
        speechOutput = categorySlot && typeof (categorySlot.value) !== 'undefined' ? `Got it. Adding new timesheet to ${project} project, ${category} category.` : `Got it. Adding new timesheet to ${project} project.`;

        deleteAll(project, category);

    } else {
        speechOutput = "I couldn't find that project name. Please try again.";
    }

    // Setting repromptText to null signifies that we do not want to reprompt the user.
    // If the user does not respond or says something that is not understood, the session
    // will end.
    callback(sessionAttributes,
        buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
}


/**
 * Adds new timesheet to a project.
 */
function addTimesheet(intent, session, callback) {
    const cardTitle = intent.name;
    const projectSlot = intent.slots.Project;
    const categorySlot = intent.slots.Category;
    let repromptText = null;
    let sessionAttributes = {};
    const shouldEndSession = true;
    let speechOutput = '';

    if (projectSlot && typeof (projectSlot.value) !== 'undefined') {
        const project = projectSlot.value;
        const category = categorySlot.value;
        sessionAttributes = createAttributes(project, category);
        speechOutput = categorySlot && typeof (categorySlot.value) !== 'undefined' ? `Got it. Adding new timesheet to ${project} project, ${category} category.` : `Got it. Adding new timesheet to ${project} project.`;

        createNewTimeSheet(project, category);

    } else {
        speechOutput = "I couldn't find that project name. Please try again.";
    }

    // Setting repromptText to null signifies that we do not want to reprompt the user.
    // If the user does not respond or says something that is not understood, the session
    // will end.
    callback(sessionAttributes,
        buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
}

function deleteAll(projectName, categoryName) {
    
        var variables = {
            user: 'testUser',
            project: projectName,
            category: categoryName ? categoryName : '',
            startTime: 12,
            endTime: 18,
            date: new Date()
        };
    
        var client = require('graphql-client')({ url: 'https://api.graph.cool/simple/v1/cj7zthyzu01ws0193qx1ua5mf' });
    
        client.query(`
          mutation {
                deletePost(id: "cj9ak6ts60mlw0156yn66l86p") {
                  id
                  title
                }
              }`, variables, function (req, res) {
                if (res.status === 401) {
                    throw new Error('Not authorized');
                }
            })
            .then(function (body) {
                console.log(body);
            })
            .catch(function (err) {
                console.log(err.message);
            });
    
    }


function createNewTimeSheet(projectName, categoryName) {

    var variables = {
        user: 'testUser',
        project: projectName,
        category: categoryName ? categoryName : '',
        startTime: 12,
        endTime: 18,
        date: new Date()
    };

    var client = require('graphql-client')({ url: 'https://api.graph.cool/simple/v1/cj7zthyzu01ws0193qx1ua5mf' });

    client.query(`
        mutation createTimesheet ($user: String!, $project: String!, $category: String!, $startTime: Int!, $endTime: Int!, $date: DateTime!) {
            createTimesheet(user: $user, project: $project, category: $category, startTime: $startTime, endTime: $endTime, date: $date ) {
                id
            }
        }`, variables, function (req, res) {
            if (res.status === 401) {
                throw new Error('Not authorized');
            }
        })
        .then(function (body) {
            console.log(body);
        })
        .catch(function (err) {
            console.log(err.message);
        });

}

// --------------- Events -----------------------

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log(`onSessionStarted requestId=${sessionStartedRequest.requestId}, sessionId=${session.sessionId}`);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log(`onLaunch requestId=${launchRequest.requestId}, sessionId=${session.sessionId}`);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {

    console.log(`onIntent requestId=${intentRequest.requestId}, sessionId=${session.sessionId}`);

    const intent = intentRequest.intent;
    const intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    if (intentName === 'AddTimesheetIntent') {
        addTimesheet(intent, session, callback);
    } else if (intentName === 'AMAZON.HelpIntent') {
        getWelcomeResponse(callback);
    } else if (intentName === 'AMAZON.StopIntent' || intentName === 'AMAZON.CancelIntent') {
        handleSessionEndRequest(callback);}
        else if (intentName === 'DeleteAllTimesheetsIntent') {
            deleteTimesheet(intent, session, callback);
        }
     else {
        throw new Error('Invalid intent');
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log(`onSessionEnded requestId=${sessionEndedRequest.requestId}, sessionId=${session.sessionId}`);
    // Add cleanup logic here
}


// --------------- Main handler -----------------------

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = (event, context, callback) => {
    try {
        console.log(`event.session.application.applicationId=${event.session.application.applicationId}`);

        if (event.session.new) {
            onSessionStarted({ requestId: event.request.requestId }, event.session);
        }

        if (event.request.type === 'LaunchRequest') {
            onLaunch(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'IntentRequest') {
            onIntent(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'SessionEndedRequest') {
            onSessionEnded(event.request, event.session);
            callback();
        }
    } catch (err) {
        callback(err);
    }
};