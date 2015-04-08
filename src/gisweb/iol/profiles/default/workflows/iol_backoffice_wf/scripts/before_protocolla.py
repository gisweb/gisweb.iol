## Script (Python) "before_protocolla"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=state_change
##title=
##
doc = state_change.object

if script.run_script(doc, script.id) != False:

    #### OTHER CODE HERE ####

    from Products.CMFPlomino.PlominoUtils import StringToDate

    params = dict(
        oggetto = '',
        tipo = 'E',
        data = DateTime()
    )
    resp = doc.protocollo(params=params)
    if resp:
        data = StringToDate(resp['data'], format='%Y-%m-%d')
        doc.setItem('numero_protocollo', '%s' % resp['numero'])
        doc.setItem('data_protocollo', data)

    script.run_script(doc, script.id, suffix='post')

#### SCRIPT ENDS HERE ####
