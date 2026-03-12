---
title: "Clojure and the Classpath"
date: 2012-02-16T11:08:13-08:00
---

# Clojure and the Classpath

Since Clojure is built on Java, and Java depends on the classpath to find code that it wants to load and execute, we are stuck using the Classpath when we run Clojure code.

Usually we use [Leiningen](https://github.com/technomancy/leiningen); to manage the Classpath. “Lein” as we’ll call it from now on, uses a small Clojure file as a configuration file. This file is called project.clj.

Project.clj defines the code locations for Clojure as well as declaring the external dependencies. These dependencies are kept in a lib/ folder under the project path.

All of this stuff is great when it’s set up the way you want it. However, I’ve recently wanted to be able to fire up the Clojure read-eval-print loop (REPL) on random code at will in the project. Typically we’d be able to use Lein to run code like this, but you need a “main” function defined. I don’t want to keep redefining this function in the project.clj file over and over.

What I want to be able to do is call clojure on a source file and load it, dropping immediately into the REPL.

```

$ clojure foo.clj

```
This is likely to go down in flames if there are any external dependencies. In my case I wanted to get all of the jar files into the classpath that are currently under lib/. To do this we can use a shell script like the following:

```

$ find ../lib -exec echo -n {}: \;

```
Which gives us something like:

```

../lib:../lib/commons-collections-3.2.1.jar:../lib/jsr305-1.3.9.jar:../lib/snakeyaml-1.8.jar:

```
We could probably use bash globs too and say something like this on the classpath without having to construct it as above but I haven’t tested this:

```

../lib/*

```
As a side note, this is what my Clojure launch script looks like. It is essentially the same script you get when installing clojure on Ubuntu, but I’ve added ‘rlwrap’ so that I get GNU Readline functionality in the Clojure REPL. This gives you things like command history, which I find to be invaluable.

```

exec rlwrap java -cp /usr/share/java/clojure.jar clojure.main "$@"

```
To use the classpath script I’m just setting the CLASSPATH environment variable in front of the clojure execution.

```

CLASSPATH=`./classpath.sh`./:../resources clojure program.clj

```
Another note on the classpath is that I have added ./resources to the path. This happens to be a location where some Java .properties files are kept. These configuration files are read from a “well known location” by the Java runtime, which basically means that the Classpath is searched to find them. So we add this folder to the classpath.

So this still doesn’t get us into the REPL. It will load the file and drop back to the shell.

We could load the file manually from the REPL like this:

```

user=> (load-file "program.clj")
#'program/start

```
This shows us that the file has been loaded and that the function “program/start” has been defined. We can then call it using:

```

user=> (program/start)

```
So I don’t know how to avoid this manual step yet. Using clojure -r doesn’t seem to work. This should drop you into the REPL, but apparently it ignores the file when given.

One solution would be to write a small clojure script that takes the argument and loads the file and drops you into the REPL. I’ll save that for next time.
