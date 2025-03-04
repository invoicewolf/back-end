import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { InvoiceDto } from './dto/Invoice.dto';

@Injectable()
export class InvoiceService {
  async generateInvoice(invoice: InvoiceDto) {
    const generatorUrl = process.env.GENERATOR_URL;

    const pdfFile = await fetch(`${generatorUrl}/Invoice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invoice),
    });

    if (!pdfFile.ok) {
      throw new NotFoundException();
    }

    return new StreamableFile(Buffer.from(await pdfFile.arrayBuffer()), {
      type: 'application/pdf',
      disposition: 'attachment; filename="invoice.pdf"',
    });
  }
}
