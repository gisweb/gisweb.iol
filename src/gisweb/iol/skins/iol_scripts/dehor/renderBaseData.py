## Script (Python) "isConditionVerified"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters= doc='', wf_id='iol_scavi_wf'
##title=Script che renderizza i dati base della pratica
##
#                                                                                              #
#                                                                                              #
#                                                                                              #
#                                                                                              #
#                                                                                              #
#                                                                                              #
#                                                                                              # 
################################################################################################

#if not context.portal_type in ('PlominoForm','PlominoDocument'):
 #   return '<div class="error">Il contesto non è ne un documento se un form. %s</div>' %(context.portal_type)

#Plomino Database    

from Products.CMFCore.utils import getToolByName

db = doc.getParentDatabase()



#Risultato
html=''
#oggetto REQUEST
request = context.REQUEST

#Recupero informazioni sullo stato di workflow e del documento
if doc.portal_type=='PlominoForm':
    frmName = doc.getFormName()
    doc=None
    state = None
    actions = []
    wfVars = dict()
    editMode = True
    creationMode = True

elif doc.portal_type=='PlominoDocument':
    frmName = doc.getForm().getFormName()
    info = doc.docInfo(format='')
    state = info['review_state'][0]['id']
    actions = info['review_state'][0]['transitions']
    wf_acts = doc.wf_transitionsInfo(wf_id=wf_id, args=['description'])
    wfVars = info['wf_vars'][wf_id]
    editMode = doc.isEditMode()
    creationMode = False



if doc and state == 'avvio' and 'invia_domanda' in [act.get('id') for act in wf_acts]:
    frm = db.getForm('base_sub_invio_domanda') 
    html += frm.displayDocument(doc,editmode=editMode,parent_form_id=frmName)

if doc or db.isNewDocument():
    frm = db.getForm('base_sub_etichette')
    html += frm.displayDocument(doc,editmode=editMode,parent_form_id=frmName)   


if doc:
    frm = db.getForm('base_sub_numerazione')
    html += frm.displayDocument(doc,editmode=editMode,parent_form_id=frmName)

if doc and state=='autorizzata':
    frm = db.getForm('base_sub_autorizzazione')
    html += frm.displayDocument(doc,editmode=editMode,parent_form_id=frmName)

if doc:
    frm = db.getForm('base_sub_workflow')
    html += frm.displayDocument(doc,editmode=editMode,parent_form_id=frmName)




return html    
