*** Settings ***
Suite Setup     Suite Setup
Suite Teardown  Suite Teardown
Variables       gisweb/iol/tests/robot/variables.py
Library         Selenium2Library  timeout=${SELENIUM_TIMEOUT}  implicit_wait=${SELENIUM_IMPLICIT_WAIT}
Library         Remote  ${PLONE_URL}/RobotRemote
Resource        library-settings.txt
Resource        gisweb/iol/tests/robot/keywords.txt

*** Test Cases ***
Test Compilare la pratica base
  Data una Pratica base
  Leggo  Persona fisica
  Capture Page Screenshot
  Compilando l'anagrafica
  Capture Page Screenshot
  Posso inviare la domanda

*** Keywords ***
Leggo
  [Arguments]  ${testo}
  Page should contain  ${testo}

Data una Pratica base
  go to  ${PLONE_URL}/iol_base/
  Capture Page Screenshot
  Click Link  Pratica base
  Wait Until Page Contains  Persona fisica

Compilando l'anagrafica
  Scrivo  Pinco  nel campo  fisica_nome
  Scrivo  Pallino  nel campo  fisica_cognome
  Scelgo  M  da  fisica_sesso
  Scrivo  20/11/1990  nel campo  fisica_data_nato
  Compilo il comune  fisica_comune_nato  Genova
  Scrivo  italiana  nel campo  fisica_cittadinanza
  Scrivo  CFFFFFFFFF  nel campo  fisica_cf
  Compilo il comune  fisica_comune  Savona
  Scrivo  via dei Glicini  nel campo  fisica_indirizzo
  Scrivo  12/a  nel campo  fisica_civico
  Scrivo  001100110011  nel campo  fisica_telefono
  Scrivo  001100110011  nel campo  fisica_cellulare
  Scrivo  001100110011  nel campo  fisica_fax
  Capture Page Screenshot
  Click button  xpath=//button[@data-name='btn_salva']
  Capture Page Screenshot


Compilo il comune
  [Arguments]  ${nome_campo}  ${valore}
  Scrivo  ${valore}  nel campo  ${nome_campo}
  Wait Until Page Contains Element  xpath=//a[contains(text(), '${valore} (')]
  Click Link  xpath=//a[contains(text(), '${valore} (')]


Scrivo
  [Arguments]  ${testo}  ${_nel_campo_}  ${nome_campo}
  Input text  xpath=//input[@name="${nome_campo}"]  ${testo}

Scelgo
  [Arguments]  ${scelta}  ${_da_}  ${nome_campo}
  Select checkbox  xpath=//input[@type="radio" and @name="${nome_campo}" and @value="${scelta}"]

Posso inviare la domanda
  Comment  TODO
