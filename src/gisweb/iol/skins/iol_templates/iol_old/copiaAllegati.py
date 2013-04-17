## Script (Python) "copiaAllegati"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=to=''
##title=TEMPORANEA - Copia tutti gli allegati da un plominoDocument ad un altro
##
doc=context
db=doc.getParentDatabase()

if to.portal_type != 'PlominoDocument':
    return
#to = doc.getDocument(to)
    
if doc.portal_type != 'PlominoDocument':
    return


ids=doc.getFilenames()

for fname in ids:
    to.setfile(submittedValue=doc.getfile(filename=fname,asFile=False),filename=fname,overwrite=False)
return
