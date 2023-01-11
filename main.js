import './matter.js';
import { keyMap, keyMapper } from './keyMap.js';
import Character from './Character.js'
import Friend from './Friend.js';
import Enemy from './Enemy.js';
import { tickCounter, ticks } from './tickCounter.js';

function main() {

    const Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Bodies = Matter.Bodies,
        Composite = Matter.Composite,
        Body = Matter.Body,
        Constraint = Matter.Constraint,
        World = Matter.World;

    // create an engine
    const engine = Engine.create({
        gravity: {
            y: 0,
            x: 0
        }
    });

    // create a renderer
    const render = Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: 800,
            height: 640,
            wireframes: false
        }
    });

    World.add(engine.world, []);

    Render.run(render);

    const runner = Runner.create();
    runner.isFixed = true;
    Runner.run(runner, engine);

    window.bodies = [];
    window.world = engine.world;
    window.entities = [];
    window.kills = 0;
    window.deaths = 0;

    const defaultCategory = 0x0001,
        charCategory = 0x0002,
        enemyCategory = 0x004,
        friendCategory = 0x0008;

    const character = new Character();
    character.add();

    for (let i = 0; i < 3; i++) {

        const friend = new Friend();
        friend.add();

    }

    for (let i = 0; i < 2000; i++) {
        const enemy = new Enemy();
        enemy.add();
    }

    const mouse = Matter.Mouse.create(render.canvas);
    render.mouse = mouse;
    window.bodies.push(mouse);

    const mouseConstraint = Matter.MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            render: {
                visible: true
            },
            stiffness: 1,
            pointA: { x: 0, y: 0 },
            pointB: { x: 0, y: 0 }
        }
    });
    window.bodies.push(mouseConstraint);

    Matter.Events.on(runner, 'tick', tick);
    window.addEventListener('keydown', e => keyMapper(e))
    window.addEventListener('keyup', e => keyMapper(e))

    Composite.add(engine.world, window.bodies);

    function tick() {

        document.querySelector('#kills').textContent = window.kills;
        document.querySelector('#deaths').textContent = window.deaths;
        document.querySelector('#kdr').textContent = window.kills/window.deaths || 0;

        const entities = window.entities;
        for (const i in entities) {
            entities[i].tick();
        }

        tickCounter();

    }

}

window.onload = main;

