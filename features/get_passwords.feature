Feature: As a user, I want to quickly figure out what the guest wifi password is

  Scenario: Get twguest wifi password
    When I say "What's the twguest wifi password"
    Then I receive a response that starts with "The twguest password is: "

  Scenario: Get twevent wifi password
    When I say "What's the twevent wifi password"
    Then I receive "The twevent password is: ***REMOVED***"

  Scenario: Ask for network name when none specified
      When I say "What's the wifi password"
      Then I am prompted for the "network"
      When I say "twguest"
      Then I receive a response that starts with "The twguest password is: "
