import k from './kaboom.js'


const MOVE_SPEED = 120
const SLICER_SPEED = 100
const SKELETOR_SPEED = 60
  

k.loadRoot("./img/sprites/");
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
  layers(['bg', 'obj', 'ui'], 'obj')

  const maps = [
    [
      'ycc)cc^ccw',
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
    a: [sprite('left-wall'), solid(), 'wall'],
    b: [sprite('right-wall'), solid(), 'wall'],
    c: [sprite('top-wall'), solid(), 'wall'],
    d: [sprite('bottom-wall'), solid(), 'wall'],
    w: [sprite('top-right-wall'), solid(), 'wall'],
    x: [sprite('bottom-left-wall'), solid(), 'wall'],
    y: [sprite('top-left-wall'), solid(), 'wall'],
    z: [sprite('bottom-right-wall'), solid(), 'wall'],
    '%': [sprite('left-door'), solid(), 'door'],
    '^': [sprite('top-door'), 'next-level'],
    $: [sprite('stairs'), 'next-level'],
    '*': [sprite('slicer'), 'slicer', { dir: -1 }, 'dangerous'],
    '}': [sprite('skeletor'), 'dangerous', 'skeletor', { dir: -1, timer: 0 }],
    ')': [sprite('lanterns'), solid()],
    '(': [sprite('fire-pot'), solid()],
  }
  addLevel(maps[level], levelCfg)

  add([sprite('bg'), layer('bg')])

  const scoreLabel = add([
    text('0'),
    pos(400, 450),
    layer('ui'),
    {
      value: score,
    },
    scale(2),
  ])

  add([text('level ' + parseInt(level + 1)), pos(400, 465), scale(2)])

  const player = add([
    sprite('link-right'),
    pos(5, 190),
    {
      // right by default
      dir: vec2(1, 0),
    },
  ])

  player.action(() => {
    player.resolve()
  })

  player.overlaps('next-level', () => {
    go('game', {
      level: (level + 1) % maps.length,
      score: scoreLabel.value,
    })
  })

  keyDown('left', () => {
    player.changeSprite('link-left')
    player.move(-MOVE_SPEED, 0)
    player.dir = vec2(-1, 0)
  })

  keyDown('right', () => {
    player.changeSprite('link-right')
    player.move(MOVE_SPEED, 0)
    player.dir = vec2(1, 0)
  })

  keyDown('up', () => {
    player.changeSprite('link-up')
    player.move(0, -MOVE_SPEED)
    player.dir = vec2(0, -1)
  })

  keyDown('down', () => {
    player.changeSprite('link-down')
    player.move(0, MOVE_SPEED)
    player.dir = vec2(0, 1)
  })

  function spawnKaboom(p) {
    const obj = add([sprite('kaboom'), pos(p), 'kaboom'])
    wait(1, () => {
      destroy(obj)
    })
  }

  keyPress('space', () => {
    spawnKaboom(player.pos.add(player.dir.scale(48)))
  })

  player.collides('door', (d) => {
    destroy(d)
  })

  collides('kaboom', 'skeletor', (k,s) => {
    camShake(4)
    wait(1, () => {
      destroy(k)
    })
    destroy(s)
    scoreLabel.value++
    scoreLabel.text = scoreLabel.value
  })

  action('slicer', (s) => {
    s.move(s.dir * SLICER_SPEED, 0)
  })

  collides('slicer', 'wall', (s) => {
    s.dir = -s.dir
  })

  action('skeletor', (s) => {
    s.move(0, s.dir * SKELETOR_SPEED)
    s.timer -= dt()
    if (s.timer <= 0) {
      s.dir = -s.dir
      s.timer = rand(5)
    }
  })

  collides('skeletor', 'wall', (s) => {
    s.dir = -s.dir
  })

  player.overlaps('dangerous', () => {
    go('lose', { score: scoreLabel.value })
  })
})

k.scene('lose', ({ score }) => {
  add([text(score, 32), origin('center'), pos(width() / 2, height() / 2)])
})

k.start('game', { level: 0, score: 0 })