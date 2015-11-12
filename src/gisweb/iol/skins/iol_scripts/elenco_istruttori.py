## Script (Python) "elenco_istruttori"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=
##title=Get instructor user list
##


def elenco_istruttori(doc):
    """
    Restituisce l'elenco degli istruttori che possono essere assegnati alla pratica.
    Ovvero gli utenti appartenenti al gruppo Plone 'istruttori-<tipo_app>'
    """

    tipo_app = context.naming('tipo_app')

    # se tipo_app è stringa vuota elenco tutti gli istruttori
    group_name = 'istruttori-%s' % tipo_app
    groups_l = [i for i in doc.getParentDatabase().getPortalGroups() if i.getId().startswith(group_name)]

    # per ogni gruppo è la lista dei propri membri
    members_l = [g.getGroupMembers() for g in groups_l]
    members = sum(members_l[0:], members_l[:0])

    return [member.id for member in members]

return elenco_istruttori(context)

