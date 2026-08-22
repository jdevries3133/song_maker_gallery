# Backup/Restore Playbook
## Song Maker Gallery

---

## Backup

```bash
make backup-prod
```

Creates: `~/Desktop/db_backups/song_maker_gallery_backup-MM-DD-YYYY__HH:MM:SS.sql`

---

## Restore

```bash
kubectl exec -n songmaker -i pod/db-postgresql-0 -- psql -U songmaker -d songmaker < ~/Desktop/db_backups/YOUR_BACKUP_FILE.sql
```
