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

from Products.CMFPlomino.PlominoUtils import Now

db = context.getParentDatabase()

tipo_app = script.naming('tipo_app')

# PERMESSI

context.addLocalRoles('istruttori-%s' % tipo_app, ['istruttore'])
context.addLocalRoles('rup-%s' % tipo_app, ['rup'])

# EVENTI DI REALIZZAZIONE COLLEGAMENTO UNO A MOLTI

if child_events:
    
    context.event_onCreateChild(backToParent=backToParent)
    
# RINNOVO
    
#if context.naming_manager('tipo_richiesta') == 'rinnovo':
#    context.copiaPerRinnovo()
