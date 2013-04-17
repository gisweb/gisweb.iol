## Script (Python) "elencoTipiPratica"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=
##title=DEPRECATO: usare [i.getFormName() for i in db.callScriptMethod('frm_events', 'elenca_tipi_pratica', context)]
##
"""

questo file è ancora qui solo per ragioni di retro-compatibilità
se non è più usato meglio rimuoverlo!

"""

return [i.getFormName() for i in context.getParentDatabase().callScriptMethod('frm_events', 'elenca_tipi_pratica', context)]

try:
    db = context.getParentDatabase()
except:
    return []

forms=[]
tmp = [f.getFormName() for f in db.getForms()]
roles = [r.split('-')[1][:-1] for r in db.getUserRoles()]
for r in roles:
    for f in tmp:
        if ( f.startswith('frm_%s' %r) or f.startswith('search_%s' %r)) and not '_info' in f: 
            forms.append(f)

 
return forms
