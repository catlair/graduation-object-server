import * as os from 'os';
import * as fs from 'fs';

export default async function word2pdf(wordPath: string, pdfPath: string) {
  if (os.platform() === 'win32') {
    return win32Word2pdf(wordPath, pdfPath);
  } else if (os.platform() === 'linux') {
    return linuxWord2pdf(wordPath, pdfPath);
  }
}

async function win32Word2pdf(wordPath: string, pdfPath: string) {
  const { wordToPdf } = await import('node-docto');

  return await wordToPdf(wordPath, pdfPath, {
    deleteOriginal: false,
    recursive: false,
  });
}

async function linuxWord2pdf(wordPath: string, pdfPath: string) {
  const libre = await import('libreoffice-convert');
  libre.convert(fs.readFileSync(wordPath), '.pdf', undefined, (err, pdfBuf) => {
    if (err) {
      throw err;
    }
    fs.writeFileSync(pdfPath, pdfBuf);
  });
}
