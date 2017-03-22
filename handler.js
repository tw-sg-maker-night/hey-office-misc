'use strict';

var util = require('util')
var Lex = require('lex-sdk')

function inspect(obj) {
  return util.inspect(obj, false, null)
}

var handlers = {
  'GetPassword': function() {
    var network = this.event.currentIntent.slots["Network"]
    var output = this.event.outputDialogMode
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
      this.emit(':tell', 'How should I know!?!')
    }
  }
}


module.exports.getPassword = (event, context, callback) => {
  console.log("Event = " + inspect(event))
  var lex = Lex.handler(event, context)
  lex.registerHandlers(handlers)
  lex.execute()
};
