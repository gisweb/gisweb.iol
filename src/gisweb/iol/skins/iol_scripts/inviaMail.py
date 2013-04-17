## Script (Python) "inviaMail"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=tipo=''
##title=
##

from Products.CMFCore.utils import getToolByName
from Products.CMFPlomino.PlominoUtils import Now,DateToString
from gisweb.utils import Type
if context.portal_type !='PlominoDocument':
    return

mail_host = getToolByName(context,'MailHost')
if tipo=='integrazione':
    a_file=context['integrazione.pdf']
    message="Si comunica che in data %s il procedimento n. %s è stato integrato" %(DateToString(Now(),'%d/%m/%Y'),context.getItem('numero_pratica',''))
    mess=context.mime_file(file=a_file,text=message,nomefile='domanda_inviata.pdf')
    mSubj='Integrazione pratica. n. %s - Trasporti Eccezionali' %context.getItem('numero_pratica','')
elif tipo == 'autorizzazione':
    mess="Si comunica che in data %s il procedimento n. %s è stato autorizzato" %(DateToString(Now(),'%d/%m/%Y'),context.getItem('numero_pratica',''))
    mSubj='Autorizzazione pratica. n. %s - Trasporti Eccezionali' %context.getItem('numero_pratica','')
elif tipo == 'rigetto':
    mess="Si comunica che in data %s il procedimento n. %s è stato rigettato" %(DateToString(Now(),'%d/%m/%Y'),context.getItem('numero_pratica',''))
    mSubj='Diniego pratica. n. %s - Trasporti Eccezionali' %context.getItem('numero_pratica','')
elif tipo=='preavviso_rigetto':
    mess="Si comunica che in data %s il procedimento n. %s è in preavviso di rigetto con le seguenti motivazioni:\n%s" %(DateToString(Now(),'%d/%m/%Y'),context.getItem('numero_pratica',''),context.getItem('motivazione_rigetto',''))
    mSubj='Preavviso Rigetto pratica. n. %s - Trasporti Eccezionali' %context.getItem('numero_pratica','')
elif tipo=='sospensione':
    mess="Si comunica che in data %s il procedimento n. %s è stato sospeso con le seguenti motivazioni:\n%s" %(DateToString(Now(),'%d/%m/%Y'),context.getItem('numero_pratica',''),context.getItem('motivazione_sospensione',''))
    mSubj='Sospensione pratica. n. %s - Trasporti Eccezionali' %context.getItem('numero_pratica','')
else:
    a_file=context['domanda_inviata.pdf']
    message="Si comunica che in data %s è stato avviato il procedimento n. %s" %(DateToString(Now(),'%d/%m/%Y'),context.getItem('numero_pratica',''))
    mess=context.mime_file(file=a_file,text=message,nomefile='domanda_inviata.pdf')
    mSubj='Avvio del Procedimento pratica. n. %s - Trasporti Eccezionali' %context.getItem('numero_pratica','')


mTo=context.getItem('fisica_email')
mFrom='info@spezianet.it'

messages = []
try:
    mail_host.send(mess, mTo, mFrom, mSubj)
except Exception as err:
    err = (u'%s: %s' % (Type(err), err), 'error')
    wrn = (u'ATTENZIONE! Non è stato possibile inviare la mail con oggetto: %s' % mSubj, 'warning')
    messages.append(err)
    messages.append(wrn)
else:
    msg = (u'La mail con oggetto "%s" è stata inviata correttamente' % mSubj, 'info')
    messages.append(msg)

plone_tools = getToolByName(context.getParentDatabase().aq_inner, 'plone_utils')
for msg in messages:
    plone_tools.addPortalMessage(*msg, request=context.REQUEST)
