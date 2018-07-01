var postcss = require('postcss');

var plugin = require('./plugin/index.js');

function run(input, output, opts) {
	return postcss([plugin(opts)])
		.process(input)
		.then(result => {
			expect(result.css).toEqual(output);
			expect(result.warnings().length).toBe(0);
		});
}

it('btoas', () => {
	return run(
		'a{ color: btoa(Test Name) 10 btoa(Test Colour); }',
		'a{ color: VGVzdCBOYW1l 10 VGVzdCBDb2xvdXI=; }',
		{}
	);
});

it('atobs', () => {
	return run(
		'a{ color: atob(VGVzdCBOYW1l) 10 atob(VGVzdCBDb2xvdXI=); }',
		'a{ color: Test Name 10 Test Colour; }',
		{}
	);
});
