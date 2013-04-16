## Script (Python) "event_beforeCreateChild"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=redirect_to='', using='', message=(), kwargs={}
##title=
##

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
		parentKey = script.event_common('parentKey')
	else:
		# easter egg
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


return beforecreate_child(redirect_to=redirect_to, using=using, message=message, **kwargs)
