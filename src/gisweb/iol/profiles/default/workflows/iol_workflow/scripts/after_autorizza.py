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
tipo_richiesta = doc.getItem('tipo_richiesta','')
#tipo_app = doc.getItem('tipo_app','')

# Aggiornamento dello stato su plominoDocument
#
# re-indicizzo alla fine tutti i settaggi in una volta sola


# Setto il numero di rinnovi sulla richiesta genitore
if tipo_richiesta == 'rinnovo':
    parentDocument = db.getDocument(doc.getItem('parentDocument'))
    if parentDocument:
        num = parentDocument.getItem('numero_rinnovi', 0)
        parentDocument.setItem('numero_rinnovi', num + 1)


#Se è una proroga la mando fino in fondo ad archiviata
if tipo_richiesta == 'proroga':
    parentDocument = db.getDocument(doc.getItem('parentDocument'))
    if parentDocument:
        num = parentDocument.getItem('numero_proroghe', 0)
        parentDocument.setItem('numero_proroghe', num + 1)

#Se Rinnovo o Pratica Base Trasform il Docx dell'autorizzazione in PDF        
doc.convertToPdf(file_type='documenti_autorizzazione')

doc.updateStatus()
