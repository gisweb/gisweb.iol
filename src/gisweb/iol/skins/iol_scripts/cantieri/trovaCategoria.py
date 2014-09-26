from Products.CMFPlomino.PlominoUtils import json_dumps
res = context.getParentDatabase().resources.zsqlCategoriaCosap(wkt_geometry = context.REQUEST.get('geometry','')).dictionaries()
return json_dumps(res)
