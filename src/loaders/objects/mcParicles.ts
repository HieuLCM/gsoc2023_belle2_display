import {
  BufferGeometry,
  CatmullRomCurve3,
  Color,
  Group,
  Line,
  LineBasicMaterial,
  LineDashedMaterial,
  Mesh,
  MeshToonMaterial,
  Object3D,
  Scene,
  TubeGeometry,
  Vector3,
} from 'three';
export class MCParticleObject {
  public static getMCParticle(mcParticleParams: any): Object3D {
    const points = mcParticleParams.pos.map(
      (point: any) => new Vector3(point[0], point[1], point[2])
    );
    const color = new Color(mcParticleParams.color);

    const curve = new CatmullRomCurve3(points);

    // TubeGeometry
    const tubeGeometry = new TubeGeometry(curve, undefined, 2);
    const tubeMaterial = new MeshToonMaterial({
      color: color,
      transparent: true,
      opacity: 0,
    });
    const tubeObject = new Mesh(tubeGeometry, tubeMaterial);

    const lineGeometry = new BufferGeometry().setFromPoints(points);
    const lineMaterial = new LineDashedMaterial({
      color: color,
    });
    const lineObject = new Line(lineGeometry, lineMaterial);
    lineObject.computeLineDistances();
    lineObject.userData = Object.assign(
      {},
      {
        color: mcParticleParams.color,
        charge: mcParticleParams.charge,
        name: mcParticleParams.name,
        PDG: mcParticleParams.PDF,
      }
    );
    lineObject.name = 'MCParticle';

    const object = new Group();

    object.add(tubeObject);
    object.add(lineObject);

    mcParticleParams.uuid = tubeObject.uuid;

    return object;
  }
}
