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

what: the argument of your request i.e. 'iol_tipo_pratica', 'iol_tipo_app' o 'iol_tipo_richiesta'
    e.g.:
        iol_tipo_pratica = trasporti_base/disabili_base/etc.
        iol_tipo_app = trasporti/disabili/etc.
        iol_tipo_richiesta = base/proroga/rinnovo
"""

if what=='frm_key':
    return frm_key

def main(what='', frm_key='frm_', default='', calculate=False):
    """
    frmname2what
    """

    def get_iol_tipo_richiesta(k):
        # così iol_tipo_richiesta "base" non è necessario se c'è solo quello
        if len(k)>2:
            return k[-1]
        else:
            return ''

    generators = dict(
        # tutto ciò che segue il prefisso unito da "_"
        iol_tipo_pratica = lambda k: '_'.join(k[1:]),
        # tutto quello che sta nel mezzo unito da "_"
        iol_tipo_app = lambda k: '_'.join(k[1:-1]),
        # solo il suffisso (se c'è!)
        iol_tipo_richiesta = get_iol_tipo_richiesta
    )

    if context.portal_type == 'PlominoDocument':

        if calculate or context.isNewDocument():
            FRM_ID = context.getForm().getFormName()
        else:
            if what:
                return context.getItem(what) or context.naming(what=what, frm_key=frm_key, default=default, calculate=True)
            else:
                out = dict([(k, context.getItem(k)) for k in generators.keys()])
                if all(out.values()):
                    return out
                else:
                    return context.naming(what=what, frm_key=frm_key, default=default, calculate=True)

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

def inverse(what, value, frm_key='frm_'):
    """
    TODO what2frmname
    """
    return form_name

return main(what=what, frm_key=frm_key, default=default, calculate=calculate)