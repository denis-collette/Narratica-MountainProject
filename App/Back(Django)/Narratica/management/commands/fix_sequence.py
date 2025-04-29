from django.core.management.base import BaseCommand
from django.db import connection

class Command(BaseCommand):
    help = "Fix all sequences in the database by resetting them to max(id) + 1."

    def handle(self, *args, **kwargs):
        with connection.cursor() as cursor:
            # Get all sequences and their related tables/columns
            cursor.execute("""
                SELECT
                    sequence_name,
                    table_name,
                    column_name
                FROM
                    information_schema.sequences seq
                JOIN
                    information_schema.columns col
                    ON col.table_name = seq.sequence_name
                WHERE
                    column_name = 'id'
                """)
            
            # If the above fails due to the JOIN, use a more PostgreSQL-specific approach:
            cursor.execute("""
                SELECT
                    seq.relname AS sequence_name,
                    tab.relname AS table_name,
                    att.attname AS column_name
                FROM
                    pg_class seq
                JOIN
                    pg_depend dep ON dep.objid = seq.oid
                JOIN
                    pg_class tab ON dep.refobjid = tab.oid
                JOIN
                    pg_attribute att ON att.attrelid = tab.oid AND att.attnum = dep.refobjsubid
                WHERE
                    seq.relkind = 'S'
                    AND att.attname = 'id';
            """)

            sequences = cursor.fetchall()
            if not sequences:
                self.stdout.write(self.style.WARNING("No sequences found to fix."))
                return

            for seq_name, table_name, column_name in sequences:
                cursor.execute(f'SELECT MAX({column_name}) FROM "{table_name}";')
                max_id = cursor.fetchone()[0] or 0
                next_id = max_id + 1

                cursor.execute(f'ALTER SEQUENCE "{seq_name}" RESTART WITH {next_id};')
                self.stdout.write(self.style.SUCCESS(
                    f'Reset sequence "{seq_name}" for table "{table_name}" to {next_id}.'
                ))
