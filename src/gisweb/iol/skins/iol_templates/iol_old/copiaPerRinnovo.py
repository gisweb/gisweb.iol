## Script (Python) "copiaPerRinnovo"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=
##title=DEPRECATO, da cancellare
##
"""
Copio una serie di dati dalla pratica genitore in particolare
tutti i dati che ho nel form dsp e i documenti di autorizzazione
della richiesta che viene rinnovata.
"""

db = context.getParentDatabase()

tipo_app = context.naming_manager('tipo_app')

diff = lambda l1,l2: [x for x in l1 if x not in l2]

dsp_from_name = 'dsp_%s' % tipo_app
dsp_from = db.getForm(dsp_from_name)

if not dsp_from:
    raise Exception('Attenzione! Il form "%s" non esiste nel PlominoDatabase "%s"' % (dsp_from_name, db.getId()))

parentId = context.getItem('parentDocument')
parentDocument = db.getDocument(parentId)

if not parentDocument:
    raise Exception('Attenzione! Il documento "%s" non esiste nel PlominoDatabase "%s"' % (parentId, db.getId()))

frm_content = [fld.id for fld in parentDocument.getForm().getFormFields(includesubforms=True, applyhidewhen=False)]
dsp_1 = [fld.id for fld in dsp_from.getFormFields(includesubforms=False, applyhidewhen=False)]
dsp_2 = [fld.id for fld in dsp_from.getFormFields(includesubforms=True, applyhidewhen=False)]
    
for item_name in [i for i in diff(dsp_2,dsp_1) if  i in frm_content]:
    plominoDocument.setItem(item_name, parentDocument.getItem(item_name))

# copia del riferimento al documenti di autorizzazione della pratica
actualdocs = context.getItem('documenti', {}) or {}
actualdocs.update(parentDocument.getItem('documenti', {}) or {})
context.setItem('documenti', actualdocs)
