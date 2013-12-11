## Script (Python) "before_istruttoria_completata"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=state_change
##title=
##

from Products.CMFPlomino.PlominoUtils import StringToDate

doc = state_change.object

if script.run_script(doc, script.id) != False:

    #### OTHER CODE HERE ####

    # 1. Recupero tipologia domanda e applicazione
    iol_tipo_richiesta = doc.naming('richiesta','')
    iol_tipo_app = doc.naming('applicazione','')

    # 2. Setto il progressivo del numero di autorizzazione
    if not doc.getItem('numero_autorizzazione'):
        prog = doc.getMaxOf('numero_autorizzazione', query={'iol_tipo_app': iol_tipo_app}) + 1
        doc.setItem('numero_autorizzazione', prog)

    doc.setItem('data_autorizzazione', DateTime())

    # 3.
    if not doc.getItem('numero_protocollo_autorizzazione'):
        #Protocollazione Autorizzazione
        params = dict(
            oggetto = 'Autorizazione pratica prot. %s' %doc.getItem('numero_protocollo',''),
            tipo = 'U',
            data = DateTime()
        )

        resp = doc.protocollo(params=params)

        if resp:
            data = StringToDate(resp['data'], format='%Y-%m-%d')
            doc.setItem('numero_protocollo_autorizzazione', '%s' % resp['numero'])
            doc.setItem('data_protocollo_autorizzazione', data)

    # 4.
    if doc.REQUEST.get('model') and doc.REQUEST.get('field'):
        model = doc.REQUEST.get('model') or ''
        field = doc.REQUEST.get('field') or ''
        grp = doc.REQUEST.get('grp') or ''

        doc.createDoc(model=model, field=field, grp=grp)

    script.run_script(doc, script.id, suffix='post')

#### SCRIPT ENDS HERE ####
