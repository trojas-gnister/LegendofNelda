// to do:
// need to fix score defaulting at 0 when going to next level

import k from './kaboom.js'


const MOVE_SPEED = 120
const SLICER_SPEED = 100
const SKELETOR_SPEED = 60
  

k.loadRoot("../img/sprites/");
k.loadSprite("link-left", "link-left.png");
k.loadSprite("link-right", "link-right.png");
k.loadSprite("link-down", "link-down.png");
k.loadSprite("link-up", "link-up.png");
k.loadSprite("left-wall", "left-wall.png");
k.loadSprite("top-wall", "top-wall.png");
k.loadSprite("bottom-wall", "bottom-wall.png");
k.loadSprite("right-wall", "right-wall.png");
k.loadSprite("bottom-left-wall", "bottom-left-wall.png");
k.loadSprite("bottom-right-wall", "bottom-right-wall.png");
k.loadSprite("top-left-wall", "top-left-wall.png");
k.loadSprite("top-right-wall", "top-right-wall.jpg");
k.loadSprite("top-door", "top-door.png");
k.loadSprite("fire-pot", "fire-pot.png");
k.loadSprite("left-door", "left-door.png");
k.loadSprite("lanterns", "lanterns.png");
k.loadSprite("slicer", "slicer.png");
k.loadSprite("skeletor", "skeletor.png");
k.loadSprite("kaboom", "kaboom.png");
k.loadSprite("stairs", "stairs.png");
k.loadSprite("bg", "bg.png");

k.scene('game', ({ level, score }) => {
  k.layers(['bg', 'obj', 'ui'], 'obj')

  const maps = [
    [
      'ycc)cc^^cw',
      'a        b',
      'a      * b',
      'a    (   b',
      '%        b',
      'a    (   b',
      'a   *    b',
      'a        b',
      'xdd)dd)ddz',
    ],
    [
      'yccccccccw',
      'a        b',
      ')        )',
      'a        b',
      'a        b',
      'a    $   b',
      ')   }    )',
      'a        b',
      'xddddddddz',
    ],
  ]

  const levelCfg = {
    width: 48,
    height: 48,
    a: [k.sprite('left-wall'), k.solid(), 'wall'],
    b: [k.sprite('right-wall'), k.solid(), 'wall'],
    c: [k.sprite('top-wall'), k.solid(), 'wall'],
    d: [k.sprite('bottom-wall'), k.solid(), 'wall'],
    w: [k.sprite('top-right-wall'), k.solid(), 'wall'],
    x: [k.sprite('bottom-left-wall'), k.solid(), 'wall'],
    y: [k.sprite('top-left-wall'), k.solid(), 'wall'],
    z: [k.sprite('bottom-right-wall'), k.solid(), 'wall'],
    '%': [k.sprite('left-door'), k.solid(), 'door'],
    '^': [k.sprite('top-door'), 'next-level'],
    $: [k.sprite('stairs'), 'next-level'],
    '*': [k.sprite('slicer'), 'slicer', { dir: -1 }, 'dangerous'],
    '}': [k.sprite('skeletor'), 'dangerous', 'skeletor', { dir: -1, timer: 0 }],
    ')': [k.sprite('lanterns'), k.solid()],
    '(': [k.sprite('fire-pot'), k.solid()],
  }
  k.addLevel(maps[level], levelCfg)

  k.add([k.sprite('bg'), k.layer('bg')])

  const scoreLabel = k.add([
    k.text('0'),
    k.pos(400, 450),
    k.layer('ui'),
    {
      value: score,
    },
    k.scale(2),
  ])

  k.add([k.text('level ' + parseInt(level + 1)), k.pos(400, 465), k.scale(2)])

  const player = k.add([
    k.sprite('link-right'),
    k.pos(5, 190),
    {
      // right by default
      dir: k.vec2(1, 0),
    },
  ])

  player.action(() => {
    player.resolve()
  })

  player.overlaps('next-level', () => {
    k.go('game', {
      level: (level + 1) % maps.length,
      score: scoreLabel.value,
    })
  })

  k.keyDown('left', () => {
    player.changeSprite('link-left')
    player.move(-MOVE_SPEED, 0)
    player.dir = k.vec2(-1, 0)
  })

  k.keyDown('right', () => {
    player.changeSprite('link-right')
    player.move(MOVE_SPEED, 0)
    player.dir = k.vec2(1, 0)
  })

  k.keyDown('up', () => {
    player.changeSprite('link-up')
    player.move(0, -MOVE_SPEED)
    player.dir = k.vec2(0, -1)
  })

  k.keyDown('down', () => {
    player.changeSprite('link-down')
    player.move(0, MOVE_SPEED)
    player.dir = k.vec2(0, 1)
  })

  function spawnKaboom(p) {
    const obj = k.add([k.sprite('kaboom'), k.pos(p), 'kaboom'])
    k.wait(1, () => {
      k.destroy(obj)
    })
  }

  k.keyPress('space', () => {
    spawnKaboom(player.pos.add(player.dir.scale(48)))
  })

  player.collides('door', (d) => {
    k.destroy(d)
  })

  k.collides('kaboom', 'skeletor', (n,s) => {
    k.camShake(4)
    k.wait(1, () => {
      k.destroy(n)
    })
    k.destroy(s)
    scoreLabel.value++
    scoreLabel.text = scoreLabel.value
  })

  k.action('slicer', (s) => {
    s.move(s.dir * SLICER_SPEED, 0)
  })

  k.collides('slicer', 'wall', (s) => {
    s.dir = -s.dir
  })

  k.action('skeletor', (s) => {
    s.move(0, s.dir * SKELETOR_SPEED)
    s.timer -= k.dt()
    if (s.timer <= 0) {
      s.dir = -s.dir
      s.timer = k.rand(5)
    }
  })

  k.collides('skeletor', 'wall', (s) => {
    s.dir = -s.dir
  })

  player.overlaps('dangerous', () => {
    k.go('lose', { score: scoreLabel.value })
  })
})

k.scene('lose', ({ score }) => {
  k.add([k.text(score, 32), k.origin('center'), k.pos(k.width() / 2, k.height() / 2)])
})

k.start('game', { level: 0, score: 0 })