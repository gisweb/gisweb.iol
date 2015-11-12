## Script (Python) "iol_eventUtils"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=k
##title=
##

"""
Gestione centralizzata dei valori o del loro calcolo di alcuni parametri
comuni agli script degli eventi di gestione collegamento 1 a molti

"""

class main():

    def parentKey(self):
        return 'parentDocument'

    def parentLinkKey(self):
        return 'linkToParent'

    def childrenListKey(self):
        return 'childrenList_%s'

    def doc_path(self):
        """
        Calcolo unificato del valore da inserire nei doclink
        """
        return '/'.join(context.doc_path())

return getattr(main(), k)()
