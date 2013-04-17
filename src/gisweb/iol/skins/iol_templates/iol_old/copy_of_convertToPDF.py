## Script (Python) "copy_of_convertToPDF"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=
##title=
##
from gisweb.utils import requests_post

if context.portal_type != 'PlominoDocument':
    return ''

doc = context
url= 'http://127.0.0.1:1301/jaxrs/convert'

files = doc.getItem('documenti_autorizzazione', {})
filename = files.keys()[-1]
file_content = doc.getfile(filename, asFile=False)

#context.REQUEST.RESPONSE.setHeader("Content-type", "application/vnd.ms-word.document")
#return file_content

query = {
    'download': False,
    'outputFormat': 'PDF',
    'via': 'DOCX4J',
}
files = {'document': ('file.docx', file_content, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')}
# La prossima riga è di difficile comprensione
# sarebbe opportuno cambiare la funzione requests_post in gisweb.utils

result = requests_post(url, query, 'content', files=files,)

#return str(result) # debug: erase me
context.REQUEST.RESPONSE.setHeader("Content-type", "application/pdf")
return result['content'] or 'vuoto'
