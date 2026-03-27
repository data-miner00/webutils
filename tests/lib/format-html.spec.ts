import { formatHtml } from '$lib/core/format-html';

describe('format HTML', () => {
	[
		{
			spacing: 4,
			expected: `<div class="hello world">
    <div class="bye world">
        <div class="nested">
            <h1>Hello World</h1>
        </div>
    </div>
</div>`
		},
		{
			spacing: 2,
			expected: `<div class="hello world">
  <div class="bye world">
    <div class="nested">
      <h1>Hello World</h1>
    </div>
  </div>
</div>`
		}
	].forEach((scenario) => {
		it('should format HTML correctly', () => {
			const input = `
<div class="hello world">
<div class="bye world">
<div class="nested">
<h1>Hello World</h1>
</div>
</div>
</div>
`;

			const actual = formatHtml(input, { indentSize: scenario.spacing });
			expect(actual).toBe(scenario.expected);
		});
	});
});
