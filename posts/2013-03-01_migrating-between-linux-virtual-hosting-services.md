---
title: "Migrating between Linux virtual hosting services"
date: 2013-03-01T01:27:28-08:00
url: https://newcome.wordpress.com/2013/03/01/migrating-between-linux-virtual-hosting-services/
id: 1852
categories: Uncategorized
tags: 
---

# Migrating between Linux virtual hosting services

I’ve been shuffling my sites around lately, canceling some virtual machines that I don’t use much and consolidating sites that get less traffic onto cheaper hosting. I’m mostly using Apache and MySql on these sites along with Node.js. I’m looking at moving to Nginx in front of the Node.js sites though.

Anyway, most of the work here is moving what is in the web content directories and my MySql database directories.

```

$ sudo service mysql stop
$ tar cf ~/mysql-bak.tar /var/lib/mysql
$ tar cf ~/www-bak.tar /var/www
$ tar cf ~/apache-config.tar apache2

```
On the new server we need at least MySql and Apache

```

# sudo apt-get install mysql-server
# sudo apt-get install apache2

```
I was able to copy my previous Apache configuration over from the old server and reuse it. I copied the symlinks for sites-enabled and mods-enabled, which was pretty nice.

I used to install node.js from source, but this time around I installed from apt. I figure Node is more stable now, so I’ll give it a shot. Same with NPM.

```

# apt-get install nodejs
# apt-get install npm

```
I had to symlink the nodejs binary in order to get it working with forever:

```

# ln -s /usr/bin/nodejs /usr/bin/node

```
However forever still isn’t working for me. It’s looking for daemon.js, which I installed using npm.

```

Error: Cannot find module './daemon.v0.6.19'

```
I had to grant all privileges on my MySql databases instead of just CRUD stuff like I used to. I’m not sure why this is yet.

All in all, moving a Linux VPS isn’t too bad if you can reuse most of the configuration. More on this later.
