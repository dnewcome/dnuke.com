---
title: "Parser jockeying &#8211; writing little languages in OMeta"
date: 2011-07-03T17:18:17-08:00
---

# Parser jockeying &#8211; writing little languages in OMeta

Writing domain-specific languages is something that I’ve been interested in for quite some time. I’ve done a few internal DSLs for various projects in the past including CrmQuery and one XML-based application definition language that is sadly not open-source.

As nice as internal DSLs are, limitations of the host language are always limiting factors in how flexible and expressive you can get in your DSL. Since an internal DSL is written in terms of the host language, and apart from some ad-hoc string-wrangling is limited by what can be expressed in the host language. Writing external DSLs can break us free from these limitations, but there are typically a lot of steps between defining your language and having an implementation to play with.

Fortunately, most desired DSL grammars are pretty simple, and there are PEG (parser expression grammar) based tools that can simplify the process of defining and using an external DSL in your project.

One tool that I’ve played with in the past was [SPART](http://www.codeproject.com/KB/recipes/spart.aspx), which is a small parser generator written in C#. SPART allows you to define a parser directly in C# code and then parse text with it without any intermediate steps such as code generation and compilation a-la Flex/Bison. Unfortunately SPART does not give us a nice grammar expression language, and we have to build the parse tree manually based on callbacks executed by the parser as it runs.

Tools like ANLTR give you a lot of options when it comes to defining your grammar, but unfortunately it takes a bit of setup and tooling to get a full toolchain running. This is fine for doing heavy language development, but when we want to implement a small DSL, possibly within the scope of another larger project, we don’t want to have the complexities of the DSL outweigh the potential benefits within the target application.

Recently, I found out about OMeta, an object-oriented language for pattern matching. This is a meta language that allows terse definition of parsers by expressing them in terms of pattern matching expressions. I’ve seen hand-built parsers implemented using a similar idea but with regular expressions. OMeta codifies the idea of using pattern-matching expressions and result transformations into a nice little grammar language that reads like a PEG grammar but has some OO capabilities as well as some target language integration as we’ll see in the Javascript examples later in this article.

OMeta provides a Javascript implementation, which is particularly interesting, since apart from my focus on JS as a language, allows JS itself as the target language. That is, the DSL can be compiled directly into javascript code that can be evaluated directly.

I’m going to get into a few examples that differ from the canonical “calculator language” examples that are used often when demonstrating a parser generator. For example, the prototype language used in the OMeta documentation does not handle parsing any textual identifiers and ignores the issue of whitespace completely, which are essential for building any useful grammar in my opinion, so I’m going to use the example of parsing RDF statements in Turtle format.

Before I go on, note that all of the examples can be run online using the [OMeta online workspace](http://www.tinlizzie.org/ometa-js). I’m omitting some boilerplate code for running the samples, but they can be run using the following snippet:

```

ometa Parser {
 // comma separated list of rules goes here
}
Parser.matchAll(
 '', // literal code string to parse 
 'myRule' // name of toplevel rule as string
);

```
Let’s say that in our DSL, we’d like to have the ability to parse RDF triple statements in the form used in N3/Turtle:

```

subj1 pred1 obj1 .
subj2 pred1 obj2 .

```
How would we write a parser that can handle this input? The general form of the input (implicit in the example above) is that we have a list of expressions consisting of three elements and a terminator. The terminator is a period and elements are separated by whitespace. It isn’t clear whether whitespace is optional before the terminator from what I’ve given above, so let’s say that it is insignificant. However, whitespace between elements is obviously significant, as if it were omitted, we’d not be able to distinguish the boundary between elements.

At a high level, we’d have something like:

```

expressionList = [ expression-1, expression-2, ... expression-n ]

```
where each expression is something like this:

```

expression = [ element1 element2 element3 terminator ]

```
At a very high level, this appears to codify the structure of the input text we’d like to parse. However, there are some missing low-level details here, namely how to handle whitespace and what constitutes an element. 

Intuitively, we know how whitespace should be handled, but we will need to encode this explicitly into the grammar, unfortunately. Also, the exact definition of an element token will need to be defined as well.

What is whitespace? Traditionally we’d consider the space and tab characters along with line breaks to be significant whitespace. These are all things that, when present can potentially delimit tokens in the input stream, or depending on their position, be semantically insignificant. For example, a trailing space on a line or two spaces in a row. In most grammars one of the whitespace characters is not significant. How do we encode this?

Fortunately OMeta includes a way to say that some element must occur once but may occur many times. This is the ‘+’ character. We’ll be using this along with the ‘*’ character which says that the element doesn’t have to occur at all, but if it does it may occur many times. These options are described on p12 of the OMeta author’s [thesis paper](http://www.vpri.org/pdf/tr2008003_experimenting.pdf).

So in order to implement our simple matching language outlined above, we have to figure out how to define whitespace and how an element is defined. OMeta gives us a builtin rule for matching an alphabetic character, letter. So we can say the following:

```

token = letter+:x -> x

```
We’ve combined several concepts together in order to define a token. This pattern will match any alphabetic input sequence. The output will be a list of letters in the form:

```

[c1, c2, c3 ]

```
We have used the variable binding colon syntax to bind the letter to x.

It’s worth noting that the default result of a rule is a Javascript array. In our case we’ll end up with an array of single characters as the rule is written. In our DSL, we’ll probably not want nor need individual access to each character in a token in the resulting parse tree, so we can write the rule to join the characters like this:

```

token = letter+:x -> x.join('')

```
Now we are starting to see the expressive power of the language.

Let’s take the next step and build up an expression. We’ll add a rule that references the token rule to build an expression. For now we’ll just say that an expression is an unbounded number of tokens. We’ll add the terminator in just a few minutes.

```

token = ws* letter+:x -> x.join(''),
exp = token+:x -> x

```
Now when we try to match something like:

```

subj obj pred

```
We get just

```

[subj]

```
What is happening here? Well if it wasn’t obvious from my previous hints, it has to do with whitespace. The first token is terminated by the whitespace since the ‘letter’ rule doesn’t match a space character. However, the space is not consumed, so the next rule must match it. So we either have to consume whitespace as part of the token, or account for it in the expression, or even both (but that seems messy). Let’s define whitespace like this:

```

ws = ' ' | '\t' | '\n'

```
This takes care of space, tab and newline. We can put this into the grammar using the star operator that I talked about earlier, making multiple occurrences match and making non-semantically meaningful whitespace optional.

```

token = ws* letter+:x -> x.join(''),
exp = token+:x -> x,
ws = ' ' | '\t' | '\n'

```
Now we can match the following source text:

```

subj pred obj

```
as:

```

[subj, pred, obj]

```
Now we are getting close.

In order to support a list of expressions, we need to introduce another rule and introduce the expression termination character. So we add a literal “.” to the expression rule and add a new rule called “list”:

```

token = ws* letter+:x -> x.join(''),
exp = token+:x '.' -> x,
list = exp+:x -> x,
ws = ' ' | '\t' | '\n'

```
Now we can match source code that looks like this:

```

sub pred preddd obj. 
subject predicate object.

```
Notice that there are still some undesirable characteristics of our language here. For one, there can be no whitespace before the statement terminator. We’ll have to add the optional whitespace explicitly to our grammar. Also, there is nothing to prevent us from adding more than three items to our statements. This is not supported in RDF, and in order to enforce this constraint we’ll have to rewrite our grammar slightly. Also, I’d like to support tokens containing numbers, and the way the grammar is currently written, numerical characters in a token will cause the termination of the token rule, and will not be matched in any subsequent rules, causing a subtle parsing bug. These are some of the reasons that writing parsers is particularly tricky. We can express what we want easily, but in order to cover all that is possible and valid things get much more difficult.

I’ll continue this exploration in a set of future posts, but in the meantime you should check out the [OMeta workspace](http://www.tinlizzie.org/ometa-js) and play around with it.
