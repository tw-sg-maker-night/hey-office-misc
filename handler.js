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
        this.emit(':tell', 'The t.w. guest password is: '+process.env.TWGUEST_PASSWORD)
      } else {
        this.emit(':tell', 'The twguest password is: '+process.env.TWGUEST_PASSWORD)
      }
    } else if(network.indexOf('event') != -1) {
      if(output == 'Voice') {
        this.emit(':tell', 'The t.w. event password is: '+process.env.TWEVENT_PASSWORD)
      } else {
        this.emit(':tell', 'The twevent password is: '+process.env.TWEVENT_PASSWORD)
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

module.exports = {
  getPassword: getPassword
}