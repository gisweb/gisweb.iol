## Script (Python) "frm_onDeleteDocument"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=kin_events=None, anchor=False, suffix=''
##title=IOL onDeleteDocument event common actions
##
"""
Standardizzazione dele operazioni da svolgere alla cancellazione di una istanza
kin_events: 'child' o 'parent' (lancia gli script appropriati di gestione dell'uno a molti)
anchor: modalità per il redirect sulla pratica "genitore"
"""

# EVENTI DI REALIZZAZIONE COLLEGAMENTO UNO A MOLTI

if kin_events == 'child':
    context.event_onDeleteChild(anchor=anchor, suffix=suffix or context.naming('tipo_richiesta'))
elif kin_events == 'parent':
    context.event_onDeleteParent()


# ALTRO... eventualmente
