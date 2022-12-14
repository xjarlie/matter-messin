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
                //fillStyle: '#ff0000',
                sprite: {
                    texture: 'stalin.jpg',
                    xScale: 0.058,
                    yScale: 0.05
                }
            },
            label: this.key
        });
        this.group = 'enemy';
        this.speed = 1;

        this.health = 10;

        console.log(this.body.render);
    }

    tick() {
        // this.altChase(getByGroup('character').entities[0]);
        this.altAltChase(getByGroup('character').entities[0]);
        // this.altAltChase(getByGroup('character').entities[0]);
        const characterCollisions = Matter.Query.collides(this.body, getByGroup('character').bodies);
        for (const i in characterCollisions) {
            const collision = characterCollisions[i];
            const character = getByKey([collision.bodyA, collision.bodyB].filter(e => getByKey(e.label).group === 'character')[0].label);

            character.kill();

            this.respawn();
        }

        const maxVelocity = this.speed;
        if (this.body.velocity.x > maxVelocity) {
            Matter.Body.setVelocity(this.body, { x: maxVelocity, y: this.body.velocity.y });
        }
        if (this.body.velocity.x < -maxVelocity) {
            Matter.Body.setVelocity(this.body, { x: -maxVelocity, y: this.body.velocity.y });
        }
        if (this.body.velocity.y > maxVelocity) {
            Matter.Body.setVelocity(this.body, { x: this.body.velocity.x, y: maxVelocity });
        }
        if (this.body.velocity.y < -maxVelocity) {
            Matter.Body.setVelocity(this.body, { x: this.body.velocity.x, y: -maxVelocity });
        }
        //console.log(this.body.velocity);
    }

    chase(target) {

        const targetVector = { x: Math.round(target.body.position.x), y: Math.round(target.body.position.y) };

        const thisVector = { x: Math.round(this.body.position.x), y: Math.round(this.body.position.y) };

        Matter.Body.setVelocity(this.body, { x: Math.sign(targetVector.x - thisVector.x) * this.speed, y: Math.sign(targetVector.y - thisVector.y) * this.speed });

    }

    altChase(target) {

        const targetVector = { x: Math.round(target.body.position.x), y: Math.round(target.body.position.y) };
        const thisVector = { x: Math.round(this.body.position.x), y: Math.round(this.body.position.y) };

        const targetVelocity = { x: target.body.velocity.x, y: target.body.velocity.y };

        const aimVector = { x: targetVector.x + targetVelocity.x*300, y: targetVector.y + targetVelocity.y*300 };
        

        const targetDirection = {x: Math.sign(targetVelocity.x), y: Math.sign(targetVelocity.y) };

        const newTargetVector = {x: targetVector.x + targetVelocity.x, y: targetVector.y + targetVelocity.y};

        if (Math.abs(thisVector.x - newTargetVector.x) < Math.abs(thisVector.x - targetVector.x)) {
            aimVector.x = targetVector.x;
        }
        if (Math.abs(thisVector.y - newTargetVector.y) < Math.abs(thisVector.y - targetVector.y)) {
            aimVector.y = targetVector.y;
        }
        const moveDirection = {x: Math.sign(aimVector.x - thisVector.x), y: Math.sign(aimVector.y - thisVector.y)}

        Matter.Body.setVelocity(this.body, { x:  moveDirection.x * this.speed, y: moveDirection.y * this.speed });

    }

    altAltChase(target) {

        const targetPosition = { x: Math.round(target.body.position.x), y: Math.round(target.body.position.y)};
        const thisPosition = { x: Math.round(this.body.position.x), y: Math.round(this.body.position.y) };

        const targetVelocity = { x: target.body.velocity.x, y: target.body.velocity.y };

        const targetDirection = { x: Math.sign(targetVelocity.x), y: Math.sign(targetVelocity.y) };

        //console.log('POSITION:', targetPosition, 'DIRECTION', targetDirection);

        const aimPosition = { x: targetPosition.x + (targetVelocity.x), y: targetPosition.y + (targetVelocity.y)};

        const moveDirection = { x: Math.sign(aimPosition.x - thisPosition.x), y: Math.sign(aimPosition.y - thisPosition.y) };

        //Matter.Body.setVelocity(this.body, { x: moveDirection.x * this.speed, y: moveDirection.y * this.speed });
        const force = 0.005;
        Matter.Body.applyForce(this.body, thisPosition, {x: moveDirection.x * force, y: moveDirection.y * force});
    }

    damage(damage) {
        console.log(damage);

        this.kill();
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