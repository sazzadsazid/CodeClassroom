# CodeClassroom Backend

## PostgreSQL Database Setup

This project uses PostgreSQL for the database. A Docker Compose configuration is provided to quickly spin up a development database.

### Start the Database

To start the PostgreSQL database in the background, navigate to the `backend` directory and run:

```bash
docker compose up -d
```

### Stop the Database

To stop the running database container, run:

```bash
docker compose down
```

The database data is persisted using a Docker volume, so your data will survive container restarts.
