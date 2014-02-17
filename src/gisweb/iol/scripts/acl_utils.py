# -*- coding: utf-8 -*- 

def addIOLRoles(doc):
    """
    In order not to directly expose the dangerouse method manafe_addLocalRoles
    """

    db = doc.getParentDatabase()

    # RUOLI
    # Ad ogni utente/gruppo del portale che ha il ruolo Plomino "[iol-qualcosa]"
    #+ viene assegnato il ruolo Plone locale "iol-qualcosa".
    rolesToAdd = dict()
    for role in db.getUserRoles():
        if role.startswith('[iol-'):
            for uid in db.getUsersForRole(role):
                if uid in rolesToAdd:
                    rolesToAdd[uid].append(role[1:-1])
                else:
                    rolesToAdd[uid] = [role[1:-1]]

    for uid,roles in rolesToAdd.items():
        doc.addLocalRoles(uid, roles)

    return doc.get_local_roles()