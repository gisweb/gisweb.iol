## Script (Python) "checkIstanza"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=pid='', test=0
##title=(DEPRECATO) Servizio di validazione dei campi nelle pratiche
##
'''
DEPRECATO
dato pid restituisce un dizionario in json string con gli errori riscontrati
{'success': 0/1, 'errors: [{'field_id': ..., 'error_message': ...}]'}
'''
from Products.CMFPlomino.PlominoDocument import PlominoDocument
from gisweb.utils import json_dumps

dummyValidator = lambda doc, pid: '' #

fieldValidator = context.script.fieldValidator or context.test.formValidator or dummyValidator

check = dict(
    success = test or 0,
    errors = []
)

if test: return json_dumps(check)


doc = None
if isinstance(pid, basestring):
    db = context.getParentDatabase()
    doc = db.getDocument(pid)
elif isinstance(pid, PlominoDocument):
    doc = pid
    db = doc.getParentDatabase()

if not doc:
    error_message = "Nessun documento trovato corrispondente all'id fornito: %s" % pid
    error_info = dict(
        field_id = None,
        error_message = error_message
    )
    check['errors'].append(error_info)
    return json_dumps(check)

frm = doc.getForm()
tipo_istanza = doc.getItem('tipo_istanza')

folder_contents = [db.resources.application]
if tipo_istanza:
    other_folder = db.resources.application.get(tipo_istanza)
    folder_contents.append(other_folder.script)

script_contents = []
for fc in folder_contents:
    for f in ['script', 'test']:
        if fc.get(f):
            script_content.append(fc[f])

docValidators = []
for sc in script_contents:
    val = f.get('docValidator')
    if val:
        docValidators.append(val)

for validator in docValidators:
    #for field in [f for f in frm.getFormFields(includesubforms=True, doc=None)]:
    error_messag = validator(doc, field.id, test=test)
    if error_message:
        error_info = dict(
            field_id = field.id,
            field_title = field.title,
            error_message = error_message
        )
        check['errors'].append(error_info)

if not check['errors']:
    check['success'] = 1

return json_dumps(check)
