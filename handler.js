'use strict'

const util = require('util')
const Lex = require('lex-sdk')

function inspect(obj) {
  return util.inspect(obj, false, null)
}

const handlers = {
  'ThankYou': function() {
    this.emit(':tell', "You're welcome")
  },
  'Hello': function() {
    this.emit(':tell', "Hi, How can I help you today?")
  },
  'GetPassword': function() {
    const network = this.event.currentIntent.slots["Network"] || ""
    const output = this.event.outputDialogMode

    if(network.includes('guest')) {
      const ssid = (output === 'Voice') ? 't.w. guest' : 'twguest'
      this.emit(':tell', `The ${ssid} password is: ` + process.env.TWGUEST_PASSWORD)
    } else if(network.includes('event')) {
      const ssid = (output === 'Voice') ? 't.w. event' : 'twevent'
      this.emit(':tell', `The ${ssid} password is: ` + process.env.TWEVENT_PASSWORD)
    } else if(network.includes('data')) {
      const ssid = (output === 'Voice') ? 't.w. data' : 'twdata'
      this.emit(':tell', `The ${ssid} is only accessible to TWers, and the password is the same as your okta login password`)
    } else {
      this.emit(':tell', 'How should I know?!')
    }
  },
  'GetDocument': function() {
    const documentName = this.event.currentIntent.slots["DocumentName"].toLowerCase();
    const output = this.event.outputDialogMode
    if(output == 'Voice') this.emit(':tell', "Message me instead to get the answer!")
    if(documentName.indexOf('leave form') != -1) {
      this.emit(':tell', process.env.LEAVE_FORM_LINK)
    }
    this.emit(':tell', "Sorry, I can't find the " + documentName)
  },
  'EndChat': function() {
    Object.keys(this.attributes).forEach( (key) => { delete this.attributes[key]; });
    this.emit(':tell', "Ok. See you later!")
  }
}

const misc = (event, context, callback) => {
  console.log("Event = " + inspect(event))
  const lex = Lex.handler(event, { succeed: (response) => {
    console.log("Response = ", inspect(response))
    context.succeed(response)
  }})
  lex.registerHandlers(handlers)
  lex.execute()
}

module.exports = {
  misc: misc
}
