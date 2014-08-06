result=['|']
       
for res in context.getParentDatabase().resources.zsqlElencoVie().dictionaries():
    result.append('%s|%s' %(res['nome'],res['id']))
     
return result
