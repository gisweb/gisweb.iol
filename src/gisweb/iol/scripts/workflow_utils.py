# -*- coding: utf-8 -*-

from Products.CMFCore.utils import getToolByName

def _getAttributes_(obj, *args):
    """ """
    out = dict()
    for k in args:
        try:
            out[k] = getattr(obj, k)
        except AttributeError, err:
            pass

    return out

def getChainFor(doc):
    """ Returns Id list of associated workflows. """

    pw = getToolByName(doc.getParentDatabase(), 'portal_workflow')
    return pw.getChainFor(doc)

def getInfoFor(doc, arg, wf_id=None, default=None):
    """ Expose the getInfoFor method of the associated workflows. """

    pw = getToolByName(doc.getParentDatabase(), 'portal_workflow')
    wf = getToolByName(pw, wf_id or getChainFor(doc)[0])

    return wf.getInfoFor(doc, arg, default)

def getStateAttr(doc, args=None, state_id=None, wf_id=None):
    """ Return sorkflow status attributes in a dictionary """

    pw = getToolByName(doc.getParentDatabase(), 'portal_workflow')

    if args is None:
        args = ('title', )
    else:
        args = ('title', ) + tuple(args)

    wf = getToolByName(pw, wf_id or getChainFor(doc)[0])

    if state_id is None:
        state_id = wf.getInfoFor(doc, 'review_state', None)

    status = getToolByName(wf.states, state_id)

    nfo = _getAttributes_(status, *args)
    nfo['id'] = status.getId()
    if wf_id is None:
        nfo['wf_id'] = wf.getId()
    return nfo

def getTransitionsAttr(doc, args=None, state_id=None, wf_id=None, supported_only=True):
    """ """

    pw = getToolByName(doc.getParentDatabase(), 'portal_workflow')

    if args is None:
        args = ('title', )
    else:
        args = ('title', ) + tuple(args)

    wf = getToolByName(pw, wf_id or getChainFor(doc)[0])

    if state_id is None:
        state_id = wf.getInfoFor(doc, 'review_state', None)
    else:
        # supported_only=True ha senso solo per le transizioni disponibili allo stato corrente
        supported_only = False

    status = getToolByName(wf.states, state_id)

    tr_infos = getStateAttr(doc, args=('transitions', ), state_id=state_id, wf_id=wf_id)

    out = dict()
    for tr_id in tr_infos['transitions']:
        if not supported_only or (supported_only and wf.isActionSupported(doc, tr_id)):
            transition = getToolByName(wf.transitions, tr_id)
            info = _getAttributes_(transition, *args)
            info['id'] = transition.getId()
            if wf_id is None:
                info['wf_id'] = wf.getId()
            out[tr_id] = info
    return out

#def listObjectActions(doc):

    #pw = getToolByName(doc.getParentDatabase(), 'portal_workflow')
    #return pw.listObjectActions(doc)

def getWorkflowAttr(doc, args=None, wf_id=None):
    """ Returns workflow attributes in a dictionary """

    pw = getToolByName(doc.getParentDatabase(), 'portal_workflow')

    if args is None:
        args = ('title', )
    else:
        args = ('title', ) + tuple(args)

    wf = getToolByName(pw, wf_id or getChainFor(doc)[0])

    nfo = _getAttributes_(wf, *args)
    if wf_id is None:
        nfo['wf_id'] = wf.getId()

    return nfo

