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
        this.group = 'friend';

    }

    tick() {
        this.character = getByGroup('character').entities[0];

        if (this.constraint) {
            this.body.collisionFilter.mask = 0;
        } else {
            this.body.collisionFilter.mask = 0x0004 | 0x0001;
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
        if (keyMap['x'] === true && !this.constraint) {
            const targetVector = { x: Math.round(this.character.body.position.x), y: Math.round(this.character.body.position.y) };

            const thisVector = { x: Math.round(this.body.position.x), y: Math.round(this.body.position.y) };
            this.speed = 3;
            Matter.Body.setVelocity(this.body, { x: Math.sign(targetVector.x - thisVector.x) * this.speed, y: Math.sign(targetVector.y - thisVector.y) * this.speed });
    
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

        if (this.thrown && this.thrownTick + 50 === ticks) {
            this.setSize(30);
            this.active = false;
        }

        if (!this.removed && !this.constraint && (this.body.position.x > 800 || this.body.position.x < 0 || this.body.position.y > 640 || this.body.position.y < 0)) {
            this.respawn();
        }

        if (this.active) {
            const enemyCollisions = Matter.Query.collides(this.body, getByGroup('enemy').bodies);
            for (const i in enemyCollisions) {
                const collision = enemyCollisions[i];
                const enemy = getByKey([collision.bodyA, collision.bodyB].filter(e => getByKey(e.label).group === 'enemy')[0].label);

                const penetration = collision.penetration;

                enemy.damage(penetration);
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
        this.removed = true;
        this.remove();
        this.removeConstraint();

        const newFriend = new Friend(this.character, this.world);
        Matter.Composite.add(this.world, newFriend.body);
    }
 
    removeConstraint() {
        if (this.constraint) {
            Matter.Composite.remove(this.world, this.constraint);
            this.constraint = 0;
        }
    }
}

export default Friend;