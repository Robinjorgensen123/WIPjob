import sys
import zipfile
import xml.etree.ElementTree as ET

def docx_to_text(path):
    with zipfile.ZipFile(path) as z:
        xml = z.read('word/document.xml')
    tree = ET.fromstring(xml)
    paragraphs = []
    # Namespaces
    ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    for p in tree.findall('.//w:p', ns):
        texts = [node.text for node in p.findall('.//w:t', ns) if node.text]
        if texts:
            paragraphs.append(''.join(texts))
    return '\n\n'.join(paragraphs)

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Usage: docx_to_text.py <file.docx>')
        sys.exit(1)
    text = docx_to_text(sys.argv[1])
    print(text)
