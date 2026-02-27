import sqlFormatter from '@sqltools/formatter';

type Options = {
	indentSize: number;
};

export function formatSql(sql: string, options: Options): string {
	const formattedSql = sqlFormatter.format(sql, {
		indent: options.indentSize === 4 ? '    ' : '  '
	});

	return formattedSql;
}

export const exampleSql = "SELECT orders.order_id, customers.customer_name, products.product_name, order_items.quantity FROM orders INNER JOIN customers ON orders.customer_id = customers.customer_id INNER JOIN order_items ON orders.order_id = order_items.order_id INNER JOIN products ON order_items.product_id = products.product_id WHERE orders.order_status = 'shipped';"