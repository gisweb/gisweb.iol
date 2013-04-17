## Script (Python) "naming_manager"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=what='', frm_key='frm_', default=''
##title=copiato in gisweb.iol come naming.py, DA CANCELLARE
##
"""
what: 'tipo_pratica', 'tipo_app' o 'tipo_richiesta'
    es. tipo_pratica = trasporti_base/disabili_base/etc.
        tipo_app = trasporti/disabili/etc.
        tipo_richiesta = base/proroga/rinnovo
frm_key: 'frm_' # prefisso identificativo dei form corrispondenti ad una richiesta
default: in caso 
"""

if what=='frm_key':
    return frm_key

if context.portal_type == 'PlominoDocument':
    FRM_ID = context.getForm().getFormName()
elif context.portal_type == 'PlominoForm':
    FRM_ID = context.getFormName()
else:
    raise Exception('Oggetto di tipo %s non contemplato dallo script' % context.portal_type)

if not FRM_ID.startswith(frm_key):
    return default

keys = FRM_ID.split('_')

generators = dict(
    tipo_pratica = lambda k: '_'.join(k[1:]),
    tipo_app = lambda k: '_'.join(k[1:-1]),
    tipo_richiesta = lambda k: k[-1]
)

if not what:
    return dict([(k, gen(keys)) for k,gen in generators.items()])
else:
    gen = generators.get(what)
    if gen:
        return gen(keys)

return default
