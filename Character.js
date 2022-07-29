import './matter.js'
import { keyMap } from './keyMap.js';
import Entity from './Entity.js';

class Character extends Entity {
    constructor() {
        super()
        this.body = Matter.Bodies.rectangle(100, 100, 50, 50, {
            collisionFilter: {
                category: 0x0002,
                mask: 0x0004 | 0x0001
            },
            render: {
                fillStyle: '#0000ff'
            },
            label: this.key
        });

        this.maxVelocity = 3;
        this.force = 0.01;
        this.group = 'character';
        this.friends = [];

    }

    tick() {

        super.tick();

        const force = this.force;
        if (keyMap['ArrowRight'] === true) {
            Matter.Body.applyForce(this.body, this.body.position, { x: force, y: 0 })
            //Body.setVelocity(this.body, { x: xVelocity, y: this.body.velocity.y })
        }
        if (keyMap['ArrowLeft'] === true) {
            Matter.Body.applyForce(this.body, this.body.position, { x: -force, y: 0 })
            //Body.setVelocity(this.body, { x: -xVelocity, y: this.body.velocity.y });
        }
        if (keyMap['ArrowUp'] === true) {
            Matter.Body.applyForce(this.body, this.body.position, { x: 0, y: -force });
        }
        if (keyMap['ArrowDown'] === true) {
            Matter.Body.applyForce(this.body, this.body.position, { x: 0, y: force })
        }

        const maxVelocity = this.maxVelocity;
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
        
    }
    
    remove() {
        super.remove();

        for (const i in this.friends) {
            const friend = this.friends[i];
            friend.kill();
        }
    }

    kill() {
        window.deaths++;
        this.respawn();
    }

    respawn() {
        this.remove();

        const newCharacter = new Character();
        Matter.Composite.add(this.world, newCharacter.body);
    }

    addFriend(friend) {
        this.friends.push(friend);
    }

    removeFriend(friend) {
        this.friends = this.friends.filter(e => e !== friend);
    }
}

export default Character;