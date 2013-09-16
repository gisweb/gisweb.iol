## Script (Python) "doclinkCommons"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=action
##title=
##

"""
Gestione centralizzata dei valori o del loro calcolo di alcuni parametri
comuni agli script degli eventi di gestione collegamento 1 a molti
"""

actions = dict(
    parentKey = lambda doc: 'parentDocument',
    parentLinkKey = lambda doc: 'linkToParent',
    # Calcolo unificato del valore da inserire nei doclink
    doc_path = lambda doc: '/'.join(doc.doc_path())

)

return actions[action](context)