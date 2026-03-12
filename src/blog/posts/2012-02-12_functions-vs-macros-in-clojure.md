---
title: "Functions vs macros in Clojure"
date: 2012-02-12T12:13:38-08:00
---

# Functions vs macros in Clojure

In my third post on the [Clojure programming language](http://clojure.org) I’m going to cover macros. I have a function that I converted to my very first macro in Clojure. I’m going to tell the story here, because it sort of made macros a lot less scary.

To begin the story, let’s consider a block of code that I wrote to write some data out to a file. I’ve changed the data to a simple foo=”bar” key-value pair for the sake of this discussion. Here is the code:

```

(use 'clojure.java.io)
(with-open [wrtr (writer "foo.out")]
 (.write wrtr (str {:foo "bar"})))

```
For those unfamiliar with Clojure idioms, the ‘with-open’ function is a way to open a file using an underlying Java OutputStream and automatically close it when we are finished. The OutputStream is created in the ‘let’ mapping vector with the ‘writer’ function. This is very similar to the ‘using’ construct in C#. In C# we would have said something like:

```

using(FileStream fs = new FileStream( "foo.out", FileMode.Append, FileAccess.Write ) {
 ... // use fs here ...
} // fs is disposed once we leave the scope

```
Here, inside the ‘using’ statement’s resource acquisition section, we create the FileStream. Similarly, in the binding form we are creating a variable binding wrtr that is bound to the OutputStream returned by the ‘writer’ function.

So my next step in this process was to create a function that took another function and a filename. I wanted the function to be able to evaluate the given function and write the results to a new file with the given name. Here is my first attempt:

```

(defn write-results-to-file [fn name]
 (with-open [wrtr (writer name)]
 (.write wrtr (str(fn)))))

```
Here is an example usage:

```

(write-results-to-file #(str "<?xml version='1.0'?>" "<root><child>txt</child></root>") "foo.out")

```
That’s a little bit contrived, as we use ‘str’ to do a string concatenation as our function. But if we think that maybe we’d end up with a function like ‘create-xml-preamble’ to spit out the XML processing instruction for us, it makes more sense.

So what does this have to do with macros? Notice when I used the above function, in order for it to work correctly I had to structure my first argument as a lambda function. Take another look at the reader macro form used – #(). This takes the contents and wraps it in an anonymous function definition.

From experience we know that other Clojure forms like ‘if’ are able to take blocks of code and treat them as separate functions, so there must be a way for us to write something like:

```

(write-results-to-file (str "<?xml version='1.0'?>" "<root><child>txt</child></root>") "foo.out")

```
The only difference is that we can just use a normal clojure form as the first argument, without creating a lambda function. Ordinarily Clojure will evaluate ‘str’ before ‘write-results-to-file’ so we’ll end up trying to evaluate a string, giving us an error like:

```

ClassCastException java.lang.String cannot be cast to clojure.lang.IFn user/eval12 (NO_SOURCE_FILE:16)

```
So let’s try to write a macro. For the first attempt I just took my function and put the body into the macro quoted with backtick:

```

(defmacro write-to-file-macro [fn name]
 `(with-open [wrtr# (writer ~name)]
 (.write wrtr# (str(~fn))))
)

```
It looks just like the function but the body is quoted so it won’t be evaluated right away. The variable names need to be unquoted so that they can be replaced by actual values when the macro is expanded. This is done using tilde in front of the variables. Also there is one other small thing – the free variables used are appended with hashes. ‘wrtr’ becomes ‘wrtr#’. This is done to create unique symbols and is a shortcut for calling ‘gensym’. Otherwise we could possibly have redefinitions of those symbols.

So, let’s use the macro.

```

(write-to-file-macro #(str "" "txt") "foo.out")

```
We still have to pass a lambda in. What gives? All we have to do now is use a different unquoting method:

```

(defmacro write-to-file-macro2 [fn name]
 `(with-open [wrtr# (writer ~name)]
 (.write wrtr# (str (~@fn))))
)

```
Note that the only difference is that we use ~@fn instead of ~fn. This causes the argument to be spliced inline. Expanding the two macros looks like this:

```

(macroexpand-1 '(with-write-to-file #(str "f") "foo.out"))

(clojure.core/with-open [wrtr__12__auto__ (clojure.java.io/writer foo.out)] (.write wrtr__12__auto__ (clojure.core/str ((fn* [] (str f))))))

```
```

(macroexpand-1 '(with-write-to-file2 #(str "f") "foo.out"))

(clojure.core/with-open [wrtr__18__auto__ (clojure.java.io/writer foo.out)] (.write wrtr__18__auto__ (clojure.core/str (fn* [] (str f)))))

```
It’s hard to see but the only difference between the two is that the ‘fn’ argument in the second one is not in its own list, that is, there is one fewer set of parentheses.

I noticed that the macros in the Clojure source code are constructed using ‘list’ rather than quoted templates. In some cases it can be cleaner. Here is the ‘when’ macro:

```

(defmacro when
 "Evaluates test. If logical true, evaluates body in an implicit do."
 [test & body]
 (list 'if test (cons 'do body)))

```
