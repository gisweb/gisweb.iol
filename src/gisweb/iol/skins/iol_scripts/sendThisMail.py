## Script (Python) "sendThisMail"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=ObjectId, sender='', debug=0
##title=Mail message to be sent during workflow transitions
##
"""
Gestione centralizzata di invio mail

N.B.:
    1. Se necessario creare lo script mail_args nella cartella resources del
PlominoDatabase per customizzare le mail. Lo script deve prendere in
ingresso, nell'ordine, il PlominoDocument in contesto e l'id del messaggio.
Lo script deve restituire un dizionario, sulla falsa riga di custom_args
qui sotto, degli argomenti dello script sendMail.
    2. ObjectId: nota bene: se possibile usare l'id della transizione
"""

from gisweb.utils import sendMail
from Products.CMFCore.utils import getToolByName

msg_info = dict(
        numero_pratica = context.getItem('numero_pratica'),
        titolo = context.Title(),
        now = DateTime().strftime('%d/%m/%Y')
    )

args = dict(
    context = context,
    To = context.getItem('fisica_email'),
    From = sender,
    as_script = debug
)

custom_args = dict()
db = context.getParentDatabase()

if not args['To']:
    plone_tools = getToolByName(context.getParentDatabase().aq_inner, 'plone_utils')
    msg = 'ATTENZIONE! Non è stato possibile inviare la mail perchè non esiste nessun destinatario'
    plone_tools.addPortalMessage(msg, request=context.REQUEST)

if 'mail_args' in db.resources.keys():
    custom_args = db.resources.mail_args(context, ObjectId)

if not custom_args:

    attach_list = context.getFilenames()

    if ObjectId=="assegna":

        msg_info.update(dict(
            attach = 'domanda_inviata.pdf',
        ))

        custom_args = dict(
            Object = 'Avvio del Procedimento pratica. n. %(numero_pratica)s - %(titolo)s' % msg_info,
            msg = context.mime_file(
                file = '' if not msg_info.get('attach') in attach_list else context[msg_info['attach']],
                text = '''
Si comunica che in data %(now)s è stato avviato il procedimento n. %(numero_pratica)s.
''' % msg_info,
                nomefile = msg_info['attach']
            ),
        )

    elif ObjectId == "integra":

        msg_info.update(dict(
            attach = 'integrazione.pdf',
        ))

        custom_args = dict(
            Object = 'Integrazione pratica. n. %(numero_pratica)s - %(titolo)s' % msg_info,
            msg = context.mime_file(
                file = '' if not msg_info.get('attach') in attach_list else context[msg_info['attach']],
                text = """
Si comunica che in data %(now)s il procedimento n. %(numero_pratica)s è stato integrato.
""" % msg_info,
                nomefile = msg_info['attach']
            )
        )

    elif ObjectId == 'autorizza':
                
        msg_info.update(dict(
            attach = context.getItem('documenti_autorizzazione', {'': ''}).keys()[0],
        ))
        
        custom_args = dict(
            Object = 'Autorizzazione pratica. n. %(numero_pratica)s - %(titolo)s' % msg_info,
            msg = context.mime_file(
                file = '' if not msg_info.get('attach') in attach_list else context[msg_info['attach']],
                text = """Si comunica che in data %(now)s il procedimento n. %(numero_pratica)s è stato autorizzato.""" % msg_info,
                nomefile = msg_info['attach'],
            )
        )

    elif ObjectId == 'rigetta':

        custom_args = dict(
            Object = 'Diniego pratica. n. %(numero_pratica)s - %(titolo)s' % msg_info,
            msg = context.mime_file(
                file = '' if not msg_info.get('attach') in attach_list else context[msg_info['attach']],
                text = """
Si comunica che in data %(now)s il procedimento n. %(numero_pratica)s è stato rigettato
""" % msg_info,
                nomefile = ''
            )
        )

    elif ObjectId == 'preavviso_rigetto':

        msg_info.update(dict(
            motivazione = context.getItem('motivazione_rigetto',''),
        ))

        custom_args = dict(
            Object = 'Preavviso Rigetto pratica. n. %(numero_pratica)s - %(titolo)s' % msg_info,
            msg = context.mime_file(
                file = '' if not msg_info.get('attach') in attach_list else context[msg_info['attach']],
                text = """
Si comunica che in data %(now)s il procedimento n. %(numero_pratica)s è
in preavviso di rigetto con le seguenti motivazioni:

%(motivazione)s

""" % msg_info,
                nomefile = ''
            )
        )

    elif ObjectId == 'sospendi':

        msg_info.update(dict(
            motivazione = context.getItem('istruttoria_motivo_sospensione',''),
        ))

        custom_args = dict(
            Object = 'Sospensione pratica. n. %(numero_pratica)s - %(titolo)s' % msg_info,
            msg = context.mime_file(
                file = '' if not msg_info.get('attach') in attach_list else context[msg_info['attach']],
                text = """
Si comunica che in data %(now)s il procedimento n. %(numero_pratica)s è
stato sospeso con le seguenti motivazioni:

%(motivazione)s

""" % msg_info,
                nomefile = ''
            )
        )

    elif ObjectId == 'pagamenti':

        msg_info.update(dict(
            motivazione = context.getItem('allegato_pagamento',''),
        ))

        custom_args = dict(
            Object = 'Richiesta pagamento oneri pratica. n. %(numero_pratica)s - %(titolo)s' % msg_info,
            msg = context.mime_file(
                file = '',
                text = """
Si comunica che in data %(now)s è stato richiesto il pagamento degli oneri per la pratica  n. %(numero_pratica)s :


%(motivazione)s

""" % msg_info,
                nomefile = ''
            )
        )
        
    elif ObjectId == 'rifiuta_pagamento':
        msg_info.update(dict(
            motivazione = context.getItem('istruttoria_motivo_rifiuto',''),
        ))

        

        custom_args = dict(
            Object = 'Rifiutati pagamento oneri pratica. n. %(numero_pratica)s - %(titolo)s' % msg_info,
            msg = context.mime_file(
                 file = '',
                text = """
Si comunica che in data %(now)s è stato rifiutato il pagamento per la pratica  n. %(numero_pratica)s :


%(motivazione)s

""" % msg_info,
                nomefile = ''
            )
        )
        
    elif ObjectId == 'richiesta_pagamenti':

        msg_info.update(dict(
            motivazione = context.getItem('',''),
        ))

        custom_args = dict(
            Object = 'Richiesta pagamento oneri pratica. n. %(numero_pratica)s - %(titolo)s' % msg_info,
            msg = context.mime_file(
                 file = '',
                text = """
Si comunica che in data %(now)s è stata effettuata la richiesta di pagamento per la pratica  n. %(numero_pratica)s :


%(motivazione)s

""" % msg_info,
                nomefile = ''
            )
        )
        
    elif ObjectId == 'approva_pagamenti':

        msg_info.update(dict(
            motivazione = context.getItem('allegato_pagamento',''),
        ))

        custom_args = dict(
            Object = 'Approvato il pagamento pratica. n. %(numero_pratica)s - %(titolo)s' % msg_info,
            msg = context.mime_file(
                file = '',
                text = """
Si comunica che in data %(now)s è stato approvato il pagamento per la pratica  n. %(numero_pratica)s :


%(motivazione)s

""" % msg_info,
                nomefile = ''
            )
        )        
   


if custom_args:
    args.update(custom_args)
    return sendMail(**args)
