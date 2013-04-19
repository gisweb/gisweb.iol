*** Settings ***
Suite Setup     Suite Setup
Suite Teardown  Suite Teardown
Variables       gisweb/iol/tests/robot/variables.py
Library         Selenium2Library  timeout=${SELENIUM_TIMEOUT}  implicit_wait=${SELENIUM_IMPLICIT_WAIT}
Resource        library-settings.txt
Resource        gisweb/iol/tests/robot/keywords.txt

*** Test Cases ***
Test iol_base creation
  Given A iol_base database
  When I visit iol_base
  And I Click on Pratica base
  Then I can see the form
  And Comment  PAUSE

*** Keywords ***
A iol_base database
  Comment  It should be there, created in our test fixture

I visit iol_base
  go to  ${PLONE_URL}/iol_base/

And I Click on Pratica base
  Click Link  Pratica base

I can see the form
  Page should contain  Persona fisica
