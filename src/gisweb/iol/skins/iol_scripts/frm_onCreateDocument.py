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
# prerequisiti:
# * ruoli di Plomino: '[istruttore]' e '[rup]'
# * ruoli di Plone: 'istruttore' e 'rup'

for role in ('[istruttore]', '[rup]'):
    for uid in db.getUsersForRole(role):
        context.addLocalRoles(uid, (role[1:-1], ))


# EVENTI DI REALIZZAZIONE COLLEGAMENTO UNO A MOLTI

if child_events:
    context.event_onCreateChild(backToParent=backToParent)
