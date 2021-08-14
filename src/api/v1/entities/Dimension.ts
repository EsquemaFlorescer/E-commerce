export class Dimension {
	public readonly id: string;

	public item_id: number;
	public weight: number;
	public length: number;
	public height: number;
	public width: number;
	public diameter: number;

	constructor(props: Dimension) {
		Object.assign(this, props);
	}
}
