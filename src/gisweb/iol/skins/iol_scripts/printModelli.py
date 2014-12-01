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


db = db_name.split('_')[-1]



for obj in context.getParentDatabase().aq_parent.listFolderContents():
    if obj.getId()==folder:
        folder= obj       
    
       


try:
    for i in folder.getFolderContents():
        obj=i.getObject()
        
    
        try:
            if db in obj.getId():
                
                sub_folders = obj.getFolderContents()
                
                pathFolder = [i.getObject().absolute_url() for i in sub_folders if grp in i.getObject().getId()][0]            
                fileNames = [i.getObject().keys() for i in sub_folders if grp in i.getObject().getId()][0]   
                
                if len(fileNames)>0:
                    
                    dizFile={}
                    for fileName in fileNames:
                        diz={}
                        pathModel= '%s/%s' %(pathFolder,fileName)
                        
                        diz['model']= pathModel
                        diz['field']=field                        
                        dizFile[fileName]=diz
                        dizFile['success']=1
                      
                else:
                   
                    dizFile['model']='test'
                    dizFile['field']=field
                    
                return json_dumps(dizFile)            
        except:        
            return context.addPortalMessage('Non sono presenti sotto cartelle nella folder %s' %db)
               
    
except:
    dizFile['success']=0
    return json_dumps(dizFile)
