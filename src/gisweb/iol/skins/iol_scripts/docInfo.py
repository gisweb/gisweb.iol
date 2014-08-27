## Script (Python) "docInfo"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=format='json'
##title=
##
assert context.portal_type == 'PlominoDocument', 'PlominoDocument expected, got %s instead' % context.portal_type
db = context.getParentDatabase()
assert context.isReader(), "You don't have read permission in this document"

from Products.CMFPlomino.PlominoUtils import json_dumps


from Products.CMFCore.utils import getToolByName

pw = getToolByName(context, 'portal_workflow')
rs = context.wf_statesInfo(args=['transitions'])

wf_vars = dict([(info['wf_id'], [i for i in pw[info['wf_id']].variables]) for info in rs])
wf_vals = {}
for wf_id,var_list in wf_vars.items():
    wf_vals[wf_id] = dict([(k,context.wf_getInfoFor(k, wf_id=wf_id)) for k in var_list])

raw_data = dict(
    chain = context.wf_getChainFor(),
    review_state = rs,
    size = context.getObjSize(),
    review_history = context.wf_getInfoFor('review_history'),
    #json = context.tojson(),
    form = context.Form,
    Plomino_Authors = context.Plomino_Authors,
    created = script.smartdate(db.created()),
    modified = script.smartdate(db.modified()),
    wf_vars = wf_vals #context.wf_getInfoFor(*wf_vars)
)

# Output rendering
if format == 'json':
    context.REQUEST.RESPONSE.setHeader("Content-type", "application/json")
    return json_dumps(raw_data)
elif format == 'text':
    print json_dumps(raw_data)
    #for k,v in raw_data.items():
    #    print '%s: \n\t%s' % (k,v)
    return printed
else:
    return raw_data
