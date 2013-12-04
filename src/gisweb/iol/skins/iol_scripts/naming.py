## Script (Python) "naming"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=what='', frm_key='frm_', default='', calculate=False, rebuild=False
##title=Centralized naming policy management
##
"""
Centralized naming policy management

Use this script:
 1. for calculating values in computed type fields formula
 2. instead of getItem method for script independent from field names

what: the argument of your request i.e. 'pratica', 'applicazione', 'richiesta' o 'frm_key'
    e.g.:
        iol_tipo_pratica = trasporti_base/disabili_base/etc.
        iol_tipo_app = trasporti/disabili/etc.
        iol_tipo_richiesta = base/proroga/rinnovo

For updating values on PlominoDocuments run this script from the PlominoDatabase
setting "rebuild" parameter to True

TEST SCRIPT EXAMPLE:



"""

def get_iol_tipo_richiesta(k):
        # così iol_tipo_richiesta "base" non è necessario se c'è solo quello
        if len(k)>2:
            return k[-1]
        else:
            return ''

prefisso = 'iol_tipo'
alias = dict(
    pratica = dict(
        itemname = '%s_pratica' % prefisso,
        generator = lambda k: '_'.join(k[1:]),
    ),
    richiesta = dict(
        itemname = '%s_richiesta' % prefisso,
        generator = get_iol_tipo_richiesta,
    ),
    applicazione = dict(
        itemname = '%s_app' % prefisso,
        generator = lambda k: '_'.join(k[1:-1]),
    )
)

# for backward compatibility
alias['tipo_pratica'] = alias['pratica']
alias['tipo_richiesta'] = alias['richiesta']
alias['tipo_app'] = alias['applicazione']
alias['iol_tipo_pratica'] = alias['pratica']
alias['iol_tipo_richiesta'] = alias['richiesta']
alias['iol_tipo_app'] = alias['applicazione']

if what=='frm_key':
    return frm_key

def main(plominoObject, what='', frm_key='frm_', default='', calculate=False):
    """
    frmname2what
    """

    if plominoObject.portal_type == 'PlominoDocument':

        def get_value(what, rebuild=False):
            value = plominoObject.naming(what=what, frm_key=frm_key, default=default, calculate=True)
            if rebuild:
                plominoObject.setItem(alias[what]['itemname'], value)
            else:
                items = plominoObject.getItems()
                fields = [i.getId() for i in plominoObject.getForm().getFormFields(includesubforms=True)]
                itemname = alias[what]['itemname']
                assert itemname in (fields+items), 'Attenzione! "%s" non è un campo valido definito per l\'oggetto %s' % (itemname, plominoObject.getId())
            return value

        if calculate or plominoObject.isNewDocument():
            # ok I got PlominoDocument but I explicitly asked for a recalculation
            FRM_ID = plominoObject.getForm().getFormName()
        else:
            if what:
                return plominoObject.getItem(alias[what]['itemname']) or get_value(what, rebuild=rebuild)
            else:
                out = dict([(alias[k]['itemname'], get_value(k, rebuild=rebuild)) for k in alias.keys()])
                if all(out.values()):
                    return out
                else:
                    return dict([(alias[k]['itemname'],get_value(k, rebuild=rebuild)) for k in alias.keys()])

    elif plominoObject.portal_type == 'PlominoForm':
        FRM_ID = plominoObject.getFormName()
    else:
        raise Exception('Oggetto di tipo %s non contemplato dallo script' % plominoObject.portal_type)

    if not FRM_ID.startswith(frm_key):
        return default

    keys = FRM_ID.split('_')
    if not what:
        return dict([(alias[k]['itemname'], v['generator'](keys)) for k,v in alias.items()])
    else:
        return alias[what]['generator'](keys)

    return default

def inverse(what, value, frm_key='frm_'):
    """
    TODO what2frmname
    """
    return form_name

if context.portal_type in ('PlominoDocument', 'PlominoForm', ):
    return main(context, what=what, frm_key=frm_key, default=default, calculate=calculate)
elif rebuild:
    # Use this part for update items and values of existing documents
    for n, doc in enumerate(context.getParentDatabase().getAllDocuments()):
        doc.naming(rebuild=rebuild)
    print "OK! %s plominoDocuments updated" % n
    return printed
else:
    # this part is JUST for TEST!
    # Run this script with PlominoDatabase as context with default parameter values (i.e. rebuild=False)
    from gisweb.utils import rndselection, boolgenerate

    db = context.getParentDatabase()

    def getPlominoObj():
        if boolgenerate():
            return rndselection(db.getAllDocuments())
        else:
            return rndselection(filter(lambda f: f.getFormName().startswith('frm_'), db.getForms()))

    obj = getPlominoObj()
    what = rndselection(alias.keys() + [''])

    print "=== Input parameters ==="
    print "* form: %s \t type: %s \t id: %s" % (obj.getForm().getFormName(), obj.portal_type, obj.getId(), )
    print "* what: %s" % what
    print "=== Result ==="
    try:
        print "SUCCESS: %s" % obj.naming(what)
    except Exception as err:
        # raise 
        print 'ERROR: %s' % err
    return printed