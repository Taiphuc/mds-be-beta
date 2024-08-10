import Medusa from "@medusajs/medusa-js";
import { EMailTemplateHtmlReplace } from './enum';

export const DefaultCodeHtmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    ${EMailTemplateHtmlReplace.CONTENT}
</body>
</html>`;

export const PaginationDefault = {
  pageIndex: 0,
  pageSize: 10,
  count: 0,
  pageCount: 1,
  canPreviousPage: false,
  canNextPage: false,
};

export const ConditionSegmentText = [
  {
    key: 'checkout_but_dont_buy',
    value: "Checkout But Don't Buy",
  },
  {
    key: 'subscribe_new_product',
    value: "Subscribe New Product",
  },
];


export const medusaClient = new Medusa({
  baseUrl: process.env.MEDUSA_ADMIN_BE_URL || 'https://api.vincoleggings.com',
  maxRetries: 3,
  apiKey: process.env.API_TOKEN,
});