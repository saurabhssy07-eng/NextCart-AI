import PDFDocument from 'pdfkit';

export const generateInvoice = (order, res) => {
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=Invoice-${order.invoiceNumber || order._id}.pdf`
  );

  doc.pipe(res);

  generateHeader(doc, order);
  generateCustomerInformation(doc, order);
  generateInvoiceTable(doc, order);
  generatePaymentSection(doc, order);
  generateFooter(doc);

  doc.end();
};

function generateHeader(doc, order) {
  doc
    .fillColor('#2563EB')
    .fontSize(24)
    .text('NextCart AI', 50, 50)
    .fillColor('#333333')
    .fontSize(10)
    .text('NextCart AI Tech', 200, 50, { align: 'right' })
    .text('123 Cyber Hub, Silicon Valley', 200, 65, { align: 'right' })
    .text('support@nextcart.ai', 200, 80, { align: 'right' })
    .moveDown();
}

function generateCustomerInformation(doc, order) {
  doc.fillColor('#333333').fontSize(12).text('INVOICE', 50, 120);

  const customerName = order.user.firstName ? `${order.user.firstName} ${order.user.lastName}` : 'Valued Customer';
  
  doc
    .fontSize(10)
    .text(`Invoice Number: ${order.invoiceNumber || 'N/A'}`, 50, 140)
    .text(`Order Number: ${order._id}`, 50, 155)
    .text(`Invoice Date: ${new Date(order.invoiceGeneratedAt || order.createdAt).toLocaleDateString('en-IN')}`, 50, 170)
    
    .text('Billed To:', 300, 140)
    .text(customerName, 300, 155)
    .text(`${order.shippingAddress.street}`, 300, 170)
    .text(`${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}`, 300, 185)
    .text(`${order.shippingAddress.country}`, 300, 200)
    .moveDown();
}

function generateInvoiceTable(doc, order) {
  let i;
  const invoiceTableTop = 250;

  doc.font('Helvetica-Bold');
  generateTableRow(
    doc,
    invoiceTableTop,
    'Item',
    'Description',
    'Unit Price',
    'Quantity',
    'Total'
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font('Helvetica');

  let position = 0;
  for (i = 0; i < order.items.length; i++) {
    const item = order.items[i];
    position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      item.product?.name || 'Product',
      '',
      `Rs ${item.price.toLocaleString('en-IN')}`,
      item.quantity,
      `Rs ${(item.price * item.quantity).toLocaleString('en-IN')}`
    );
    generateHr(doc, position + 20);
  }

  const subtotalPosition = position + 40;
  doc.font('Helvetica-Bold');
  generateTableRow(doc, subtotalPosition, '', '', 'Subtotal', '', `Rs ${order.orderSummary.subtotal.toLocaleString('en-IN')}`);

  let currentPos = subtotalPosition + 20;

  if (order.orderSummary.discount > 0) {
    doc.font('Helvetica');
    generateTableRow(doc, currentPos, '', '', 'Discount', '', `-Rs ${order.orderSummary.discount.toLocaleString('en-IN')}`);
    currentPos += 20;
  }

  doc.font('Helvetica');
  generateTableRow(doc, currentPos, '', '', 'Shipping', '', `Rs ${order.orderSummary.shipping.toLocaleString('en-IN')}`);
  currentPos += 20;
  
  generateTableRow(doc, currentPos, '', '', 'Tax (GST)', '', `Rs ${order.orderSummary.tax.toLocaleString('en-IN')}`);
  currentPos += 20;

  doc.font('Helvetica-Bold');
  generateTableRow(doc, currentPos, '', '', 'Grand Total', '', `Rs ${order.orderSummary.total.toLocaleString('en-IN')}`);
}

function generatePaymentSection(doc, order) {
  const paymentTop = 500;
  
  doc.fontSize(12).font('Helvetica-Bold').text('Payment Information', 50, paymentTop);
  doc.fontSize(10).font('Helvetica');
  
  doc.text(`Method: ${order.paymentMethod.replace('_', ' ').toUpperCase()}`, 50, paymentTop + 20);
  doc.text(`Status: ${order.paymentStatus}`, 50, paymentTop + 35);
  
  if (order.payment?.razorpayPaymentId) {
    doc.text(`Provider: Razorpay`, 50, paymentTop + 50);
    doc.text(`Transaction ID: ${order.payment.razorpayPaymentId}`, 50, paymentTop + 65);
  } else if (order.paymentMethod === 'cod') {
    doc.text(`Notes: Cash to be collected at delivery`, 50, paymentTop + 50);
  }

  // QR Code Placeholder
  doc.rect(400, paymentTop, 100, 100).stroke('#eaeaea');
  doc.fontSize(10).fillColor('#666666').text('QR Code', 425, paymentTop + 40);
  doc.fontSize(8).text('(Coming Soon)', 420, paymentTop + 55);
}

function generateFooter(doc) {
  doc
    .fontSize(10)
    .fillColor('#666666')
    .text(
      'Thank you for shopping with NextCart AI! This is a computer generated invoice and does not require a signature.',
      50,
      700,
      { align: 'center', width: 500 }
    );
}

function generateTableRow(
  doc,
  y,
  item,
  description,
  unitCost,
  quantity,
  lineTotal
) {
  doc
    .fontSize(10)
    .text(item, 50, y, { width: 150 })
    .text(description, 200, y)
    .text(unitCost, 280, y, { width: 90, align: 'right' })
    .text(quantity, 370, y, { width: 90, align: 'right' })
    .text(lineTotal, 0, y, { align: 'right' });
}

function generateHr(doc, y) {
  doc
    .strokeColor('#aaaaaa')
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}
