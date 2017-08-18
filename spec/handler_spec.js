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

describe('Hello', () => {

  it('should repond with a greeting', (done) => {
    event = testEvent('Hello', 'FulfillmentCodeHook', {}, {})
    handler.misc(event, {
      succeed: function(response) {
        expect(response.dialogAction.type).to.equal('Close')
        expect(response.dialogAction.message.content).to.equal("Hi, How can I help you today?")
        done()
      }
    })
  })

})

describe('EndChat', () => {

  it('should say goodbye', (done) => {
    event = testEvent('EndChat', 'FulfillmentCodeHook', {}, {})
    handler.misc(event, {
      succeed: function(response) {
        expect(response.dialogAction.type).to.equal('Close')
        expect(response.dialogAction.message.content).to.equal("Ok. See you later!")
        done()
      }
    })
  })

  it('should clear any session attributes', (done) => {
    event = testEvent('EndChat', 'DialogCodeHook', {ValueA: 'blah', ValueB: 'Blah2'}, {})
    handler.misc(event, {
      succeed: function(response) {
        expect(JSON.stringify(response.sessionAttributes)).to.equal(JSON.stringify({}))
        done()
      }
    })
  })

})
