import json
import os
import psycopg2  # noqa: psycopg2-binary in requirements.txt

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def handler(event: dict, context) -> dict:
    """Управление заселением игроков в комнаты ЖК Мафия."""
    if event.get("httpMethod") == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Max-Age": "86400",
            },
            "body": "",
        }

    method = event.get("httpMethod", "GET")
    cors = {"Access-Control-Allow-Origin": "*"}

    # GET /rooms — список всех заселённых комнат
    if method == "GET":
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            "SELECT room_number, player_nickname, player_avatar, player_role, checked_in_at "
            "FROM rooms ORDER BY room_number"
        )
        rows = cur.fetchall()
        cur.close()
        conn.close()
        rooms = [
            {
                "room_number": r[0],
                "player_nickname": r[1],
                "player_avatar": r[2],
                "player_role": r[3],
                "checked_in_at": r[4].isoformat() if r[4] else None,
            }
            for r in rows
        ]
        return {"statusCode": 200, "headers": cors, "body": json.dumps({"rooms": rooms})}

    # POST /rooms — заселить игрока в комнату
    if method == "POST":
        body = json.loads(event.get("body") or "{}")
        room_number = body.get("room_number")
        nickname = body.get("nickname", "")
        avatar = body.get("avatar", "")
        role = body.get("role", "")

        if not room_number or not nickname:
            return {"statusCode": 400, "headers": cors, "body": json.dumps({"error": "room_number and nickname required"})}

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO rooms (room_number, player_nickname, player_avatar, player_role) "
            "VALUES (%s, %s, %s, %s) "
            "ON CONFLICT (room_number) DO UPDATE "
            "SET player_nickname=%s, player_avatar=%s, player_role=%s, checked_in_at=NOW()",
            (room_number, nickname, avatar, role, nickname, avatar, role),
        )
        conn.commit()
        cur.close()
        conn.close()
        return {"statusCode": 200, "headers": cors, "body": json.dumps({"ok": True, "room_number": room_number})}

    # DELETE /rooms — выселить игрока из комнаты
    if method == "DELETE":
        body = json.loads(event.get("body") or "{}")
        room_number = body.get("room_number")
        if not room_number:
            return {"statusCode": 400, "headers": cors, "body": json.dumps({"error": "room_number required"})}

        conn = get_conn()
        cur = conn.cursor()
        cur.execute("DELETE FROM rooms WHERE room_number=%s", (room_number,))
        conn.commit()
        cur.close()
        conn.close()
        return {"statusCode": 200, "headers": cors, "body": json.dumps({"ok": True})}

    return {"statusCode": 405, "headers": cors, "body": json.dumps({"error": "Method not allowed"})}