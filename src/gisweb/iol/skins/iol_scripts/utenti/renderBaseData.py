## Script (Python) "isConditionVerified"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters= doc='', wf_id='iol_utenti_wf'
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

if doc or db.isNewDocument():
    frm = db.getForm('base_sub_etichette')
    html += frm.displayDocument(doc,editmode=editMode,parent_form_id=frmName)  

if doc.isDocument() and not doc.isEditMode() and state == 'avvio':
    frm = db.getForm('sub_avvertenze') 
    html += frm.displayDocument(doc,parent_form_id=frmName)

if doc.isDocument():
    frm = db.getForm('base_sub_numerazione')
    html += frm.displayDocument(doc,editmode=editMode,parent_form_id=frmName)


if doc.isDocument():
    frm = db.getForm('base_sub_workflow')
    html += frm.displayDocument(doc,editmode=editMode,parent_form_id=frmName)




return html    
