---
title: "Functional programming and the death of the Unix Way"
date: 2012-03-06T01:54:41-08:00
---

# Functional programming and the death of the Unix Way

Small tools, each doing one thing well, has been the call of the Unix Way since its inception some 40 years ago. However, if you look at even the basic tools that ship with a modern Unix (Linux, BSD) many of them have an abundance of options and layers of additional functionality added over the years.

Every time I have to use anything but the well-worn options of tools like tar and sed I’m reminded of how deep some of these tools really are. Not only are they deep but often times there are a dizzying number of ways to do the same thing and sometimes the only way to do what you really need is more complex than it should be. Take a look at the man page for something supposedly simple like find and check out how many options there are.

Case in point, despite the simplicity of Unix’s plain text output of nearly every standard tool, it can be quite complex to parse that text into a format that you want. Often times I’ll want to grab just one part of a command’s output to use for the input of another command. Sometimes I can use grep to do this, and sometimes grep isn’t quite flexible enough and sed is required. The regular expression required to get sed to do the right thing is often complex on its own, and of course the flags need to be set appropriately. If the data format is in columns, sometimes cut can be simpler.

With this in mind, it seems like the promise of the Unix Way has been lost. When questioned about this very topic, the one and only Rob Pike has been quoted as saying “Those days are dead and gone and the eulogy was delivered by Perl.” With the admission that a more cohesive general-purpose environment is more suited to modern computing, one wonders if the idea of small tools is at fault or whether the sands of time have simply diluted the initial simplicity of the Unix environment. In my view, Perl is hardly a model of cohesion or simplicity, so to say that it improves upon the standard Unix tools is particularly damning.

What would a programming environment look like that embodies the original ideals of the Unix Way? An environment of easily composable tools that perform extremely general but specific functions? The answer is right there in the question merely by the mention of “functions” and “composable”. Modern functional programming languages such as Clojure and Haskell are the closest thing we have to what Unix was intended to be.

Clojure, like most Lisp-like functional languages, is a small kernel with most of the language built up in itself. The idea is that small primitive functions, each doing something basic, are combined to form higher-level functions until finally we have implemented the entire language. Functions in Clojure are inherently composable. That is, like the Unix tools, functions can be combined together to perform more complex tasks. The flexibility of the macro language even allows pipe-like syntax operators so that functions can be composed left-to-right.

Beyond what functional languages give us to mimic Unix, they far surpass it in the flexibility of the data output. Instead of plain text output we have data structures like lists and maps that are easily traversed to transform the data into what we need for the next step of the operation. 

However, despite all of the advantages of functional languages, I still write shell scripts. Why? They are the most immediate way to interact with the OS. Unfortunately, languages like Clojure are cumbersome to use to do something quick and dirty. Even Perl can be tricky due to the sheer size of the language and the possibility of module dependencies. Microsoft had a good start with its Powershell programming language in that data is output as parseable object rather than plain text, but it is marred by PHP/Perl-like syntax and procedural focus. Doing many things requires knowledge of .NET and cumbersome syntax to integrate it into the shell.

I’m not advocating a return to Lisp machines here. We tried that and it didn’t work. Symbolics is dead, and no one even gave a eulogy at that funeral. Plan 9 OS never took off, probably because it’s too abstract and elitist. I do think that revisiting some of what we consider Unix gospel is worthwhile though. What if we keep the good – “small tools that do one thing well” – and change one or two not so good things – “everything is plain text, everything is a file”? What if we said that all command output was an S-expression (data list) and that instead of files to interact with the kernel, we had functions or S-expressions? For that matter, for the sake of argument, what if everything was JSON? Maybe getting data from the kernel process list was the act of mapping a function over that data structure?

I think that a lot of progress could be made in by applying some ideas of functional programming to the standard Unix way of computing.
