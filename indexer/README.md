# Directry Indexer

Takes entries in Postgres index entries DB and turn them into a searchable Lucene index. This Lucene index is then intended to be used as candidate generation for the search process.

## Run

To run, copy `config.sample.json` into `config.json` and fill in the correct Postgres DB connection parameters. Then run the following:

```
$ ./generate-index.sh
```

This will output an index at `directory-index` in this folder. An argument can be given to specify the output path:

```
$ ./generate-index.sh PATH
```
