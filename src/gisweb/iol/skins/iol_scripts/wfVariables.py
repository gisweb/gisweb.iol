## Script (Python) "wfVariables"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=wf_name='iol_workflow',var=None
##title=Get current workflow variables values
##
from gisweb.utils import Type
from Products.CMFPlomino.PlominoUtils import  DateToString, Now
from Products.CMFCore.utils import getToolByName


if context.portal_type!='PlominoDocument':
    return 'Tipo di oggetto non valido'

print '**********************************************************************'
print 'WORKFLOW : %s' % wfname
print 'STATO : %s' % (context.wf_getInfoFor('review_state'))
print DateToString(Now(),'%d/%m/%Y %H:%M:%s') 
print '**********************************************************************'

if not var:
    pw = getToolByName(context,'portal_workflow')
    for v in pw[wfname].variables:
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
