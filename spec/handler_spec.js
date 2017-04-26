const nock = require('nock')
const expect = require('chai').expect
const handler = require('../handler')

function testEvent(intentName, invocationSource, sessionAttributes, slots) {
  intentName = intentName || 'TestIntent'
  invocationSource = invocationSource || 'FulfillmentCodeHook'
  sessionAttributes = sessionAttributes || {}
  slots = slots || {}
  return {
    sessionAttributes: sessionAttributes,
    invocationSource: invocationSource,
    currentIntent: {
      name: intentName,
      slots: slots
    }
  }
}

describe('GetPassword', () => {

  describe('when the user provides a valid network name', () => {
    var event = null

    beforeEach(() => {
      process.env.TWGUEST_PASSWORD = "password"
      event = testEvent('GetPassword', 'FulfillmentCodeHook', {}, {Network: "twguest"})
    })

    it('should return the network password', (done) => {
      handler.misc(event, {
        succeed: function(response) {
          expect(response.dialogAction.type).to.equal('Close')
          expect(response.dialogAction.message.content).to.equal('The twguest password is: password')
          done()
        }
      })
    })
  })

  describe('when the user provides a invalid network name', () => {
    var event = null

    beforeEach(() => {
      event = testEvent('GetPassword', 'FulfillmentCodeHook', {}, {Network: "asdf"})
    })

    it('should return the network password', (done) => {
      handler.misc(event, {
        succeed: function(response) {
          expect(response.dialogAction.type).to.equal('Close')
          expect(response.dialogAction.message.content).to.equal('How should I know?!')
          done()
        }
      })
    })
  })

})
