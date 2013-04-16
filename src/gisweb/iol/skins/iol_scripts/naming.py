## Script (Python) "naming"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=what='', frm_key='frm_', default='', calculate=False
##title=Centralized naming policy management
##

"""
Centralized naming policy management

what: the argument of your request i.e. 'tipo_pratica', 'tipo_app' o 'tipo_richiesta'
    e.g.:
		tipo_pratica = trasporti_base/disabili_base/etc.
		tipo_app = trasporti/disabili/etc.
		tipo_richiesta = base/proroga/rinnovo
"""

if what=='frm_key':
    return frm_key

generators = dict(
	# tutto ciò che segue il prefisso unito da "_"
    tipo_pratica = lambda k: '_'.join(k[1:]),
    # tutto quello che sta nel mezzo unito da "_"
    tipo_app = lambda k: '_'.join(k[1:-1]),
    # solo il suffisso
    tipo_richiesta = lambda k: k[-1]
)

if context.portal_type == 'PlominoDocument':
	
	if not calculate:
		if what:
			return context.getItem(what)
		else:
			return dict([(k, context.getItem(k)) for k in generators.keys()])
	else:
		FRM_ID = context.getForm().getFormName()

elif context.portal_type == 'PlominoForm':
    FRM_ID = context.getFormName()
else:
    raise Exception('Oggetto di tipo %s non contemplato dallo script' % context.portal_type)

if not FRM_ID.startswith(frm_key):
    return default

keys = FRM_ID.split('_')

if not what:
    return dict([(k, gen(keys)) for k,gen in generators.items()])
else:
    gen = generators.get(what)
    if gen:
        return gen(keys)

return default
