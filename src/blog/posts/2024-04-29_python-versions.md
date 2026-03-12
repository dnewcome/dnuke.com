---
title: "Python versions"
date: 2024-04-29T14:52:14-08:00
---

# Python versions

I’m a little slow on the uptake with version management of language runtimes and environments. For a long time I just followed the Linux distribution convention of global versions of dependencies and compiler versions for my system. This changed during my years doing NodeJS development where the language and tools were changing daily it seemed. Node Version Manager and `n` saved the day back then.

I wrote a bunch of Python after that. The shop still used Python 2 because it was during the years where the breaking changes of Python 3 were slow to propagate through the open source world of dependencies in the Python Package Manager ecosystem. So I think I had the same old version of Python globally installed for my whole time there.

Fast forward a bit and we are in a place where running everything in a Docker container is the norm. Old habits die hard and it took me a while to embrace this over the convenience of having local tooling installed on my development workstation.

Ok that was a long preamble to a post I’m writing so I remember the best way to get Python 2 and 3 virtual environments both installed at the same time on my workstation.

Virtual environments are the way. The complication is that the canonical way of creating virtual environments in Python 3 that has been serving me well is not part of Python 2. Prior to `venv` we had the `virtualenv` tool. So I will go through that here as well.

## Python 3

I will start with Python 3 since that’s mostly what I’m using now and it’s comparatively easy with respect (and retrospect) to Python 2. Python 3 comes with built-in support for virtual environments using 

$ python3 -m venv envname

This command will create a folder in the current directory called `envname` . The folder will have linked versions of python and related tools along with a local folder for installing dependencies. This environment must be activated before use. We can do that using

$ source envname/bin/activate

After that the virtual environment is active and any subsequent calls to pip will install dependencies locally under the environment folder.

I will admit to installing Python 3 on my Mac the lazy way with `brew`. Debates abound on using package managers to install development tools. I tend to prefer using the package manager unless I have an advanced use case for needing to be flexible and work in many codebases that might be using different configurations. It turns out that `pyenv` is able to install both Python 2 and Python 3 so I might start using that to install my Python 3 version as well.

## Python 2

Python 2 is a little more involved. I used `pyenv` to install Python 2 like this:

$ pyenv install 2.7.18

Once installed it’s in a folder in your home directory

~/.pyenv

So now the trick is to create a virtual environment with a version of python in this directory. To do this we use `virtualenv`.

$ brew install virtualenv

$ brew install python-virtualenv

I’m not actually sure if we need both of these.

$ pyenv virtualenv 2.7.17 envname

$ pyenv activate envname

$ python –version

Python 2.7.18

Yay it’s working. So for my future self, I think I will install all Python versions including Python 3 with `pyenv`. But this works too.
