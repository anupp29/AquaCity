import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { WaterBody } from '@/types/waterBody';
import { format } from 'date-fns';

export async function generateWaterBodyReport(waterBody: WaterBody): Promise<void> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  let yPosition = margin;

  const checkPageBreak = (neededSpace: number) => {
    if (yPosition + neededSpace > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Header
  pdf.setFillColor(14, 116, 144); // Teal-700
  pdf.rect(0, 0, pageWidth, 42, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(22);
  pdf.setFont('helvetica', 'bold');
  pdf.text('AquaCity — Water Body Health Report', pageWidth / 2, 18, { align: 'center' });
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('SDG 11: Sustainable Cities & Communities | Data Source: AI Kosh', pageWidth / 2, 28, { align: 'center' });
  pdf.setFontSize(8);
  pdf.text('Methodology: CPCB Water Quality Standards & IS 10500 | MoEFCC Guidelines', pageWidth / 2, 35, { align: 'center' });

  yPosition = 52;

  // Water Body Name and Status
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text(waterBody.name, margin, yPosition);
  yPosition += 10;

  const statusColors: Record<string, [number, number, number]> = {
    excellent: [34, 197, 94], good: [59, 130, 246], fair: [234, 179, 8],
    poor: [249, 115, 22], critical: [239, 68, 68],
  };
  const [r, g, b] = statusColors[waterBody.healthStatus] || [100, 100, 100];
  
  pdf.setFillColor(r, g, b);
  pdf.roundedRect(margin, yPosition, 50, 12, 3, 3, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text(waterBody.healthStatus.toUpperCase(), margin + 25, yPosition + 8, { align: 'center' });
  
  pdf.setFillColor(14, 116, 144);
  pdf.roundedRect(margin + 55, yPosition, 40, 12, 3, 3, 'F');
  pdf.text(`Score: ${waterBody.healthScore}`, margin + 75, yPosition + 8, { align: 'center' });
  
  yPosition += 20;

  pdf.setTextColor(100, 100, 100);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Report Generated: ${format(new Date(), 'MMMM d, yyyy h:mm a')}`, margin, yPosition);
  pdf.text(`Water Body Type: ${waterBody.type.charAt(0).toUpperCase() + waterBody.type.slice(1)}`, pageWidth - margin, yPosition, { align: 'right' });
  yPosition += 12;

  pdf.setDrawColor(200, 200, 200);
  pdf.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // Location Section
  pdf.setTextColor(14, 116, 144);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Location Information', margin, yPosition);
  yPosition += 8;

  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  
  const locationData = [
    ['District:', waterBody.location.district],
    ['Taluka:', waterBody.location.taluka],
    ['Village:', waterBody.location.village],
    ['Address:', waterBody.location.address],
    ['Coordinates:', `${waterBody.location.latitude.toFixed(4)}°N, ${waterBody.location.longitude.toFixed(4)}°E`],
  ];

  locationData.forEach(([label, value]) => {
    pdf.setFont('helvetica', 'bold');
    pdf.text(label, margin + 5, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text(value, margin + 40, yPosition);
    yPosition += 6;
  });

  yPosition += 5;
  checkPageBreak(80);

  // Water Quality Parameters
  pdf.setTextColor(14, 116, 144);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Water Quality Parameters (CPCB Standards)', margin, yPosition);
  yPosition += 8;

  pdf.setTextColor(100, 100, 100);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'italic');
  pdf.text(`Measurement Date: ${format(new Date(waterBody.measurements.date), 'MMMM d, yyyy')}`, margin + 5, yPosition);
  yPosition += 8;

  const parameters = [
    ['Parameter', 'Value', 'Unit', 'CPCB/IS Standard'],
    ['pH Level', waterBody.measurements.pH?.toFixed(1) || 'N/A', '', '6.5–8.5 (IS 10500)'],
    ['Dissolved Oxygen', waterBody.measurements.dissolvedOxygen?.toFixed(1) || 'N/A', 'mg/L', '≥6 (Class A)'],
    ['Turbidity', waterBody.measurements.turbidity?.toString() || 'N/A', 'NTU', '<10 (IS 10500)'],
    ['Temperature', waterBody.measurements.temperature?.toString() || 'N/A', '°C', '15–25 ambient'],
    ['Conductivity', waterBody.measurements.conductivity?.toString() || 'N/A', 'µS/cm', '300–800'],
    ['BOD', waterBody.measurements.bod?.toString() || 'N/A', 'mg/L', '≤3 (Class A)'],
    ['COD', waterBody.measurements.cod?.toString() || 'N/A', 'mg/L', '≤20'],
    ['Nitrates', waterBody.measurements.nitrates?.toFixed(1) || 'N/A', 'mg/L', '≤45 (IS 10500)'],
    ['Phosphates', waterBody.measurements.phosphates?.toFixed(1) || 'N/A', 'mg/L', '<0.5'],
    ['Fecal Coliform', waterBody.measurements.fecalColiform?.toString() || 'N/A', 'CFU/100mL', '≤50 (Class A)'],
  ];

  pdf.setFontSize(9);
  pdf.setTextColor(0, 0, 0);

  pdf.setFillColor(240, 240, 240);
  pdf.rect(margin, yPosition, pageWidth - 2 * margin, 8, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.text(parameters[0][0], margin + 2, yPosition + 6);
  pdf.text(parameters[0][1], margin + 50, yPosition + 6);
  pdf.text(parameters[0][2], margin + 80, yPosition + 6);
  pdf.text(parameters[0][3], margin + 105, yPosition + 6);
  yPosition += 8;

  pdf.setFont('helvetica', 'normal');
  parameters.slice(1).forEach((row, index) => {
    checkPageBreak(8);
    if (index % 2 === 0) {
      pdf.setFillColor(250, 250, 250);
      pdf.rect(margin, yPosition, pageWidth - 2 * margin, 7, 'F');
    }
    pdf.text(row[0], margin + 2, yPosition + 5);
    pdf.setFont('helvetica', 'bold');
    pdf.text(row[1], margin + 50, yPosition + 5);
    pdf.setFont('helvetica', 'normal');
    pdf.text(row[2], margin + 80, yPosition + 5);
    pdf.setTextColor(100, 100, 100);
    pdf.text(row[3], margin + 105, yPosition + 5);
    pdf.setTextColor(0, 0, 0);
    yPosition += 7;
  });

  yPosition += 5;
  checkPageBreak(30);

  if (waterBody.measurements.heavyMetals) {
    pdf.setTextColor(14, 116, 144);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Heavy Metals Analysis:', margin, yPosition);
    yPosition += 6;
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(waterBody.measurements.heavyMetals, margin + 5, yPosition);
    yPosition += 10;
  }

  if (waterBody.observations) {
    checkPageBreak(40);
    pdf.setTextColor(14, 116, 144);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Observations', margin, yPosition);
    yPosition += 8;
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    const lines = pdf.splitTextToSize(waterBody.observations, pageWidth - 2 * margin - 10);
    lines.forEach((line: string) => { checkPageBreak(6); pdf.text(line, margin + 5, yPosition); yPosition += 6; });
    yPosition += 5;
  }

  if (waterBody.pollutionSources && waterBody.pollutionSources.length > 0) {
    checkPageBreak(30);
    pdf.setTextColor(249, 115, 22);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Pollution Sources', margin, yPosition);
    yPosition += 8;
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    waterBody.pollutionSources.forEach((source) => { checkPageBreak(6); pdf.circle(margin + 7, yPosition - 2, 1, 'F'); pdf.text(source, margin + 12, yPosition); yPosition += 6; });
    yPosition += 5;
  }

  // Recommendations
  checkPageBreak(50);
  pdf.setTextColor(14, 116, 144);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Recommendations (per MoEFCC Guidelines)', margin, yPosition);
  yPosition += 8;

  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');

  const recommendations: string[] = [];
  if (waterBody.healthScore < 50) {
    recommendations.push('URGENT: Immediate intervention required per CPCB Priority Action Zone criteria');
    recommendations.push('• Conduct detailed pollution source analysis per MoEFCC protocol');
    recommendations.push('• Implement water treatment measures as per National Water Policy 2012');
  }
  if (waterBody.measurements.pH && (waterBody.measurements.pH < 6.5 || waterBody.measurements.pH > 8.5)) {
    recommendations.push('• pH outside IS 10500 acceptable range — investigate acid/alkaline sources');
  }
  if (waterBody.measurements.dissolvedOxygen && waterBody.measurements.dissolvedOxygen < 6) {
    recommendations.push('• DO below CPCB Class A threshold — consider mechanical aeration');
  }
  if (waterBody.measurements.turbidity && waterBody.measurements.turbidity > 25) {
    recommendations.push('• Turbidity exceeds potable limits — implement sediment control per CPHEEO guidelines');
  }
  if (waterBody.measurements.fecalColiform && waterBody.measurements.fecalColiform > 500) {
    recommendations.push('• Fecal coliform exceeds CPCB Class B limit — check for sewage ingress');
  }
  if (waterBody.healthScore >= 70) {
    recommendations.push('• Meets CPCB designated best use criteria — continue conservation');
    recommendations.push('• Maintain regular monitoring per National Water Quality Monitoring Programme');
  }
  if (recommendations.length === 0) {
    recommendations.push('• Continue regular monitoring per NWQMP schedule');
    recommendations.push('• Maintain current conservation efforts');
  }

  recommendations.forEach((rec) => {
    checkPageBreak(6);
    const lines = pdf.splitTextToSize(rec, pageWidth - 2 * margin - 10);
    lines.forEach((line: string) => { pdf.text(line, margin + 5, yPosition); yPosition += 6; });
  });

  yPosition += 10;
  checkPageBreak(30);

  // Reporter
  if (waterBody.reportedBy) {
    pdf.setTextColor(14, 116, 144);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Reported By', margin, yPosition);
    yPosition += 8;

    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    const reporterData = [
      ['Name:', waterBody.reportedBy.name || 'N/A'],
      ['Organization:', waterBody.reportedBy.organization || 'N/A'],
      ['Contact:', waterBody.reportedBy.contact || 'N/A'],
      ['Last Updated:', format(new Date(waterBody.updatedAt), 'MMM d, yyyy h:mm a')],
    ];
    reporterData.forEach(([label, value]) => {
      pdf.setFont('helvetica', 'bold');
      pdf.text(label, margin + 5, yPosition);
      pdf.setFont('helvetica', 'normal');
      pdf.text(value, margin + 40, yPosition);
      yPosition += 6;
    });
  }

  // Footer
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`AquaCity — SDG 11 Urban Water Infrastructure Monitor — Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    pdf.text('Data: AI Kosh | Standards: CPCB / IS 10500 / MoEFCC | Framework: NITI Aayog SDG India Index', pageWidth / 2, pageHeight - 6, { align: 'center' });
  }

  const fileName = `AquaCity_${waterBody.name.replace(/[^a-z0-9]/gi, '_')}_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
  pdf.save(fileName);
}

export async function captureChartAsImage(elementId: string): Promise<string | null> {
  const element = document.getElementById(elementId);
  if (!element) return null;
  try {
    const canvas = await html2canvas(element, { backgroundColor: '#ffffff', scale: 2 });
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error capturing chart:', error);
    return null;
  }
}
