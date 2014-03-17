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


pw = getToolByName(context,'portal_workflow')
wf_list=[]
for i in context.wf_workflowInfo():
    wf_list.append(i['id'])
wf_ids=','.join(wf_list)
args=dict(wf_ids=wf_name)
print '**********************************************************************'
print 'WORKFLOW ASSOCIATI: %s' % wf_ids
print 'WORKFLOW RICHIESTO: %s' % wf_name
print 'STATO : %s' % (context.WFgetInfoFor('review_state'))
print DateToString(Now(),'%d/%m/%Y %H:%M:%s') 
print '**********************************************************************'

if not var:
    
    for v in pw[wf_name].variables:
        try:
            result=context.WFgetInfoFor(v,wf_ids=[wf_name])
        except:
            result='variable %s not found' %v
        print 'Variables "%s" with values "%s" and type "%s"' %(v,str(result),str(Type(result)))
else:
    try:
        result=context.WFgetInfoFor(var,wf_ids=[wf_name])
    except:
        result='variable %s not found' %var
    print 'Variables "%s" with values "%s" and type "%s"' %(var,str(result),str(Type(result)))


return printed
