## Script (Python) "sospendiDelega"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=tipo=''
##title=
##

# spedire la mail di sospensione al delegato

if tipo == 'sospendi':
    context.setItem('stato','sospensione')
    from gisweb.utils import urllib_urlencode
    query={'openwithform':'base_com_sospensione_delega'}
    params=urllib_urlencode(query)
    
    frmUrl='%s/EditDocument' %(context.absolute_url())
    context.redirectTo(frmUrl,query)
    
if tipo == 'rigetta':
    context.setItem('stato','rigettata')
    from gisweb.utils import urllib_urlencode
    query={'openwithform':'base_com_preavviso_rigetto_delega'}
    params=urllib_urlencode(query)
    
    frmUrl='%s/EditDocument' %(context.absolute_url())
    context.redirectTo(frmUrl,query)


