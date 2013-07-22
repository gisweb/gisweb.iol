## Script (Python) "richiesta"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=
##title=
##

""" Restituisce tutte le tipologie di richiesta presenti nel PlominoDatabase """

tipi = list()
for f in context.getForms():
    tipo = f.naming('tipo_richiesta')
    if tipo and tipo not in tipi:
        tipi.append(tipo)

return tipi
