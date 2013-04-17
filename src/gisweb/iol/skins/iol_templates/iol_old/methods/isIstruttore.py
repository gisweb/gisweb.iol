## Script (Python) "isIstruttore"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=
##title=DEPRECATO: visto che no usiamo più i ruoli di Plomino ma i gruppi di Plone
##
try:
    db = context.getParentDatabase()
except:
    return 0
role = '[istruttore-'
for i in db.getUserRoles():
    if role in i:
        return 1
return 0
