## Script (Python) "isConditionVerified"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=condition='',app=''
##title=Script che verifica se alcune condizioni sul PlominoDocument sono verificate
##
#                                                                                              #
#    Script che a seconda del contesto verifica se sono verificate condizioni                  #
#    rinnovabilità, integrabilità, prorogabilità, etc.... dell'istanza o dell'applicazione     #
#    Se esiste il corrspondente script nella cartella resources del Db lo invoca altrimenti    #
#    restituisce il valore di default True.                                                    #
#    Se applicato ad oggetti non PlominoDocument o Plomino Datatbase restituisce False         #
#                                                                                              # 
################################################################################################

if context.portal_type=='PlominoDocument':
    doc=context
    fld = doc.getParentDatabase().resources
    if script.id in fld.keys():
        return fld[script.id](context,cond=condition)
    else:
        return True
elif context.portal_type=='PlominoDatabase':
    fld = context.resources
    if script.id in fld.keys():
        return fld[script.id](context,cond=condition,application=app)
    else:
        return True
else:
    return False
