from Products.CMFPlomino.PlominoUtils import json_dumps

ret = []
for res in context.getParentDatabase().resources.zsqlCategoriaCosap(geom = context.REQUEST.get('geom','')).dictionaries():
    ret.append('%s' %(res['categoria']))
    
    

return json_dumps({"success":1, "results":ret})
