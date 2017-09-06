#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <sqlite3.h>
#include <assert.h>
#include <malloc.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <unistd.h>
#include <fcntl.h>


/*
** Print the most recent database error for database db to standard error.
*/
static void databaseError(sqlite3* db){
  int errcode = sqlite3_errcode(db);
  const char *errmsg = sqlite3_errmsg(db);
  syslog(LOG_DEBUG, "Database error %d: %s\n", errcode, errmsg);
}

/*
** Read a blob from database db. Return an SQLite error code.
*/ 
static int readBlob(
  struct pool *p,
  sqlite3 *db,               /* Database containing blobs table */
  const char *name,          /* Null-terminated key to retrieve blob for */
  unsigned char **pzBlob,    /* Set *pzBlob to point to the retrieved blob */
  int *pnBlob                /* Set *pnBlob to the size of the retrieved blob */
){
  const char *zSql = "SELECT value FROM THUMB_DB WHERE name = ?";
  sqlite3_stmt *pStmt;
  int rc;

  /* In case there is no table entry for key name or an error occurs, 
  ** set *pzBlob and *pnBlob to 0 now.
  */
  *pzBlob = 0;
  *pnBlob = 0;

  do {
    /* Compile the SELECT statement into a virtual machine. */
    rc = sqlite3_prepare(db, zSql, -1, &pStmt, 0);
    if( rc!=SQLITE_OK ){
      return rc;
    }

    /* Bind the key to the SQL variable. */
    sqlite3_bind_text(pStmt, 1, name, -1, SQLITE_STATIC);

    /* Run the virtual machine. We can tell by the SQL statement that
    ** at most 1 row will be returned. So call sqlite3_step() once
    ** only. Normally, we would keep calling sqlite3_step until it
    ** returned something other than SQLITE_ROW.
    */
    rc = sqlite3_step(pStmt);
    if( rc==SQLITE_ROW ){
      /* The pointer returned by sqlite3_column_blob() points to memory
      ** that is owned by the statement handle (pStmt). It is only good
      ** until the next call to an sqlite3_XXX() function (e.g. the 
      ** sqlite3_finalize() below) that involves the statement handle. 
      ** So we need to make a copy of the blob into memory obtained from 
      ** malloc() to return to the caller.
      */
      *pnBlob = sqlite3_column_bytes(pStmt, 0);
      *pzBlob = (unsigned char *)palloc(p, *pnBlob);
      memcpy(*pzBlob, sqlite3_column_blob(pStmt, 0), *pnBlob);
    }

    /* Finalize the statement (this releases resources allocated by 
    ** sqlite3_prepare() ).
    */
    rc = sqlite3_finalize(pStmt);

    /* If sqlite3_finalize() returned SQLITE_SCHEMA, then try to execute
    ** the statement all over again.
    */
  } while( rc==SQLITE_SCHEMA );

  return rc;
}
