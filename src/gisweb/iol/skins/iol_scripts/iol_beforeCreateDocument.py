## Script (Python) "iol_beforeCreateDocument"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=child_events=False, msg='', redirect_to='', event_args={}
##title=IOL beforCreateDocument event common actions
##

"""
Standardizzazione dele operazioni da svolgere prima della creazione di una istanza

child_events: True/False (lancia gli script di gestione dell'uno a molti)
msg: a portal message with its class (e.g. ('My warning message', 'warning'))
redirect_to: PlominoForm or PlominoView where to redirect in case no
	parentDocument is given in REQUEST
event_args: beforecreate_child parameters
"""

from Products.CMFCore.utils import getToolByName
from gisweb.utils import urllib_urlencode

db = context.getParentDatabase()


# SE UTENTE ACCREDITATO PRECARICO I VALORI DI DEFAULT

if hasattr(db, 'accreditamento_richiesto'):
    if db.accreditamento_richiesto and hasattr(db.aq_parent, 'iol-utenti'):

        dbutenti = context.getParentDatabase().aq_parent['iol-utenti']
        defaults = dbutenti.resources.loadUserData() or {}
        if defaults:
            for k,v in defaults.items():
                context.REQUEST.set(k, v)
        elif not 'Manager' in db.getCurrentUser().getRolesInContext(context):
            plone_tools = getToolByName(context.getParentDatabase().aq_inner, 'plone_utils')
            msg = """ATTENZIONE! L'accesso al servizio \"%s\" è consentito solo ad utenti accreditati.
Per iniziare la pratica di accreditamento compilare il form sottostante.""" % db.Title()
            wrn = (unicode(msg, errors='replace'), 'warning')
            plone_tools.addPortalMessage(*wrn, request=context.REQUEST)
            
            context.REQUEST.RESPONSE.redirect(dbutenti.absolute_url())


# GESTIONE UNO A MOLTI

if child_events:
    
    def getWhereToRedirect(redirect_to, using, **kwargs):
        """
        redirect_to: the name of the object (i.e. PlominoView or PlominoForm)
			in the plominoDatabase where to redirect
        using: an attribute (i.e. template, or script or method) of the
			object to use/execute
        kwargs: arguments to pass to the url as query string
        """
    
        destination = db.getView(redirect_to) or db.getForm(redirect_to) or db
        messages = []
    
        if destination==db and redirect_to:
            messages.append(('Destination "%s" not found.' % redirect_to, 'error'))
    
        if hasattr(destination, using):
            destinationUrl = '%s/%s' % (destination.absolute_url(), using)
        else:
            destinationUrl = destination.absolute_url()
            if using:
                messages.append(('Template "%s" not found.' % using, 'error'))
    
        if kwargs:
            query_string = urllib_urlencode(kwargs)
            destinationUrl += '?%s' % query_string
    
        return destinationUrl, messages
    
    #parentKey = script.iol_events_utils('parentKey')
    
    def beforecreate_child(redirect_to='', using='', message=(), **kwargs):
        """
        Action to take before child creation.
        redirect_to: the name of the object (i.e. PlominoView or PlominoForm)
			in the plominoDatabase where to redirect
        using: an attribute (i.e. template, or script or method) of the
			object to use/execute
        message: a 2-tuple object containing the message and his class
			type (e.g. ("Indicazioni per l'utente", 'info'))
        kwargs: arguments to pass to the url as query string.
        """
        
        if not 'parentKey' in kwargs:
            parentKey = script.iol_eventUtils('parentKey')
        else:
            parentKey = kwargs.pop('parentKey')
        
        if not db.getDocument(context.REQUEST.get(parentKey)):
            # concept is: for a child creation a parent is necessary.
            #+ In case a parent document is not given it returns an URL where to redirect
            #+ e.g. e view where to chose a parent document.

            destinationUrl, messages = getWhereToRedirect(redirect_to, using, **kwargs)
            
            roles = context.portal_membership.getAuthenticatedMember().getRolesInContext(context)
            
            if context.REQUEST.get(parentKey):
                messages.append(('Given id seams not to correspond to a valid plominoDocument.', 'error'))
            else:
                
                if isinstance(message, basestring):
                    message = (message, )
                
                messages.append(message or ('No plominoDocument id given.', 'warning'))

            plone_tools = getToolByName(db.aq_inner, 'plone_utils')
            for msg in messages:
                plone_tools.addPortalMessage(*msg, request=context.REQUEST)

            if not 'Manager' in roles or context.REQUEST.get('test'):
                context.REQUEST.RESPONSE.redirect(destinationUrl)

    msg = msg or 'Scegli uno tra i documenti elencati qui sotto.'

    beforecreate_child(
        redirect_to = redirect_to,
        using = '',
        message = msg,
        destinationForm = context.getFormName(),
        **event_args
    )
