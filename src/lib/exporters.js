import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export async function exportElementAsPng(elementId, filename = 'quicksign-table.png') {
  const element = document.getElementById(elementId)
  if (!element) throw new Error('找不到要匯出的內容')

  const canvas = await html2canvas(element, {
    backgroundColor: '#ffffff',
    scale: 2,
    useCORS: true
  })

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
  const element = document.getElementById(elementId)
  if (!element) throw new Error('找不到要分享的內容')

  const canvas = await html2canvas(element, {
    backgroundColor: '#ffffff',
    scale: 2,
    useCORS: true
  })

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
  const file = new File([blob], 'quicksign.png', { type: 'image/png' })

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    await navigator.share({
      title,
      text: title,
      files: [file]
    })
    return
  }

  if (navigator.share) {
    await navigator.share({
      title,
      text: title
    })
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
  const element = document.getElementById(elementId)
  if (!element) throw new Error('找不到要匯出的內容')

  const canvas = await html2canvas(element, {
    backgroundColor: '#ffffff',
    scale: 2,
    useCORS: true
  })

  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF('p', 'mm', 'a4')
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const imgWidth = pageWidth - 20
  const imgHeight = (canvas.height * imgWidth) / canvas.width

  let y = 10
  if (imgHeight <= pageHeight - 20) {
    pdf.addImage(imgData, 'PNG', 10, y, imgWidth, imgHeight)
  } else {
    let position = 0
    while (position < imgHeight) {
      pdf.addImage(imgData, 'PNG', 10, y - position, imgWidth, imgHeight)
      position += pageHeight - 20
      if (position < imgHeight) pdf.addPage()
    }
  }

  pdf.save(filename)
}
