'use strict';

const util = require('util')
const Lex = require('lex-sdk')

function inspect(obj) {
  return util.inspect(obj, false, null)
}

const passwordHandlers = {
  'GetPassword': function() {
    const network = this.event.currentIntent.slots["Network"]
    const output = this.event.outputDialogMode
    if(network.indexOf('guest') != -1) {
      if(output == 'Voice') {
        this.emit(':tell', 'The t.w. guest password is: '+ process.env.TWGUEST_PASSWORD)
      } else {
        this.emit(':tell', 'The twguest password is: '+ process.env.TWGUEST_PASSWORD)
      }
    } else if(network.indexOf('event') != -1) {
      if(output == 'Voice') {
        this.emit(':tell', 'The t.w. event password is: '+ process.env.TWEVENT_PASSWORD)
      } else {
        this.emit(':tell', 'The twevent password is: '+ process.env.TWEVENT_PASSWORD)
      }
    } else if(network.indexOf('data') != -1) {
      if(output == 'Voice') {
        this.emit(':tell', 'The t.w. data is only accessible to TWers, and the password is the same as your okta login password')
      } else {
        this.emit(':tell', 'The twdata is only accessible to TWers, and the password is the same as your okta login password')
      }
    } else {
      this.emit(':tell', 'How should I know?!')
    }
  }
}

const getPassword = (event, context, callback) => {
  console.log("Event = " + inspect(event))
  const lex = Lex.handler(event, context)
  lex.registerHandlers(passwordHandlers)
  lex.execute()
};

const documentHandlers = {
  'GetDocument': function() {
    const documentName = this.event.currentIntent.slots["DocumentName"].toLowerCase();
    const output = this.event.outputDialogMode
    if(output == 'Voice') this.emit(':tell', "Message me instead to get the answer!")
    if(documentName.indexOf('leave form') != -1) {
      if(output !== 'Voice') {
        this.emit(':tell', 'https://docs.google.com/a/thoughtworks.com/forms/d/e/1FAIpQLScxeQd78tKd1aw7K2mzKH5QPwZ7XO8N65Bwsqzo27Pchl122Q/viewform')
      }
    }
  }
}

const getDocument = (event, context, callback) => {
  console.log("Event = " + inspect(event))
  const lex = Lex.handler(event, context)
  lex.registerHandlers(documentHandlers)
  lex.execute()
};

module.exports = {
  getPassword: getPassword,
  getDocument: getDocument
}