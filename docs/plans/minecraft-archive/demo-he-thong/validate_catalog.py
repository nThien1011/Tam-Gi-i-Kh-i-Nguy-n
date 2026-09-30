"""Kiểm tra liên kết và giới hạn cơ bản của catalog demo (Python 3, stdlib)."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parent
CATALOG = ROOT / "catalog.json"
ID_PATTERN = re.compile(r"^[A-Z][A-Z0-9_]*$")


def require(condition: bool, message: str, errors: list[str]) -> None:
    if not condition:
        errors.append(message)


def index(records: list[dict], label: str, errors: list[str]) -> dict[str, dict]:
    result: dict[str, dict] = {}
    for row in records:
        key = row.get("id")
        require(isinstance(key, str) and bool(ID_PATTERN.fullmatch(key)), f"{label}: ID sai {key!r}", errors)
        require(key not in result, f"{label}: ID trùng {key!r}", errors)
        result[key] = row
    return result


def check() -> list[str]:
    data = json.loads(CATALOG.read_text(encoding="utf-8"))
    errors: list[str] = []
    maps = index(data["maps"], "map", errors)
    portals = index(data["portals"], "portal", errors)
    npcs = index(data["npcs"], "npc", errors)
    mobs = index(data["mobs"], "mob", errors)
    items = index(data["items"], "item", errors)
    loot = index(data["loot_tables"], "loot", errors)
    quests = index(data["quests"], "quest", errors)
    boss = data["boss"]

    for map_id, area in maps.items():
        x1, z1, x2, z2 = area["bounds_xz"]
        require(x1 < x2 and z1 < z2, f"{map_id}: bounds sai", errors)
        x, _y, z = area["spawn_xyz"]
        require(x1 <= x <= x2 and z1 <= z <= z2, f"{map_id}: spawn ngoài bounds", errors)
        for target in area["exits"]:
            require(target in maps, f"{map_id}: exit thiếu {target}", errors)
        for npc_id in area["npcs"]:
            require(npc_id in npcs and npcs[npc_id]["map_id"] == map_id, f"{map_id}: NPC sai {npc_id}", errors)
        if area["safe"]:
            require(not area["mob_spawns"], f"{map_id}: safe zone có mob spawn", errors)
        for point in area["mob_spawns"]:
            mob_id = point["mob_id"]
            px, _py, pz = point["xyz"]
            require(mob_id in mobs and mobs[mob_id]["map_id"] == map_id, f"{map_id}: mob spawn sai {mob_id}", errors)
            require(x1 <= px <= x2 and z1 <= pz <= z2, f"{map_id}: spawn point ngoài bounds {point['id']}", errors)
            require(point["capacity"] > 0, f"{map_id}: capacity không dương {point['id']}", errors)

    require("MAP_HUB" in maps, "Thiếu MAP_HUB", errors)
    if "MAP_HUB" in maps:
        reachable = {"MAP_HUB"}
        pending = ["MAP_HUB"]
        while pending:
            for destination in maps[pending.pop()]["exits"]:
                if destination in maps and destination not in reachable:
                    reachable.add(destination)
                    pending.append(destination)
        require(reachable == set(maps), f"Map không tới được từ Hub: {sorted(set(maps) - reachable)}", errors)

    for portal_id, portal in portals.items():
        origin = portal["from"]
        destination = portal["to"]
        require(origin in maps and destination in maps, f"{portal_id}: map thiếu", errors)
        if origin not in maps or destination not in maps:
            continue
        require(destination in maps[origin]["exits"], f"{portal_id}: exit chưa khai báo", errors)
        for map_id, xyz, side in ((origin, portal["xyz"], "đầu"), (destination, portal["destination_xyz"], "đích")):
            x1, z1, x2, z2 = maps[map_id]["bounds_xz"]
            require(x1 <= xyz[0] <= x2 and z1 <= xyz[2] <= z2, f"{portal_id}: {side} ngoài map", errors)
        if "requires_quest" in portal:
            require(portal["requires_quest"] in quests, f"{portal_id}: quest gate thiếu", errors)
    declared_routes = {(map_id, target) for map_id, area in maps.items() for target in area["exits"]}
    actual_routes = {(portal["from"], portal["to"]) for portal in portals.values()}
    require(declared_routes == actual_routes, f"Map exits/portals lệch: thiếu {sorted(declared_routes - actual_routes)}, thừa {sorted(actual_routes - declared_routes)}", errors)

    for npc_id, npc in npcs.items():
        require(npc["map_id"] in maps and npc_id in maps[npc["map_id"]]["npcs"], f"{npc_id}: map reference sai", errors)

    for race, starter_ids in data["race_starter_items"].items():
        require(len(starter_ids) == 3, f"{race}: starter cần 3 slot", errors)
        slots = []
        for item_id in starter_ids:
            require(item_id in items, f"{race}: starter item thiếu {item_id}", errors)
            if item_id in items:
                slots.append(items[item_id]["slot"])
                require(items[item_id]["race"] == race, f"{race}: starter sai tộc {item_id}", errors)
        require(set(slots) == {"WEAPON", "ARMOR", "ACCESSORY"}, f"{race}: starter slot sai", errors)

    require(set(data["race_zone_mob"]) == set(data["race_starter_items"]), "Race mapping starter/mob không khớp", errors)
    for race, mob_id in data["race_zone_mob"].items():
        require(mob_id in mobs, f"{race}: zone mob thiếu", errors)

    item_sources = {item_id for starter_ids in data["race_starter_items"].values() for item_id in starter_ids}
    for table in loot.values():
        item_sources.update(grant["item_id"] for grant in table.get("guaranteed", []))
        item_sources.update(roll["item_id"] for roll in table.get("rolls", []))
    for quest in quests.values():
        item_sources.update(grant["item_id"] for grant in quest["reward"].get("items", []))
    require(item_sources == set(items), f"Item không có nguồn nhận: {sorted(set(items) - item_sources)}", errors)

    for mob_id, mob in mobs.items():
        require(mob["map_id"] in maps, f"{mob_id}: map thiếu", errors)
        require(mob["loot_table"] in loot, f"{mob_id}: loot table thiếu", errors)
        require(mob["hp"] > 0 and mob["attack"] >= 0, f"{mob_id}: stat sai", errors)
        low, high = mob["respawn_seconds"]
        require(0 < low <= high, f"{mob_id}: respawn sai", errors)

    for loot_id, table in loot.items():
        low, high = table["currency"]
        require(0 <= low <= high, f"{loot_id}: currency range sai", errors)
        for grant in table.get("guaranteed", []):
            require(grant["item_id"] in items and grant["amount"] > 0, f"{loot_id}: guaranteed item sai", errors)
        for roll in table.get("rolls", []):
            require(roll["item_id"] in items and roll["amount"] > 0, f"{loot_id}: roll item sai", errors)
            require(0 <= roll["chance"] <= 1, f"{loot_id}: chance ngoài [0,1]", errors)

    require(boss["map_id"] in maps, "Boss map thiếu", errors)
    require(boss["entry_npc_id"] in npcs, "Boss entry NPC thiếu", errors)
    require(boss["entry_quest_completed"] in quests, "Boss entry quest thiếu", errors)
    require(boss["loot_table"] in loot, "Boss loot table thiếu", errors)
    require(boss["base_hp"] > 0 and boss["party_size"] == [1, 4], "Boss HP/party sai", errors)
    require(0 < boss["transition_at_hp_fraction"] < 1, "Boss transition sai", errors)
    require(0 < boss["phase_2"]["beam_at_hp_fraction"] < boss["transition_at_hp_fraction"], "Boss beam threshold sai", errors)
    bx1, bz1, bx2, bz2 = maps[boss["map_id"]]["bounds_xz"]
    for label, point in [("spawn", boss["spawn_xyz"])] + [("safe pad", point) for point in boss["phase_2"]["safe_pads_xyz"]] + [("Wisp spawn", point) for point in boss["phase_2"]["wisp_spawn_xyz"]]:
        x, _y, z = point
        require(bx1 <= x <= bx2 and bz1 <= z <= bz2, f"Boss {label} ngoài arena", errors)
    require(len(boss["phase_2"]["wisp_spawn_xyz"]) == boss["phase_2"]["wisp_count"], "Boss Wisp count/points không khớp", errors)
    require(boss["phase_2"]["wisp_reward_enabled"] is False, "Wisp boss không được phát reward", errors)

    for quest_id, quest in quests.items():
        for dependency in quest["requires"]:
            require(dependency in quests, f"{quest_id}: prerequisite thiếu {dependency}", errors)
        objective = quest["objective"]
        for mob_id in objective.get("mob_ids", []):
            require(mob_id in mobs, f"{quest_id}: objective mob thiếu {mob_id}", errors)
        if "boss_id" in objective:
            require(objective["boss_id"] == boss["id"], f"{quest_id}: boss objective sai", errors)
        for grant in quest["reward"].get("items", []):
            require(grant["item_id"] in items and grant["amount"] > 0, f"{quest_id}: reward item sai", errors)

    visiting: set[str] = set()
    visited: set[str] = set()

    def visit(quest_id: str) -> None:
        if quest_id in visiting:
            errors.append(f"Quest cycle tại {quest_id}")
            return
        if quest_id in visited or quest_id not in quests:
            return
        visiting.add(quest_id)
        for dependency in quests[quest_id]["requires"]:
            visit(dependency)
        visiting.remove(quest_id)
        visited.add(quest_id)

    for quest_id in quests:
        visit(quest_id)

    steps = data["upgrade"]["steps"]
    require(len(steps) == data["upgrade"]["max_stars"], "Upgrade thiếu bước", errors)
    for expected, step in enumerate(steps):
        require(step["from"] == expected and step["to"] == expected + 1, f"Upgrade step sai tại {expected}", errors)
        require(step["currency_cost"] >= 0 and 0 < step["chance"] <= 1, f"Upgrade cost/chance sai tại {expected}", errors)
        for material in step["materials"]:
            require(material["item_id"] in items and material["amount"] > 0, f"Upgrade material sai tại {expected}", errors)

    require(quests["Q_INTRO_02"]["reward"]["currency"] >= steps[0]["currency_cost"], "Tutorial không bảo đảm tiền nâng 0→1", errors)
    tutorial_materials = {grant["item_id"]: grant["amount"] for grant in quests["Q_INTRO_03"]["reward"]["items"]}
    for material in steps[0]["materials"]:
        require(tutorial_materials.get(material["item_id"], 0) >= material["amount"], "Tutorial không bảo đảm vật liệu nâng 0→1", errors)

    return errors


if __name__ == "__main__":
    findings = check()
    if findings:
        for finding in findings:
            print(f"ERROR: {finding}", file=sys.stderr)
        raise SystemExit(1)
    print("Catalog hợp lệ: map, portal, item, mob, loot, boss và quest liên kết đúng.")
