from Products.CMFPlomino.PlominoUtils import json_dumps

ret = ['|']
for res in context.getParentDatabase().resources.foglio_cu().dictionaries():
    ret.append('%s|%d' %(res['foglio'],int(res['foglio'])))

return json_dumps(ret)
