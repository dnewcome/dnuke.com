---
title: "Database connection anti-patterns"
date: 2009-03-26T16:37:31-05:00
url: https://newcome.wordpress.com/2009/03/26/database-connection-anti-patterns/
id: 185
categories: Uncategorized
tags: 
---

# Database connection anti-patterns

I was looking back at some older code in our codebase, and found one class that created a database connection for its own internal use. This is a Windows service, and we are creating a database connection in the OnStart event handler of the service:

```
 protected override void OnStart(string[] args) {
 ms_logger.Info( "OnStart(): Service started" );
 LoadAppConfig();
 try {
 DatabaseConnect();
 ms_logger.Info( "OnStart(): Connected to database" );
 }
 catch( Exception ex ) {
 ms_logger.Error( "OnStart(): Error connecting to database: ", ex);
 }
 SetupTimer();
 }
```
At first blush this may seem reasonable. We want to connect to the database when the service starts.  However there are several code smells in the implementation:

```
 /**
 * Create a sql connection and open it. Depends on app.config settings
 */
 private void DatabaseConnect() {
 m_sqlConnection = new SqlConnection();
 m_sqlConnection.ConnectionString = ConfigurationManager.AppSettings["keyConn"];
 m_sqlConnection.Open();
 }
```
First, this is sort of a black box method. It mutates the class state by setting a private member, which is not evident by looking at the method signature. Also, we directly access some implicit configuration information via System.Configuration.ConfigurationManager here. Thirdly, we open the database connection as soon as we create it, another thing that is not evident to callers by looking at the method interface. And finally we are explicitly using SqlConnection, where it may be better to return IDbConnection so that we could change the underlying database without affecting the callers.

The refactored method might look like this:

```
 private IDbConnection CreateDatabaseConnection( string in_connectionString ) {
 return new SqlConnection( in_connectionString );
 }
```
I know this is very simple, but seeing this in my own code later on makes me realize that we all have habits that we can improve. If you don’t see things in your old code that you could do better, maybe you aren’t improving much as a programmer.
