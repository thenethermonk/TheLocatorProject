import { world, system, Player } from "@minecraft/server"

system.runInterval(() => {
  world.getPlayers().forEach((player) => {
    show_main_compass(player)
    show_home_location(player)

    let ids = world.structureManager.getWorldStructureIds()

    for (let id = 0; id <= ids.length; id++) {
      if (typeof ids[id] === "string") {
        let structure = world.structureManager.get(ids[id])
        if (
          structure !== undefined &&
          structure?.isValid() &&
          structure.size.y > 0
        ) {
          world.sendMessage(JSON.stringify(structure.size))
        }
      }
    }
  })
})

function show_home_location(p: Player) {
  let spawn = p.getSpawnPoint()
    ? p.getSpawnPoint()
    : world.getDefaultSpawnLocation()

  let spawn_dis = getDistance(p.location.x, p.location.z, spawn?.x, spawn?.z)
  let spawn_dir = getDirection(p.location.x, p.location.z, spawn?.x, spawn?.z)
  let direction = spawn_dir + p.getRotation().y + 180
  if (direction > 360) direction -= 360

  let rot = direction / 2.28

  let home_loc_string = ""
  for (let i = 0; i < 41; i++) {
    if (i == 4 || i == 36) {
      home_loc_string += "\u{E21B}\u{E21A}\u{E21B}"
    } else {
      home_loc_string += "\u{E21B}\u{E21B}\u{E21B}\u{E21B}\u{E21B}"
    }
  }

  let distance = ""

  for (let i = 0; i < String(spawn_dis).length; i++) {
    let unicode: any = "E21" + String(spawn_dis)[i]
    unicode = parseInt(unicode, 16)
    unicode = String.fromCodePoint(unicode)
    distance += unicode
  }

  //  let distance = "\u{E212}\u{E211}\u{E213}"

  p.onScreenDisplay.updateSubtitle(
    home_loc_string.substring(rot, rot + 43) + "\n" + distance
  )
}

function show_main_compass(p: Player) {
  let direction = p.getRotation().y + 180
  let rot = direction / 2.35
  let compass = ""
  for (let i = 0; i < 41; i++) {
    if (i == 4 || i == 36) {
      compass += "\u{E200}\u{E203}\u{E200}"
    } else if (i == 12) {
      compass += "\u{E200}\u{E204}\u{E200}"
    } else if (i == 20) {
      compass += "\u{E200}\u{E205}\u{E200}"
    } else if (i == 28) {
      compass += "\u{E200}\u{E206}\u{E200}"
    } else if (i == 0 || i == 8 || i == 16 || i == 24 || i == 32 || i == 40) {
      compass += "\u{E200}\u{E200}\u{E202}\u{E200}\u{E200}"
    } else {
      compass += "\u{E200}\u{E200}\u{E201}\u{E200}\u{E200}"
    }
  }
  p.onScreenDisplay.setTitle(compass.substring(rot, rot + 43))
}

function getDirection(x1: any, y1: any, x2: any, y2: any) {
  // Calculate the difference in X and Y coordinates
  const deltaX = x2 - x1
  const deltaY = y2 - y1

  // Calculate the angle in radians
  const angleRadians = Math.atan2(deltaX, deltaY)

  // Convert radians to degrees
  const angleDegrees = angleRadians * (180 / Math.PI)

  // Normalize the angle to be between 0 and 360 degrees
  let normalizedAngle = ((angleDegrees + 360) % 360) - 180
  if (normalizedAngle < 0) normalizedAngle += 360

  /*  // Normalize the angle to be between 0 and 360 degrees
  let normalizedAngle = (angleDegrees + 360) % 360
  // invert the angle
  normalizedAngle = (normalizedAngle - 720) * -1
  // 0 needs to be north
  if (normalizedAngle + 90 > 360) normalizedAngle -= 270
*/

  return normalizedAngle
}

function getDistance(x1: any, y1: any, x2: any, y2: any) {
  const dx = x2 - x1
  const dy = y2 - y1
  return Math.floor(Math.sqrt(dx * dx + dy * dy))
}
