## Script (Python) "before_proroga"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=state_change
##title=
##

doc = state_change.object

if script.run_script(doc, script.id) != False:

    #### OTHER CODE HERE ####

    script.run_script(doc, script.id, suffix='post')

#### SCRIPT ENDS HERE ####
