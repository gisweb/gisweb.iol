*** Settings ***
Suite Setup     Suite Setup
Suite Teardown  Suite Teardown
Variables       gisweb/iol/tests/robot/variables.py
Library         Selenium2Library  timeout=${SELENIUM_TIMEOUT}  implicit_wait=${SELENIUM_IMPLICIT_WAIT}
Resource        library-settings.txt
Resource        gisweb/iol/tests/robot/keywords.txt

*** Test Cases ***
Test fill in Pratica base
  Given a Pratica base form
  When I fill in anagrafica
  Capture Page Screenshot
  I can submit the form

Test iol_base creation
  Given A iol_base database
  When I visit iol_base
  Capture Page Screenshot
  And I Click on Pratica base
  Capture Page Screenshot
  Then I can see the form

*** Keywords ***
A iol_base database
  Comment  It should be there, created in our test fixture

I visit iol_base
  go to  ${PLONE_URL}/iol_base/

And I Click on Pratica base
  Click Link  Pratica base

I can see the form
  Page should contain  Persona fisica

a Pratica base form
  go to  ${PLONE_URL}/iol_base/
  Click Link  Pratica base

I fill in anagrafica
  Scrivo  Pinco  nel campo  fisica_nome
  Scrivo  Pallino  nel campo  fisica_cognome
  Scelgo  M  da  fisica_sesso
  Scrivo  20/11/1990  nel campo  fisica_data_nato
  Scrivo  Genova  nel campo  fisica_comune_nato

Scrivo
  [Arguments]  ${testo}  ${_nel_campo_}  ${nome_campo}
  Input text  xpath=//input[@name="${nome_campo}"]  ${testo}

Scelgo
  [Arguments]  ${scelta}  ${_da_}  ${nome_campo}
  Select checkbox  xpath=//input[@type="radio" and @name="${nome_campo}" and @value="${scelta}"]
