import Entity from "./Entity.js";
import getByGroup from "./getByGroup.js";
import getByKey from "./getByKey.js";

class Enemy extends Entity {
    constructor() {
        super();
        this.body = Matter.Bodies.rectangle(700, Math.random() * 640, 40, 40, {
            collisionFilter: {
                category: 0x0004,
                mask: 0x0008 | 0x0004 | 0x0002 | 0x0001
            },
            render: {
                fillStyle: '#ff0000'
            },
            label: this.key
        });
        this.group = 'enemy';
        this.speed = 1;
    }

    tick() {
        this.chase(getByGroup('character').entities[0]);

        const characterCollisions = Matter.Query.collides(this.body, getByGroup('character').bodies);
        for (const i in characterCollisions) {
            const collision = characterCollisions[i];
            const character = getByKey([collision.bodyA, collision.bodyB].filter(e => getByKey(e.label).group === 'character')[0].label);

            character.kill();

            this.respawn();

        }
    }

    chase(target) {

        const targetVector = { x: Math.round(target.body.position.x), y: Math.round(target.body.position.y) };

        const thisVector = { x: Math.round(this.body.position.x), y: Math.round(this.body.position.y) };

        Matter.Body.setVelocity(this.body, { x: Math.sign(targetVector.x - thisVector.x) * this.speed, y: Math.sign(targetVector.y - thisVector.y) * this.speed });

    }

    kill() {
        window.kills++;
        this.respawn();
    }

    respawn() {
        this.remove();

        const newEnemy = new Enemy();
        Matter.Composite.add(this.world, newEnemy.body);
    }
}

export default Enemy;