from Products.CMFPlomino.PlominoUtils import json_dumps

result = dict(success=0, cosap=0, allerta2=0)

res = context.getParentDatabase().resources.zsqlCategoriaCosap(geom = context.REQUEST.get('geom','')).dictionaries()

if len(res) == 1:
    result['success'] = 1
    result["cosap"] = res[0]['categoria']

res = context.getParentDatabase().resources.zsqlAllerta2(geom = context.REQUEST.get('geom','')).dictionaries()
if len(res) == 1:
    result['success'] = 1
    result["allerta2"] = res[0]['id']

return json_dumps(result)
