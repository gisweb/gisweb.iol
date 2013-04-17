## Script (Python) "copyFileTo"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=destDoc, sourceItem, destItem='', new_filename=''
##title=(copiato in gisweb.iol, DA CANCELLARE)
##
"""
Copia di un file da un PlominoDocument ad un altro
destDoc: documento di destinazione (o suo id)
sourceItem: item_name sorgente
destItem: nome(*) o formato(**) del nome dell'item di destinazione (se mancante si assume lo stesso nome della sorgente).
new_filename: nome(***) o formato(****) del file destinazione (se mancante si assume lo stesso nome file originario).

courtesy of: https://github.com/plomino/Plomino/issues/172#issuecomment-9494835
"""

if isinstance(destDoc, basestring):
    destDoc = context.getParentDatabase().getDocument(destDoc)

files = context.getItem(sourceItem, {}) or {}
new_files = dict()

for filename, mimetype in files.items():
    file_content = context.getfile(filename, asFile=True)
    
    if '%s' in destItem:
        destItem = destItem % sourceItem # (**)
    else:
        destItem = destItem or sourceItem # (*)
    
    if '%s' in new_filename:
        new_filename = new_filename % filename # (****)
    else:
        new_filename = new_filename or filename # (***)
        
    (new_filename, new_type) = destDoc.setfile('%s' % file_content, filename=new_filename, overwrite=False)
    if not new_type:
        new_type = mimetype
    
    new_files[new_filename] = new_type
    old_att = destDoc.getItem(destItem, {})
    old_att.update(new_files)
    destDoc.setItem(destItem, old_att)
