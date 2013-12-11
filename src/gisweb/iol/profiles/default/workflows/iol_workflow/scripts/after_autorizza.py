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

#Aggiornamento dello stato su plominoDocument
db = doc.getParentDatabase()
doc.updateStatus()

if script.run_script(doc, script.id) != False:

    #### OTHER CODE HERE ####

    iol_tipo_richiesta = doc.naming('richiesta')

    # 1. Setto il numero di rinnovi sulla richiesta genitore
    if 'rinnovo' in iol_tipo_richiesta:
        parentDocument = db.getDocument(doc.getItem('parentDocument'))
        if parentDocument:
            num = parentDocument.getItem('numero_rinnovi', 0)
            parentDocument.setItem('numero_rinnovi', num + 1)

    # 2. Setto il numero di proroghe sulla richiesta genitore
    if 'proroga' in iol_tipo_richiesta:
        parentDocument = db.getDocument(doc.getItem('parentDocument'))
        if parentDocument:
            num = parentDocument.getItem('numero_proroghe', 0)
            parentDocument.setItem('numero_proroghe', num + 1)
    
    # 3. Se Rinnovo o Pratica Base Trasform il Docx dell'autorizzazione in PDF 
    doc.convertToPdf(file_type='documenti_autorizzazione')
    if iol_tipo_richiesta != 'integrazione':
        doc.sendThisMail('autorizza')

    script.run_script(doc, script.id, suffix='post')

#### SCRIPT ENDS HERE ####
