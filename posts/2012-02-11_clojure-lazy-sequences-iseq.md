---
title: "Clojure lazy sequences, ISeq"
date: 2012-02-11T16:59:17-08:00
url: https://newcome.wordpress.com/2012/02/11/clojure-lazy-sequences-iseq/
id: 1554
categories: Uncategorized
tags: 
---

# Clojure lazy sequences, ISeq

Functional languages like Clojure support lazy evaluation of expressions. This contrasts sharply with languages like C# where every expression is evaluated immediately. In order to get something that resembles a lazy sequence in Clojure would be to use IEnumerable and yield.

Ok so I should probably dig into comparing Clojure sequences with C# Iterators, but I’m going to do that later on. First I want to explore Clojure sequences since they are little more slippery than I first imagined.

The Clojure docs would initially have you believe that every data structure provided by the core library is already a sequence, implementing ISeq. This isn’t explicitly true. Let’s take a look at a few examples:

Is a vector a seq?

```

user=> (seq? [1 2])
false

```
Nope. How about a map?

```

user=&gt; (seq? {:foo 1})
false

```
Again, no. What is the deal? Aren’t all of these things supposed to support ISeq? Ok, what about a list?

```

user=> (seq? (list 2 3))
true

```
Ok, now we’re getting somewhere. So a list implements ISeq by default. So, since a vector isn’t a seq, we shouldn’t be able to take the first item using ‘first’ right? Let’s try it:

```

user=> (first [1 2])
1

```
Ooops. What’s going on? Reading the docs more closely reveals that the above is actually calling a function called ‘seq’ on its argument before evaluation. So the following expression is actually equivalent:

```

(first (seq [1 2]))
1

```
Now, what does it look like when we create a sequence from a vector?

```

user=> (seq [2 3])
(2 3)

```
It looks like a list. Let’s see if it is.

```

user=> (= (seq [2 3]) (list 2 3))
true

```
Wow. Let’s double-check that result.

```

user=> (= (seq [2 3]) [2 3])
true

```
Ok, that’s strange. We know that a vector is not a seq by default, so there must be some coercion going on here.

So now how about using lazy sequences? Let’s create an infinite sequence. We can do this easily using something like ‘cycle’ which takes some data structure and returns an infinitely repeating sequence of the given values. For example:

```

user=> (take 5 (cycle [1 2 ]))
(1 2 1 2 1)

```
If we don’t ‘take’ just a few elements, this will repeat forever. Let’s check what we assume is the case:

```

user=> (seq?(cycle [2 3 ]))
true

```
What do you know? ‘cycle’ returns a seq. In the above sample, the cycle is obviously not fully computed before we ‘take’ our result, otherwise it would never finish. So cycle returns a lazy seq.

Later on I’m going to explore laziness in Clojure and expand on some of these observations.
