## Script (Python) "autorizzaDelega"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=doc=None,Form=''
##title=
##

from Products.CMFPlomino.PlominoUtils import DateToString
db=context.getParentDatabase()

doc=db.getDocument(doc)

doc.setItem('Form',Form)
res=doc.naming()

context.redirectTo(doc.absolute_url())
doc.setTitle('Pratica di Rinnovo per delega %s' %(DateToString(context.getItem('data_pratica'),'%d/%m/%Y')))
if res:
    doc.setItem('iol_tipo_app',res['iol_tipo_app'])
    doc.setItem('iol_tipo_richiesta',res['iol_tipo_richiesta'])
    doc.setItem('iol_tipo_pratica',res['iol_tipo_pratica'])

#doc.pgSave()
