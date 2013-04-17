## Script (Python) "wfVariables"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=var=''
##title=
##
from gisweb.utils import Type
from Products.CMFPlomino.PlominoUtils import  DateToString, Now
from Products.CMFCore.utils import getToolByName

if context.aq_parent.portal_type!='PlominoDocument':
    return 'Tipo di oggetto non valido'

print '**********************************************************************\n'
print '          %s                                                          ' %DateToString(Now(),'%d/%m/%Y %H:%M:%s') 
print '          %s Numero %d del %s                                         ' %(context.Title(),context.getItem('numero_pratica',0),DateToString(context.getItem('creation',Now()),'%d/%m/%Y'))
print '\n**********************************************************************'

if not var:
    pw = getToolByName(context,'portal_workflow')
    result=context.wf_getInfoFor('review_state')
    print 'Variables "%s" with values "%s" and type "%s"' %('review_state',str(result),str(Type(result)))
    for v in pw['iol_workflow'].variables:
        try:
            result=context.wf_getInfoFor(v)
        except:
            result='variable %s not found' %v
        print 'Variables "%s" with values "%s" and type "%s"' %(v,str(result),str(Type(result)))
else:
    try:
        result=context.wf_getInfoFor(var)
    except:
        result='variable %s not found' %var
    print 'Variables "%s" with values "%s" and type "%s"' %(var,str(result),str(Type(result)))


return printed
