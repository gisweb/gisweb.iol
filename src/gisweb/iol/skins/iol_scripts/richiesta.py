## Script (Python) "richiesta"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=
##title=
##
forms=context.getForms()
apps=context.getItem('tipo_app')
richiesta=[]
for i in forms:
     frmname=i.getFormName()
     if frmname.startswith('frm_'):
            if apps in frmname:              
                lista= frmname.split('_')
                a=lista[2]
                richiesta.append(a)
return richiesta
