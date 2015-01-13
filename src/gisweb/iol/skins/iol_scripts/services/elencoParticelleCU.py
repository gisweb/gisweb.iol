from Products.CMFPlomino.PlominoUtils import json_dumps
ret = []
for res in context.getParentDatabase().resources.zsqlElencoParticelleCU(sezione = context.REQUEST.get('sezione',''), foglio = context.REQUEST.get('foglio','')).dictionaries():
    ret.append(res)

return json_dumps({"success":1, "results":ret})