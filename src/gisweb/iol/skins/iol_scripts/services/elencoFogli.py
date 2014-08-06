from Products.CMFPlomino.PlominoUtils import json_dumps
ret = []
for res in context.getParentDatabase().resources.zsqlElencoFogli(sezione = context.REQUEST.get('sezione','')).dictionaries():
    ret.append(res)

return json_dumps({"success":1, "results":ret})