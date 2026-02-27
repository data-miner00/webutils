import { formatSql, exampleSql } from './format-sql';

describe('formatSql', () => {
	it('should format SQL with 2 spaces indentation', () => {
		const sql = exampleSql;
		const options = { indentSize: 2 };
		const expected = `SELECT orders.order_id,
  customers.customer_name,
  products.product_name,
  order_items.quantity
FROM orders
  INNER JOIN customers ON orders.customer_id = customers.customer_id
  INNER JOIN order_items ON orders.order_id = order_items.order_id
  INNER JOIN products ON order_items.product_id = products.product_id
WHERE orders.order_status = 'shipped';`;
		expect(formatSql(sql, options)).toBe(expected);
	});

	it('should format SQL with 4 spaces indentation', () => {
		const sql = exampleSql;
		const options = { indentSize: 4 };
		const expected = `SELECT orders.order_id,
    customers.customer_name,
    products.product_name,
    order_items.quantity
FROM orders
    INNER JOIN customers ON orders.customer_id = customers.customer_id
    INNER JOIN order_items ON orders.order_id = order_items.order_id
    INNER JOIN products ON order_items.product_id = products.product_id
WHERE orders.order_status = 'shipped';`;
		expect(formatSql(sql, options)).toBe(expected);
	});
});
