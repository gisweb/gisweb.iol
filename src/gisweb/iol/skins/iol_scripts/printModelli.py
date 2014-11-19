## Script (Python) "printModelli"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=db_name='',grp='autorizzazione',field='documenti_autorizzazione', folder='modelli'
##title=sstampa modelli di stampa prelevati da una folder del portale Plone
##

from Products.CMFPlomino.PlominoUtils import  json_dumps

  
for obj in context.listFolderContents():
    if obj.getId()==folder:
        folder= obj       
    
       

db = db_name.split('_')[-1]
diz={}
try:
    for i in folder.getFolderContents():
        obj=i.getObject()
        
    
        try:
            if db in obj.getId():
                
                sub_folders = obj.getFolderContents()
                
                pathFolder = [i.getObject().absolute_url() for i in sub_folders if grp in i.getObject().getId()][0]            
                fileName = [i.getObject().keys() for i in sub_folders if grp in i.getObject().getId()][0]   
                
                if len(fileName)>0:
                    fileName =fileName[0]
                    pathModel= '%s/%s' %(pathFolder,fileName)
                    diz['model']= pathModel
                    diz['field']=field
                    diz['success']=1
                else:
                    diz['model']='test'
                    diz['field']=field
                    
                return json_dumps(diz)            
        except:        
            return context.addPortalMessage('Non sono presenti sotto cartelle nella folder %s' %db)
               
    
except:
    diz['success']=0
    return json_dumps(diz)
