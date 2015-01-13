from Products.CMFPlomino.PlominoUtils import json_dumps
ret = []
for res in context.getParentDatabase().resources.zsqlElencoFogliCU(sezione = context.REQUEST.get('sezione','')).dictionaries():
    ret.append(res)

return json_dumps({"success":1, "results":ret})