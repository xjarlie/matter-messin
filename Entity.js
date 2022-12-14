class Entity {
    constructor() {
        this.world = window.world;
        this.body = 0;
        this.group = 'default';
        this.key = crypto.randomUUID();
        window.entities.push(this);
    }

    add() {
        Matter.Composite.add(this.world, this.body);
    }

    remove() {
        window.entities = window.entities.filter(e => e !== this);
        Matter.Composite.remove(this.world, this.body);
    }

    tick() {

    }

    setSize(px) {
        const multiplyDiff = px / this.width;
        Matter.Body.scale(this.body, multiplyDiff, multiplyDiff);
        this.width = px;
    }
}

export default Entity;