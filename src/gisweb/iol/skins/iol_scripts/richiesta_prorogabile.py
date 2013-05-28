## Script (Python) "richiesta_prorogabile"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=
##title=
##

"""
verifico prima l'esistenza di uno script in resources in mancanza di altro
applico criteri generici per i quali:
 1. La pratica genitore deve essere stata approvata
 2. La pratica genitore deve essere in corso di validità
 3. Il numero di proroga del documento corrente non deve superare il numero massimo

"""
