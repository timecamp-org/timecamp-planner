### Development

#### Backend Development

The backend code is mounted as a volume, so changes will be reflected after rebuilding:

```bash
# Rebuild backend after code changes
docker-compose up --build backend

# Or restart the backend service
docker-compose restart backend
```

#### Frontend Development

The frontend runs in development mode with hot-reload enabled. Changes to source files will automatically trigger rebuilds.

#### Push notifications (ntfy)

- Local config example: `frontend/tools/NOTES/default-dev-config.js-put-this-in-root/config.js`
- Test publish/subscribe: `backend/bin/ntfy-test.sh`

### Troubleshooting

**Port already in use:**
- Ports are mapped to avoid conflicts: Frontend uses 3002 (instead of 3000), Database uses 5433 (instead of 5432)
- Stop any local instances if you need the standard ports
- Or modify port mappings in `docker-compose.yml`

**Database connection errors:**
- Wait for the database to be fully initialized (check logs: `docker-compose logs db`)
- Ensure the `init-db.sh` script ran successfully

**Backend won't start:**
- Check backend logs: `docker-compose logs backend`
- Verify database is healthy: `docker-compose ps`
- Try rebuilding: `docker-compose up --build --force-recreate backend`
