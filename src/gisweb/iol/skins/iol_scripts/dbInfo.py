## Script (Python) "dbInfo"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=details=0, format='json'
##title=
##
db = context.getParentDatabase()

assert db.hasCurrentUserRight('PlominoAuthor'), "You don't have rights!"
from gisweb.utils import json_dumps
from gisweb.utils import isRepoUpToDate

idx = db.getIndex()
forms = [i.getFormName() for i in db.getForms()]
views = [i.getId() for i in db.getViews()]
indexes = idx.indexes()
roles = db.getUserRoles()

raw_data = dict(
    plomino_version = dict(value = db.plomino_version),
    name = dict(value = db.getId()),
    doc_count = dict(value = len(idx.dbsearch({}))),
    test_mode = dict(value = db.test_mode(default='Not set!')),
    status = dict(value = db.getStatus()),
    form_count = dict(value = len(forms)),
    view_count = dict(value = len(views)),
    size = dict(value = db.getObjSize()),
    index_count = dict(value = len(indexes), weight=3),
    acl_roles = dict(value = dict([(r, db.getUsersForRole(r)) for r in db.getUserRoles()]), weight = 0),
    current_user = dict(value = db.getCurrentUserId()),
    members = dict(value = db.getPortalMembersIds(), weight=3),
    states = dict(value = db.getWorkflowStates(), weight=2),
    created = dict(value = script.smartdate(db.created())),
    modified = dict(value = script.smartdate(db.modified())),
    current_user_rights = dict(value = db.getCurrentUserRights(), weight=2),
    priority = dict(value = db.PLOMINO_RIGHTS_PRIORITY, weight=5),
    forms = dict(value = forms, weight=5),
    views = dict(value = views, weight=5),
    db_properties = dict(value=db.get_properties())
    #db_properties = dict(value = dict((x, y) for x, y in db.propertyItems()))
)

repos = {
    'gisweb.utils': '../src/gisweb.utils',
    'gisweb.iol': '../src/gisweb.iol',
    'gisweb.plominofields': '../src/gisweb.plominofields',
    'gisweb.plominofieldextensions': '../src/gisweb.plominofieldextensions'
}

for k,r in repos.items():
    test = int(isRepoUpToDate(r))
    msg = 'Already up to date!' if not test else 'Maybe needs an upgrade.'
    raw_data[k] = dict(value=msg)
    
ld = int(details)-1
md = int(details)+1
rr = max([(v.get('weight') or 0) for k,v in raw_data.items()])+1
if ld in range(rr):
    raw_data['less_details'] = dict(value=db.REQUEST.get('URL')+'?details=%s' % ld)
if md in range(rr):
    raw_data['more_details'] = dict(value=db.REQUEST.get('URL')+'?details=%s' % md)
    
# Output rendering
if format == 'json':
    context.REQUEST.RESPONSE.setHeader("Content-type", "application/json")
    return json_dumps(dict([(k,v['value']) for k,v in raw_data.items() if (v.get('weight') or 0)<=int(details)]), sort_keys=True)
elif format == 'text':
    print json_dumps(dict([(k,v['value']) for k,v in raw_data.items() if (v.get('weight') or 0)<=int(details)]), indent=4, sort_keys=True)
    #for k,v in raw_data.items():
    #    print '%s: \n\t%s' % (k,v)
    return printed
else:
    return dict([(k,v['value']) for k,v in raw_data.items() if (v.get('weight') or 0)<=int(details)])