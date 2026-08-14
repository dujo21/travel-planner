import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Snima element sa datim id-em i pravi visestranicni PDF bez preklapanja.
// Koristimo slikanje HTML-a jer jsPDF podrazumevani fontovi
// ne podrzavaju srpske dijakritike (c, c, s, z, dj).
export async function exportPlanToPdf(elementId, fileName) {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element za izvoz nije pronađen.');
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: '#ffffff',
    useCORS: true,
  });

  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 10;

  const imgWidth = pageWidth - margin * 2;
  // Odnos px -> mm na osnovu sirine
  const ratio = imgWidth / canvas.width;
  // Visina jedne strane izrazena u pikselima izvornog canvas-a
  const pageHeightPx = (pageHeight - margin * 2) / ratio;

  let renderedPx = 0; // koliko piksela je vec odsliano
  let pageIndex = 0;

  while (renderedPx < canvas.height) {
    // Koliko piksela stane na ovu stranu
    const sliceHeightPx = Math.min(pageHeightPx, canvas.height - renderedPx);

    // Napravi isecak canvasa za ovu stranu
    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = canvas.width;
    pageCanvas.height = sliceHeightPx;

    const ctx = pageCanvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
    ctx.drawImage(
      canvas,
      0, renderedPx,              // izvor: pocetak isecka
      canvas.width, sliceHeightPx,
      0, 0,                       // odrediste
      canvas.width, sliceHeightPx
    );

    const imgData = pageCanvas.toDataURL('image/png');
    const sliceHeightMm = sliceHeightPx * ratio;

    if (pageIndex > 0) {
      pdf.addPage();
    }
    pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, sliceHeightMm);

    renderedPx += sliceHeightPx;
    pageIndex += 1;
  }

  pdf.save(fileName);
}