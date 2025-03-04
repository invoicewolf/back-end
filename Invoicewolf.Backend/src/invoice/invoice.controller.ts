import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { InvoiceDto } from './dto/Invoice.dto';
import { InvoiceService } from './invoice.service';

@ApiTags('invoice')
@Controller('invoice')
@Controller('invoice')
export class InvoiceController {
  constructor(private invoiceService: InvoiceService) {}

  @ApiOperation({ operationId: 'createInvoice' })
  @Post('/')
  async PostInvoice(@Body(new ValidationPipe()) jsonBody: InvoiceDto) {
    return await this.invoiceService.generateInvoice(jsonBody);
  }
}
