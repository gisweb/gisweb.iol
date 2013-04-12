*** Settings ***

Variables  gisweb/iol/tests/robot/variables.py

Library  Selenium2Library  timeout=${SELENIUM_TIMEOUT}  implicit_wait=${SELENIUM_IMPLICIT_WAIT}

Resource  library-settings.txt
Resource  gisweb/iol/tests/robot/keywords.txt

Suite Setup  Suite Setup
Suite Teardown  Suite Teardown


*** Test Cases ***

Test iol_base creation
    Given A Folder a-folder
     When I go to /a-folder/@@create_iol_db
     Then the folder should contain a Plomino Database


*** Keywords ***
the folder should contain a Plomino Database
    Sleep 1

I go to /a-folder/@@create_iol_db
    go to  /a-folder/@@create_iol_db