import { Controller, Get, Query, StreamableFile } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { createReadStream } from 'fs';
import { join } from 'path';
import { AppService } from './app.service';
import { ZipCodeDto } from './dto/zip-code.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  getHello() {
    return 'InvoiceWolf API 1.0.0';
  }

  @Get('/zip-code')
  @ApiOkResponse({ type: ZipCodeDto })
  @ApiOperation({ operationId: 'getZipCode' })
  async getZipCode(
    @Query('zipCode') zipCode: string,
    @Query('houseNumber') houseNumber: string,
  ) {
    return this.appService.getZipCode(zipCode, houseNumber);
  }

  @Get('/fonts/bold')
  @ApiOperation({ operationId: 'getBoldFont' })
  async getBoldFont() {
    const file = createReadStream(
      join(process.cwd(), 'src/assets/Roboto-Bold.ttf'),
    );
    return new StreamableFile(file, { type: 'font/ttf' });
  }

  @Get('/fonts/regular')
  @ApiOperation({ operationId: 'getRegularFont' })
  async getRegularFont() {
    const file = createReadStream(
      join(process.cwd(), 'src/assets/Roboto-Regular.ttf'),
    );
    return new StreamableFile(file, { type: 'font/ttf' });
  }
}
