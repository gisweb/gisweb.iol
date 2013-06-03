## Script (Python) "copyFileTo"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=destDoc, sourceItem, destItem='', new_filename='', setItem=True
##title=Copia degli allegati da un documento ad un altro
##
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
    
    if setItem:
        destDoc.setItem(destItem, old_att)
    else:
        return old_att
