---
title: "Using Haskell with Microsoft .NET"
date: 2011-01-10T01:15:47-08:00
url: https://newcome.wordpress.com/2011/01/10/using-haskell-with-microsoft-net/
id: 1263
categories: Uncategorized
tags: 
---

# Using Haskell with Microsoft .NET

I’ve been learning some [Haskell](http://www.haskell.org/haskellwiki/Haskell) recently since I ran into people at the [Hacker Dojo](http://wiki.hackerdojo.com/w/page/25437/FrontPage) who are putting on [Haskell events](http://wiki.hackerdojo.com/w/page/32992961/Haskell-Hackathon-2011). After running through the [basic](http://www.haskell.org/haskellwiki/A_brief_introduction_to_Haskell) [tutorials](http://learnyouahaskell.com/) the first thing I like to do is to try to get it working with [another platform](http://en.wikipedia.org/wiki/.NET_Framework) that I already know well. I’ve [done this with Ruby](https://newcome.wordpress.com/2010/12/04/accessing-microsoft-crm-from-ironruby/) in the past, and it is a good way to learn your way around the new language.

The first step is to look around to see what options we have for getting Haskell to work with .NET. There isn’t (to my knowledge) a native .NET compiler for Haskell, but there are several projects that aim to provide interoperability in other ways. There is a list [here](http://www.haskell.org/haskellwiki/GHC:FAQ#Why_isn.27t_GHC_available_for_.NET_or_on_the_JVM.3F) of projects that we might be interested in, with the notable exception of [Salsa](http://www.haskell.org/haskellwiki/Salsa), which I found independently.

The [hs-dotnet](http://haskell.forkio.com/dotnet/) project is what I had the most success with, so that is the approach that I’ll feature here. The project appears to be complete enough to experiment with and has worked for what I’ve been doing so far, but there is very little documentation other than some sample code that ships with the distribution package. If you haven’t learned a little Haskell already it could be tough going initially, even with deep knowledge of the .NET platform. I’m hoping to write a later post on how to approach the basics. In the meantime let’s look at how to get the environment set up.

I’m assuming that we are starting with a fresh [Haskell Platform](http://hackage.haskell.org/platform/) installation on Windows. Hs-dotnet has a package hosted on [Hackage](http://hackage.haskell.org/packages/hackage.html), so we can use [Cabal](http://www.haskell.org/cabal/) to install it. Once the Haskell platform has been installed, the cabal binary should be in the path. Note that we’ll need administrator privileges to install hs-dotnet, as the installer will put the bridge library in the GAC.

```

(as Administrator)
> cabal install hs-dotnet

```
Once we have the package installed we can test things out in the GHC interpreter. The examples are included in the package archive, so grab it from [here](http://hackage.haskell.org/cgi-bin/hackage-scripts/package/hs-dotnet) and untar it first. Load up the environment variable test code like this:

```

> cd hs-dotnet\examples
> ghci env.hs

```
Which should give us a Prelude prompt with some code in scope that uses the .NET runtime to read the value of a system environment variable:

```

Prelude Env>

```
If the code loaded with no errors we can test it by trying to read the name of the logged in user:

```

Prelude Env> getEnv "USERNAME"

```
In my case, I had an error when I tried to run any code that called out to the .NET runtime:

```

*** Exception: NET bridge error:
 Location: static-method
 Source: System.Environment.GetEnvironmentVariable
 Kind: COM error: 0x80070002 The system cannot find the file specified.
 Description:
 Method type: (S)S

```
I’ve been working with Windows for a pretty long time and COM errors like this often are the result of a library that failed to be registered using regsvr32. The installer should have taken care of all of this so I took a look in the Cabal package to see what the installer was doing, so maybe I could manually set things up. The setup script is called Setup.hs and is in the root of the Cabal package that we just downloaded from Hackage to find the sample code.

Taking a look in Setup.hs, we can see that the library that we are interested in is called HsDotnetBridge.dll and that it both gets installed into the GAC and is registered as a COM component using regasm.exe.

```

assembly = "bridge\\HsDotnetBridge.dll"
...

gacInstall args iflags pd lbi = do
 dir <- getCurrentDirectory
 putStrLn "Registering hs-dotnet Assembly.."
 ex <- rawSystem (dir </> "gacInstaller.exe") [dir </> assembly]
 case ex of 
 ExitSuccess{} -> putStrLn "OK!"
 ExitFailure{} -> putStrLn ("Unable to register assembly...; try doing it manually via 'gacutil /i'..")
 putStrLn "Registering Assembly COM Interop classes.."
 ex <- rawSystem (dir </> "regasm.exe") [dir </> assembly]
 case ex of 
 ExitSuccess{} -> putStrLn "OK!"
 ExitFailure{} -> putStrLn ("Unable to register assembly...; try doing it manually via 'regasm'..")

```
I looked in the .NET Global Assembly Cache and didn’t see this assembly installed there, so I did it manually like this:

```

"C:\Program Files\Microsoft.NET\SDK\v2.0 64bit\Bin\gacutil.exe" -i HsDotnetBridge.dll

```
Re-running the test as above now worked as follows:

```

Prelude Env> getEnv "USERNAME"
"dan"

```
Getting the environment set up is just the first step in calling your .NET code from Haskell. In order to call any arbitrary code, we’ll have to use a code generation tool to create Haskell wrappers for it. This is an unfortunate extra complexity but it is relatively easy since the supplied tools will automatically handle any dependencies for you, provided that they can be found in the .NET GAC. Stay tuned for more on this.
