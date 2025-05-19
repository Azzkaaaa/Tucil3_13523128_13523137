export class Piece {
    constructor(
        public id: string,
        public col: number,
        public row: number,
        public length: number,
        public isHorizontal: boolean,
        public isPrimary: boolean
    ) {}

    copy(): Piece {
        return new Piece(
            this.id,
            this.col,
            this.row,
            this.length,
            this.isHorizontal,
            this.isPrimary
        );
    }
}
