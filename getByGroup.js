export default function getByGroup(group) {

    let entities = window.entities;
    entities = entities.filter(e => e.group === group);

    let bodies = Array.from(entities, e => e.body);
    return { entities, bodies };

}