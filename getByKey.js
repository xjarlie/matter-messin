export default function getByKey(key) {
    let entities = window.entities;
    entities = entities.filter(e => e.key === key);

    return entities[0];
}
