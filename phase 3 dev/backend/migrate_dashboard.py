import sqlite3

conn = sqlite3.connect("skillbridge.db")
cur = conn.cursor()

def add_column(table, column, definition):
    columns = [row[1] for row in cur.execute(f"PRAGMA table_info({table})")]
    if column not in columns:
        cur.execute(f"ALTER TABLE {table} ADD COLUMN {column} {definition}")
        print(f"Added {table}.{column}")

try:
    # QUIZ RECORDS
    add_column("quiz_records", "student_key", "TEXT NOT NULL DEFAULT ''")
    add_column("quiz_records", "skill", "VARCHAR(100)")
    add_column("quiz_records", "total_questions", "INTEGER DEFAULT 0")
    add_column("quiz_records", "correct_answers", "INTEGER DEFAULT 0")
    add_column("quiz_records", "attempted_at", "DATETIME")

    cur.execute("""
        UPDATE quiz_records
        SET student_key = (
            SELECT student_key FROM students
            WHERE students.id = quiz_records.student_id
        )
        WHERE student_key = ''
    """)

    cur.execute("""
        UPDATE quiz_records
        SET skill = topic,
            total_questions = COALESCE(total, 0),
            attempted_at = COALESCE(attempted_at, datetime('now'))
    """)

    # PROJECT RECORDS
    add_column("project_records", "student_key", "TEXT NOT NULL DEFAULT ''")
    add_column("project_records", "skills_used", "TEXT DEFAULT ''")
    add_column("project_records", "project_url", "VARCHAR(500) DEFAULT ''")
    add_column("project_records", "status", "VARCHAR(50) DEFAULT 'Completed'")
    add_column("project_records", "created_at", "DATETIME")

    cur.execute("""
        UPDATE project_records
        SET student_key = (
            SELECT student_key FROM students
            WHERE students.id = project_records.student_id
        )
        WHERE student_key = ''
    """)

    cur.execute("""
        UPDATE project_records
        SET skills_used = COALESCE(skills, ''),
            project_url = COALESCE(project_url, ''),
            status = COALESCE(status, 'Completed'),
            created_at = COALESCE(created_at, datetime('now'))
    """)

    # ACHIEVEMENTS
    add_column("achievements", "student_key", "TEXT NOT NULL DEFAULT ''")
    add_column("achievements", "code", "VARCHAR(100)")
    add_column("achievements", "title", "VARCHAR(150)")
    add_column("achievements", "earned_at", "DATETIME")

    cur.execute("""
        UPDATE achievements
        SET student_key = (
            SELECT student_key FROM students
            WHERE students.id = achievements.student_id
        )
        WHERE student_key = ''
    """)

    cur.execute("""
        UPDATE achievements
        SET code = 'legacy-' || id,
            title = badge_name,
            earned_at = COALESCE(earned_at, datetime('now'))
    """)

    # Verify student mappings before committing
    for table in ["quiz_records", "project_records", "achievements"]:
        missing = cur.execute(
            f"SELECT COUNT(*) FROM {table} WHERE student_key = ''"
        ).fetchone()[0]

        if missing:
            raise Exception(
                f"{table} has {missing} records without a student key"
            )

    conn.commit()
    print("\nSUCCESS: Database migration completed!")
    
except Exception as error:
    conn.rollback()
    print("\nMigration failed:", error)
    raise

finally:
    conn.close()
