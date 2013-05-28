## Script (Python) "iol_onCreateDocument"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=child_events=False, backToParent=False
##title=IOL onCreateDocument event common actions
##

"""
Standardizzazione dele operazioni da svolgere alla creazione di una istanza
child_events: True o False (lancia gli script di gestione dell'uno a molti)
kwargs: argomenti da passare al metodo oncreate_child
"""

db = context.getParentDatabase()

# PERMESSI
# Ad ogni utente/gruppo del portale che ha il ruolo Plomino "[iol-qualcosa]"
#+ viene assegnato il ruolo Plone "iol-qualcosa".
rolesToAdd = dict()
for role in db.getUserRoles():
    if role.startswith('[iol-'):
        for uid in db.getUsersForRole(role):
            if uid in rolesToAdd:
                rolesToAdd[uid].append(role[1:-1])
            else:
                rolesToAdd[uid] = [role[1:-1]]
                
for uid,roles in rolesToAdd.items():
    context.addLocalRoles(uid, roles)


# EVENTI DI REALIZZAZIONE COLLEGAMENTO UNO A MOLTI
if child_events:
    context.event_onCreateChild(backToParent=backToParent)
