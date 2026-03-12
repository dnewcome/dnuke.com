---
title: "Functionally speaking with Clojure and Javascript"
date: 2012-02-08T18:09:43-08:00
url: https://newcome.wordpress.com/2012/02/08/functionally-speaking-with-clojure-and-javascript/
id: 1546
categories: Uncategorized
tags: 
---

# Functionally speaking with Clojure and Javascript

I’ve been playing around with [Clojure](http://clojure.org/) a lot more recently as a result of a new project that I’m wor[](http://en.wikipedia.org/wiki/Homoiconicity)king on. I have played around with Clojure before, especially in the context of the recent [.NET port of Clojure](https://github.com/richhickey/clojure-clr).

I considered myself to be pretty familiar with functional programming ideas. Higher order functions, function application, etc. These are all technically things that I do all the time with Javascript.

So I’ve also played around with F# and Haskell, which would probably be more interesting comparisons here, but since I know Javascript so well, and I’ve written a lot about JS in the past, I think I’ll see how far I can go in a comparison using what I’ve learned so far about Clojure. I’m going to start off with some similarities, but later on I want to address some things that are fundamentally different like lazy evaluation and immutable data structures.

First off, one of the most useful things functionally about Javascript is the ability to define an anonymous function, or lambda, shown here in the following code snippet:

```

function( x, y) {
 return x + y;
}

```
Guess what that does? Yep, it is a function that sums its arguments. In Javascript it’s very nice to be able to define a lambda in almost exactly the same way that we would normally define a regular named function. In fact, it is useful to think of this lambda definition as simply a language-supported constructor function that we call and leave the return value unbound.

Just for completeness, here is the same function, bound to the name ‘sum’ to be called later.

```

sum = function( x, y) {
 return x + y;
};

```
Also the alternative construct where the name is ‘magically’ bound without the use of the assignment operator:

```

function sum( x, y) {
 return x + y;
}

```
I showed this last form since it reflects the clojure example that I’m about to show.

In Clojure, we would define the named function sum using a macro called ‘defn’ that is provided by the Clojure system. What is a macro? Let’s not worry about that for the moment. Using a macro looks just like calling a function in this case, so let’s just think of the following sample as us calling a constructor function like we imagine the Javascript ‘function’ keyword to be.

```

(defn sum [x y] 
 (+ x y)
)

```
Ok, I have formatted the code so that it follows more closely the C-style indentation convention that I commonly use for Javascript. This is to more clearly show the parallels between what we wrote in JS with the Clojure example.

If we think of ‘defn’ as our ‘function’ language construct in JS, we can see that syntactically, the scope braces have been moved out around the entire expression and we don’t seem to explicitly be returning anything. Well we’ve definitely seen the latter in other familiar languages like Ruby. Of course the function evaluates to the result of the last expression in the function. The argument list is actually given as one of Clojure’s built-in data types called a vector. In JS the specification of the argument list is supported by the language parser. In Clojure it is just a regular data structure that is passed to the macro. This is an important distinguishing factor of Clojure – that is, the language is homoiconic. Clojure code is actually expressed in terms of Clojure data structures.

Ok enough philosophy. What about lambda functions? Well it turns out that there are two ways to express them in Clojure. Not surprisingly one maps closely to the other. The difference is that one is implemented as a macro and is more verbose, and the other is less verbose as a result of being implemented at the reader level. What is the reader? I don’t have enough space to go into that here, but suffice it to say that, much like in Javascript when code is evaluated as the file is parsed, there are several stages at which Clojure can evaluate code other than at runtime proper. One of these times is during the ‘reading’ of the file. This feature allows us to express some commonly-used constructs very concisely as we will see in a minute.

Using the ‘fn’ macro looks like this:

```

(fn [x y] 
 (+ x y)
)

```
The same explanations that I gave above for a named function apply here. The biggest difference is (apart from having a different macro name) is that, wait for it, it doesn’t take an argument for the function name. The function definition is returned as a result of macro evaluation in both cases, but in the case of ‘defn’, ‘def’ is used to bind the result to an externally-accessible name.

We could actually mimic the behavior of ‘defn’ using a combination of ‘def’ and the lambda macro ‘fn’, as in the following code snippet:

```

(def sum (fn [x y] 
 (+ x y)
))

```
In my mind this is analogous to the Javascript example in which I used the variable assignment for to bind the function to a name:

```

sum = function( x, y) {
 return x + y;
};

```
What about the more concise version using reader macros that I alluded to earlier? Well, I’ll drop this on you, but I don’t have a very good way to explain it other than the reader sees the special sequence #( and internally converts it to the form using ‘fn’ that we saw above.

```

#(+ %1 %2)

```
That’s all there is to it. The percent characters denote the positional arguments to the function. No need to explicitly define the argument list other than to name them when used. To see what the reader produces as output we can quote the form like this:

```

'#(+ %1 %2)
(fn* [p1__297# p2__298#] (+ p1__297# p2__298#))

```
The single quote character prevents the expression from being evaluated so that we can see what it looks like first. The argument names have automatically been automatically generated to avoid conflicts (I think this is similar to the idea of ‘gensym’ in Lisp). I’m not sure what the difference between ‘fn’ and ‘fn*’ is at this point. Structurally, the generated code looks just like what we wrote in the first example using ‘fn’.

Ok so that’s lambdas. 

JS doesn’t support lazy evaluation directly in the language, but since we can do higher-order functions, I think we could fake it if we wanted to. Immutability as it exists in Clojure is just right out of the question in JS. It could be done in JS by making deep copies of every data structure every time an assignment is made, but it won’t achieve constant-time performance (O(1)) like Clojure does.

However, the idea of homoiconicity in JS is really ripe for discussion I think. Javascript’s rich object literal format (JSON, roughly speaking) allows a whole lot of the language to be expressed as data structures. Not fully though, as statements of a function are not directly expressed as JS data, but I think I’ll write a post later comparing Clojure lists and vectors to JS Objects and arrays.
