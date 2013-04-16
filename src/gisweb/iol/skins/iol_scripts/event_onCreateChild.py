## Script (Python) "event_onCreateChild"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=parent_id='', backToParent='anchor', setDocLink=True
##title=
##

from gisweb.utils import idx_createFieldIndex

parentKey = script.event_common('parentKey')
parentLinkKey = script.event_common('parentLinkKey')
childrenListKey = script.event_common('childrenListKey')

idx = context.getParentDatabase().getIndex()
# verifico l'indicizzazione di alcuni campi fondamentali
idx_createFieldIndex(idx, parentKey)
idx_createFieldIndex(idx, 'CASCADE')
	
def setParenthood(ChildDocument, parent_id, CASCADE=True, setDocLink=False, bash=False):
	'''
	Set parent reference in child document
	'''

	ParentDocument = ChildDocument.getParentDatabase().getDocument(parent_id)
	Parent_path = ParentDocument.doc_path()

	ChildDocument.setItem(parentKey, ParentDocument.getId())
	ChildDocument.setItem('CASCADE', CASCADE)
	if setDocLink:
		if bash:
			# utile per la procedura bash
			ChildDocument.setItem(parentLinkKey, [Parent_path])
		else:
			# utile per la creazione via web
			ChildDocument.REQUEST.set(parentLinkKey, [Parent_path])

def setChildhood(ChildDocument, parent_id, backToParent='anchor'):
	'''
	Set child reference on parent document
	'''

	db = ChildDocument.getParentDatabase()
	ParentDocument = db.getDocument(parent_id)

	childrenList_name = childrenListKey % ChildDocument.Form
	childrenList = ParentDocument.getItem(childrenList_name, []) or []
	
	childrenList.append(ChildDocument.doc_path())

	ParentDocument.setItem(childrenList_name, childrenList)

	if backToParent:
		backUrl = ParentDocument.absolute_url()
		if backToParent == 'anchor':
			backUrl = '%s#%s' % (backUrl, childrenList_name)
		ChildDocument.setItem('plominoredirecturl', backUrl)

def oncreate_child(doc, parent_id='', backToParent='anchor', setDocLink=False):
	'''
	Actions to perform on creation of a ChildDocument
	'''

	# second take from the request
	if not parent_id:
		parent_id = doc.REQUEST.get(parentKey)

	if parent_id:
		setParenthood(doc, parent_id, setDocLink=setDocLink)
		setChildhood(doc, parent_id, backToParent)

oncreate_child(context, parent_id=parent_id, backToParent=backToParent, setDocLink=setDocLink)
