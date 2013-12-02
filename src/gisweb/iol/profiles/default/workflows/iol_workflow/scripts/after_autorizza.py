## Script (Python) "after_autorizza"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=state_change
##title=
##
doc = state_change.object
db = doc.getParentDatabase()

#Recupero tipologia domanda e applicazione
iol_tipo_richiesta = doc.getItem('iol_tipo_richiesta','')
#iol_tipo_app = doc.getItem('iol_tipo_app','')

#Script personalizzato se esiste
scriptName=script.id

if scriptName in db.resources.keys():
    db.resources[scriptName](doc)

# Setto il numero di rinnovi sulla richiesta genitore
if 'rinnovo' in iol_tipo_richiesta:
    parentDocument = db.getDocument(doc.getItem('parentDocument'))
    if parentDocument:
        num = parentDocument.getItem('numero_rinnovi', 0)
        parentDocument.setItem('numero_rinnovi', num + 1)

if 'proroga' in iol_tipo_richiesta:
    parentDocument = db.getDocument(doc.getItem('parentDocument'))
    if parentDocument:
        num = parentDocument.getItem('numero_proroghe', 0)
        parentDocument.setItem('numero_proroghe', num + 1)

#Se Rinnovo o Pratica Base Trasform il Docx dell'autorizzazione in PDF 
doc.convertToPdf(file_type='documenti_autorizzazione')
if doc.getItem('iol_tipo_richiesta','')!='integrazione':
    doc.sendThisMail('autorizza') 
    
# Se sono presenti modelli di comunicazione ne genera il pdf    
if 'copyDocxToPdf' in db.resources.keys():
    db.resources.copyDocxToPdf(doc)

doc.updateStatus()
