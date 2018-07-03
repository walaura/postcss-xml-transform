# css-in-xml

<img width="1282" alt="screen shot 2018-07-03 at 9 55 22 am" src="https://user-images.githubusercontent.com/11539094/42209746-56321c32-7ea7-11e8-90e3-738b615b530a.png">

A tiny transform library that lets you write CSS using XML

## Usage

```
const postcss = require('postcss');
const xss = require('./parser');

postcss()
	.process(css, { parser: xss })
	.then(function(result) {
		console.log(result.content);
	});
```

Use `xss` as a parser.

## Why?

If i'm being completely honest this sort of begun as a jokey idea and then evolved into an exploration of of `postcss` works on the inside and how to write transforms for it and such

## What can I use this library for?

Imagine this, you hold a senior position at a company you hate. You write up a compelling case for css in xml, something about the Android developers having an easier time with this because android uses xml. Probably. Nobody in your company really cares enough about the Android app to even know do they.
You lead a team for two months to rewrite the entire CSS stack in this abhorrent XML thing. It should actually work with css modules and stuff.
Hell you could even write a jsx pragma. You leave. Retire to the Bahamas for a bunch of months. The company you hated all along now has to maintain **this**. You sip a strawberry mojito in the beach and pet a bird. Things are good. You made it.

## Is there like a spec or anything?

Hahahsahjbddsvufbf of course not I already had enough trouble rationalizing how separate the parsers for the declaration xml and the root xml should be to bother writing anything up.

Please refer to the [test page](https://iron-door.glitch.me) or to the three files of code that i refactored so thoroughly that everything is now an abstract mess nobody can follow. I don't even know how this works. it's amazing. i love it.

## Can I use the stringify method?

No

## Can I donate to help support development of this project?

I will donate to your project if you use this.
