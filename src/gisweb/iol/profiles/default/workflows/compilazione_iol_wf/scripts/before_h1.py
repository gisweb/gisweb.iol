## Script (Python) "before_h1"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=state_change
##title=
##
from DateTime import DateTime
doc = state_change.object

doc.setItem('data_presentazione',DateTime().strftime('%d/%m/%Y'))
