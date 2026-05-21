import json
import os
import psycopg2  # noqa: psycopg2-binary in requirements.txt

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def handler(event: dict, context) -> dict:
    """Управление заселением игроков, голосованием и ставками в ЖК Мафия."""
    if event.get("httpMethod") == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Max-Age": "86400",
            },
            "body": "",
        }

    method = event.get("httpMethod", "GET")
    cors = {"Access-Control-Allow-Origin": "*"}
    path = event.get("path", "/")

    # GET — список всех заселённых комнат со всеми полями
    if method == "GET":
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            "SELECT room_number, player_nickname, player_avatar, player_role, "
            "checked_in_at, is_eliminated, votes, coins, voted_for "
            "FROM rooms ORDER BY room_number"
        )
        rows = cur.fetchall()
        cur.execute("SELECT time_of_day FROM game_state WHERE id=1")
        gs = cur.fetchone()
        time_of_day = gs[0] if gs else "night"
        cur.close()
        conn.close()
        rooms = [
            {
                "room_number": r[0],
                "player_nickname": r[1],
                "player_avatar": r[2],
                "player_role": r[3],
                "checked_in_at": r[4].isoformat() if r[4] else None,
                "is_eliminated": r[5],
                "votes": r[6],
                "coins": r[7],
                "voted_for": r[8],
            }
            for r in rows
        ]
        return {"statusCode": 200, "headers": cors, "body": json.dumps({"rooms": rooms, "time_of_day": time_of_day})}

    # POST — заселить игрока в комнату
    if method == "POST":
        body = json.loads(event.get("body") or "{}")
        action = body.get("action", "checkin")

        # Смена времени суток: action=set_time
        if action == "set_time":
            time_of_day = body.get("time_of_day", "night")
            if time_of_day not in ("day", "night"):
                return {"statusCode": 400, "headers": cors, "body": json.dumps({"error": "time_of_day must be day or night"})}
            conn = get_conn()
            cur = conn.cursor()
            cur.execute(
                "INSERT INTO game_state (id, time_of_day) VALUES (1, %s) "
                "ON CONFLICT (id) DO UPDATE SET time_of_day=%s, updated_at=NOW()",
                (time_of_day, time_of_day)
            )
            conn.commit()
            cur.close()
            conn.close()
            return {"statusCode": 200, "headers": cors, "body": json.dumps({"ok": True, "time_of_day": time_of_day})}

        # Голосование: action=vote
        if action == "vote":
            voter_room = body.get("voter_room")
            target_room = body.get("target_room")
            bet = int(body.get("bet", 1))
            if not voter_room or not target_room:
                return {"statusCode": 400, "headers": cors, "body": json.dumps({"error": "voter_room and target_room required"})}
            if bet < 1 or bet > 10:
                return {"statusCode": 400, "headers": cors, "body": json.dumps({"error": "bet must be 1-10"})}

            conn = get_conn()
            cur = conn.cursor()
            # Проверить монеты голосующего
            cur.execute("SELECT coins, voted_for FROM rooms WHERE room_number=%s", (voter_room,))
            row = cur.fetchone()
            if not row:
                cur.close(); conn.close()
                return {"statusCode": 404, "headers": cors, "body": json.dumps({"error": "voter not found"})}
            coins, already_voted = row
            if already_voted is not None:
                cur.close(); conn.close()
                return {"statusCode": 400, "headers": cors, "body": json.dumps({"error": "already voted"})}
            if coins < bet:
                cur.close(); conn.close()
                return {"statusCode": 400, "headers": cors, "body": json.dumps({"error": "not enough coins"})}

            # Записать голос и списать монеты
            cur.execute(
                "UPDATE rooms SET coins=coins-%s, voted_for=%s WHERE room_number=%s",
                (bet, target_room, voter_room)
            )
            cur.execute(
                "UPDATE rooms SET votes=votes+1 WHERE room_number=%s",
                (target_room,)
            )
            conn.commit()
            cur.close()
            conn.close()
            return {"statusCode": 200, "headers": cors, "body": json.dumps({"ok": True})}

        # Выбывание: action=eliminate
        if action == "eliminate":
            room_number = body.get("room_number")
            if not room_number:
                return {"statusCode": 400, "headers": cors, "body": json.dumps({"error": "room_number required"})}
            conn = get_conn()
            cur = conn.cursor()
            cur.execute("UPDATE rooms SET is_eliminated=TRUE WHERE room_number=%s", (room_number,))
            conn.commit()
            cur.close()
            conn.close()
            return {"statusCode": 200, "headers": cors, "body": json.dumps({"ok": True})}

        # Обычное заселение
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
            "SET player_nickname=%s, player_avatar=%s, player_role=%s, checked_in_at=NOW(), "
            "is_eliminated=FALSE, votes=0, coins=20, voted_for=NULL",
            (room_number, nickname, avatar, role, nickname, avatar, role),
        )
        conn.commit()
        cur.close()
        conn.close()
        return {"statusCode": 200, "headers": cors, "body": json.dumps({"ok": True, "room_number": room_number})}

    # DELETE — выселить игрока из комнаты
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