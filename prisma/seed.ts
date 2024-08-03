import { PrismaClient } from '@prisma/client';
import { fakerNL } from '@faker-js/faker';
import { CipherService } from '../src/cipher/cipher.service';

const prisma = new PrismaClient();
const cipherService = new CipherService();

async function main() {
  const example_corp = await prisma.company.upsert({
    where: { id: 0 },
    update: {},
    create: {
      id: 0,
      companyName: 'Example',
      companyNumber: fakerNL.number
        .int({ min: 10000000, max: 99999999 })
        .toString(),
      companyEmail: 'contact@example.com',
      taxNumber: generateRandomVATNumber(),
      zipCode: fakerNL.location.zipCode(),
      houseNumber: fakerNL.location.buildingNumber(),
      streetName: fakerNL.location.street(),
      city: fakerNL.location.city(),
      country: fakerNL.location.country(),
    },
  });

  const example_corp_payment_details = await prisma.paymentDetails.upsert({
    where: { id: 0 },
    update: {},
    create: {
      id: 0,
      companyId: 0,
      iban: cipherService.encrypt(fakerNL.finance.iban({ countryCode: 'NL' })),
      currency: 'EUR',
    },
  });

  const admin = await prisma.user.upsert({
    where: { id: '9YsRjfWMndNguBpMX1zkDugrrC93' },
    update: {},
    create: {
      id: '9YsRjfWMndNguBpMX1zkDugrrC93',
      firstName: fakerNL.person.firstName(),
      lastName: fakerNL.person.lastName(),
      email: 'admin@example.com',
    },
  });

  const adminCompanyUser = await prisma.companyUser.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      companyId: 0,
      userId: '9YsRjfWMndNguBpMX1zkDugrrC93',
    },
  });

  const user = await prisma.user.upsert({
    where: { id: '88gGjEWOTmWmzLwthr0nhYzAQ1v2' },
    update: {},
    create: {
      id: '88gGjEWOTmWmzLwthr0nhYzAQ1v2',
      firstName: fakerNL.person.firstName(),
      lastName: fakerNL.person.lastName(),
      email: 'user@example.com',
    },
  });

  const userCompanyUser = await prisma.companyUser.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      companyId: 0,
      userId: '88gGjEWOTmWmzLwthr0nhYzAQ1v2',
    },
  });

  console.log({
    example_corp,
    example_corp_payment_details,
    admin,
    adminCompanyUser,
    user,
    userCompanyUser,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

function generateRandomVATNumber() {
  return `NL${fakerNL.number.int({ min: 100000000, max: 999999999 })}B${fakerNL.number.int({ min: 10, max: 99 })}`;
}
