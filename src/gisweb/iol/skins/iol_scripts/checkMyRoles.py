## Script (Python) "checkMyRoles"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=listRoles={},wf_var=''
##title=
##


wf_variable = 'gwKey' if wf_var=='gwKey' else context.wf_getInfoFor(wf_var)


    
checkRoles = listRoles[wf_variable] if wf_variable in listRoles.keys() else [] 

roles = context.portal_membership.getAuthenticatedMember().getRolesInContext(context)

for role in checkRoles:
    if role in roles:
        return True
return False
