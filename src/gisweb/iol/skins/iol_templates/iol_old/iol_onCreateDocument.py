## Script (Python) "iol_onCreateDocument"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=child_events=False, event_args={}
##title=
##
"""
Standardizzazione dele operazioni da svolgere alla creazione di una istanza
child_events: True o False (lancia gli script di gestione dell'uno a molti)
kwargs: argomenti da passare al metodo oncreate_child
"""

from Products.CMFPlomino.PlominoUtils import Now

db = context.getParentDatabase()

tipo_app = context.naming_manager('tipo_app')

# PERMESSI


context.addLocalRoles('istruttori-%s' %tipo_app, ['istruttore'])
context.addLocalRoles('rup-%s' %tipo_app, ['rup'])

# EVENTI DI REALIZZAZIONE COLLEGAMENTO UNO A MOLTI

if child_events:
    
    
    
    #########
    
    def setParenthood(ChildDocument, parent_id, CASCADE=True, setDocLink=False, **kwargs):
        """
        Set parent reference in child document
        """
    
        parentKey = kwargs.get('parentKey') or defaults.get('parentKey')
        parentLinkKey = kwargs.get('parentLinkKey') or defaults.get('parentLinkKey')
    
        ParentDocument = ChildDocument.getParentDatabase().getDocument(parent_id)
        Parent_path = getPath(ParentDocument)
    
        ChildDocument.setItem(parentKey, ParentDocument.getId())
        ChildDocument.setItem('CASCADE', CASCADE)
        if setDocLink:
            # utile per la procedura bash
            ChildDocument.setItem(parentLinkKey, [Parent_path])
            # utile per la creazione via web
            ChildDocument.REQUEST.set(parentLinkKey, [Parent_path])
    
    
    def setChildhood(ChildDocument, parent_id, backToParent='anchor', **kwargs):
        '''
        Set child reference on parent document
        '''
    
        parentKey = kwargs.get('parentKey') or defaults.get('parentKey')
        childrenListKey = kwargs.get('childrenListKey') or defaults.get('childrenListKey')
    
        db = ChildDocument.getParentDatabase()
        ParentDocument = db.getDocument(parent_id)
    
        childrenList_name = childrenListKey % ChildDocument.Form
        childrenList = ParentDocument.getItem(childrenList_name, []) or []
        childrenList.append(getPath(ChildDocument))
    
        idx = db.getIndex()
        for fieldname in (parentKey, 'CASCADE', ):
            if fieldname not in idx.indexes():
                idx.createFieldIndex(fieldname, 'TEXT', refresh=True)
    
        ParentDocument.setItem(childrenList_name, childrenList)
    
        if backToParent:
            backUrl = ParentDocument.absolute_url()
            if backToParent == 'anchor':
                backUrl = '%s#%s' % (backUrl, childrenList_name)
            ChildDocument.setItem('plominoredirecturl', backUrl)
    
    def oncreate_child(self, parent_id='', backToParent='anchor', **kwargs):
        '''
        Actions to perform on creation of a ChildDocument
        '''
    
        parentKey = kwargs.get('parentKey') or defaults.get('parentKey')
    
        # if no parent_id passed
        # first take from the child itself
        #if not parent_id:
            #parent_id = self.getItem(parentKey)
    
        # second take from the request
        if not parent_id:
            parent_id = self.REQUEST.get(parentKey)
    
        if parent_id:
            setParenthood(self, parent_id, **kwargs)
            setChildhood(self, parent_id, backToParent, **kwargs)
    
    #########
    
    context.oncreate_child(**event_args)


# RINNOVO
    
#if context.naming_manager('tipo_richiesta') == 'rinnovo':
#    context.copiaPerRinnovo()
