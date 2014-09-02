from Products.CMFPlomino.PlominoUtils import json_dumps
res = context.getParentDatabase().resources.zsqlTrovaCategoria(wkt_geometry = context.REQUEST.get('geom','')).dictionaries()
return json_dumps(res)
