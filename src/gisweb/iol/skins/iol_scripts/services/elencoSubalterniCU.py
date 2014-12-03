from Products.CMFPlomino.PlominoUtils import json_dumps

ret = []
for res in context.getParentDatabase().resources.cu_subalterno(mpl=mp).dictionaries():
	if res['subalterno'] != None:
    	ret.append(res)
    
return json_dumps(ret)
