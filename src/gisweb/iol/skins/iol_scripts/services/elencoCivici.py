from Products.CMFPlomino.PlominoUtils import json_dumps
ret = []
for res in context.getParentDatabase().resources.zsqlElencoCivici(idvia = context.REQUEST.get('idvia','')).dictionaries():
    ret.append(res)

return json_dumps({"success":1, "results":ret})