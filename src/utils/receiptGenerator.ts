import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Order, OrderDetail, Product } from '../types';
import autoTable from 'jspdf-autotable';

interface ReceiptItem {
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

/**
 * Generates a PDF receipt for a table's order
 * @param tableNumber - The table number
 * @param orderDetails - The order details containing items ordered
 * @param menuItems - Product catalog to get names and prices
 * @param totalAmount - The total amount of the order
 * @returns The PDF document as a Blob URL that can be used for download
 */
export const generateReceiptPDF = (
    tableNumber: number,
    orderDetails: OrderDetail[],
    menuItems: Product[],
    totalAmount: string
): string => {
    // Create a new PDF document
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    // Set up fonts and sizes
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);

    // Add restaurant logo/header
    doc.text('RESTVISOR', 105, 20, { align: 'center' });
    
    // Restaurant info
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Restaurante Ejemplo, S.L.', 105, 30, { align: 'center' });
    doc.text('C/ Principal, 123 - 28001 Madrid', 105, 35, { align: 'center' });
    doc.text('CIF: B-12345678', 105, 40, { align: 'center' });
    doc.text('Tel: 912 345 678', 105, 45, { align: 'center' });

    // Receipt details
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`TICKET MESA ${tableNumber}`, 20, 60);
    
    // Date and receipt number
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const today = new Date();
    const receiptNumber = `RV-${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}-${tableNumber}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    
    doc.text(`Fecha: ${today.toLocaleDateString()} ${today.toLocaleTimeString()}`, 20, 65);
    doc.text(`Núm. Ticket: ${receiptNumber}`, 20, 70);
    doc.text(`Mesa: ${tableNumber}`, 20, 75);

    // Format order details for table
    const tableItems: ReceiptItem[] = orderDetails.map(detail => {
        const product = menuItems.find(item => item.id === detail.producto_id);
        const name = product ? product.name : 'Producto desconocido';
        const price = product ? product.price : 0;
        const quantity = detail.cantidad;
        const total = price * quantity;

        return {
            name,
            quantity,
            unitPrice: price,
            total
        };
    });

    // Generate order table
    autoTable(doc, {
        startY: 85,
        head: [['Producto', 'Cantidad', 'Precio Unit.', 'Total']],
        body: tableItems.map(item => [
            item.name,
            item.quantity.toString(),
            `€${item.unitPrice.toFixed(2)}`,
            `€${item.total.toFixed(2)}`
        ]),
        foot: [
            ['', '', 'TOTAL:', `€${totalAmount}`]
        ],
        theme: 'striped',
        headStyles: {
            fillColor: [41, 128, 185],
            textColor: 255,
            fontStyle: 'bold'
        },
        footStyles: {
            fillColor: [240, 240, 240],
            textColor: [0, 0, 0],
            fontStyle: 'bold'
        },
        styles: {
            fontSize: 10,
            cellPadding: 3
        }
    });
    
    // Add footer information
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    
    doc.setFontSize(9);
    doc.text('Gracias por su visita', 105, finalY, { align: 'center' });
    doc.text('Este documento no es una factura. Si desea factura, solicítela en caja.', 105, finalY + 5, { align: 'center' });
    doc.text('I.V.A. incluido en todos los precios', 105, finalY + 10, { align: 'center' });

    // Convert to Blob URL
    const pdfBlob = doc.output('blob');
    return URL.createObjectURL(pdfBlob);
}; 
