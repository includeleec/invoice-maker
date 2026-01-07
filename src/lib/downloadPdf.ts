import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const downloadPdf = async (elementId: string, fileName: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    try {
        const canvas = await html2canvas(element, {
            scale: 2, // Higher resolution
            logging: false,
            useCORS: true, // vital for images if external, though ours are data URLs mostly
            onclone: (clonedDoc) => {
                const clonedElement = clonedDoc.getElementById(elementId);
                if (clonedElement) {
                    const elementsWithStyles = clonedElement.querySelectorAll('*');
                    elementsWithStyles.forEach((el) => {
                        const htmlEl = el as HTMLElement;
                        const style = window.getComputedStyle(htmlEl);

                        // html2canvas fails on modern CSS color functions like lab(), oklch(), etc.
                        // These are common in Tailwind CSS 4.

                        // 1. Remove modern effects that definitely use these colors
                        if (style.boxShadow !== 'none') htmlEl.style.boxShadow = 'none';
                        if (style.filter !== 'none') htmlEl.style.filter = 'none';

                        // 2. Check and fix basic color properties
                        // We convert common color properties to safe defaults if they use modern functions
                        const colorProps = ['color', 'backgroundColor', 'borderColor', 'borderTopColor', 'borderBottomColor', 'borderLeftColor', 'borderRightColor'] as const;

                        colorProps.forEach(prop => {
                            const value = style[prop as any];
                            if (value && (value.includes('lab(') || value.includes('oklch(') || value.includes('oklab(') || value.includes('lch('))) {
                                // Fallback to a safe color if it uses an unsupported function
                                if (prop === 'backgroundColor') {
                                    htmlEl.style.backgroundColor = '#ffffff';
                                } else if (prop.includes('borderColor')) {
                                    htmlEl.style.borderColor = '#e5e7eb'; // gray-200
                                } else {
                                    htmlEl.style[prop as any] = '#000000';
                                }
                            }
                        });

                        // Special case for the root preview element
                        if (htmlEl === clonedElement) {
                            htmlEl.style.backgroundColor = '#ffffff';
                        }
                    });
                }
            }
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });

        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(`${fileName}.pdf`);
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
};
