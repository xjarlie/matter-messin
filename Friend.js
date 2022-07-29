import Entity from './Entity.js';
import getByGroup from './getByGroup.js';
import getByKey from './getByKey.js';
import { keyMap } from './keyMap.js';
import { ticks } from './tickCounter.js';

class Friend extends Entity {
    constructor() {
        super();

        this.width = 30;

        this.body = Matter.Bodies.rectangle(Math.random() * 800, Math.random() * 640, this.width, this.width, {
            collisionFilter: {
                category: 0x0008,
                mask: 0x0004 | 0x0001
            },
            render: {
                fillStyle: '#00aa00'
            },
            mass: 0.01,
            label: this.key
        });

        this.character = getByGroup('character').entities[0];
        this.active = false;
        this.constraint = 0;
        this.thrown = false;

    }

    tick() {
        this.character = getByGroup('character').entities[0];

        if (this.constraint) {
            this.body.collisionFilter.mask = 0;
        } else {
            this.body.collisionFilter.mask = 0x0004 | 0x0001;
        }

        if (Matter.Collision.collides(this.body, this.character.body) !== null && !this.constraint) {

            this.constraint = Matter.Constraint.create({
                bodyA: this.body,
                bodyB: this.character.body,
                length: 150,
                stiffness: 0.6
            });
            Matter.Composite.add(this.world, this.constraint);
            this.character.addFriend(this);
            this.body.render.fillStyle = '#00ff00';

            this.setSize(30);
        }

        if (keyMap[' '] === true && this.constraint) {
            Matter.Composite.remove(this.world, this.constraint);
            this.constraint = 0;

            this.body.render.fillStyle = '#00aa00';
            this.setSize(80);
            this.thrown = true;
            this.thrownTick = ticks;
            this.active = true;

            this.character.removeFriend(this);
        }

        if (this.thrown && this.thrownTick + 100 === ticks) {
            this.setSize(30);
            this.active = false;
        }

        if (!this.constraint && (this.body.position.x > 800 || this.body.position.x < 0 || this.body.position.y > 640 || this.body.position.y < 0)) {
            this.respawn();
        }

        if (this.active) {
            const enemyCollisions = Matter.Query.collides(this.body, getByGroup('enemy').bodies);
            for (const i in enemyCollisions) {
                const collision = enemyCollisions[i];
                const enemy = getByKey([collision.bodyA, collision.bodyB].filter(e => getByKey(e.label).group === 'enemy')[0].label);

                enemy.kill();

                this.respawn();
            }

        }
    }

    remove() {
        super.remove();

        this.character.removeFriend(this);
    }

    kill() {
        this.respawn();
    }

    respawn() {
        this.remove();
        this.removeConstraint();

        const newFriend = new Friend(this.character, this.world);
        Matter.Composite.add(this.world, newFriend.body);
    }

    removeConstraint() {
        Matter.Composite.remove(this.world, this.constraint);
        this.constraint = 0;
    }
}

export default Friend;