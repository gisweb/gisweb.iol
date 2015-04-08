## Script (Python) "run_script"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=doc, name, suffix=''
##title=
##
"""
Se lo script eseguito restituisce qualcosa di valutabile come True lo script di
workflow chiamante viene by-passato.
None o False fanno proseguire.
"""

script_name = '_'.join([i for i in (suffix, name, ) if i])
resources = doc.getParentDatabase().resources

if script_name in resources.keys():
    return resources[script_name](doc)
else:
    return None
