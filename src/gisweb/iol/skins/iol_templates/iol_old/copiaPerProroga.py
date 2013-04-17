## Script (Python) "copiaPerProroga"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=
##title=DEPRECATO, da cancellare
##
"""
bozza di comportamento standard per le proroghe:
i dati del sub_pratica che voglio spostare ma andrebbero a sovrascrivere quelli della richiesta posso pensare
di rinominarli aggiungendo un suffisso uguale per tutti.

Ci sono in più:
    * La data di proroga che deve sostituire quella di fine richiesta salvando il vecchio valore.
    * La motivazione 

"""

doc = context
db = context.getParentDatabase()
parent = db.getDocument(doc.getItem('parentDocument'))
sub_pratica_frm =  db.getForm('sub_pratica')
if parent.portal_type == 'PlominoDocument':
    flds = [f.getId() for f in db.getForm('sub_proroga').getFormFields(includesubforms=False, doc=None, applyhidewhen=False)]
    for i in flds:
        parent.setItem('%s' %i, doc.getItem(i.replace('proroga_','')))

#parent.setItem('motivo_proroga', doc.getItem('motivo_proroga'))

# backup trasporti_datafine
#parent.setItem('trasporti_datafine_richiesta', parent.getItem('trasporti_datafine'))
#parent.setItem('trasporti_datafine', doc.getItem('trasporti_datafine'))

# setto un destinatario per gli invii mail
doc.setItem('fisica_email', parent.getItem('giuridica_email','') or parent.getItem('fisica_email',''))

parent.updateStatus()
