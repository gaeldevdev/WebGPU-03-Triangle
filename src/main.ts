import './style.css'
import { GPU } from './gpu';
import { Shaders } from './shader';

var gpu = new GPU()
const COLOR: string = '(1.0,0.0,1.0,1.0)'
const BACKGROUND = { r: 0.25, g: 0.25, b: 0.3, a: 1.0 }

function generateCoordinates(): Array<number>{
    return [-0.5, -0.5, 0.0, 0.0, 0.5, 0.0, 0.5, -0.5, 0.0]
}

function createPipeline(device: GPUDevice, vertexShader: string, fragmentShader: string, format: string): GPURenderPipeline {
    var pipeline = device.createRenderPipeline({
        layout:'auto',
        vertex: {
            module: device.createShaderModule({                    
              code: vertexShader
            }),
            entryPoint: "main"
        },
        fragment: {
            module: device.createShaderModule({
                code: fragmentShader
            }),
            entryPoint: "main",
            targets: [{
                format: format as GPUTextureFormat
            }]
        },
        primitive:{
            topology: "triangle-list",
        }
    });
    return pipeline
}

const createTriangle = async (color = COLOR) => {
    if (!gpu.getStatus()){
        console.log(gpu.getStatusMessage());
        throw(gpu.getStatusMessage());
    }
    
    const canvas  = document.getElementById('canvas-webgpu') as HTMLCanvasElement;
    const context = canvas.getContext('webgpu') as unknown as GPUCanvasContext;
    const device  = await gpu.requestDevice() as GPUDevice;
    const format  = 'bgra8unorm';
    
    context.configure({
      device: device,
      format: format,
      alphaMode: 'opaque'
    });
    
    const shader = new Shaders(generateCoordinates(), color)

    const numberOfMeshes = generateCoordinates().length / 3;

    const pipeline: GPURenderPipeline = createPipeline(device, shader.getVertexShader(), shader.getFragmentShader(), format);

    const commandEncoder = device.createCommandEncoder();
    const textureView = context.getCurrentTexture().createView();
    const renderPass = commandEncoder.beginRenderPass({
        colorAttachments: [{
            view: textureView,
            clearValue: BACKGROUND,
            loadOp: 'clear',
            storeOp: 'store'
        }]
    });
    renderPass.setPipeline(pipeline);
    renderPass.draw(numberOfMeshes, 1, 0, 0);
    renderPass.end();

    device.queue.submit([commandEncoder.finish()]);
}

createTriangle()

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `<div><p> ${gpu.getStatusMessage()}</p></div>`
