## Script (Python) "sendThisMail"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=ObjectId, sender=''
##title=Low level sending email management
##
"""
Gestione centralizzata di invio mail

N.B.:
    1. Se necessario creare lo script mail_args nella cartella resources del
PlominoDatabase per customizzare le mail. Lo script deve prendere in
ingresso, nell'ordine, il PlominoDocument in contesto e l'id del messaggio.
Lo script deve restituire un dizionario, sulla falsa riga di custom_args
qui sotto, degli argomenti dello script sendMail.
    2. ObjectId: se possibile usare l'id detta transizione
"""

from gisweb.utils import sendMail

msg_info = dict(
        numero_pratica = context.getItem('numero_pratica'),
        titolo = context.Title(),
        now = DateTime().strftime('%d/%m/%Y')
    )

args = dict(
    To = context.getItem('fisica_email'),
    From = sender
)

custom_args = dict()
db = context.getParentDatabase()

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

        custom_args = dict(
            Object = 'Autorizzazione pratica. n. %(numero_pratica)s - %(titolo)s' % msg_info,
            Text = """Si comunica che in data %(now)s il procedimento n. %(numero_pratica)s è stato autorizzato.
""" % msg_info
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
            motivazione = context.getItem('motivazione_sospensione',''),
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


if custom_args:
    args.update(custom_args)
    sendMail(context, **args)
