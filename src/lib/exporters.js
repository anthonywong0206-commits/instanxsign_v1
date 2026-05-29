import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

async function captureExportElement(elementId) {
  const element = document.getElementById(elementId)
  if (!element) throw new Error('找不到要匯出的內容')

  const hiddenNodes = element.querySelectorAll('.export-hide, .no-print')
  const previousDisplays = []
  hiddenNodes.forEach((node) => {
    previousDisplays.push([node, node.style.display])
    node.style.display = 'none'
  })

  const previousWidth = element.style.width
  const previousMaxWidth = element.style.maxWidth
  const previousOverflow = element.style.overflow
  const previousTransform = element.style.transform
  const table = element.querySelector('table')
  const targetWidth = Math.max(element.scrollWidth, table ? table.scrollWidth + 48 : 0, 1000)

  element.style.width = `${targetWidth}px`
  element.style.maxWidth = 'none'
  element.style.overflow = 'visible'
  element.style.transform = 'none'

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      windowWidth: targetWidth,
      width: targetWidth,
      height: element.scrollHeight,
      scrollX: 0,
      scrollY: 0
    })
    return canvas
  } finally {
    element.style.width = previousWidth
    element.style.maxWidth = previousMaxWidth
    element.style.overflow = previousOverflow
    element.style.transform = previousTransform
    previousDisplays.forEach(([node, display]) => {
      node.style.display = display
    })
  }
}

export async function exportElementAsPng(elementId, filename = 'quicksign-table.png') {
  const canvas = await captureExportElement(elementId)
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
  return blob
}

export async function shareElementAsImage(elementId, title = 'QuickSign 簽收表') {
  const canvas = await captureExportElement(elementId)
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
  const file = new File([blob], 'quicksign.png', { type: 'image/png' })

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    await navigator.share({ title, text: title, files: [file] })
    return
  }

  if (navigator.share) {
    await navigator.share({ title, text: title })
    return
  }

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'quicksign.png'
  a.click()
  URL.revokeObjectURL(url)
}

export async function exportElementAsPdf(elementId, filename = 'quicksign-table.pdf') {
  const canvas = await captureExportElement(elementId)
  const imgData = canvas.toDataURL('image/png')
  const orientation = canvas.width > canvas.height ? 'landscape' : 'portrait'
  const pdf = new jsPDF({ orientation, unit: 'mm', format: 'a4' })
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 8
  const usableWidth = pageWidth - margin * 2
  const usableHeight = pageHeight - margin * 2
  const imgWidth = usableWidth
  const imgHeight = (canvas.height * imgWidth) / canvas.width

  if (imgHeight <= usableHeight) {
    pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight)
  } else {
    let yOffset = 0
    while (yOffset < imgHeight) {
      pdf.addImage(imgData, 'PNG', margin, margin - yOffset, imgWidth, imgHeight)
      yOffset += usableHeight
      if (yOffset < imgHeight) pdf.addPage()
    }
  }
  pdf.save(filename)
}
