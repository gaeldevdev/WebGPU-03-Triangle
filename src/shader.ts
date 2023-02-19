export class Shaders {
    private coords: Array<number> = [];
    private color: string;

    /**
     * @param {Array<number>} coords - array of 3d coordinates e.g. [0.5, 0.5, 0.5, 1.0, 1.0, 1.0]
     * @param {string} color - color as a RGBA string e.g. "(1.0,0.0,1.0,1.0)"'
     */
    public constructor(coords: Array<number>, color: string) {
        this.coords = coords
        this.color = color
    }

    public getVertexShader(): string {
        let nbOfVertices: number = this.coords.length / 3 ;
        let sb = '@vertex\nfn main(@builtin(vertex_index) VertexIndex: u32) -> @builtin(position) vec4<f32> {\n'
        sb += '\tvar pos = array<vec2<f32>, '
        sb += nbOfVertices
        sb += '>(\n'
        for (let i = 0; i < nbOfVertices; i++ ){
            sb += '\t\tvec2<f32>(' + this.coords[i*3] + ', ' + this.coords[i*3+1] + ')'
            if (i < nbOfVertices - 1)
                sb += ',\n'
        }
        sb += ');\n'
        sb += '\treturn vec4<f32>(pos[VertexIndex], 0.0, 1.0);\n}'
        return sb;

        /*
        const vertex = `
        @vertex
        fn main(@builtin(vertex_index) VertexIndex: u32) -> @builtin(position) vec4<f32> {
            var pos = array<vec2<f32>, 3>(
                vec2<f32>(-0.5, -0.5),
                vec2<f32>(-0.0, 0.5),
                vec2<f32>(0.5, -0.5));
            return vec4<f32>(pos[VertexIndex], 0.0, 1.0);
        }
        `;
        */
    }

    public getFragmentShader(): string {
        return '@fragment\nfn main() -> @location(0) vec4<f32> {\n\treturn vec4<f32>' + this.color + ';\n}'
    }
}