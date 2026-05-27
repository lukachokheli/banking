import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { transactionCategoryStyles } from '@/constants';
import {
  cn,
  formatAmount,
  formatDateTime,
  getTransactionStatus,
  removeSpecialCharacters,
} from '@/lib/utils';

const normalizeCategory = (category: string) => {
  const formatted = category
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

  if (formatted.includes('Transfer')) return 'Transfer';
  if (formatted.includes('Payment')) return 'Payment';
  if (formatted.includes('Food')) return 'Food And Drink';
  if (formatted.includes('General Merchandise')) return 'Food And Drink';
  if (formatted.includes('Transportation')) return 'Travel';

  return formatted;
};

const CategoryBadge = ({ category }: CategoryBadgeProps) => {
  const formattedCategory = normalizeCategory(category);

  const { borderColor, backgroundColor, textColor, chipBackgroundColor } =
    transactionCategoryStyles[
      formattedCategory as keyof typeof transactionCategoryStyles
    ] || transactionCategoryStyles.default;

  return (
    <div className={cn('category-badge', borderColor, chipBackgroundColor)}>
      <div className={cn('size-2 rounded-full', backgroundColor)} />
      <p className={cn('text-[12px] font-medium', textColor)}>
        {formattedCategory}
      </p>
    </div>
  );
};

const TransactionsTable = ({ transactions = [] }: TransactionTableProps) => {
  return (
    <div className="w-full overflow-x-auto">
      <Table className="min-w-[850px]">
        <TableHeader className="bg-[#f9fafb]">
          <TableRow>
            <TableHead className="px-2">Transaction</TableHead>
            <TableHead className="px-2">Amount</TableHead>
            <TableHead className="px-2">Status</TableHead>
            <TableHead className="px-2">Date</TableHead>
            <TableHead className="px-2 max-md:hidden">Channel</TableHead>
            <TableHead className="px-2 max-md:hidden">Category</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((t: Transaction) => {
            const status = getTransactionStatus(new Date(t.date));
            const numericAmount = Number(t.amount);
            const amount = formatAmount(Math.abs(numericAmount));

            const isDebit = t.type === 'debit';
            const isCredit = t.type === 'credit';

            return (
              <TableRow
                key={t.id}
                className={`${isDebit || amount[0] === '-' ? 'bg-[#FFFBFA]' : 'bg-[#F6FEF9]'} border-b`}
              >
                <TableCell className="max-w-[250px] pl-2 pr-10">
                  <div className="flex items-center gap-3">
                    <h1 className="text-14 truncate font-semibold text-[#344054]">
                      {removeSpecialCharacters(t.name)}
                    </h1>
                  </div>
                </TableCell>

                <TableCell
                  className={`pl-2 pr-10 font-semibold ${isDebit || amount[0] === '-' ? 'text-[#f04438]' : 'text-[#039855]'}`}
                >
                  {isDebit ? `-${amount}` : isCredit ? amount : amount}
                </TableCell>

                <TableCell className="pl-2 pr-10">
                  <CategoryBadge category={status} />
                </TableCell>

                <TableCell className="min-w-32 pl-2 pr-10">
                  {formatDateTime(new Date(t.date)).dateTime}
                </TableCell>

                <TableCell className="pl-2 pr-10 capitalize min-w-24">
                  {t.paymentChannel}
                </TableCell>

                <TableCell className="pl-2 pr-10 max-md:hidden">
                  <CategoryBadge
                    category={
                      t.category
                        ? t.category.replace(/_/g, ' ')
                        : 'Uncategorized'
                    }
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionsTable;
