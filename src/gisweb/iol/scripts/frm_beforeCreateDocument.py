# coding: utf-8
"""
Standardizzazione dele operazioni da svolgere prima della creazione di una istanza

child_events: True/False (lancia gli script di gestione dell'uno a molti)
msg: a portal message with its class (e.g. ('My warning message', 'warning'))
redirect_to: PlominoForm or PlominoView where to redirect in case no
    parentDocument is given in REQUEST
"""

from Products.CMFCore.utils import getToolByName
from gisweb.utils import urllib_urlencode

def frm_beforeCreateDocument(context, child_events=False, msg='', redirect_to=''):
    db = context.getParentDatabase()

    roleTestResult = not filter(
        lambda r: r in ('Manager', 'iol-manager', 'iol-reviewer', ),
        db.getCurrentUser().getRolesInContext(context)
    )

    # SE UTENTE ACCREDITATO PRECARICO I VALORI DI DEFAULT

    if hasattr(db, 'accreditamento_richiesto'):
        if db.accreditamento_richiesto and hasattr(db.aq_parent, 'iol-utenti'):

            dbutenti = context.getParentDatabase().aq_parent['iol-utenti']
            defaults = dbutenti.resources.loadUserData() or {}
            if defaults:
                for k,v in defaults.items():
                    context.REQUEST.set(k, v)
            elif roleTestResult:
                plone_tools = getToolByName(context.getParentDatabase().aq_inner, 'plone_utils')
                msg = """ATTENZIONE! L'accesso al servizio \"%s\" è consentito solo ad utenti accreditati.
    Per iniziare la pratica di accreditamento compilare il form sottostante.""" % db.Title()
                wrn = (unicode(msg, errors='replace'), 'warning')
                plone_tools.addPortalMessage(*wrn, request=context.REQUEST)

                context.REQUEST.RESPONSE.redirect(dbutenti.absolute_url())


    # GESTIONE UNO A MOLTI

    if child_events:

        msg = msg or 'Scegli uno tra i documenti elencati qui sotto.'

        context.event_beforeCreateChild(
            redirect_to = redirect_to,
            using = '',
            custom_message = msg,
            query_args = dict(
                destinationForm = context.getFormName()
            )
        )


    # SCRIPT DEDICATO AL TIPO DI APPLICAZIONE

    tipo_app = context.naming('tipo_app')
    vs = db.resources.get(tipo_app, {}).get('beforeCreateDocument')
    if vs:
        return vs(context) or ''

