## Script (Python) "test_modec"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=default=False
##title=Is app in test mode?
##

"""
Returns True or False

Ti dice se la applicazione di cui fa parte il documento o il form è in test.
La funzione interroga la proprietà del plominodb <tipo_app>_is_in_test.
Se la variabile non è settata restituisce il valore di default.
"""

attr_list = ['app_in_test']

try:
    tipo_app = context.naming('tipo_app')
except Exception as err:
   tipo_app = ''

if tipo_app:
    attr_list.append('%s_is_in_test' % tipo_app)

db = context.getParentDatabase()

for attr_name in attr_list:
    try:
        test = getattr(db, attr_name)
    except AttributeError, err:
        pass
    else:
        default = test

if json:
    from Products.CMFPlomino.PlominoUtils import json_dumps
    return json_dumps(default)
else:
    return default
