export async function generatePDF(resumeId: string, title: string = 'Resume'): Promise<void> {
  const element = document.getElementById('resume-preview');
  if (!element) {
    alert('Resume preview not found. Please make sure the preview is visible.');
    return;
  }

  try {
    // Show loading
    const loadingEl = document.createElement('div');
    loadingEl.id = 'pdf-loading';
    loadingEl.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;color:white;font-size:16px;font-family:Inter,sans-serif';
    loadingEl.innerHTML = '<div style="text-align:center"><div>Generating PDF...</div><div style="font-size:12px;opacity:0.7;margin-top:8px">This may take a moment</div></div>';
    document.body.appendChild(loadingEl);

    const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
      import('jspdf'),
      import('html2canvas'),
    ]);

    await document.fonts.ready;
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: element.offsetWidth,
      height: element.offsetHeight,
    });

    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = pdfWidth / (imgWidth / 2 / 96 * 25.4); // convert px to mm

    const pageHeightPx = pdfHeight * (imgWidth / pdfWidth);
    let heightLeft = imgHeight;
    let position = 0;
    let page = 0;

    while (heightLeft > 0) {
      if (page > 0) pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, -position * (pdfHeight / pageHeightPx), pdfWidth, pdfWidth * imgHeight / imgWidth);
      heightLeft -= pageHeightPx;
      position += pageHeightPx;
      page++;
    }

    // Extract all clickable <a> anchor tags from the preview and overlay interactive links onto the PDF
    const elemRect = element.getBoundingClientRect();
    const pageDomHeight = element.offsetWidth * (pdfHeight / pdfWidth);
    const anchors = element.querySelectorAll<HTMLAnchorElement>('a[href]');

    anchors.forEach((anchor) => {
      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;

      const rect = anchor.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const domX = (rect.left - elemRect.left) * (element.offsetWidth / elemRect.width);
      const domY = (rect.top - elemRect.top) * (element.offsetHeight / elemRect.height);
      const domW = rect.width * (element.offsetWidth / elemRect.width);
      const domH = rect.height * (element.offsetHeight / elemRect.height);

      const pageIdx = Math.floor(domY / pageDomHeight);
      if (pageIdx >= page) return; // out of bounds

      const xMm = (domX / element.offsetWidth) * pdfWidth;
      const yMm = ((domY % pageDomHeight) / pageDomHeight) * pdfHeight;
      const wMm = (domW / element.offsetWidth) * pdfWidth;
      const hMm = (domH / pageDomHeight) * pdfHeight;

      pdf.setPage(pageIdx + 1);
      pdf.link(xMm, yMm, wMm, hMm, { url: href });
    });

    const fileName = `${title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_')}_Resume.pdf`;
    pdf.save(fileName);

    // PDF downloaded successfully

  } catch (err) {
    console.error('[PDF Export]', err);
    alert('Failed to generate PDF. Please try again.');
  } finally {
    document.getElementById('pdf-loading')?.remove();
  }
}
